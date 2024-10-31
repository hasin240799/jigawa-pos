<?php

/**
 * Store a newly created sales return in storage.
 */
public function storeReturnSale(Request $request)
{
    $request->validate([
        'sale_id' => 'required|exists:sales,id',
        'reason' => 'nullable|string',
    ]);

    // Find the sale
    $sale = Sale::findOrFail($request->sale_id);


    // Find the specific product in the sale using its pivot data
    $productPivot = $sale->products()
        ->where('product_id', $request->product_id)
        ->firstOrFail()
        ->pivot;


    // Create the sales return record
    $salesReturn = SalesReturn::create([
        'sale_id' => $request->sale_id,
        'return_date' => now(),
        'reason' => $request->reason,
    ]);

    $sale->is_return = true;
    $sale->save();

    // Update the loan balance if the sale was associated with a loan
    $loan = Loan::where('sale_id', $sale->id)->first();

    if ($loan) {
        $loan->is_return = true;
        $loan->save();
    }

    // Update inventory to reflect the returned product
    $shop = Shop::where('manage_by_id', $sale->shop_agent_id)->first();

    if ($shop) {

        foreach ($productPivot  as $product) {

            // Update the stock in the shop for the returned product
            $shopProduct = ShopProduct::where('shop_id', $shop->id)
                ->where('product_id', $product->product_id)
                ->firstOrFail();

            $shopProduct->qty_out -= $product->qty;
            $shopProduct->save();

            return response()->json([
                'message' => 'Sales return processed successfully.',
                'success' => true
            ]);
        }

    } else {
        return response()->json(['message' => 'Shop not found or managed by the specified agent.', 'success' => false], 404);
    }
}

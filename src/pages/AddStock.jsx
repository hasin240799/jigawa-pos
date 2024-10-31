import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import InputField from "../components/InputField";
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import $ from 'jquery';
import 'dropify/dist/js/dropify.min.js';
import 'dropify/dist/css/dropify.min.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function AddStock() {
    const [formData, setFormData] = useState({
        qty: '',
        price: '',
        supplier_id: '',
        product_id: '',
        updateFormData:''
    });


    const [saveFormData, setSaveFormData] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState([]);


    const [processing, setProcessing] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);
    const [openQty, setOpenQty] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [users, setUsers] = useState([]); // Users for the dropdown
    const [suppliers, setSuppliers] = useState([]); // Suppliers for the dropdown
    const [suppliersData, setSuppliersData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [products, setProducts] = useState([]);
    const [FormArray, setFormArray] = useState([]);
    const [copyProduct, setCopyProduct] = useState([]);
    // Suppliers for the dropdown
    const toast = useRef(null);


    const [updateFormData, setUpdateFormData] = useState({
        qty: '',
        selling_price: '',
        product_id: '',
        updatedPrice:false,
        updatedQty:false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch suppliers data from your API
                const response = await axios.get('https://api.scan-verify.com/api/suppliers');
                const suppliers = response.data;

                // Transform the suppliers data
                const transformedData = suppliers.map(supplier => ({
                    id: supplier.id,
                    name: supplier.business_name  // Assuming you want to use `business_name` as `name`
                }));

                // Update state with the transformed data
                setSuppliersData(transformedData);

                // Log the transformed data for verification
                console.log(transformedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);



    const  fetch  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/products', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);


                setProductData(response.data)
                console.log(response.data)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }
    useEffect(() => {
        fetch();
    }, []);




    const handleQtyChange = (value,change) => {

        setUpdateFormData((prevState) => ({
            ...prevState,
            qty: value,
            product_id:change,
            updatedQty:true,
        }));
    };

    const handlePriceChange = (value,change) => {

        setUpdateFormData((prevState) => ({
            ...prevState,
            purchase_price: value,
            product_id:change,
            updatedPrice:true,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };



    const handleSupplierChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            supplier_id: e.target.value
        }));
    };

    // const handleProductChange = (e) => {
    //     const { name, value } = e.target;

    //     setFormData((prevState) => ({
    //         ...prevState,
    //         product_id: value,
    //     }));

    //     setSelectedProduct((prevState) => {
    //         const selectedProductExists = prevState.some((product) => product.id === value);

    //         if (!selectedProductExists) {
    //             return [...prevState, { id: value, name: name }];
    //         } else {
    //             return prevState;
    //         }
    //     });
    //     console.log('selectedProduct:', selectedProduct)
    // };



    // const update = ()=>{
    //     FormArray.push(updateFormData);
    //     console.log('Form Data:', updateFormData)
    //     console.log('Current Data:', FormArray)
    //     setIsUpdate(true);

    //     setInterval(() => {
    //          setIsUpdate(false);
    //     }, 200)
    // }


    // useEffect(() => {
    //     setSelectedProduct([]);
    // }, [isUpdate]);


    const handleProductChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            product_id: value,
        }));



        setSelectedProduct((prevState) => {
            const selectedProductExists = prevState.some((product) => product.id === value);

            if (!selectedProductExists) {
                setCopyProduct({ id: value, name: name });
                console.log("copy1", copyProduct)

                console.log("form1", selectedProduct)
                return [{ id: value, name: name }];
            } else {

                setCopyProduct(prevState.id);
                console.log("copy2", copyProduct)
                return prevState;
            }

        });



        console.log('selectedProduct:', selectedProduct)
    };



    useEffect(() => {
        console.log('updateFormData:', updateFormData)

    }, [updateFormData]);

    const showSuccess = (severity, summary, message) => {
        toast.current.show({ severity, summary, detail: message, life: 10000 });
    };

    useEffect(() => {
        setFormData((prevState) => ({
                 ...prevState,
                 price: copyProduct?.id?.purchase_price,
                 qty: copyProduct?.id?.qty,
             }));

 }, [copyProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const form = new FormData();
        form.append('price', formData.price);
        form.append('qty', formData.qty);
        form.append('product_id', formData.product_id?.id);
        form.append('supplier_id', formData.supplier_id?.id);
        // form.append('updateFormData', JSON.stringify(FormArray));


        console.log("Copy prod", copyProduct)

        try {
            const response = await axios.post('https://api.scan-verify.com/api/stocks', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Stock added:', response.data);
            showSuccess('success', 'Stock', 'Purchase successfully placed');
        } catch (error) {
            console.error('Error adding stock:', error);
            showSuccess('error', 'Stock', 'Failed to Purchase');
        } finally {
            setProcessing(false);
        }
    };


    const update = () => {
        const newFormArray = [...FormArray, updateFormData];
        setFormArray(newFormArray);
        setUpdateFormData([]);

        console.log('Form Data:', updateFormData);
        console.log('Current Data:', newFormArray);
        setIsUpdate(true);

        // Reset isUpdate after 200ms using a timeout
        setTimeout(() => {
            setIsUpdate(false);
        }, 200);
    };

    useEffect(() => {
        setOpenPrice(false);
        setOpenQty(false);

        console.log("Latest",FormArray)
        setFormData((prevState)=>({
            ...prevState,
            updateFormData:FormArray,
        }))

        if (!isUpdate) {
            setSelectedProduct([]);
        }
    }, [isUpdate]);



    const qtyBody = (rowData) => {

        return(
            <div className=''>
            <div className='flex items-center justify-center text-green-500'>
                <input
                    type="number"
                    onClick={(e)=>{setOpenQty(true);}}
                    name="qty"
                    placeholder="Quantity"
                    value={openQty? copyProduct.qty :  rowData.id.qty}
                    onChange={(e)=>{ handleQtyChange(e.target.value,rowData.id.id)} }
                    className="rounded-md border w-20 text-center border-green-500 bg-white px-1  text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />


            </div>
            </div>
        )
      };

      const priceBody = (rowData) => {

        return(
            <div className='flex items-center justify-center text-green-500'><b>{"₦  "}</b>
             <input
                type="number"
                onClick={(e)=>{setOpenPrice(true);}}
                name="selling_price"
                placeholder="Price"
                value={openPrice? copyProduct.selling_price :  rowData.id.selling_price}
                onChange={(e)=>{ handlePriceChange(e.target.value,rowData.id.id) }}
                className="rounded-md border w-20 text-center border-green-500 bg-white px-1  text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />


            </div>
        )
      };

      const actionButtonTemplate = (rowData) => {
        return (
          <div className='grid grid-cols-2 justify-center'>
            <div
            onClick={update}
             type='button'
           tooltip="Update Product"
              className="p-button-rounded px-4 my-auto border hover:bg-green-400  bg-green-500 items-center justify-center rounded-md text-white w-12 h-12 p-button-warning mr-2"
            >
              <i className="pi pi-plus-circle w-12 text-success"></i>Update
            </div>

          </div>
        );
      };

    return (
        <div className="flex items-center justify-center p-12 w-1/2 mx-auto mb-6">
            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between mb-6">
                <h1 className="font-bold mx-auto text-4xl place-self-start text-green-500 justify-center text-left">Store Purchase</h1>
                <Toast ref={toast} />
                <form onSubmit={handleSubmit}>
                    <h1 className="font-bold text-2xl place-self-start">Store Purchase Information</h1>


                    <label htmlFor="supplier_id" className="my-3 block font-bold text-base font-medium text-[#000000]">
                        Select Product
                    </label>
                    <div className="card flex justify-content-center w-full my-3">
                        <Dropdown
                            inputId="product_id"
                            name='product_id'
                            value={formData.product_id}
                            onChange={handleProductChange}
                            options={productData}
                            optionLabel="name"
                            className="w-full text-green-500 border border-green-500"
                        />
                    </div>

                        {/* <div className="mx-auto  w-[68%] my-3">
                            <DataTable value={selectedProduct} tableStyle={{ maxWidth: '50rem' }}>
                            <Column
                                    body={priceBody}
                                    header="Buying Price"
                                    className='p-4'
                                    sortable
                                    style={{ minHeight: '6rem' }}
                                    filter
                                    filterPlaceholder="Search by ID"
                                />

                                <Column
                                    field="id.name"
                                    header="Name"
                                    className='p-4'
                                    sortable
                                    style={{ minHeight: '6rem' }}
                                    filter
                                    filterPlaceholder="Search by ID"
                                />

                                 <Column
                                    field="id.discount"
                                    header="Discount (%)"
                                    className='p-4'
                                    sortable
                                    style={{ minHeight: '6rem' }}
                                    filter
                                    filterPlaceholder="Search by ID"
                                />



                                <Column
                                    body={qtyBody}
                                    header="Quantity"
                                    className='p-4'
                                    sortable
                                    style={{ minHeight: '6rem' }}
                                    filter
                                    filterPlaceholder="Search by ID"
                                />

                                <Column
                                    body={actionButtonTemplate}
                                    header="Actions"
                                    className='p-4'
                                    style={{ minHeight: '6rem' }}

                                />
                            </DataTable>
                        </div> */}


                            <label htmlFor="supplier_id" className="my-3 block font-bold text-base font-medium text-[#000000]">
                                Select Supplier
                            </label>
                            <div className="card flex justify-content-center w-full my-3">
                                <Dropdown
                                    inputId="supplier_id"
                                    value={formData.supplier_id}
                                    onChange={handleSupplierChange}
                                    options={suppliersData}
                                    optionLabel="name"
                                    className="w-full text-green-500 border border-green-500"
                                />
                            </div>


                    <div>


                    <label htmlFor="supplier_id" className="my-3 block font-bold text-base font-medium text-[#000000]">
                            Quantity
                    </label>
                    <div className='grid grid-cols-2 mt-3'>
                    <input
                            id="qty"
                            label="Purchase Quantity"
                            type="number"
                            name="qty"
                            placeholder="Quantity"
                            value={formData.qty}
                            required
                            onChange={handleInputChange}
                            className="rounded-md w-full mb-5 py-3 px-5 border w-20  border-green-500 bg-white px-1  text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />



                    <label htmlFor="supplier_id" className="my-2 block font-bold text-base font-medium text-[#000000]">
                    Purchase Price
                    </label>
                    <input
                        id="price"

                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleInputChange}

                            className="rounded-md w-full mb-3 py-3 px-5 border w-20  border-green-500 bg-white px-1  text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        />




                    </div>


                        <button
                            type="submit"
                            disabled={processing}
                            className={`hover:shadow-form grid grid-cols-2 w-full items-center justify-content-center py-3 px-4 text-center text-base font-semibold outline-none ${processing ? 'bg-green-300' : 'bg-green-500'}`}
                        >
                            {processing && (
                                <div className="items-center">
                                    <ProgressSpinner style={{ width: '30px', height: '30px', color: 'red' }} strokeWidth="6" fill="none" animationDuration=".2s" />
                                </div>
                            )}
                            <div className="items-center justify-center text-white">
                                Add Stock
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

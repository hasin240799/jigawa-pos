import React, { useState, useRef, useEffect } from 'react';
import InputField from "../components/InputField";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import $ from 'jquery';
import 'dropify/dist/js/dropify.min.js';
import 'dropify/dist/css/dropify.min.css';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Navigate, useNavigate } from 'react-router-dom';
import { Image } from 'primereact/image';
import { FaCartPlus, FaTrash } from 'react-icons/fa';

export default function SalesForm() {

    const [processing, setProcessing] = useState(false);
    const [products, setProducts] = useState([]);
    const [fetchedProducts, setFetchedProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [type, setType] = useState('');
    const [isEmploy, setIsEmploy] = useState(false);
    const [disable, setIsDisable] = useState(false);
    const [due, setDue] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loan, setLoan] = useState([]);
    const [repayment, setRepayment] = useState([]);
    const [netSal, setNetSal] = useState(null);
    const [loanType, setLoanType] = useState('');
    const navigate = useNavigate();
    const customersRef = useRef(Array.from({ length: 100000 }));
    const [loading, setLoading] = useState(false);
    const loadLazyTimeout = useRef();
    const [processingStatus, setProcessingStatus] = useState('');
    const [responseCode, setResponseCode] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseRef, setResponseRef ]= useState('');

 const [formData, setFormData] = useState({
    customer_id: '',
    products: [],
    installments:'',
    status: 'pending',  
    card_id:'',
    payment_type: 'direct',
    note: '',
  });


    const toast = useRef(null);
    const showSuccess = (severity, summary, message) => {
        toast.current.show({ severity: severity, summary: summary, detail: message, life: 10000 });
    };


    const  changeQty = (field,qty)=>{

        const data = formData.products[field];
        const currentAmount = data.selling_price * data.quantity

        setTotalAmount((prevState) => (
            (prevState - currentAmount)  +  parseFloat(data.selling_price) * qty

        ))

    }

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = formData.products.map((product, i) =>
      i === index ? { ...product, [name]: value } : product
    );

        setFormData({ ...formData, products: updatedProducts });
        changeQty(index,e.target.value);
  };


//   useEffect(() => {


//   }, [formData.products]);


  const handleAddProduct = (e) => {
    // Assuming e.target.value is an object representing the product
    const newProduct = e.target.value;
    const showSuccess = (severity, summary, message) => {
        toast.current.show({ severity: severity, summary: summary, detail: message, life: 10000 });
    };

    if ((newProduct.qty_in - newProduct.qty_out <= 0)) {
        showSuccess('error', "Product"," Product stock is 0");
    }

    // Update the formData with the new product
    setFormData(prevFormData => {
        // Add the new product to the products array
        const updatedProducts = [...prevFormData.products, {
            selling_price: newProduct.selling_price * 1,
            discount: newProduct.discount,
            name: newProduct.name,
            id: newProduct.id,
            stock: (newProduct.qty_in - newProduct.qty_out),
            quantity: 1
        }];



        // Filter out duplicate products based on the product ID
        const uniqueProducts = updatedProducts.filter((product, i, self) =>
            i === self.findIndex((p) => p.id === product.id)

        );

        const productIndex = formData.products.findIndex(product => product.id === newProduct.id);






        // Check if the quantity of the new product is less than or equal to 0
        if ((newProduct.qty_in - newProduct.qty_out) <= 0) {
            // Return the updated formData with unique products
            // Return the updated formData with an empty products array (it looks like a mistake to set it to an empty object `{}`)

                if(productIndex !== -1){

                }else{
                    setTotalAmount((prevState) => (
                        prevState + 0
                    ))
                }

            return {
                ...prevFormData,
                products: formData.products
            };

        } else {


        if(productIndex !== -1){

        }else{
            setTotalAmount((prevState) => (
                prevState + parseFloat(newProduct.selling_price)
            ))
        }


            return {
                ...prevFormData,
                products: uniqueProducts
            };
        }

    });

};


useEffect(() => {

        setLoanType(formData.payment_type.id)
}, [formData.payment_type]);

  const handleRemoveProduct = (index) => {
    const amount = formData.products[index].selling_price;

    const productIndex = formData.products.indexOf(index);


    const updatedProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: updatedProducts });


    if(productIndex !== -1){

    }else{
        const qty = formData.products[index];

        setTotalAmount((prevState) => (
            prevState - (parseFloat(amount) * qty.quantity)
        ))
    }

    if(formData.products === null){
        alert("is empty")
        setTotalAmount(0);
    }


  };


    const handleCustomerChange = (e) => {
        const { value } = e.target;

        console.log("customer_data", value)
        setFormData((prevState) => ({
            ...prevState,
            customer_id: value
        }));




    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };



    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            payment_type: value
        }));
    };

    const methods = [
        {id:'card', name:"Card Sale"},
        {id:'installment', name:"Installment Sale"},
    ]



const status = [
    {id:'pending',name:"Pending"},
    {id:'completed',name:"Completed"},
    {id:'paid',name:"Paid"},
    {id:'installment',name:"Installment'"},
    {id:'cancelled',name:"Cancelled"}
]




const customerType =[
    { "id": 1, "name": "Individual" },
    { "id": 2, "name": "Employee" },
]



 useEffect(() => {

    if (type.id == customerType[1].id) {
        setIsEmploy(true)

    }else{
        setIsEmploy(false)
    }

 }, [type]);

 const checkEligibleAmount = (amount) => {
    // Calculate the customer's eligible amount (one-third of the given amount)
    let eligibleAmount = amount / 3;

    // const apiUrl = process.env.REACT_APP_API_URL;



    // Check if the total amount exceeds the eligible amount
    if (totalAmount > eligibleAmount) {

        if (isEmploy) {
            showSuccess(
                'error',
                "Repayment",
                `Your total product amount exceeds your loan eligibility of N ${eligibleAmount.toFixed(2)}`
            );
            setIsDisable(true);

        }
        // else{

            // if(totalAmount > (10000)){
            //     setIsDisable(true);

            // }

        // }

    }else{
        setIsDisable(false)
    }

}//End of the function



useEffect(() => {
    checkEligibleAmount(netSal);
    // if(totalAmount <= 0){
    //     setIsDisable(false)
    // }
}, [totalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(isEmploy){
            if(formData.card_id == '' || formData.card_id == null || formData.card_id == undefined || formData.card_id == 0){
                showSuccess('error',"Card Error",`Please select correct Card ID to process card sale`)
                
            }
        }

        setProcessing(true);
    

        const saleData = {
        ...formData,
        // installments:parseInt(formData.installments),
        installments: loanType == 'installment' ? 1 : 0,
        customer_id: parseInt(formData.customer_id.id),
        payment_type: formData.payment_type.id,
        card_id: formData?.card_id,
        total_amount: totalAmount,
        products: formData.products.map(product => ({
        id: parseInt(product.id),
        qty: parseInt(product.quantity),
      })),
    };

    console.log('Sales Data',saleData)

        try {
          

            if(formData.payment_type.id == 'card'){

                const response = await axios.post('https://api.scan-verify.com/api/sales/create/card',saleData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
         

            setProcessing(false);
            if (response.data.success) {
                fetchProducts()
                const ref = response?.data?.ref;
                    
                if (ref) {
                    setResponseRef(ref)
                  
                    navigate(`/sales/receipt-card/${ref}?status=${response.data.status.processingStatus}`);
                    
                  } else {
             
                    console.error('Reference not found');
                  }


            setFormData((form)=>({
                ...form,
                products:[]
            }))

                showSuccess('success', "Product", response.data.message);
            } else {

                showSuccess('error', "Product", response.data.message);
            }
        
        }else if(formData.payment_type.id == 'installment'){
                const response = await axios.post('https://api.scan-verify.com/api/sales/create',saleData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
        

            console.log('Product added:', response.data);
            setProcessing(false);
            if (response.data.success) {
                fetchProducts()
                const ref = response?.data?.ref;

                if (ref) {
                    setResponseRef(ref)
                    navigate(`/sales/receipt/${ref}`);
                } else {
                    console.error('Reference not found');
                }

            setFormData((form)=>({
                ...form,
                products:[]
            }))

                showSuccess('success', "Product", response.data.message);
            } else {

                showSuccess('error', "Product", response.data.message);
            }
        }else{
            alert('Failed Transaction')
            setProcessing(false);
        };

    } catch (error) {
        setProcessing(false);
        console.error('Error adding product:', error);
    }
};



    const  fetchProducts  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/sales', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 13|HicavqjMcaeClvJeYbdRTzuaTqzx3npnn4FN5glUe426d978',
                }

            });

            console.log('Customer and Products:', response.data.products);

            setCustomers(response.data.customers)
            setProducts(response.data.products)


            // )))

            console.log("Logged", fetchedProducts)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

    //  const checkIfLoan = ()=>{
    //     if (loan !== null) {
    //         setDue(true);
    //         alert('HasDue')
    //     }else{
    //         alert('Has No Due')
    //         setDue(false);
    //     }
    //  }
//  localStorage.setItem('token',"9|uNcizYdWEBr85RAasqTWNz5cKFCuQKRGTYiOSaeOe4f57c9b")

     const  fetchLoan  = async ()=>{
        try {
            const response = await axios.get(`https://api.scan-verify.com/api/customer/loan?id=${formData.customer_id.id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Customer and Products:', response.data.products);

            setRepayment(response.data.repayment)
            setLoan(response.data.loan)
            setNetSal(response.data.netSalary)

            if (response.data.loan !== null) {
                    setDue(true);
            }else{
                setDue(true);
            }
            // )))

            console.log("Logged Repayment", response.data.repayment)
            console.log("Logged Net Salary", response.data.netSalary)
            console.log("Logged Net Loan", response.data.loan)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


     
     const verifyPayment  = async ()=>{
        try {
            const response = await axios.get(`https://api.scan-verify.com/api/sales/trans-status/${formData.merchantReference}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Sales Status:', response.data);

            setProcessingStatus(response.data.processingStatus)
            setResponseCode(response.data.responseCode)
            setResponseMessage(response.data.responseMessage)


        } catch (error) {
            console.error('Error verifying payment:', error);
        }
     }


     const customerTemplate = (option) => {
        if (isEmploy) {
            return (
                <div>
                    {option.full_name} - {option.psn}
                </div>
            );

        } else {
            return (
                <div>
                    {option.full_name} - {option.contact}
                </div>
            );
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    useEffect(() => {

        if (type.name ==  "Employee") {
            fetchLoan();
        }

    }, [formData.customer_id.id]);



    const handleUpdate = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const form = new FormData();
        // form.append('items', itemFormData.item);
        // form.append('type', itemFormData.type);

        try {
            const response = await axios.post('https://api.scan-verify.com/api/product/create', form, {
                headers: {
                     'Content-Type': 'application/json'
                }
            });

            console.log('Product Item added:', response.data);
            setProcessing(false);

            if (response.data.success) {

                showSuccess('success', "Product", "Product Category/Sub Category  Successfully Added");
            } else {
                showSuccess('error', "Product", "Product failed to add");
            }
        } catch (error) {
            setProcessing(false);
            console.error('Error adding product:', error);
        }
    };

    const selectedCustomerTemplate = (option) => {
        if (isEmploy) {
                // Assuming `option` here is the selected value
        if (!option) return <span>Select Customer</span>;
        return (
            <div>
                {option.full_name} - {option.psn}
            </div>
        );

        } else {
                        // Assuming `option` here is the selected value
                if (!option) return <span>Select Customer</span>;
                return (
                    <div>
                        {option.full_name} - {option.contact}
                    </div>
                );
        }
    };
    // const onLazyLoad = (event) => {
    //     setLoading(true);
    //     if (loadLazyTimeout.current) {
    //         clearTimeout(loadLazyTimeout.current);
    //     }

    //     // Imitate delay of a backend call
    //     loadLazyTimeout.current = setTimeout(() => {
    //         const { first, last } = event;
    //         // Simulate loading customers here
    //         setLoading(false);
    //     }, Math.random() * 1000 + 250);
    // };

    const onLazyLoad = (event) => {
        setLoading(true);
        if (loadLazyTimeout.current) {
            clearTimeout(loadLazyTimeout.current);
        }
    
        loadLazyTimeout.current = setTimeout(() => {
            // Apply filtering manually
            const filterValue = event.filter || '';
            const filteredCustomers = customers.filter(customer =>
                customer?.psn && customer?.psn.includes(filterValue)
            );
       
            // Load a subset of filtered customers
            const { first, last } = event;
            const lazyLoadedCustomers = filteredCustomers.slice(first, last);
    
            setCustomers(filteredCustomers);
            console.log(filteredCustomers);
            setLoading(false);
        }, Math.random() * 1000 + 250);
    };
    

    return (



        <div className="flex items-center justify-center p-12 w-full mx-auto">



            <div className="mx-auto w-[80%] bg-white p-6 rounded-md justify-between ">
            <h1 className=" font-bold mx-auto text-4xl place-self-start text-green-500 justify-center text-left">POS Palliatve Shop</h1>
            <Toast ref={toast} />
                <form onSubmit={handleSubmit}>


                    <div className="grid grid-cols-2 gap-x-4 w-full">

                        
                    <div className="flex flex-row gap-x-4 w-full">
                           
                            <div className="card   md:w-1/3 sm:w-full mt-3">
                            <label htmlFor="cat" className="font-bold text-base font-medium text-[#07074D]">
                                Select Customer type
                            </label>
                                    <Dropdown inputId="dd-type" value={type}   placeholder='Select Customer Type'  name='customer_type' onChange={(e)=>{setType(e.target.value)}} options={customerType} optionLabel="name" className="w-full text-green-500 border border-green-500" />
                            </div>

                            {isEmploy? (
                                <>
                                    
                                    <div className="card  md:w-1/3 sm:w-full my-3">
                                    <label htmlFor="cat" className="font-bold text-base font-medium text-[#07074D]">
                                        Select Customer
                                    </label>
                                        <Dropdown
                                            inputId="dd-city"
                                            loading={loading}
                                            
                                            virtualScrollerOptions={{
                                                onLazyLoad: onLazyLoad,
                                                itemSize: 38,
                                                showLoader: true,
                                                loading: loading,
                                                delay: 250
                                            }}
                                            filterInputAutoFocus={true}                                            
                                            value={formData.customer_id}
                                            placeholder='Select Customer'
                                            name='customer_id'
                                            filterPlaceholder='Search with PSN Number'
                                            filter={true}
                                            filterBy='psn'
                                            onChange={handleCustomerChange}
                                            options={customers}
                                            itemTemplate={customerTemplate} // Use custom template
                                            valueTemplate={selectedCustomerTemplate} // Custom template for selected item
                                            className="w-full text-green-500 border border-green-500"
                                        />
                                    </div>
                                    <div className="card w-[20%] h-[30%] my-3 mx-auto">
                                        <Image src={formData.customer_id.passport} zoomSrc={formData.customer_id.passport}  preview={true} loading='lazy' alt="Image" width="250" height="50"  />
                                    </div>
                                 
                                                        
                                </>

                                ):(
                                    <>
                                 
                                    <div className="card md:w-1/3 sm:w-full my-3">
                                    <label htmlFor="cat" className=" font-bold text-base font-medium text-[#07074D]">
                                        Select Customer
                                    </label>
                                        <Dropdown
                                            inputId="dd-city"
                                            value={formData.customer_id}
                                            loading={loading}
                                            virtualScrollerOptions={{
                                              
                                                onLazyLoad: onLazyLoad,
                                                itemSize: 38,
                                                showLoader: true,
                                                loading: loading,
                                                delay: 250
                                            }}
                                            placeholder='Select Customer'
                                            name='customer_id'
                                            filterPlaceholder='Search with Phone Number'
                                            filter={true}
                                            filterBy='contact'
                                            onChange={handleCustomerChange}
                                            options={customers}
                                            itemTemplate={customerTemplate} // Custom template for dropdown items
                                            valueTemplate={selectedCustomerTemplate} // Custom template for selected item
                                            className="w-full text-green-500 border border-green-500"
                                        />
                                    </div>

                                    <div className="card w-[20%] h-[30%] my-3 mx-auto">
                                        <Image src={formData.customer_id.passport} zoomSrc={formData.customer_id.passport}  preview={true} loading='lazy' alt="Image" width="250" height="50"  />
                                    </div>
                                </>

                                )
                            }

                            </div>

                            {/* Table for loan eligibility */}

                            
                            {isEmploy &&(
                                    <div className=" mt-5 md:w-1/2 sm:w-full">
                                    <span className='font-bold text-green-600 text-capitalize mt-4'>Outstanding Loan & Current Net Salary Summary</span>
                                    <table className='w-full'>
                                        <thead>
                                        <tr className='bg-green-500'>
                                            <th  scope="col" className="px-3 py-1 text-left text-xs font-medium text-white uppercase tracking-wider">Loan</th>
                                            <th  scope="col" className="px-3 py-1 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 ">
                                            <tr className='bg-red-500'>
                                                <td>
                                                    <b className='text-white'>Current Loan Due:</b>
                                                </td>
                                                <td>
                                                    <b className='text-white'> {new Intl.NumberFormat('en-US', {style: 'currency',
                                                currency: 'NGN', // or 'NGN' for Nigerian Naira
                                                }).format(repayment.due_balance)}</b>
                                                </td>
                                            </tr>
                                            <tr className='bg-black'>
                                                <td>
                                                    <b className='text-white'>Loan Amount </b>
                                                </td>
                                                <td>
                                                    <b className='text-white'> {new Intl.NumberFormat('en-US', {style: 'currency',
                                                currency: 'NGN', // or 'NGN' for Nigerian Naira
                                                }).format(loan? loan.total_amount: 0.0)}</b>
                                                </td>
                                            </tr>

                                            <tr className='bg-black'>
                                                <td className='text-white'>Eligible Loan Amount: </td>
                                                <td className='text-white'>
                                                    {new Intl.NumberFormat('en-US', {style: 'currency',
                                                    currency: 'NGN', // or 'NGN' for Nigerian Naira
                                                    }).format((netSal*1/3))}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </div>
                            )

                            }
                         

                                <div className="card  w-full mt-3">
                                <label htmlFor="cat" className="mt-4 block font-bold text-base font-medium text-[#07074D]">
                                    Select Product
                                </label>
                                        <Dropdown inputId="dd-city"  value={formData.products} filter={true}  placeholder='Select Products'  name='products' onChange={handleAddProduct} options={products} optionLabel="name" className="w-full text-green-500 border border-green-500" />
                                </div>


                                <label htmlFor="cat" className="mt-4  block font-bold text-base font-medium text-[#07074D]">
                                  Select Methods
                                </label>
                                <div className="card  w-full mt-3">
                                        <Dropdown inputId="dd-city" required={true} value={formData.payment_type}   placeholder='Select Methods'  name='payment_type' onChange={handlePaymentChange} options={methods} optionLabel="name" className="w-full text-green-500 border border-green-500" />
                                </div>

                               {loanType == "installment" && (
                                <>
                                <label htmlFor="cat" className="mt-4  block font-bold text-base font-medium text-[#07074D]">
                                  Installments (In Months)
                                </label>

                                <input
                                type="number"
                                max={2}
                                min={1}
                                name="installments"
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-200 sm:text-sm"
                                placeholder="Installments"
                                value={formData.installments}
                                required
                                />


                               

                            </>
                           
                                
                               )}


                        {loanType == "card" && (
                                <>
                                <label  className="mt-3 block text-base font-medium font-bold text-[#07074D]">
                                Card ID
                                </label>
                                <input
                                    id="card_id"
                                    type="password"
                                    name="card_id"
                                    maxLength={5}
                                    minLength={1}                                            
                                    required={true}
                                    placeholder="Card ID"
                                    value={formData?.card_id}
                                    onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-200 sm:text-sm"
                                />

                                </> 
                                )}
                            </div>


                    <div className="w-full mt-4">
                    <label className="block text-sm font-medium font-bold text-black">Selected Products</label>
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-green-500">
                        <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium font-bold text-white uppercase tracking-wider">Product Name</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium font-bold text-white uppercase tracking-wider">Selling Price</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium font-bold text-white uppercase tracking-wider">Stocks</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium font-bold text-white uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium font-bold text-white uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white py-1">
                        {formData.products.map((product, index) => (
                            <tr key={index} className="font-bold">

                            <td className="px-0 py-0 whitespace-nowrap">
                                <input
                                type="text"
                                name="id"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-200 sm:text-sm"
                                placeholder="Product ID"
                                value={product.name}
                                disabled={true}
                                required
                                />
                            </td>
                            <td className="px-4 py-0 whitespace-nowrap">
                                <input
                                type="text"
                                name="selling_price"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-200 sm:text-sm"
                                placeholder="Selling PRice"
                                value={product.selling_price}
                                disabled={true}
                                required
                                />
                            </td>
                            <td className="px-4 py-0 whitespace-nowrap">
                                <input
                                type="number"
                                name="stock"
                                className="mt-1 block w-full px-3 py-2 border font-bold text-red-500 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-200 sm:text-sm"
                                placeholder="Quantity"
                                disabled={true}
                                value={product.stock}
                                onChange={(e) => handleProductChange(index, e)}
                                required
                                />
                            </td>
                            <td className="px-4 py-0 whitespace-nowrap">
                                <input
                                type="text"
                                name="quantity"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm outline-none focus:ring-green-500 focus:border-green-200 sm:text-sm"
                                placeholder="Quantity"
                                value={product.quantity}
                                onChange={(e) => handleProductChange(index, e)}
                                required
                                />
                            </td>
                            <td className="px-4 py-0 whitespace-nowrap">
                                <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={() => handleRemoveProduct(index)}
                                >
                                <FaTrash/>
                                <span className="font-bold">Delete</span>
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>

                     {isEmploy &&(
                        <div className='my-5'>
                            <table className='w-full'>
                                <tbody className=''>
                                    <tr className='bg-yellow-500 my-4'>
                                                    <td className='font-bold'>Current Net: </td>
                                                <td className='font-bold'>
                                                  ₦{new Intl.NumberFormat('en-US').format(netSal)}
                                                </td>
                                    </tr>
                                    <tr className='bg-black'>
                                                    <td className='text-white font-bold'>Eligible Loan Amount: </td>
                                                    <td className='text-white font-bold'>
                                                    ₦{new Intl.NumberFormat('en-US').format((netSal*1/3))}
                                                    </td>
                                    </tr>
                                </tbody>
                            </table>
                       </div>
                        )
                     }


                        <div className=" my-5">
                        <span className='font-bold  text-green-600 text-capitalize mt-5 py-6'>Cummulative Price</span>
                        <table className=' w-full'>
                            <thead>
                               <tr className='bg-green-500'>
                                <th  scope="col" className="px-3 py-1 text-left text-xs font-medium font-bold text-white uppercase tracking-wider">S/N</th>
                                <th scope="col" className="px-3 py-1 text-left text-xs font-bold font-medium text-white uppercase tracking-wider">Items Name</th>
                                <th scope="col" className="px-3 py-1 text-left text-xs font-bold font-medium text-white uppercase tracking-wider">Qty</th>
                                <th scope="col" className="px-3 py-1 text-left text-xs font-bold font-medium text-white uppercase tracking-wider">Amount</th>
                               </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 ">
                                {
                                        formData.products.map((product, index) => (
                                            <tr key={index}>
                                            <td className='px-2 py-1 whitespace-nowrap font-bold'>{index + 1}</td>
                                            <td className='px-2 py-1 whitespace-nowrap font-bold'>{product.name}</td>
                                            <td className='px-2 py-1 whitespace-nowrap font-bold'>{product.quantity}</td>
                                            <td className='px-2 py-1 whitespace-nowrap font-bold'>
                                            ₦{new Intl.NumberFormat('en-US').format(product.selling_price)}
                                                </td>
                                            </tr>
                                        ))
                                }

                            </tbody>
                            </table>
                                    <span className='text-green-500 font-bold mt-4'>Total Amount: </span>
                                    <span className='font-extrabold'>
                                    ₦{new Intl.NumberFormat('en-US').format(totalAmount)}
                                    </span>
                            </div>


                    {/* <div className="mb-5">
                        <label htmlFor="note" className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                        Description
                        </label>
                        <textarea
                            id="note"
                            name="note"
                            placeholder='Notes'
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-green-500 bg-white py-3 px-5 text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        >{formData.note}</textarea>
                    </div> */}

                    {disable? (
                            <>
                                <span className='text-red-500 font-bold bg-yellow-300 rounded-md px-2 py-1'>Your Total cost exceeds limit of the loan eligibility, you need to decrease your porudcts quantity or remove </span>

                                <div>
                                <button
                                    onClick={handleSubmit}
                                        type="submit"
                                        { ...processing && 'disabled'}
                                        disabled={true}

                                        className={`hover:shadow-form grid  mt-4 grid-cols-2 w-full items-center justify-content-center file:rounded-md  py-3 px-4 text-center text-base font-semibold outline-none bg-green-300`}
                                    >{processing && (
                                        <div className="items-center">
                                            <ProgressSpinner style={{width: '30px', height: '30px', color:'red'}} strokeWidth="6" fill="none" animationDuration=".2s" />
                                    </div>
                                    )

                                    }
                                    <div className="items-center justify-center text-white">
                                        <FaCartPlus/>
                                        <span>Process Sale</span>
                                    </div>
                                    </button>
                                </div>
                            </>


                    ):(

                    <div>
                        <button
                        onClick={handleSubmit}
                            type="submit"
                            { ...processing && 'disabled'}

                            className={`hover:shadow-form focus:bg-green-300  grid grid-cols-2 w-full items-center justify-content-center file:rounded-md  py-3 px-4 text-center text-base font-semibold outline-none ${processing ? 'bg-green-300' : 'bg-green-500'}`}
                        >{processing && (
                             <div className="items-center">
                                <ProgressSpinner style={{width: '30px', height: '30px', color:'red'}} strokeWidth="6" fill="none" animationDuration=".2s" />
                        </div>
                        )

                        }
                        <div className="flex flex-row gap-x-4 items-center justify-center text-white">
                                <FaCartPlus/>
                                <span>Process Sale</span>
                        </div>
                        </button>
                    </div>
                    )

                }





                </form>
            </div>
        </div>
    );
}

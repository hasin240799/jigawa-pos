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
import './receipt.css'
import { useParams } from 'react-router-dom';
import { BiCartAdd, BiPlug, BiPlus, BiPrinter } from 'react-icons/bi';
import { useBarcode } from 'next-barcode';


export default function CardReceipt() {
    const [formData, setFormData] = useState({
        qty: '',
        price: '',
        supplier_id: '',
        product_id: '',
        updateFormData:''
    });
    const { id } =  useParams(); // Extracts the ID from the URL

    const [saveFormData, setSaveFormData] = useState([]);

    const [selectedProduct, setSelectedProduct] = useState([]);


    const [processing, setProcessing] = useState(false);
    const [openPrice, setOpenPrice] = useState(false);
    const [openQty, setOpenQty] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [users, setUsers] = useState([]); // Users for the dropdown
    const [suppliers, setSuppliers] = useState([]); // Suppliers for the dropdown
    const [suppliersData, setSuppliersData] = useState([]);
    const [saleRefs, setSaleRefs] = useState();
    const [sale, setSale] = useState([]);
    const [total, setTotal] = useState(0);
    const [productData, setProductData] = useState([]);
    const [FormArray, setFormArray] = useState([]);
    const [copyProduct, setCopyProduct] = useState([]);
    const [processingStatus, setProcessingStatus] = useState('');
    const [responseCode, setResponseCode] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [responseRef, setResponseRef ]= useState('');
    
    // Suppliers for the dropdown
    const toast = useRef(null);


    const [updateFormData, setUpdateFormData] = useState({
        qty: '',
        selling_price: '',
        product_id: '',
        updatedPrice:false,
        updatedQty:false,
    });







      const { inputRef } = useBarcode({
        value: saleRefs,
        options: {
          width:1,
          height:50,
          displayValue:false,
        }
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


                console.log(response.data)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

     function formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);

        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' }); // August
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format

        return `${month} ${day}, ${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
      }

    const  fetchSale  = async ()=>{
        try {
            const response = await axios.get(`https://api.scan-verify.com/api/sales/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setSale(response.data.sale.products)
            setProductData(response.data)
            setSaleRefs(response.data.sale.ref);
            
            verifyPayment(id);

            // Calculate total outside of setState to avoid multiple re-renders
            let total = 0;
            response.data.sale.products.forEach((product) => {
            total += parseFloat(product.pivot.selling_price * product.pivot.qty);
            });

            // Update the total state
            setTotal(total);

            console.log('Sale Data', response.data.sale);
            console.log('Shop Data', response.data.shop);



        } catch (error) {
            console.error('Error adding product:', error);
        }
     }




    useEffect(() => {
        fetchSale()

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

    const handlePrint = ()=>{
        window.print();
    }

    const handlePriceChange = (value,change) => {

        setUpdateFormData((prevState) => ({
            ...prevState,
            selling_price: value,
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




    useEffect(() => {
        const interval = setInterval(() => verifyPayment(id), 5000);
        return () => clearInterval(interval);
    }, [id]);
    
     const verifyPayment  = async (saleRefs)=>{
        try {
            const response = await axios.get(`https://api.scan-verify.com/api/sales/trans-status/${saleRefs}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Sales Status:', response.data);

            // Determine the response message using a switch statement
            let message;
            switch (response.data.responseCode) {
                case "00":
                    message = "Approved";
                    break;
                case "01":
                    message = "Refer to card issuer";
                    break;
                case "02":
                    message = "Refer to card issuer, special condition";
                    break;
                case "03":
                    message = "Invalid merchant";
                    break;
                case "04":
                    message = "Pick-up card";
                    break;
                case "05":
                    message = "Do not honour";
                    break;
                case "06":
                    message = "Error";
                    break;
                case "07":
                    message = "Pick-up card, special condition";
                    break;
                case "08":
                    message = "Honor with identification";
                    break;
                case "09":
                    message = "Request in progress";
                    break;
                case "10":
                    message = "Approved, partial";
                    break;
                case "11":
                    message = "Approved, VIP";
                    break;
                case "12":
                    message = "Invalid transaction";
                    break;
                case "13":
                    message = "Invalid amount";
                    break;
                case "14":
                    message = "Invalid card number";
                    break;
                case "15":
                    message = "No such issuer";
                    break;
                case "16":
                    message = "Approved, update track 3";
                    break;
                case "17":
                    message = "Customer cancellation";
                    break;
                case "18":
                    message = "Customer dispute";
                    break;
                case "19":
                    message = "Re-enter transaction";
                    break;
                case "20":
                    message = "Invalid response";
                    break;
                case "21":
                    message = "No action taken";
                    break;
                case "22":
                    message = "Suspected malfunction";
                    break;
                case "23":
                    message = "Unacceptable transaction fee";
                    break;
                case "24":
                    message = "File update not supported";
                    break;
                case "25":
                    message = "Unable to locate record";
                    break;
                case "26":
                    message = "Duplicate record";
                    break;
                case "27":
                    message = "File update edit error";
                    break;
                case "28":
                    message = "File update file locked";
                    break;
                case "29":
                    message = "File update failed";
                    break;
                case "30":
                    message = "Format error";
                    break;
                case "31":
                    message = "Bank not supported";
                    break;
                case "32":
                    message = "Completed partially";
                    break;
                case "33":
                    message = "Expired card, pick-up";
                    break;
                case "34":
                    message = "Suspected fraud, pick-up";
                    break;
                case "35":
                    message = "Contact acquirer, pick-up";
                    break;
                case "36":
                    message = "Restricted card, pick-up";
                    break;
                case "37":
                    message = "Call acquirer security, pick-up";
                    break;
                case "38":
                    message = "PIN tries exceeded, pick-up";
                    break;
                case "39":
                    message = "No credit account";
                    break;
                case "40":
                    message = "Function not supported";
                    break;
                case "41":
                    message = "Lost card";
                    break;
                case "42":
                    message = "No universal account";
                    break;
                case "43":
                    message = "Stolen card";
                    break;
                case "44":
                    message = "No investment account";
                    break;
                case "51":
                    message = "Not sufficient funds";
                    break;
                case "52":
                    message = "No check account";
                    break;
                case "53":
                    message = "No savings account";
                    break;
                case "54":
                    message = "Expired card";
                    break;
                case "55":
                    message = "Incorrect PIN";
                    break;
                case "56":
                    message = "No card record";
                    break;
                case "57":
                    message = "Transaction not permitted to cardholder";
                    break;
                case "58":
                    message = "Transaction not permitted on terminal";
                    break;
                case "59":
                    message = "Suspected fraud";
                    break;
                case "60":
                    message = "Contact acquirer";
                    break;
                case "61":
                    message = "Exceeds withdrawal limit";
                    break;
                case "62":
                    message = "Restricted card";
                    break;
                case "63":
                    message = "Security violation";
                    break;
                case "64":
                    message = "Original amount incorrect";
                    break;
                case "65":
                    message = "Exceeds withdrawal frequency";
                    break;
                case "66":
                    message = "Call acquirer security";
                    break;
                case "67":
                    message = "Hard capture";
                    break;
                case "68":
                    message = "Response received too late";
                    break;
                case "75":
                    message = "PIN tries exceeded";
                    break;
                case "77":
                    message = "Intervene, bank approval required";
                    break;
                case "78":
                    message = "Intervene, bank approval required for partial amount";
                    break;
                case "90":
                    message = "Cut-off in progress";
                    break;
                case "91":
                    message = "Issuer or switch inoperative";
                    break;
                case "92":
                    message = "Routing error";
                    break;
                case "93":
                    message = "Violation of law";
                    break;
                case "94":
                    message = "Duplicate transaction";
                    break;
                case "95":
                    message = "Reconcile error";
                    break;
                case "96":
                    message = "System malfunction";
                    break;
                case "98":
                    message = "Exceeds cash limit";
                    break;
                default:
                    message = "Unknown response code";
            }

            setProcessingStatus(message)

            setResponseCode(response.data.responseCode)
            setResponseMessage(response.data.responseMessage)
            
            // window.print();
        

        } catch (error) {
            console.error('Error verifying payment:', error);
        }
     }



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
                 price: copyProduct?.id?.selling_price,
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


      const statusBody = (processingStatus)=>{       
        switch (processingStatus) {
            case "Approved":
                return(
                    <>
                      <span className=" font-bold mt-0 font-serif" style={{ fontSize: '15px',fontFamily:'bolder', color:'green' }}>{processingStatus.toUpperCase()}</span><br/>
                    </>
                 )
                break;

            default:
                return(
                    <>
                      <span className=" font-bold mt-0 font-serif" style={{ fontSize: '15px',fontFamily:'bolder', color:'red' }}>{responseMessage}</span><br/>
                    </>
                 )
                break;
        }
      
    }

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
        <>
       <div className='container print:w-auto print:h-auto mt-4'>
       <div className='border border-spacing-1 border-green-200 bg-green-100 mt-4 text-green-900 rounded-md  px-2 py-3'>
            <div className='grid grid-cols-2 gapx-2 justify-center items-center'>
                <BiCartAdd/>
                <span>Purchase successfully</span>
            </div>
        </div>

       <div className='border border-spacing-1 gap-2 grid grid-cols-2 px-2'>
            <button
             onClick={()=>{handlePrint()}}
             className='bg-blue-500 hover:bg-green-900 text-white mt-5 w-1/2 rounded-md grid grid-cols-2  justify-center items-center'>
                <BiPrinter/>
                <span>Print</span>
            </button>
            <button className='bg-green-500 hover:bg-green-900 ml-3 text-white mt-5 w-1/2 rounded-md grid grid-cols-2  justify-center items-center'>
                <BiPlus/>
                <span>New Sale</span>
            </button>
        </div>

       </div>

        <div className="flex items-center  print:w-auto print:h-auto justify-center p-4">
            <div id="receipt-print" className=" print:w-auto print:h-auto bg-white  p-4  rounded-md font-mono">
                <div  className=' pt-4 px-4 font-mono text-center'>
                    <img src='https://www.jigawapalliative.com.ng/wp-content/uploads/2024/07/e-500-x-199-px-1-e1721594916831.png' className='mx-auto w-10 h-20' />
                    <span className="mt-3 text-center font-bold">{productData?.shop?.shopname}</span>
                </div>
                <div  className='px-4 font-mono text-center'>
                     <span className=" font-bold mt-0 font-serif" style={{ fontSize: '15px',fontFamily:'sans-serif', color:'black' }}>CARD PURCHASE</span><br/>
                <div style={{ fontSize: '12px' }}>***********************</div>
                     {statusBody(processingStatus)} 
                <div style={{ fontSize: '12px' }}>************************</div>
                    <span className="mt-3"><b>Processed By:</b><br/>{productData?.sale?.agent?.name}</span><br/>
                </div>
                <span className=' text-1xl' style={{fontSize:'12px'}}><b>Customer:{productData.sale?.customer?.full_name}</b></span><br/>
                <span className=' text-1xl' style={{fontSize:'12px'}}><b>Date:</b>{formatDateTime(productData?.sale?.created_at)}</span><br/>
                <span className=' text-1xl' style={{fontSize:'12px'}}><b>Printed at: </b>{formatDateTime(new Date())}</span>
                <table className='w-full border-y border-collapse border-black'>
                    <thead>
                        <tr className='border-y border-black' style={{ fontSize: '12px' }}>
                            <th className='text-left px-1 py-1'>S/N</th>
                            <th className='text-left px-1 py-1'>Items</th>
                            <th className='text-left px-1 py-1'>Qtys</th>
                            <th className='text-left px-1 py-1'>Total</th>
                        </tr>
                    </thead>
                    <tbody>


                    {sale.map((product, index) => (
                        <tr key={index} style={{ fontSize: '12px' }}>
                            <td className='text-left px-1 py-1'>{index + 1}</td> 
                            <td className='text-left px-1 py-1'>{product.name}</td>
                            <td className='text-left px-1 py-1'>{product.pivot.qty}</td>
                            <td className='text-right px-1 py-1'>
                                ₦{new Intl.NumberFormat('en-US').format(product.pivot.selling_price * product.pivot.qty)}
                            </td>
                        </tr>
                    ))}

                    <tr className=' border-t-black border-y-1' style={{ fontSize: '12px' }}>
                            <td className='text-left px-2 py-1'></td>
                            <td className='text-left px-2 py-1 font-bold text-1xl'>SaaS Charges</td>
                            <td className='text-right px-1 py-1 font-bold text-1xl'>₦{new Intl.NumberFormat('en-US').format((3.5/100)*total)}</td>
                    </tr>
                   
                    <tr className=' border-t-black border-y-1' style={{ fontSize: '12px' }}>
                            <td className='text-left px-2 py-1'></td>
                            <td className='text-left px-2 py-1 font-bold text-1xl'>Sub Total</td>
                            <td className='text-right px-1 py-1 font-bold text-1xl'>₦{new Intl.NumberFormat('en-US').format(total)}</td>
                    </tr>
                    <tr className=' border-b-black border-y-1' style={{ fontSize: '12px' }}>
                            <td className='text-left px-2 py-1'></td>
                            <td className='text-left px-2 py-1 font-bold text-1xl'>Total + SaaS Charges</td>
                            <td className='text-right px-1 py-1 font-bold text-1xl'>₦{new Intl.NumberFormat('en-US').format(total+(3.5/100)*total)}</td>
                    </tr>
                    </tbody>
                </table>

                <canvas className='mx-auto' ref={inputRef} />
                <div className='font-bold font-medium text-center'> POWERED BY BiziPay © {new Date().getFullYear()}</div>
                <div className='font-bold font-medium text-center mx-auto'>www.bizipay.ng</div>
                        {/* <canvas ref={inputRef} /> */}
            </div>
        </div>
        </>
    );
}

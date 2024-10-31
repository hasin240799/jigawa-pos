import { useEffect,useRef, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Calendar } from 'primereact/calendar';

import InputField from "../components/InputField";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

import $ from 'jquery';
import 'dropify/dist/js/dropify.min.js';
import 'dropify/dist/css/dropify.min.css';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';
import { Helmet } from 'react-helmet';
import { ProgressSpinner } from 'primereact/progressspinner';
import DateUtil from '../components/DateUtil';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Navigate, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Modal from '../components/Modal';
import { FaEdit } from 'react-icons/fa';

export default function SalesReturn({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [salesReport, setSalesReport] = useState([]);
    const [sales, setSales] = useState([]);
    const [shopData, setShopData] = useState([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedShop, setSelectedShop] = useState([]);

    const [productData, setProductData] = useState([]);
    const [subCatArray, setSubCatArray] = useState('');


    const [formData, setFormData] = useState();



    useEffect(() => {

        handleReset();
        }, []);

        const  handleReset =  ()=>{
            setFormData([]);
            // fetchSales([]);
        }







    const toast = useRef(null);

    const cols = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'category', header: 'Category' },
        { field: 'quantity', header: 'Quantity' }
    ];

    const exportColumns = cols.map((col) => ({ title: col.header, dataKey: col.field }));

    const dt = useRef(null);

    const navigate =  useNavigate();
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    // Function to format numbers as Nigerian Naira currency
const formatNaira = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);

};




    const exportPdf = () => {
        const doc = new jsPDF(
            {
                orientation: 'l',
                unit: 'mm',
                format: 'a4',
                putOnlyUsedFonts:true,
                floatPrecision: 16 // or "smart", default is 16
               }
        );

        // Define columns for the PDF
        const columns = [
            { header: 'Sale ID', field: 'id' },
            { header: 'Customer Name', field: 'customer.full_name' },
            { header: 'Product Name', field: 'products[0].name' },
            { header: 'Quantity', field: 'products[0].pivot.qty' },
            { header: 'Selling Price', field: 'products[0].selling_price' },
            { header: 'Total Price', field: 'total_price' },
            { header: 'Date', field: 'created_at' }
        ];

        // Extract headers
        const headers = columns.map(col => col.header);


        const dateUtil = (date)=>{
            return(
             <DateUtil date={date} />
            )
         }
        // Extract data
        const data = sales.flatMap(sale =>
            sale.products.map(product => {
                const totalPrice = (product?.selling_price * product?.pivot.qty).toFixed(2);

                return [
                    sale?.id,                            // Sale ID
                    sale?.customer.full_name,            // Customer Name
                    product?.name,                       // Product Name
                    product?.pivot.qty,                  // Quantity
                    formatNaira(product?.selling_price),              // Selling Price
                    formatNaira(totalPrice),
                    format(new Date(sale?.created_at), 'PPPpp')                      // Total Price
                ];
            })
        );



      

         // Calculate x coordinate for center alignment
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = 50; // Image width
        const xCenter = (pageWidth - imgWidth) / 2;

   


        // Add subtitle, make it bold and center it
       doc.setFontSize(12);
       doc.setFont('helvetica', 'bold');
       doc.text('Sales Report', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });


         // Add subtitle, make it bold and center it
         doc.setFontSize(20);
         doc.setFont('helvetica', 'bold');
         doc.text(formData.shop? formData.shop.shopname : 'Jigawa Palliative Shops', doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });

       // Add current date to the header
       const currentDate = new Date().toLocaleDateString();
       if(formData.startDate && formData.endDate !== null){
        doc.setFontSize(10);
        doc.text(`Date Range: ${(formData.startDate).toLocaleDateString()} to ${formData.endDate.toLocaleDateString()}`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });
       }else{

        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });




       }

        doc.setFontSize(12);
        doc.setFont('helvetica');
        // Calculate the width of the text
         // Calculate the total revenue
         const totalRevenue = salesReport.reduce((accumulator, product) => {
            const quantitySold = parseInt(product.quantity_sold);
            const sellingPrice = parseFloat(product.selling_price);
            return accumulator + (quantitySold * sellingPrice);
        }, 0);

        // Format the totalRevenue as Naira currency
        const formattedRevenue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'NGN',
        }).format(totalRevenue);

        console.log(formattedRevenue); // Output: ₦X,XXX,XXX.XX


        const textWidth = doc.getTextWidth(`Total Sum ${formattedRevenue}`);

        // Position the text on the right side of the page

        const xPosition = pageWidth - textWidth - 20; // 20 is padding from the right edge

        doc.text(`Total Sum ${formattedRevenue}`, xPosition, 80);


       // Add a margin before the table starts
       const margin = 90; // Adjust the margin value as needed

       // Reset text color to black for table content
       doc.setTextColor(0, 0, 0);
       const pageHeight = doc.internal.pageSize.height;


           // Prepare the data for the second report
    const headers2 = ['Product Name', 'Quantity Sold','Unit Price', "Total Amount"];
    const data2 = salesReport.map(report => [
        report.product_name,
        report.quantity_sold,
        formatNaira(report.selling_price),
        formatNaira(report.selling_price * report.quantity_sold)
    ]);

    // Generate the first report table
    autoTable(doc, {
        head: [headers],
        body: data,
        startY: margin,
    });


    doc.addPage({
        format:'p'
    });


        // Add subtitle, make it bold and center it
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${formData.shop? formData.shop.shopname+" "+"Sold  Products Stocks" : 'All Shops Sold  Products Stocks'}`,
            doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });

    // Generate the second report table
    autoTable(doc, {
        head: [headers2],
        body: data2,
        startY: margin,
    });


        doc.save(`sales_report.pdf`);
    };

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };


    const showSuccess = (severity,summary,message) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 10000});
    }
        const accept = () => {
                if (toast.current) {
                    toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 10000 });
                } else {
                    console.error('Toast reference is null');
                }
            };

            const reject = () => {
                if (toast.current) {
                    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'You have rejected', life: 10000 });
                } else {
                    console.error('Toast reference is null');
                }
            };

            const confirm1 = () => {
                confirmDialog({
                    group: 'headless',
                    message: 'Are you sure you want to delete?',
                    header: 'Confirmation',
                    icon: 'pi pi-trash',
                    defaultFocus: 'accept',
                    accept,
                    reject
                });
            };

const filterStatus = [
    {id:'all',name:'All'},
    {id:'expired',name:'Expired'},
    {id:'notCollected',name:'Not Collected'}
]

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
   // Handle form submission
   const handleSubmit = (e) => {
    e.preventDefault();

   
    const form = new FormData();
    form.append('sale_id',formData?.id)


    // fetchSales(form);
    sendCancelSale(form);
    fetchReport(formData?.shop?.id);

};



const  fetchProduct  = async ()=>{
    try {
        const response = await axios.get('https://api.scan-verify.com/api/products', {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Product:', response.data);
            setProductData(response.data)

    } catch (error) {
        console.error('Error adding product:', error);
    }
 }

 useEffect(() => {
    fetchProduct();
 }, []);

    const dropifyRef = useRef(null);

    useEffect(() => {
        // Initialize Dropify
        $(dropifyRef.current).dropify();

        // Clean up Dropify instance on unmount
        return () => {
            if (dropifyRef.current) {
                $(dropifyRef.current).dropify('destroy');
            }
        };
    }, []);



     const  fetch  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/users?q=shops', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);


                setCustomersData(response.data)
                console.log(customers)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


     const  sendCancelSale  = async (form)=>{
        try {
            const response = await axios.post('https://api.scan-verify.com/api/sales/return',form,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Sales:', response.data);

                setSales(response.data)
                console.log("Sales Data", response.data.customer)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


     const  fetchReport  = async (shop)=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/sales/report?shop_id='+shop,{
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Sales:', response.data);

                setSalesReport(response.data)
                console.log("Sales Data", response.data.customer)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }




     const  fetchData  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/shops', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);


                setShopData(response.data)
                console.log(customers)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

    useEffect(() => {
        fetchReport();
        fetchData() ;
        fetch();
    }, []);

 

    const handleReceiptView = (rowData)=>{
            navigate(`/sales/receipt/${rowData.ref}?view=true`);
    }

    const handleOpenModal = (rowData)=>{
            setVisible(true);
            setFormData(rowData);

            console.log(rowData)
    } 

    const actionButtonTemplate = (rowData) => {
        return (
          <div className='grid grid-cols-2 justify-center'>
            <button
           tooltip="Enter your username"
              className="p-button-rounded text-green-800 w-12 h-12 p-button-warning mr-2"
            onClick={()=>{handleReceiptView(rowData)}}
            >
              <i className=" pi pi-eye w-12 text-danger"></i>
            </button>

            <button
                tooltip="Enter your username"
                    className="p-button-rounded text-green-800 w-12 h-12 p-button-warning mr-2"
                    onClick={()=>{handleOpenModal(rowData) }}
                    >
                    <i className="  w-12 text-green-500"><FaEdit/></i> 
            </button>
            {/* <button
            tooltip="Enter your username"
              className="p-button-rounded p-button-danger"
                onClick={confirm1}
            >
              <i className="pi pi-trash text-red-500"></i>
            </button> */}
          </div>
        );
      };

    const priceTemplate = (rowData)=>{
            return(
                <>
                <span>₦‎ {rowData.selling_price}</span>
                </>
            )
    }


    const unitTemplate = (rowData)=>{
        return(
            <>
            <span>{rowData.sub_category}</span>
            </>
        )
}


    const catTemplate = (rowData)=>{
        return(
            <>
            <span>{rowData.category}</span>
            </>
        )
}


const productBody = (rowData)=>{
    return(
        <>
            <ul>
                {rowData.products.map((p,index)=>(
                    <li>{index+1} . {p.name} - <b className=' text-red-500' style={{fontSize:'12px'}}>(QTY)- </b>{p.pivot.qty} </li>
                ))

                }

            </ul>
        </>
    )
}

const amountBody = (rowData) => {
    // Calculate the total amount by summing all selling prices
    const totalAmount = rowData.products.reduce((acc, p) => acc + parseFloat(p.selling_price * p.pivot.qty), 0);

    return (
        <>

            {/* Display the total amount */}
        
            <strong>₦{
                new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: 'NGN',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(totalAmount)
            }</strong>


        </>
    );
}

const footer = ()=>{
   return(
    <>
   <div className='mx-auto items-center'>
    <button            
                onClick={handleSubmit}
                type="submit"
                className="hover:shadow-form w-full rounded-md bg-green-500 hover:bg-green-300 py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
                Cancel Sale
        </button>
   </div>
  
   <div className='mx-auto items-center my-3'>
    <button 
                onClick={()=>{setVisible(false)}}
                type="button"
                className="hover:shadow-form w-full rounded-md bg-red-500 hover:bg-red-300 py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
             Close
        </button>
   </div>        
</>
   )
}


const dateBody = (rowData)=>{
   return(
    <DateUtil date={rowData.created_at} />
   )
}

    const header = (
        <div className="flex items-center mx-auto my-auto justify-end pl-4">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>
          <Button type="button" icon="pi pi-file-pdf text-green-500 text-2xl" severity="warning" rounded onClick={exportPdf} data-pr-tooltip="PDF">Sales Report</Button>
          <button
                        onClick={()=>{setVisible(true)}}
                        type="button"
                        className="p-button pi pi-filter bg-green-600 text-white px-3 py-1 rounded-md p-component p-button-success"
                    >
                    Filter
            </button>

          <span className="p-input-icon-left">
            <InputText
              type="search"
              className='w-50  h-5 m-3 border border-green-500 py-3 px-2'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
             placeholder='Search by any filter'
            />
          </span>

        </div>
      );

    return (




<div className="container w-full my-5 mb-5 bg-green-200 rounded-2xl mx-auto px-4 sm:px-6 lg:px-2 py-8">

<Helmet>
        <title>Shops</title>
        <meta name="address" content="Learn more about us on this page." />
        <meta name="keywords" content="about, my app, react" />
        <meta property="og:title" content="About Us - My App" />
        <meta property="og:address" content="Learn more about us on this page." />
</Helmet>

<Toast ref={toast} />
            <ConfirmDialog
                group="headless"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-question text-5xl"></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                                label="Save"
                                onClick={(event) => {
                                    hide(event);
                                    accept();
                                }}
                                className="w-8rem"
                            ></Button>
                            <Button
                                label="Cancel"
                                outlined
                                onClick={(event) => {
                                    hide(event);
                                    reject();
                                }}
                                className="w-8rem"
                            ></Button>
                        </div>
                    </div>
                )}
            />

        <div className="card flex justify-content-center">
                <Modal visible={visible} setVisible={setVisible} footer={footer}>
                <div className='grid grid-cols-2 gap-x-4 w-full px-4 py-5'>
                    <div>
                        <Image src={formData?.customer?.passport} zoomSrc={formData?.customer?.passport}  alt="Image" width="150" height="150" preview />
                    </div> 
                    <div className=' py-3'>
                                <span>Name:{formData?.customer?.full_name}</span><br/>
                                <span>PSN:{formData?.customer?.psn}</span>                              
                    </div>       
             
                </div>

                <p className='text-black font-bold text-2xl'>Are you sure you want to cancel this sale</p>
                </Modal> 
        </div>


<h1 className='text-gray-700 font-bold text-2xl'>Sales Return</h1>

<DataTable
  id='dt'
  ref={dt}
  value={sales}
  scrollable
  rowHover
  className=' my-5  '
  paginator rows={50}
  rowsPerPageOptions={[50, 100, 250,500,1000]}
  scrollHeight="600px"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  currentPageReportTemplate="{first} to {last} of {totalRecords}"
  tableStyle={{ Width: '100%', height:"10%" }}
  globalFilter={globalFilter}
  header={header}
>
  <Column
    field="id"
    header="ID"
    className='p-4'
    sortable
    style={{ minHeight: '15rem' }}
    filter
    filterPlaceholder="Search by ID"
  />

  <Column
    body={productBody}
    header="Products"
    style={{ width: '80%' }}
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="customer.full_name"
    header="Customer"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="customer.psn"
    header="PSN No."
    sortable
    filter
    filterPlaceholder="Search by PSN"
  />


<Column
    field="payment_type"
    header="Payment Type"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    body={amountBody}
    header="Amount"
    style={{ width: '40%' }}
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="agent.name"
    header="Sold By"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column

    body={dateBody}
    header="Date Sold"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />



  <Column header="Actions" body={actionButtonTemplate} />

</DataTable>
</div>
    );
}

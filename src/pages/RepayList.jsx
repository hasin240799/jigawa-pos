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


import InputField from "../components/InputField";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

import $ from 'jquery';
import 'dropify/dist/js/dropify.min.js';
import 'dropify/dist/css/dropify.min.css';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';
import DateUtil from '../components/DateUtil';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Navigate, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';


export default function RepayList({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [productData, setProductData] = useState([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);

    const [selectedSubCat, setSelectedSubCat] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [catVal, setCatVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [subCatArray, setSubCatArray] = useState('');

    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        image: '',
        unit: '',
        qty:'',
        selling_price: '',
        discount: ''
    });





    /**
     * Handles exporting the loans data to an Excel file
     */
    const handleExport = () => {
        // Extract the relevant fields from the loans data
        const dataToExport = customers.map(loan => ({
            // Environment is the MDA of the customer
            "Paypoint": loan.customer.mda,
            // Name is the full name of the customer
            "Staff Name": loan.customer.full_name,
            "Bizipay Account": loan.customer.bizipay_account,
            // PSN is the Personal Service Number of the customer
            "PSN No.": loan.customer.psn,
            // Amount is the total amount of the loan
            "Loan Amount": Number(loan.sale.total_amount) + Number(loan.sale.tax),
            // Tax is the tax amount of the loan
            "Tax(%)": loan.sale.tax,
            // Installments is the number of installments of the loan
            "Installments Count": loan.installments,
        })); 

  

        // Create a new workbook and add a worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Loans"); 


        // Generate Excel file and download it
        XLSX.writeFile(wb, `Loan-Repayment.xlsx`);
    };




    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };


    const toast = useRef(null);

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


     const  fetchProduct  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/products', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);


                setProductData(response.data)
                console.log("product data",productData)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

      useEffect(() => {
        fetchProduct();
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('id', formData.id);
        form.append('name', formData.name);
        form.append('description', formData.description);
        form.append('image', formData.image);
        form.append('unit', formData.unit);
        form.append('qty', formData.qty);
        form.append('image', formData.image);
        form.append('selling_price', formData.selling_price);

        try {
            const response = await axios.post('https://api.scan-verify.com/api/products/update/'+formData.id, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // console.log('Product added:', response.data);

            if(response.data.success == true){
                fetch();
                showSuccess('success',"Product","Product Successfully Updated")
            }else{
                showSuccess('error',"Product","Product fail to ddd")
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };



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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevState) => ({
            ...prevState,
            image: file
        }));

    };


     const  fetchLoans  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/fetch/loans', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);

                setCustomersData(response.data.loans)
                console.log(customers)

        } catch (error) {
            alert("failed to load purchases")
            console.error('Error adding product:', error);
        }
     }
    useEffect(() => {
        fetchLoans();


    }, []);

    const ImageBody = (rowData) => {
        return (

            <Image src={rowData.product.image} zoomSrc={rowData.product.image}  alt="Image" width="40" height="30" preview />

        );
    };


    const dt = useRef(null);

    const navigate =  useNavigate();
    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    };

    const exportPdf = () => {
        const doc = new jsPDF();

        // Define columns for the PDF
        const columns = [
            { header: 'Product Name', field: 'name' },
            { header: 'Price', field: 'selling_price' },
            { header: 'Category', field: 'sub_category' },
        ];

        // Extract headers
        const headers = columns.map(col => col.header);

        // Extract data
        const data = productData.map(item => [
            item.name,
            item.selling_price,
            item.sub_category
        ]);
        // Add a logo (you need the logo as a base64 image)
        const logo = 'data:image/png;base64,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'; // Replace with your base64 encoded logo
        doc.addImage(logo, 'PNG', 80, 10, 50, 20); // Adjust the x, y, width, and height as needed

        // Add shop header, make it bold and center it
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text("Jigawa Palliative Shops", doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

        // Add subtitle, make it bold and center it
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Product Pricing', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });

        // Add current date to the header
        const currentDate = new Date().toLocaleDateString();
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

        // Add a margin before the table starts
        const margin = 70; // Adjust the margin value as needed

        // Reset text color to black for table content
        doc.setTextColor(0, 0, 0);


        // Generate PDF table
        autoTable(doc, {
            head: [headers],
            body: data,
            startY: margin,
            styles: {
                fillColor: [240, 240, 240] // Light grey background color for all rows
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255] // White background color for alternate rows (optional)
            },
            headStyles: {
                fillColor: [255, 1, 1], // Blue background color for header row
                textColor: [255, 255, 255] // White text color for header row
            },
        });

        doc.save('pricing.pdf');
    };

    const actionButtonTemplate = (rowData) => {
        return (
          <div className='grid grid-cols-2 justify-center'>
            <button
           tooltip="Enter your username"
              className="p-button-rounded text-green-800 w-12 h-12 p-button-warning mr-2"
            onClick={()=>{ setFormData(rowData); !visible && setVisible(true); }}
            >
              <i className="pi pi-pencil w-12 text-danger"></i>
            </button>
            <button
            tooltip="Enter your username"
              className="p-button-rounded p-button-danger"
                onClick={confirm1}
            >
              <i className="pi pi-trash text-red-500"></i>
            </button>
          </div>
        );
      };

    const priceTemplate = (rowData)=>{
            return(
                <>
                <span>₦‎ {rowData.purchase_price}</span>
                </>
            )
    }


    const unitTemplate = (rowData)=>{
        return(
            <>
            <span>{rowData.product.sub_category}</span>
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

const stockTemplate = (rowData)=>{
    return(
        <>
        <span>{rowData.qty_in - rowData.qty_out}</span>
        </>
    )
}



    const header = (
        <div className="flex justify-between pl-4">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>
          <Button type="button" icon="pi pi-file-excel text-green-500 text-2xl" severity="warning" rounded onClick={handleExport} data-pr-tooltip="PDF">Download Loan Defualter</Button>

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






<div className="container w-full my-5 mb-5 bg-green-200 rounded-2xl mx-auto px-3 sm:px-4 lg:px-2 py-8">
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

            <Dialog header="Product Update" visible={visible} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

            <h1 className=" font-bold text-2xl place-self-start my-5">Product Information</h1>
            <form onSubmit={handleSubmit}>

                    <InputField
                        id="name"
                        label="Product Name"
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />



                    <InputField
                        id="qty"
                        label="Quantity"
                        type="number"
                        name="qty"
                        placeholder="Quantity "
                        value={formData.qty}
                        onChange={handleInputChange}
                    />


                    <InputField
                        id="unit"
                        label="Unit"
                        type="text"
                        name="unit"
                        placeholder="Unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                    />

                    <InputField
                        id="sellingPrice"
                        label="Buyin Price"
                        type="number"
                        name="sellingPrice"
                        placeholder="Selling Price"
                        value={formData.selling_price}
                        onChange={handleInputChange}
                    />

                    {/* <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#000000]">
                            Select Category
                    </label>
                    <div className="card flex justify-content-center w-full my-3">
                            <Dropdown inputId="dd-city" value={formData.category.name} onChange={handleCategoryChange} options={cat} optionLabel="name" className="w-full text-green-500 border border-green-500" />
                    </div>

                    <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#000000]">
                            Select Sub Category
                    </label>
                    <div className="card flex justify-content-center w-full my-3">
                            <Dropdown inputId="dd-city" value={formData.subCategory} onChange={handleSubCategoryChange} options={subCatArray} optionLabel="name" className="w-full text-green-500 border border-green-500" />
                    </div>


                    <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#000000]">
                            Select Product Unit
                    </label>
                    <div className="card flex justify-content-center w-full my-3">
                            <Dropdown inputId="dd-city" value={formData.unit} onChange={handleUnitChange} options={unit} optionLabel="name" className="w-full text-green-500 border border-green-500" />
                    </div> */}


                    <div className="mb-5">
                        <label htmlFor="description" className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                        Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={handleInputChange}
                            defaultValue={formData.description}
                            className="w-full rounded-md border border-green-500 bg-white py-3 px-5 text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        ></textarea>
                    </div>

                     <div className="mb-5">
                        <label htmlFor="image" className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                            Image
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            className="dropify"
                            ref={dropifyRef}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="hover:shadow-form w-full rounded-md bg-green-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
                </div>
            </Dialog>
        </div>


<h1 className='text-gray-700 font-bold text-2xl'>Loan Defualters</h1>

<DataTable
  value={customers}
  scrollable
  rowHover
  className=' my-5  '
  paginator rows={10}
  rowsPerPageOptions={[10,50,100]}
   scrollHeight="300px"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  currentPageReportTemplate="{first} to {last} of {totalRecords}"
  tableStyle={{ maxWidth: '100%', height:"50%" }}
  globalFilter={globalFilter}
  header={header}
>
  <Column
    field="customer.mda"
    header="Environment"
    className='p-4'
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />



<Column
    field="customer.full_name"
    header="Name"
    className='p-4'
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />


<Column
    field="customer.psn"
    header="PSN Number"
    className='p-4'
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />

<Column
    field="total_amount"
    header="Amounts"
    className='p-4'
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />


<Column
    field="installments"
    header="Installments"
    className='p-4'
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />




  {/* <Column header="Actions" body={actionButtonTemplate} /> */}

</DataTable>
</div>
    );
}

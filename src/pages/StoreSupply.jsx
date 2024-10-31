import { useEffect,useRef, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-green/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import { Image } from 'primereact/image';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';


import InputField from "../components/InputField";
import DateUtil from "../components/DateUtil";
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

import $ from 'jquery';
import 'dropify/dist/js/dropify.min.js';
import 'dropify/dist/css/dropify.min.css';
import { Dropdown } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Dialog } from 'primereact/dialog';

import { Calendar } from 'primereact/calendar';

export default function StoreSupply({ auth }) {
    const [supply, setSupplyData] = useState([]);
    const [modalData, setModalData] = useState([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);

    const [productData, setProductData] = useState([]);
    const [shopData, setShopData] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');

    const [subCatArray, setSubCatArray] = useState('');

    const [catId, setCatId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        shop: null,
        startDate: null,
        endDate: null
    });

    const toast = useRef(null);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    // Handle dropdown change
    const handleDropdownChange = (e, fieldName) => {
        setFormData(prevState => ({ ...prevState, [fieldName]: e.value }));
    };

    // Handle date change
    const handleDateChange = (e, fieldName) => {
        setFormData(prevState => ({ ...prevState, [fieldName]: e.value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('product',formData.name?.id)
        form.append('shop',formData.shop?.id)
        form.append('start_date',formData.startDate)
        form.append('end_date',formData.endDate)

        fetch(form);

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


     const fetchShopData  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/shops', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Shop Data:', response.data);

                setShopData(response.data)


        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


     useEffect(() => {
        fetchProduct();
        fetchShopData();
     }, []);



    const handleCategoryChange = (e) => {
        const { value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            category: value,
            subCategory: '', // Reset subCategory when category changes
        }));
        // console.log(formData)
        setSelectedCat(value.id)


    };





    const handleUnitChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            unit: value,
        }));

    };


    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };


    // const toast = useRef(null);

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

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     const form = new FormData();
    //     form.append('id', formData.id);
    //     form.append('name', formData.name);
    //     form.append('description', formData.description);
    //     form.append('image', formData.image);
    //     form.append('unit', formData.unit);
    //     form.append('qty', formData.qty);
    //     form.append('image', formData.image);
    //     form.append('selling_price', formData.selling_price);

    //     try {
    //         const response = await axios.post('https://api.scan-verify.com/api/products/update/'+formData.id, form, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         // console.log('Product added:', response.data);

    //         if(response.data.success == true){
    //             fetch();
    //             showSuccess('success',"Product","Product Successfully Updated")
    //         }else{
    //             showSuccess('error',"Product","Product fail to ddd")
    //         }
    //     } catch (error) {
    //         console.error('Error adding product:', error);
    //     }
    // };



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


     const  fetch  = async (form)=>{
        try {
            const response = await axios.post('https://api.scan-verify.com/api/fetch/supply',form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);

                setSupplyData(response.data)
                console.log(supply)

        } catch (error) {
            alert("failed to load purchases")
            console.error('Error adding product:', error);
        }
     }

    useEffect(() => {

    handleReset();
    }, []);

    const  handleReset =  ()=>{
        setFormData([]);
        fetch([]);
    }

    const ImageBody = (rowData) => {
        return (

            <Image src={rowData.product.image} zoomSrc={rowData.product.image}  alt="Image" width="40" height="30" preview />

        );
    };


    const actionButtonTemplate = (rowData) => {
        return (
          <div className='grid grid-cols-2 justify-center'>
            <button
           tooltip="Enter your username"
              className="p-button-rounded text-green-800 w-12 h-12 p-button-warning mr-2"
            onClick={()=>{ setFormData(rowData); !visible && setVisible(true)}}
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
            <span>₦‎ {rowData.unit_price}</span>
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

const dateTemplate = (rowData) => {
    return (
        <span>
            <DateUtil date={rowData.created_at} />
        </span>
    );
};


    const header = (
        <div className="flex justify-center pl-4">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>

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

<Dialog
            header="Filter"
            visible={visible}
            style={{ width: '50%' }}
            className='h-screen justify-content-center'
            onHide={() => setVisible(false)}
            footer={
               <>
                 <div className=' grid grid-cols-2 gap-x-2 place-content-between'>
                    <button
                        onClick={handleReset}
                        type="button"
                        className="p-button bg-red-600 text-white px-3 py-2 rounded-md p-component p-button-success"
                    >
                        Reset Filter
                    </button>

                    <button
                        onClick={handleSubmit}
                        type="button"
                        className="p-button bg-green-600 text-white px-3 py-2 rounded-md p-component p-button-success"
                    >
                        Apply Filter
                    </button>
                </div>
               </>
            }
        >

            <Toast ref={toast} />
            <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-field">
                    <label htmlFor="startDate" className='my-3 block font-bold text-base font-medium text-[#32cf3a]'>Select Product</label>
                    <Dropdown
                        id="category"
                        value={formData.name}
                        options={productData}
                        onChange={(e) => handleDropdownChange(e, 'name')}
                        optionLabel="name" filter={true}
                        placeholder="Select Product"
                        className="w-full text-green-500 border border-green-500 px-4 py-2"
                    />
                </div>

                <div className="p-field">
                <label htmlFor="startDate" className='my-3 block font-bold text-base font-medium text-[#32cf3a]'>Select Shop</label>
                    <Dropdown
                        value={formData.shop}
                        options={shopData}
                        onChange={(e) => handleDropdownChange(e, 'shop')}
                        optionLabel="shopname" filter={true}
                        placeholder="Select Shop"
                        className="w-full text-green-500 border border-green-500 px-4 py-2"
                    />
                </div>


                <div className=' grid grid-cols-2 gap-x-4'>
                    <div>
                            <label htmlFor="startDate" className='my-3 block font-bold text-base font-medium text-[#32cf3a]'>Start Date</label>
                            <div className="p-field">
                                <Calendar
                                inputClassName='px-3 py-2 border border-green-500'
                                panelClassName='h-auto w-20'
                                panelStyle={{ background:'#ffff9', color:'green'}}
                                nextIcon={true}
                                iconPos='left' viewDate={true} todayButtonClassName='bg-green-900 text-white'
                                id="startDate"
                                onChange={(e)=>{handleDateChange(e,'startDate')}}
                                value={formData.startDate}
                                placeholder="Start Date"
                                dateFormat="dd/mm/yy"
                                showIcon
                                />
                            </div>
                    </div>

                    <div>
                        <label htmlFor="endDate" className='my-3 block font-bold text-base font-medium text-[#32cf3a]'>End Date</label>
                        <div className="p-field">
                            <Calendar
                            inputClassName='px-3 py-2 border border-green-500'
                            panelClassName='h-auto w-20'
                            panelStyle={{ background:'#ffff9', color:'green'}}
                            nextIcon={true}
                            iconPos='left' viewDate={true} todayButtonClassName='bg-green-900 text-white'
                            id="endDate"
                            onChange={(e)=>{handleDateChange(e,'endDate')}}
                            value={formData.endDate}
                            placeholder="End Date"
                            dateFormat="dd/mm/yy"
                            showIcon
                            />
                        </div>
                    </div>

                </div>
            </form>
        </Dialog>
        </div>


<h1 className='text-gray-700 font-bold text-2xl'>Supply History</h1>

<DataTable
  value={supply}
  scrollable
  rowHover
  className=' my-5  '
  paginator rows={50}
  rowsPerPageOptions={[50, 100, 250]}
  scrollHeight="300px"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  currentPageReportTemplate="{first} to {last} of {totalRecords}"
  tableStyle={{ maxWidth: '100%', height:"50%" }}
  globalFilter={globalFilter}
  header={header}
>
  <Column
    field="id"
    header="ID"
    className='p-4'
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />
  <Column
    field="product.name"
    header="Product"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />



    <Column
     body={unitTemplate}
    header="Unit Price"
 style={{ width: 'auto' }}
    sortable
  />

<Column
    field="qty"
    header="Quantity"
    style={{ minHeight: '20rem' }}
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />




<Column
    body={dateTemplate}
    header="Date of Supply"
    style={{ width: 'auto' }}
    sortable
  />

<Column
    field="supplier.business_name"
    header="Supplier"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />







{/* <Column
    body={catTemplate}
    header="Category"
    sortable
    filter
    filterPlaceholder="Search by Product Category"
  />

<Column
    field='sub_category'
    header="Category"
    sortable
    filter
    filterPlaceholder="Search by Product Category"
  /> */}


  {/* <Column header="Actions" body={actionButtonTemplate} /> */}

</DataTable>
</div>
    );
}

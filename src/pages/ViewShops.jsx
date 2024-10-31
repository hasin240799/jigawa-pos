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
import { Helmet } from 'react-helmet';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function AlertForm({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [shopdata, setShopData] = useState([]);
    const [modalData, setModalData] = useState([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedShop, setSelectedShop] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [catVal, setCatVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [subCatArray, setSubCatArray] = useState('');

    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState({
        shopname: '',
        address: '',
        contact: '',
        manager_id: '',       
    });


    const unit =[
        { "id": 1, "name": "Piece (pc)" },
        { "id": 2, "name": "Pack (pk)" },
        { "id": 4, "name": "Carton (ct)" },
        { "id": 5, "name": "Kilogram (kg)" },
        { "id": 8, "name": "Liter (L)" },
        { "id": 16, "name": "Gallon (gal)" },
        { "id": 19, "name": "Dozen (dz)" },
        { "id": 21, "name": "Set (set)" },
        { "id": 22, "name": "Roll (rl)" },
        { "id": 23, "name": "Bundle (bdl)" },
        { "id": 24, "name": "Can (can)" },
        { "id": 25, "name": "Bottle (btl)" },
        { "id": 27, "name": "Packet (pkt)" },
        { "id": 28, "name": "Sachet (sach)" },
    ]


    const cat = [
        { id: 1, name: 'Fruit and vegetables' },
        { id: 2, name: 'Starchy food' },
    ];

    const subCat = {
        1: [
            { id: 1, name: 'Orange' },
            { id: 2, name: 'Watermelon' },
        ],
        2: [
            { id: 1, name: 'Dan Wake' },
            { id: 2, name: 'Shinkafa' },
        ],
    };



    const updateSubCat = (id) => {
        if (subCat[id]) {
            setSubCatArray(subCat[id]);

        } else {
            setSubCatArray([]);
        }
    };



    const handleManagerChange = (e) => {
        const { value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            manager_id: value,
        }));
        setSelectedShop(value.id)

    };



    const handleSubCategoryChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            subCategory: value,
        }));
       

    };


    const handleUnitChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            unit: value,
        }));

    };


    const handleInputChange = (field,value) => {
       
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        form.append('manage_by_id', selectedShop? selectedShop : formData.manager_id);
        form.append('shopname', formData.shopname);
        form.append('location', formData.address);
        form.append('contact', formData.contact);

        setProcessing(true);
        try {
            const response = await axios.post('https://api.scan-verify.com/api/shops/create',form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // console.log('Product added:', response.data);
            setProcessing(false);
            if(response.data.success == true){
                fetch();
                showSuccess('success',"Shop",response.data.message)
            }else{
                showSuccess('error',"Shop",response.data.message)
            }
        } catch (error) {
            setProcessing(false);
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
        fetchData() ;
        fetch();
    }, []);

    const ImageBody = (rowData) => {
        return (

            <Image src={rowData.image} zoomSrc={rowData.image}  alt="Image" width="40" height="30" preview />

        );
    };


    const actionButtonTemplate = (rowData) => {
        return (
          <div className='grid grid-cols-2 justify-center'>
            <button
           tooltip="Enter your username"
              className="p-button-rounded text-green-800 w-12 h-12 p-button-warning mr-2"
            onClick={()=>{ setFormData(rowData); !visible && setVisible(true); updateSubCat(rowData.cat_id)}}
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



    const header = (
        <div className="flex items-center mx-auto my-auto justify-end pl-4">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>

          <span className="">
             <button
                onClick={()=>{!visible && setVisible(true)}}
               className='border bg-green-600 text-white px-4 py-2'>
                <div className='grid grid-cols-2 items-center justify-center my-auto mx-auto'>
                        <span><i className=" pi pi-plus-circle"></i></span>
                        <span><b>Add Shop</b></span>
                </div>
             </button>
          </span>

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
            <Dialog header="Shop Form" visible={visible} style={{ width: '50vw', height:'auto' }} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

            <h1 className=" font-bold text-2xl place-self-start my-5">Shop Information</h1>
            <form onSubmit={handleSubmit}>

                    <InputField
                        id="shopname"
                        label="Shop Name"
                        type="text"
                        name="shopname"
                        placeholder="Shop Name"
                        value={formData.name}
                        onChange={(e)=>{handleInputChange('shopname',e.target.value)}}
                    />


                    <InputField
                        id="contact"
                        label="Phone Number"
                        type="number"
                        name="contact"
                        placeholder="Phone Number"
                        value={formData.contact}
                        onChange={(e)=>{handleInputChange('contact',e.target.value)}}
                    />


                  

                   <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#000000]">
                            Select Shop Agent
                    </label>
                    <div className="card flex justify-content-center w-full  my-3">
                            <Dropdown filter={true}  inputId="dd-city" value={formData.manager_id} onChange={handleManagerChange} options={customers} optionLabel="name" className="w-full text-green-500 border border-green-500 px-4 py-2" />
                    </div>

 {/*
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
                        <label htmlFor="address" className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                        Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            onChange={(e)=>{ handleInputChange('address',e.target.value)}}
                            defaultValue={formData.address}
                            className="w-full rounded-md border border-green-500 bg-white py-3 px-5 text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        ></textarea>
                    </div>

                     
                    <div>
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
                                Add Shop
                            </div>
                        </button>
                  

                        {/* <button
                            onClick={handleSubmit}
                            type="submit"
                            className="hover:shadow-form w-full rounded-md bg-green-500 py-3 px-8 text-center text-base font-semibold text-white outline-none"
                        >
                            Update Product
                        </button> */}
                    </div>
                </form>
                </div>
            </Dialog>
        </div>


<h1 className='text-gray-700 font-bold text-2xl'>Shops</h1>

<DataTable
  value={shopdata}
  scrollable
  rowHover
  className=' my-5  '
  paginator rows={10}
   scrollHeight="300px"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  currentPageReportTemplate="{first} to {last} of {totalRecords}"
  tableStyle={{ minWidth: '60rem', height:"50%" }}
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
    field="shopname"
    header="Shop Name"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="contact"
    header="Phone Number"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />


<Column
    field="location"
    header="Address"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />


<Column
    field="manager.name"
    header="Manager"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

  

  {/* <Column header="Actions" body={actionButtonTemplate} /> */}

</DataTable>
</div>
    );
}

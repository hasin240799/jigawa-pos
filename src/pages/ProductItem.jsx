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

export default function ProductItem({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [shopdata, setShopData] = useState([]);
    const [modalData, setModalData] = useState([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedItem, setSelectedItem] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [catVal, setCatVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [subCatArray, setSubCatArray] = useState('');

    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState({
        item: '',
        type: '',  
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

    const catType = [
        'Category',
        'Sub Category'
    ]

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
        setSelectedItem(value.id)

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
        form.append('type', selectedItem? selectedItem : formData.type);
        form.append('items', formData.shopname);
        
        setProcessing(true);
        try {
            const response = await axios.post('https://api.scan-verify.com/api/product/create',form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            // console.log('Product added:', response.data);
            setProcessing(false);
            if(response.data.success == true){
                fetch();
                showSuccess('success',"Product Category",response.data.message)
            }else{
                showSuccess('error',"Product Category",response.data.message)
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
            const response = await axios.get('https://api.scan-verify.com/api/users', {
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

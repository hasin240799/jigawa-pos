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
import { RadioButton } from 'primereact/radiobutton';


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
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import '../pages/receipt.css'
import MyDataTable from '../components/MyDataTable'
import { FaCreditCard } from 'react-icons/fa';

export default function CardAssign({ auth }) {
    const [cardData, setCardData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [shopdata, setShopData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const stepperRef = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [employ, setIsEmploy] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedShop, setSelectedShop] = useState([]);
    const [subCatArray, setSubCatArray] = useState('');
  
    
   


    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState([{
        "assigned_to": '',
        "total_cards": '',
   }]);


    const fileUploadRef = useRef(null); // Create a ref for the FileUpload component
    const [uploadedFiles, setUploadedFiles] = useState([]);


    const onUpload = (event) => {
        // Add the uploaded files to the uploadedFiles state
        // const files = event.files;

        const inputElement = fileUploadRef.current.getInput(); // Get the input element using the ref
        const files = inputElement.files; // Access the FileList from the input
        // Update the uploaded files state
        setFormData((prevState) => ({
            ...prevState,
            passport: files[0]
        }));


        console.log('acual',files[0])
        console.log('elemt',inputElement)
        console.log('event',event)
        console.log("formData",formData.passport)

        };

    const customerType =[
        { "id": 1, "name": "Individual" },
        { "id": 2, "name": "Employee" },
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



    const roleData =[
        {id:'admin',name:'Admin'},
        {id:'stakeholder',name:'Stakeholder (Government, Ministries and Agency)'},
        {id:'shop_agent',name:'Shop Agents'},
        {id:'store_agent',name:'Store Agents'},
        {id:'finance',name:'Finance'},
        {id:'shop_admin',name:'Shop Admin'},
        {id:'shop_manager',name:'Shop Managers'},
        {id:'bizi_agent',name:'BIZI Agent'},
        {id:'bizi_agent_staff',name:'BIZI Agent Staff'},
        {id:'bizi_agent_manager',name:'BIZI Agent Manager'},
        {id:'bizi_admin',name:'BIZI Admin'},
        {id:'bizi_card_agent', name:'BIZI Card Agent'},
        {id:'bizi_card_manager', name:'BIZI Card Manager'},

       
    ]

    const lgas = [
        { id: 1, lga: "Auyo" },
        { id: 2, lga: "Babura" },
        { id: 3, lga: "Biriniwa" },
        { id: 4, lga: "Birnin Kudu" },
        { id: 5, lga: "Buji" },
        { id: 6, lga: "Dutse" },
        { id: 7, lga: "Gagarawa" },
        { id: 8, lga: "Garki" },
        { id: 9, lga: "Gumel" },
        { id: 10, lga: "Guri" },
        { id: 11, lga: "Gwaram" },
        { id: 12, lga: "Gwiwa" },
        { id: 13, lga: "Hadejia" },
        { id: 14, lga: "Jahun" },
        { id: 15, lga: "Kafin Hausa" },
        { id: 16, lga: "Kazaure" },
        { id: 17, lga: "Kiri Kasama" },
        { id: 18, lga: "Kiyawa" },
        { id: 19, lga: "Kaugama" },
        { id: 20, lga: "Maigatari" },
        { id: 21, lga: "Malam Madori" },
        { id: 22, lga: "Miga" },
        { id: 23, lga: "Ringim" },
        { id: 24, lga: "Roni" },
        { id: 25, lga: "Sule Tankarkar" },
        { id: 26, lga: "Taura" },
        { id: 27, lga: "Yankwashi" }
    ]




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


    const handleEmployChange = (name,value) => {
        setFormData((prevState) => ({
            ...prevState,
            customer_type: value,
        }));

        if(formData.customer_type.name == customerType[0].name){

            setIsEmploy(true);
        }else{
            setIsEmploy(false);
        }
    };


    const handleInputChange = (field,value) => {

        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };


    // const getStatesFromApi = async () => {
    //     try {
    //       let response = await axios.get('https://nga-states-lga.onrender.com/?state=Jigawa');
    //       return response.data.lga;
    //     } catch (error) {
    //       console.error("Error fetching data: ", error);
    //       return [];
    //     }
    //   };

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       const lgas = await getStatesFromApi();
    //       console.log('lga',lgas)
    //       const jigawaLga = lgas.map((lga, index) => ({
    //         id: index + 1,
    //         lga: lga
    //       }));
    //       console.log('jigawaLga:', jigawaLga)
    //       setSelectedLga(prevState => [...prevState, ...jigawaLga]);

    //       console.log(jigawaLga);
    //     };

    //     fetchData();
    //   }, []);

    // useEffect(() => {
    //     if(formData.customer_type == customerType[0].name){
    //         if (!employ) {
    //             setIsEmploy(true);
    //         }

    //     }else{
    //         setIsEmploy(false);
    //     }

    // }, [formData.customer_type]);

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

        // Append each field from formData to the FormData object
        form.append('name', formData.full_name);
        form.append('contact', formData.contact);
        form.append('email', formData.email);
        form.append('role', formData.role?.id);
        form.append('ward', formData.ward.ward);
        form.append('lga', formData.lga.lga);
        form.append('role_desc', formData.role_desc);

        setProcessing(true);
        try {
            const response = await axios.post('https://api.scan-verify.com/api/users/create',form, {
                headers: {
                   'Content-Type': 'multipart/form-data'
                }
            }); 
            
            // console.log('Product added:', response.data);
            setProcessing(false);
            if(response.data.success == true){
                fetch()
                setFormData([]);
                showSuccess('success',"Users",response.data.message)
            }else{
                showSuccess('error',"Users",response.data.message)
            }
        } catch (error) {
            setProcessing(false);
            showSuccess('error',"Shop",error.request.response)
            console.error('Error adding product:', error.request.response);
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
            const response = await axios.get('https://api.scan-verify.com/api/card-assigned', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Product added:', response.data);

                setCardData(response.data)


        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


     const  fetchData  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/customer/data', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });


                setShopData(response.data.customer)
                // console.log(cardData)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

     const  shopData  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/shops', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // console.log('Product added:', response.data.customer);

                setShopData(response.data)
                // console.log(cardData)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


    useEffect(() => {
        fetchData() ;
        shopData() ;
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



const PhotoBody = (rowData) => {
    return (

        <Image src={rowData.passport} zoomSrc={rowData.passport}  alt="Image" width="40" height="30" preview />

    );
};


    const header = (
        <div className="flex items-center mx-auto my-auto justify-end pl-4">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>

          <span className="">
             <button
                onClick={()=>{!visible && setVisible(true)}}
               className='border animation-linear from-green-400 to-green-300 bg-green-500  text-white px-4 py-2  rounded-md shadow-md '>
                <div className='grid grid-cols-2 gap-x-3 items-center justify-center my-auto mx-auto'>
                        <span><i className=""><FaCreditCard/></i></span>
                        <span><b>Assign Card</b></span>
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


      const columns = [
        {
            name: 'Title',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'Year',
            selector: row => row.year,
            sortable: true,
        },
    ];
    
    const data = [
        {
            id: 1,
            title: 'Beetlejuice',
            year: '1988',
        },
        {
            id: 2,
            title: 'Ghostbusters',
            year: '1984',
        },
    ];

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
            <Dialog modal={true}   header="Card Assignment" visible={visible} className='sm:w-1/2 px-4' style={{ width:'80%'}} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

            <h1 className=" font-bold text-2xl place-self-start my-5">Card Assignment</h1>
            <form onSubmit={handleSubmit}>

                <div className="card flex justify-content-center w-full">
                    <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                        <StepperPanel header="">
                            <div className="flex flex-row h-auto">
                                <div className="border-2 border-dashed surface-border border-round px-4 py-6 w-full surface-ground  justify-content-center align-items-center font-medium">

                                <InputField
                                    id="total_cards"
                                    label="Cards Count"
                                    type="number"
                                    name="total_cards"
                                    placeholder="Cards Count"
                                    value={formData.total_cards}
                                    onChange={(e)=>{handleInputChange('total_cards',e.target.value)}}
                                />

                                
                            <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                    Select Agent
                            </label>
                            <div className="card flex justify-content-center w-full  mt-3 mb-6">
                                    <Dropdown filter={true} placeholder='Select Agent'  value={formData.assigned_to} onChange={(e)=> {handleInputChange('ward',e.target.value) }} options={[]} optionLabel="name" className="w-full text-green-500 border border-green-500 px-4 py-2" />
                            </div>

                            <div className='flex flex-wrap'>
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
                                            Assign Card
                                        </div>
                                </button>
                            </div>


                                </div>
                            </div>
                            {/* <div className="flex pt-4 justify-content-end">
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                            </div> */}
                        </StepperPanel>
                    </Stepper>
                </div>




                </form>
                </div>
            </Dialog>
        </div>

{/* 
        <div className='report print:px-3 print:py-5' id='report'>
             <MyDataTable columns={columns} data={data} header={"Dutse Shop LGA"} />
        </div> */}

<h1 className='text-gray-700 font-bold text-2xl'>Assigned Card History </h1>

<DataTable
  value={cardData}
  scrollable
  rowHover
  tableClassName='p-4'
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
    field="name"
    header="Full Name"
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
    field="email"
    header="Email"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="role"
    header="Roles"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />



  {/* <Column header="Actions" body={actionButtonTemplate} /> */}

</DataTable>
</div>
    );
}

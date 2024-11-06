import { useEffect,useRef, useState } from 'react';
import axios from '../../src/api';
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

export default function ShopProduct({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [productData, setproductData] = useState([]);
    const [shopdata, setShopData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const stepperRef = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [employ, setIsEmploy] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [selectedShop, setSelectedShop] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [catVal, setCatVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [subCatArray, setSubCatArray] = useState('');
    const [role, setRole] = useState(false);


    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState({
        product_id:'',
        shop_id:'',
        qty:''
    });


    const fileUploadRef = useRef(null); // Create a ref for the FileUpload component
    const [uploadedFiles, setUploadedFiles] = useState([]);





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


    const getStatesFromApi = async () => {
        try {
          let response = await axios.get('https://nga-states-lga.onrender.com/?state=Jigawa');
          return response.data.lga;
        } catch (error) {
          console.error("Error fetching data: ", error);
          return [];
        }
      };

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       const lgas = await getStatesFromApi();
    //       console.log('lga',lgas)
    //     //   const jigawaLga = lgas.map((lga, index) => ({
    //     //     id: index + 1,
    //     //     lga: lga
    //     //   }));
    //     //   console.log('jigawaLga:', jigawaLga)
    //     //   setSelectedLga(prevState => [...prevState, ...jigawaLga]);

    //     //   console.log(jigawaLga);
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


    useEffect(() => {
        const roles= localStorage.getItem('role');

        if (roles == 'bizi_admin') {
                setRole(true);
        } else {
            setRole(false);
        }

    }, []);

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
        form.append('product_id', formData.product_id?.id);
        form.append('shop_id', formData.shop_id?.id);
        form.append('qty_in', formData.qty);


        setProcessing(true);

        try {
            const response = await axios.post('https://api.scan-verify.com/api/product/purchase',form, {

            });
            // console.log('Product added:', response.data);
            setProcessing(false);
            if(response.data.success == true){
                fetch()
                showSuccess('success',"Purchase",response.data.message)
            }else{
                showSuccess('error',"Purchase",response.data.message)
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
            const response = await axios.get('https://api.scan-verify.com/api/purchases/data', {
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


    //  const  fetchData  = async ()=>{
    //     try {
    //         const response = await axios.get('https://api.scan-verify.com/api/customer/data', {
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         console.log('Product added:', response.data.customer);


    //             setShopData(response.data.customer)
    //             console.log(customers)

    //     } catch (error) {
    //         console.error('Error adding product:', error);
    //     }
    //  }




     const  shopData  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/shops', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // console.log('Product added:', response.data.customer);

                setShopData(response.data)


        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

     const  fetchProductData = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/products', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // console.log('Product added:', response.data.customer);

                setproductData(response.data)
                console.log(response.data)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

    useEffect(() => {

         shopData() ;
        fetch();
        fetchProductData();
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
            onClick={()=>{ setFormData(rowData); !visible && setVisible(true);}}
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

    const  sellingPriceBody = (rowData)=>{
            return(
                <>
                <span>₦‎ {rowData.product?.selling_price}</span>
                </>
            )
    }





const balanceBody= (rowData)=>{
    return(
        <>
        <span>{rowData.qty_in - rowData.qty_out}</span>
        </>
    )
}




    const header = (
        <div className="flex items-center mx-auto my-auto justify-end pl-4">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>

        {!role &&(
            <>
            <span className="">
             <button
                onClick={()=>{!visible && setVisible(true)}}
               className='border animation-linear from-green-400 to-green-300 bg-green-500  text-white px-4 py-2  rounded-md shadow-md '>
                <div className='grid grid-cols-2 gap-x-3 items-center justify-center my-auto mx-auto'>
                        <span><i className=" pi pi-user-plus"></i></span>
                        <span><b>Purchase Product</b></span>
                </div>
             </button>
          </span>
            </>
        )

        }

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
            <Dialog modal={true}   header="Stock Purchase" visible={visible} className='sm:w-1/2 px-4' style={{ width:'80%'}} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

            <h1 className=" font-bold text-2xl place-self-start my-5">Shop Product Purchase</h1>
            <form onSubmit={handleSubmit}>

                <div className="card flex justify-content-center w-full">
                    <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                        <StepperPanel header="">
                            <div className="flex flex-row h-auto">
                                <div className="border-2 border-dashed surface-border border-round px-4 py-6 w-full surface-ground  justify-content-center align-items-center font-medium">



                                <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                 Select Shop
                                </label>
                                <div className="card flex justify-content-center w-full  my-3">
                                        <Dropdown filter={true} placeholder='Select Shop'  value={formData.shop_id} onChange={(e)=> {handleInputChange('shop_id',e.target.value) }} options={shopdata} optionLabel="shopname" className="w-full text-green-500 border border-green-500 px-4 py-2" />
                                </div>



                                <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                 Select Product
                                </label>
                                <div className="card flex justify-content-center w-full my-3">
                                <Dropdown
                                        inputId="product_id"
                                        name='product_id'
                                        value={formData.product_id}
                                        onChange={(e)=>{handleInputChange('product_id',e.target.value)}}
                                        options={productData}
                                        optionLabel="name"
                                        className="w-full text-green-500 border border-green-500"
                                    />
                                </div>

                                <div className='text-red-500 mb-3'>
                                Available Stock:{formData.product_id.qty}
                                </div>

                                <InputField
                                    id="qty"
                                    label="Quantity"
                                    type="number"
                                    name="qty"
                                    placeholder="Quantity"
                                    value={formData.qty}
                                    onChange={(e)=>{handleInputChange('qty',e.target.value)}}
                                />




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
                                            Add Purchase
                                        </div>
                                </button>
                            </div>


                                </div>
                            </div>
                        </StepperPanel>
                    </Stepper>
                </div>
                </form>
                </div>
            </Dialog>
        </div>


<h1 className='text-gray-700 font-bold text-2xl'>Shop Manager Purchase</h1>

<DataTable
  value={customers.stocks}
  scrollable
  rowHover
  tableClassName='p-4'
  className=' my-5  '
  paginator rows={50}
  rowsPerPageOptions={[50, 100, 250,500,1000]}
  scrollHeight="500px"
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
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
  />

  <Column
    field="product.name"
    header="Product Name"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    body={sellingPriceBody}
    header="Selling Price"
    sortable
    filter

  />


    <Column
    field='qty_in'
    header="Quantity In"
    sortable
    filter

  />

<Column
    field='qty_out'
    header="Quantity Out"
    sortable
    filter

  />

<Column
    body={balanceBody}
    header="Stock Balance"
    sortable
    filter

  />

<Column
    field='shop.shopname'
    header="Shop"
    sortable
    filter

  />




  {/* <Column header="Actions" body={actionButtonTemplate} /> */}

</DataTable>
</div>
    );
}

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


export default function StoreStocks({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [modalData, setModalData] = useState([]);

    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [filter, setFilter] = useState(false);

    const [selectedSubCat, setSelectedSubCat] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState('');
    const [selectedProductsFetch, setSelectedProductFetch] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');

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



    const handleCategoryChange = (e) => {
        const { value } = e.target;

        setFormData((prevState) => ({
            ...prevState,
            category: value,
            subCategory: '', // Reset subCategory when category changes
        }));
        // console.log(formData)
        setSelectedCat(value.id)
        updateSubCat(value.id);

    };



    const handleSubCategoryChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            subCategory: value,
        }));
        setSelectedSubCat(value.id)

    };


    const handleUnitChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            unit: value,
        }));

    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setSelectedProducts(value.id);
         console.log("Select produc", selectedProducts)
    };


    useEffect(() => {

        // Check if customers and selectedProducts are defined and not null
        if (selectedProducts) {
            // Find the index of the selected product in customers.product array
            const index = customers.filter(p => p.product.id === selectedProducts);
         
            console.log('Found Item Index:', index);
            setSelectedProductFetch(index);

           
        } else {
            console.log('Customers or selectedProducts is not defined');
        }
    }, [selectedProducts]);

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


     const  fetch  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/stocks', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data);

                setCustomersData(response.data)
                console.log(customers)
        
        } catch (error) {
            alert("failed to load purchases")
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

                setProducts(response.data)
                console.log(response.data)

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }

    useEffect(() => {
        fetch();
        fetchProductData();
        // setCustomersData([
        //     {id:1,name:'Rice',unit:'34kh' },
        //     {id:2,name:'Rice',unit:'34kh' },
        //     {id:3,name:'Rice',unit:'34kh' },
        //     {id:4,name:'Rice',unit:'34kh' },

        // ])

    }, []);


    const handleFilter = ()=>{
        !filter? setFilter(true) : setFilter(false); 

    }


    const ImageBody = (rowData) => {
        return (

            <Image src={rowData?.product?.image} zoomSrc={rowData?.product?.image}  alt="Image" width="40" height="30" preview />

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
        <div className="flex justify-center pl-4">
        <span className="w-1/2 mx-auto items-center">
        <Dropdown
                        inputId="products"
                        name='products'
                        value={selectedProducts}
                        onChange={handleProductChange}
                        options={products}
                        placeholder='Filter by Products'
                        optionLabel="name"
                        className="w-full text-green-500 border border-green-500"
                    />
            <div>
                <button onClick={handleFilter} className='pi pi-filter hover:to-blue-600 rounded-md px-2 py-1 border border-green-500 bg-green-500 text-white'>Reset Filter</button>
            </div>
            </span> 
            
{/* 
          <span className="p-input-icon-left">
            <InputText
              type="search"
              className='w-50  h-5 m-3 border border-green-500 py-3 px-2'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
             placeholder='Search by any filter'
            />
          </span> */}
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


<h1 className='text-gray-700 font-bold text-2xl'>Stock List</h1>

<DataTable
  value={filter? selectedProductsFetch : customers}
  scrollable
  rowHover
  className=' my-5  '
  paginator rows={10}
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
    header="Image"
    className='p-4'
    body={ImageBody}
    sortable
    style={{ minHeight: '12rem' }}
    filter
    filterPlaceholder="Search by ID"
    />



    <Column
     body={unitTemplate}
    header="Unit"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="qty_in"
    header="Quantity In"
    style={{ minHeight: '20rem' }}
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="qty_out"
    header="Quantity Out"
    style={{ minHeight: '20rem' }}
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />


<Column
    body={stockTemplate}
    header="Stock Quantity"
    style={{ minHeight: '20rem' }}
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="supplier.business_name"
    header="Supplier"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />


<Column
    body={priceTemplate}
    header="Price"
    sortable
    filter
    filterPlaceholder="Search by Product Price"
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

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
import { useLocation } from 'react-router-dom';
import Preloader from '../components/Preloader';

export default function AddProduct() {
    const [selectedSubCat, setSelectedSubCat] = useState([]);
    const [purchasePrice, setPurchasePrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [visible, setVisible] = useState(false);
    const [subCatArray, setSubCatArray] = useState('');
    const [processing, setProcessing] = useState(false);
    const [catId, setCatId] = useState(null);
    const [itemType, setItemType]=useState(null);
    const [type, setType]=useState(false);
    const [subCatData, setSubCatData] = useState([]);
    const [catData, setCatData] = useState([]);

    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the timeout as needed

      return () => clearTimeout(timer);
    }, [location]);

    const [formData, setFormData] = useState({
        productName: '',
        product_id:'',
        category: '',
        subCategory: '',
        description: '',
        image: null,
        unit: '',
        qty: '',
        sellingPrice: '',
        purchasePrice: '',
        discount: ''
    });

    const [itemFormData, setItemFormData] = useState({
        item: '',
        type: '',
    });

    const unit = [
        { id: 1, name: "Piece (pc)" },
        { id: 2, name: "Pack (pk)" },
        { id: 4, name: "Carton (ct)" },
        { id: 5, name: "Kilogram (kg)" },
        { id: 8, name: "Liter (L)" },
        { id: 16, name: "Gallon (gal)" },
        { id: 19, name: "Dozen (dz)" },
        { id: 21, name: "Set (set)" },
        { id: 22, name: "Roll (rl)" },
        { id: 23, name: "Bundle (bdl)" },
        { id: 24, name: "Can (can)" },
        { id: 25, name: "Bottle (btl)" },
        { id: 27, name: "Packet (pkt)" },
        { id: 28, name: "Sachet (sach)" }
    ];

    const cat = [
        { id: 1, name: 'Rice' },
        { id: 2, name: 'Beans' },
        { id: 3, name: 'Maize' },
        { id: 4, name: 'Sourgum' },
        { id: 5, name: 'Millet' },
        { id: 6, name: 'Garri' },
        { id: 7, name: 'Spaghetti' }
    ];

    const subCat = [
        { id: 1, name: '100KG' },
        { id: 2, name: '50KG' },
        { id: 3, name: '25KG' },
        { id: 4, name: '10KG' },
        { id: 5, name: '5KG' },
        { id: 6, name: '1000 Pieces' }
    ];

    useEffect(() => {
        const val = formData.purchasePrice * (formData.discount / 100);
        const newPrice = formData.purchasePrice - val;
        setFormData((prevFormData) => ({
            ...prevFormData,
            sellingPrice: newPrice
        }));
    }, [formData.purchasePrice, formData.discount]);

    const handleCategoryChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            category: value,
        }));


    };

    const handleSubCategoryChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            subCategory: value
        }));

        setSelectedSubCat(value.id);
    };

    const handleUnitChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            unit: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };



    const handleTypeChange = (value) => {

        setItemFormData((prevState) => ({
            ...prevState,
            type: value
        }));

        if (value == "Cat") {
            setType(true);

    }else{
        setType(false);

    }

    };


    const handleItemChange = (value) => {
        setItemFormData((prevState) => ({
            ...prevState,
            item: value
        }));

    };

    const handleInputDiscountChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
        if (name === "discount") {
            setDiscount(value);
        }
        if (name === "purchasePrice") {
            setPurchasePrice(value);
        }
    };

    const toast = useRef(null);
    const showSuccess = (severity, summary, message) => {
        toast.current.show({ severity: severity, summary: summary, detail: message, life: 10000 });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const form = new FormData();
        form.append('category', formData.category?.items);
        form.append('sub_category', formData.subCategory?.items);
        form.append('description', formData.description);
        form.append('qty', formData.qty);
        form.append('image', formData.image);
        form.append('selling_price', formData.sellingPrice);
        form.append('purchase_price', formData.purchasePrice);
        form.append('discount', formData.discount);

        try {
            const response = await axios.post('https://api.scan-verify.com/api/products', form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Product added:', response.data);
            setProcessing(false);
            if (response.data.success) {
                showSuccess('success', "Product", "Product Successfully Added");
            } else {
                showSuccess('error', "Product", "Product failed to add");
            }
        } catch (error) {
            setProcessing(false);
            console.error('Error adding product:', error);
        }
    };


    const  fetchDataCat  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/product/item?type=1', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Product items fetched:', response.data);

            const data = response.data; // Destructure cat and subCat from response.data

            setCatData(data);

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


     const  fetchDataSub  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/product/item?type=2', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Product items fetched:', response.data);

            const data = response.data; // Destructure cat and subCat from response.data

            setSubCatData(data);

        } catch (error) {
            console.error('Error adding product:', error);
        }
     }


    useEffect(() => {
        fetchDataCat() ;
        fetchDataSub() ;
    }, []);


    const handleUpdate = async (e) => {
        e.preventDefault();
        setProcessing(true);

        const form = new FormData();
        form.append('items', itemFormData.item);
        form.append('type', itemFormData.type);

        try {
            const response = await axios.post('https://api.scan-verify.com/api/product/create', form, {
                headers: {
                     'Content-Type': 'application/json'
                }
            });

            console.log('Product Item added:', response.data);
            setProcessing(false);

            if (response.data.success) {
                setItemFormData([])
                fetchDataSub();
                fetchDataCat();
                showSuccess('success', "Product", "Product Category/Sub Category  Successfully Added");
            } else {
                showSuccess('error', "Product", "Product failed to add");
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



    return (



        <div className="flex items-center justify-center p-12 w-full mx-auto">
        <div className="card flex justify-content-center">
            <Dialog  header="Add Product" visible={visible} style={{ width: '50vw', height:'auto' }} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

            <form >
                  {type? (

                    <InputField
                        id="item"
                        label="Category"
                        type="text"
                        name="item"
                        placeholder="Category Name"
                        value={itemFormData.item}
                        onChange={(e)=>{handleItemChange(e.target.value)}}
                    />
                  ):(

                    <InputField
                        id="item"
                        label="Sub Category Name"
                        type="text"
                        name="item"
                        placeholder="Sub Category Name"
                        value={itemFormData.item}
                        onChange={(e)=>{handleItemChange(e.target.value)}}
                    />

                  )}





                    <div>
                    <button
                            type="button"
                            onClick={handleUpdate}
                            disabled={processing}
                            className={`hover:shadow-form grid grid-cols-2 w-full items-center justify-content-center py-3 px-4 text-center text-base font-semibold outline-none ${processing ? 'bg-green-300' : 'bg-green-500'}`}
                        >
                            {processing && (
                                <div className="items-center">
                                    <ProgressSpinner style={{ width: '30px', height: '30px', color: 'red' }} strokeWidth="6" fill="none" animationDuration=".2s" />
                                </div>
                            )}
                            <div className="items-center justify-center text-white">
                                Add Product
                            </div>
                        </button>

                    </div>
                </form>
                </div>
            </Dialog>
        </div>



            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <h1 className=" font-bold mx-auto text-4xl place-self-start text-green-500 justify-center text-left">Add Product</h1>
            <Toast ref={toast} />
                <form onSubmit={handleSubmit}>
                <h1 className=" font-bold text-2xl place-self-start mb-4">Product Information</h1>

                    <div className="grid grid-cols-2 gap-x-4 w-full">
                    {/* <div className="mb-5 w-1/3">

                    </div> */}


                            <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#000000]">
                                Select Product
                            </label>
                                <div className="card  w-full my-3">
                                        <Dropdown inputId="dd-city" value={formData.category} name='category' onChange={handleCategoryChange} options={catData} optionLabel="items" className="w-full text-green-500 border border-green-500" />
                                        <span className="flex">
                                            <button
                                            type='button'
                                                onClick={()=>{!visible && setVisible(true); handleTypeChange('Cat')}}
                                            className='border bg-green-600 active:bg-green-300 active:text-black text-white px-4 py-2'>
                                                <div className='grid grid-cols-2 items-center justify-center my-auto mx-auto'>
                                                        <span><i className=" pi pi-plus-circle"></i></span>
                                                        <span><b>Add Product</b></span>
                                                </div>
                                            </button>
                                        </span>


                                <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#000000]">
                                        Select Unit
                                </label>
                                <div className="card  w-full my-3">
                                        <Dropdown inputId="dd-city" value={formData.subCategory} name='subCategory' onChange={handleSubCategoryChange} options={subCatData} optionLabel="items" className="w-full text-green-500 border border-green-500" />
                                        <span className="">
                                            <button
                                             type='button'
                                                onClick={()=>{!visible && setVisible(true); handleTypeChange('subCat')}}
                                            className='border bg-green-600 active:bg-green-300 active:text-black text-white px-4 py-2'>
                                                <div className='grid grid-cols-2 items-center justify-center my-auto mx-auto'>
                                                        <span><i className=" pi pi-plus-circle"></i></span>
                                                        <span><b>Add Unit</b></span>
                                                </div>
                                            </button>
                                        </span>
                                </div>

                            </div>
                    </div>



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

                    <div className="mb-5">
                        <label htmlFor="description" className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                        Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-green-500 bg-white py-3 px-5 text-base font-medium text-[#26ad38] outline-none focus:border-[#6A64F1] focus:shadow-md"
                        >{formData.description}</textarea>
                    </div>



                    <div className=" my-3 grid grid-cols-6 justify-between ">
                        <InputField
                            id="purchasePrice"
                            label="Purchase Price"
                            type="number"
                            name="purchasePrice"
                            placeholder="Purchase Price"
                            value={formData.purchasePrice}
                            onChange={handleInputDiscountChange }
                        />



                        <InputField
                            id="discount"
                            label="  Discount %"
                            type="number"
                            name="discount"
                            placeholder="Discount %"
                            value={formData.discount}
                            onChange={handleInputDiscountChange}
                        />

                        <InputField
                            id="sellingPrice"
                            label="Selling Price"
                            type="number"
                            name="sellingPrice"
                            placeholder="Selling Price"
                            value={formData.sellingPrice}
                            onChange={handleInputChange}
                        />
                        </div>



                    <div>
                        <button
                        onClick={handleSubmit}
                            type="submit"
                            { ...processing && 'disabled'}

                            className={`hover:shadow-form grid grid-cols-2 w-full items-center justify-content-center file:rounded-md  py-3 px-4 text-center text-base font-semibold outline-none ${processing ? 'bg-green-300' : 'bg-green-500'}`}
                        >{processing && (
                             <div className="items-center">
                                <ProgressSpinner style={{width: '30px', height: '30px', color:'red'}} strokeWidth="6" fill="none" animationDuration=".2s" />
                        </div>
                        )

                        }
                        <div className="items-center justify-center text-white">
                                Add Product
                        </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

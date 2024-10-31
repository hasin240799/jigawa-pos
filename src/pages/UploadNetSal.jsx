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
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import * as XLSX from "xlsx";

export default function UploadNetSal() {

    const [processing, setProcessing] = useState(false);
    const [products, setProducts] = useState([]);
    const [fetchedProducts, setFetchedProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [jsonData, setJsonData] = useState([]);


 const [formData, setFormData] = useState([]);





    const toast = useRef(null);
    const showSuccess = (severity, summary, message) => {
        toast.current.show({ severity: severity, summary: summary, detail: message, life: 10000 });
    };



    // localStorage.setItem('token',"9|uNcizYdWEBr85RAasqTWNz5cKFCuQKRGTYiOSaeOe4f57c9b")

    const fileUploadRef = useRef(null); // Create a ref for the FileUpload component
    const [uploadedFiles, setUploadedFiles] = useState([]);


    // const onUpload = (event) => {
    //     // Add the uploaded files to the uploadedFiles state
    //     // const files = event.files;

    //     const inputElement = fileUploadRef.current.getInput(); // Get the input element using the ref
    //     const files = inputElement.files; // Access the FileList from the input
    //     // Update the uploaded files state
    //     setFormData((prevState) => ({
    //         ...prevState,
    //         passport: files[0]
    //     }));


    //     console.log('acual',files[0])
    //     console.log('elemt',inputElement)
    //     console.log('event',event)
    //     console.log("formData",formData.passport)

    //     };





    const onUpload = async (event) => {
        const inputElement = fileUploadRef.current.getInput(); // Get the input element using the ref
        const file = inputElement.files[0]; // Access the selected file

        if (!file) return;

        // Read the file and convert it to JSON
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet);

            console.log('jsonData:', json)
            setJsonData(json)
            // Update the formData state with the JSON data
            setFormData((prevState) => ({
                ...prevState,
                data: json
            }));

            // Optional: send the data to your backend
            // sendDataToBackend(jsonData);
        };

        reader.readAsBinaryString(file);
    };

    const sendDataToBackend = async (data) => {
        try {
            const response = await axios.post("https://api.scan-verify.com/api/upload/net-salary", { data });
            console.log("Data successfully sent:", response.data);
            setProcessing(false);
            if (response.data.success) {

                showSuccess('success', "Net Salary", response.data.message);
            } else {
                showSuccess('error', "Net Salary", response.data.message);
            }

        } catch (error) {
            setProcessing(false);
            showSuccess('error', "Product", error);
            console.error("Error sending data:", error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        sendDataToBackend(jsonData);

    //     const saleData = {
    //     ...formData,
    //     customer_id: parseInt(formData.customer_id.id),
    //     payment_type: formData.payment_type.id,
    //     products: formData.products.map(product => ({
    //     id: parseInt(product.id),
    //     qty: parseInt(product.quantity),
    //   })),
    // };

    // console.log('Sales Data',saleData)

    //     try {
    //         const response = await axios.post('https://api.scan-verify.com/api/sales/create',saleData, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         });
    //         console.log('Product added:', response.data);
    //         setProcessing(false);
    //         if (response.data.success) {

    //             showSuccess('success', "Product", response.data.message);
    //         } else {
    //             showSuccess('error', "Product", response.data.message);
    //         }
    //     } catch (error) {
    //         setProcessing(false);
    //         console.error('Error adding product:', error);
    //     }
    };



    return (

        <div className="flex items-center justify-center p-12 sm:w-full md:w-1/2 mx-auto">

            <div className="mx-auto sm:w-full md:w-1/2 bg-white p-6 rounded-md justify-between ">
            <h1 className=" font-bold mx-auto text-4xl place-self-start text-green-500 justify-center text-left">Upload Salary Net Excel File</h1>
            <Toast ref={toast} />
                <form onSubmit={handleSubmit}>

                        <div className="card my-5">
                                        <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                            Upload Excel File
                                    </label>
                                <FileUpload
                                  chooseLabel='Upload excel file here..., only xlsx (excel). Max file size of 1MB(*)'

                                  uploadLabel='Upload Net Salary in Bulk'
                                    ref={fileUploadRef} // Attach the ref to the FileUpload component
                                    name="file"
                                    accept=".xlsx, .xls"
                                    multiple = {false}
                                    previewWidth={100}
                                    maxFileSize={100000000}
                                    onSelect={onUpload}
                                    customUpload={true}

                                    auto={true}
                                    emptyTemplate={<p className="m-0">Upload Net Salary in Bulk</p>}
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
                          Upload
                        </div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

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

export default function BiziUsersForm({ auth }) {
    const [customers, setCustomersData] = useState([]);
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
    const [gender, setGender] = useState('');


    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState({
        full_name: '',
        contact: '',
        email:'',
        role:'',
    });


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


    const banks = [
        { "id": "1", "name": "Access Bank" ,"code":"044" },
        { "id": "2", "name": "Citibank","code":"023" },
        { "id": "3", "name": "Diamond Bank","code":"063" },
        { "id": "4", "name": "Dynamic Standard Bank","code":"" },
        { "id": "5", "name": "Ecobank Nigeria","code":"050" },
        { "id": "6", "name": "Fidelity Bank Nigeria","code":"070" },
        { "id": "7", "name": "First Bank of Nigeria","code":"011" },
        { "id": "8", "name": "First City Monument Bank","code":"214" },
        { "id": "9", "name": "Guaranty Trust Bank","code":"058" },
        { "id": "10", "name": "Heritage Bank Plc","code":"030" },
        { "id": "11", "name": "Jaiz Bank","code":"301" },
        { "id": "12", "name": "Keystone Bank Limited","code":"082" },
        { "id": "13", "name": "Providus Bank Plc","code":"101" },
        { "id": "14", "name": "Polaris Bank","code":"076" },
        { "id": "15", "name": "Stanbic IBTC Bank Nigeria Limited","code":"221" },
        { "id": "16", "name": "Standard Chartered Bank","code":"068" },
        { "id": "17", "name": "Sterling Bank","code":"232" },
        { "id": "18", "name": "Suntrust Bank Nigeria Limited","code":"100" },
        { "id": "19", "name": "Union Bank of Nigeria","code":"032" },
        { "id": "20", "name": "United Bank for Africa","code":"033" },
        { "id": "21", "name": "Unity Bank Plc","code":"215" },
        { "id": "22", "name": "Wema Bank","code":"035" },
        { "id": "23", "name": "Zenith Bank","code":"057" }
    ]

    const MDAS = [
        // Ministries
        { "id": 1, "name": "Ministry of Agriculture and Rural Development" },
        { "id": 2, "name": "Ministry of Education" },
        { "id": 3, "name": "Ministry of Health" },
        { "id": 4, "name": "Ministry of Works and Housing" },
        { "id": 5, "name": "Ministry of Finance" },
        { "id": 6, "name": "Ministry of Water Resources" },
        { "id": 7, "name": "Ministry of Youth and Sports Development" },
        { "id": 8, "name": "Ministry of Environment" },
        { "id": 9, "name": "Ministry of Local Government" },
        { "id": 10, "name": "Ministry of Information and Culture" },
        { "id": 11, "name": "Ministry of Justice" },
        { "id": 12, "name": "Ministry of Commerce and Industry" },
        { "id": 13, "name": "Ministry of Science and Technology" },
        { "id": 14, "name": "Ministry of Social Development" },
        { "id": 15, "name": "Ministry of Planning and Budget" },
        { "id": 16, "name": "Ministry of Transportation" },
        { "id": 17, "name": "Ministry of Petroleum Resources" },
        { "id": 18, "name": "Ministry of Power" },
        { "id": 19, "name": "Ministry of Foreign Affairs" },
        { "id": 20, "name": "Ministry of Energy" },

        // Boards

        { "id": 26, "name": "State Civil Service Commission" },
        { "id": 27, "name": "State Scholarship Board" },
        { "id": 28, "name": "State Tourism Board" },
        { "id": 29, "name": "State Board for Technical Education" },
        { "id": 30, "name": "State Internal Revenue Board" },

        // Commissions

        { "id": 36, "name": "State Independent Electoral Commission" },
        { "id": 37, "name": "State Human Rights Commission" },
        { "id": 38, "name": "State Revenue Mobilization Allocation and Fiscal Commission" },
        { "id": 39, "name": "State Code of Conduct Bureau" },
        { "id": 40, "name": "State Population Commission" },

        // Agencies

        { "id": 54, "name": "State Police Command" },
        { "id": 55, "name": "State Security Service (SSS)" },
        { "id": 56, "name": "State Emergency Management Agency" },
        { "id": 57, "name": "State Road Safety Corps" },
        { "id": 58, "name": "State Environmental Protection Agency" },
        { "id": 59, "name": "State Health Management Board" },
        { "id": 60, "name": "State Water Board" },
        { "id": 61, "name": "State Housing Authority" },
        { "id": 62, "name": "State Agricultural Development Programme" },
        { "id": 63, "name": "State Industrial Development Agency" },
        { "id": 64, "name": "State Social Welfare Board" },
        { "id": 65, "name": "State Employment and Productivity Agency" }
    ]

    const roleData =[
        {id:'bizi_agent',name:'BIZI Agent'},
        {id:'bizi_agent_manager',name:'BIZI Agent Manager'},
    ]
//     const wardsData = [
//         { id: 'AUYO', ward: 'AUYO' },
//         { id: 'AUYAKAYI', ward: 'AUYAKAYI' },
//         { id: 'AYAMA', ward: 'AYAMA' },
//         { id: 'AYAN', ward: 'AYAN' },
//         { id: 'GAMAFOI', ward: 'GAMAFOI' },
//         { id: 'GAMSARKA', ward: 'GAMSARKA' },
//         { id: 'GATAFA', ward: 'GATAFA' },
//         { id: 'KAFUR', ward: 'KAFUR' },
//         { id: 'TSIDIR', ward: 'TSIDIR' },
//         { id: 'UNIK', ward: 'UNIK' },
//         { id: 'BABURA', ward: 'BABURA' },
//         { id: 'BATALI', ward: 'BATALI' },
//         { id: 'DORAWA', ward: 'DORAWA' },
//         { id: 'GARU', ward: 'GARU' },
//         { id: 'GASAKOLI', ward: 'GASAKOLI' },
//         { id: 'INSHARUWA', ward: 'INSHARUWA' },
//         { id: 'JIGAWA', ward: 'JIGAWA' },
//         { id: 'KANYA', ward: 'KANYA' },
//         { id: 'KUZUNZUMI', ward: 'KUZUNZUMI' },
//         { id: 'KYAMBO', ward: 'KYAMBO' },
//         { id: 'TAKWASA', ward: 'TAKWASA' },
//         { id: 'BIRNIN KUDU', ward: 'BIRNIN KUDU' },
//         { id: 'KANGIRE', ward: 'KANGIRE' },
//         { id: 'KANTOGA', ward: 'KANTOGA' },
//         { id: 'KIYAKO', ward: 'KIYAKO' },
//         { id: 'KWANGWARA', ward: 'KWANGWARA' },
//         { id: 'LAFIYA', ward: 'LAFIYA' },
//         { id: 'SUNDIMINA', ward: 'SUNDIMINA' },
//         { id: 'SURKO', ward: 'SURKO' },
//         { id: 'UNGUWARYA', ward: 'UNGUWARYA' },
//         { id: 'WURNO', ward: 'WURNO' },
//         { id: 'YALWAN DAMAI', ward: 'YALWAN DAMAI' },
//         { id: 'BATU', ward: 'BATU' },
//         { id: 'BIRNIWA', ward: 'BIRNIWA' },
//         { id: 'DANGWALERI', ward: 'DANGWALERI' },
//         { id: 'DIGINSA', ward: 'DIGINSA' },
//         { id: 'FAGI', ward: 'FAGI' },
//         { id: 'KACHALLARI', ward: 'KACHALLARI' },
//         { id: 'KARANKA', ward: 'KARANKA' },
//         { id: 'KAZURA', ward: 'KAZURA' },
//         { id: 'MACHINAMARI', ward: 'MACHINAMARI' },
//         { id: 'MATAMU', ward: 'MATAMU' },
//         { id: 'NGUWA', ward: 'NGUWA' },
//         { id: 'AHOTO', ward: 'AHOTO' },
//         { id: 'BUJI', ward: 'BUJI' },
//         { id: 'CHURBUN', ward: 'CHURBUN' },
//         { id: 'GANTSA', ward: 'GANTSA' },
//         { id: 'FALAGERI', ward: 'FALAGERI' },
//         { id: 'KAWAYA', ward: 'KAWAYA' },
//         { id: 'KUKUMA', ward: 'KUKUMA' },
//         { id: 'K/LELEN KUDU', ward: 'K/LELEN KUDU' },
//         { id: 'MADABE', ward: 'MADABE' },
//         { id: 'Y/TUKUR', ward: 'Y/TUKUR' },
//         { id: 'ABAYA', ward: 'ABAYA' },
//         { id: 'CHAMO', ward: 'CHAMO' },
//         { id: 'DUNDUBUS', ward: 'DUNDUBUS' },
//         { id: 'DURU', ward: 'DURU' },
//         { id: 'JIGAWAR TSADA', ward: 'JIGAWAR TSADA' },
//         { id: 'KACHI', ward: 'KACHI' },
//         { id: 'KARNAYA', ward: 'KARNAYA' },
//         { id: 'KUDAI', ward: 'KUDAI' },
//         { id: 'LIMAWA', ward: 'LIMAWA' },
//         { id: 'MADOBI', ward: 'MADOBI' },
//         { id: 'SAKWAYA', ward: 'SAKWAYA' },
//         { id: 'BUDURU', ward: 'BUDURU' },
//         { id: 'DOKO', ward: 'DOKO' },
//         { id: 'GARKI', ward: 'GARKI' },
//         { id: 'GWARZON GARKI', ward: 'GWARZON GARKI' },
//         { id: 'JIRIMA', ward: 'JIRIMA' },
//         { id: 'KANYA', ward: 'KANYA' },
//         { id: 'KARGO', ward: 'KARGO' },
//         { id: 'KORE', ward: 'KORE' },
//         { id: 'MUKU', ward: 'MUKU' },
//         { id: 'RAFIN MARKE', ward: 'RAFIN MARKE' },
//         { id: 'SIYORI', ward: 'SIYORI' },
//         { id: 'GAGARAWA GARI', ward: 'GAGARAWA GARI' },
//         { id: 'GAGARAWA TASHA', ward: 'GAGARAWA TASHA' },
//         { id: 'GARIN CHIROMA', ward: 'GARIN CHIROMA' },
//         { id: 'KORE BALATU', ward: 'KORE BALATU' },
//         { id: 'MADAKA', ward: 'MADAKA' },
//         { id: 'MAIADUWA', ward: 'MAIADUWA' },
//         { id: 'MAIKILILI', ward: 'MAIKILILI' },
//         { id: 'MEDU', ward: 'MEDU' },
//         { id: 'YALAWA', ward: 'YALAWA' },
//         { id: 'ZARADA', ward: 'ZARADA' },
//         { id: 'BAIKARYA', ward: 'BAIKARYA' },
//         { id: 'DANAMA', ward: 'DANAMA' },
//         { id: 'DANTANOMA', ward: 'DANTANOMA' },
//         { id: 'GALAGAMMA', ward: 'GALAGAMMA' },
//         { id: 'GARIN GAMBO', ward: 'GARIN GAMBO' },
//         { id: 'GARIN ALHAJI BARKA', ward: 'GARIN ALHAJI BARKA' },
//         { id: 'GUSAU', ward: 'GUSAU' },
//         { id: 'HAMMADO', ward: 'HAMMADO' },
//         { id: 'KOFAR AREWA', ward: 'KOFAR AREWA' },
//         { id: 'KOFAR YAMMA', ward: 'KOFAR YAMMA' },
//         { id: 'ZANGO', ward: 'ZANGO' },
//         { id: 'ABUNABO', ward: 'ABUNABO' },
//         { id: 'ADIYANI', ward: 'ADIYANI' },
//         { id: 'DAWA', ward: 'DAWA' },
//         { id: 'GARBAGAL', ward: 'GARBAGAL' },
//         { id: 'GURI', ward: 'GURI' },
//         { id: 'KADIRA', ward: 'KADIRA' },
//         { id: 'LAFIYA', ward: 'LAFIYA' },
//         { id: 'MARGADU', ward: 'MARGADU' },
//         { id: 'MATARA BABA', ward: 'MATARA BABA' },
//         { id: 'MUSARI', ward: 'MUSARI' },
//         { id: 'BASIRKA', ward: 'BASIRKA' },
//         { id: 'DINGAYA', ward: 'DINGAYA' },
//         { id: 'FAGAM', ward: 'FAGAM' },
//         { id: 'FARIN DUTSE', ward: 'FARIN DUTSE' },
//         { id: 'GWARAM TSOHUWA', ward: 'GWARAM TSOHUWA' },
//         { id: 'BUNTUSU', ward: 'BUNTUSU' },
//         { id: 'DABI', ward: 'DABI' },
//         { id: 'DARINA', ward: 'DARINA' },
//         { id: 'F/YAMMA', ward: 'F/YAMMA' },
//         { id: 'GUNTAI', ward: 'GUNTAI' },
//         { id: 'GWIWA', ward: 'GWIWA' },
//         { id: 'KORAYEL', ward: 'KORAYEL' },
//         { id: 'RORAU', ward: 'RORAU' },
//         { id: 'SHAFE', ward: 'SHAFE' },
//         { id: 'YOLA', ward: 'YOLA' },
//         { id: 'ZAUMAR SAINAWA', ward: 'ZAUMAR SAINAWA' },
//         // HADEJIA Wards
//   { id: 'ATAFI', ward: 'ATAFI' },
//   { id: 'DUBANTU', ward: 'DUBANTU' },
//   { id: 'GAGULMARI', ward: 'GAGULMARI' },
//   { id: 'KASUWAR KUDA', ward: 'KASUWAR KUDA' },
//   { id: 'KASUWAR KOFA', ward: 'KASUWAR KOFA' },
//   { id: 'MAJEMA', ward: 'MAJEMA' },
//   { id: 'MATSARO', ward: 'MATSARO' },
//   { id: 'RUMFA', ward: 'RUMFA' },
//   { id: 'SABON GARU', ward: 'SABON GARU' },
//   { id: 'YANKOLI', ward: 'YANKOLI' },
//   { id: 'YAYARI', ward: 'YAYARI' },

//   // JAHUN Wards
//   { id: 'AUJARA', ward: 'AUJARA' },
//   { id: 'GANGAWA', ward: 'GANGAWA' },
//   { id: 'GAUZA TAZARA', ward: 'GAUZA TAZARA' },
//   { id: 'GUNKA', ward: 'GUNKA' },
//   { id: 'HARBO SABUWA', ward: 'HARBO SABUWA' },
//   { id: 'HARBO TSOHUWA', ward: 'HARBO TSOHUWA' },
//   { id: 'IDANDUNA', ward: 'IDANDUNA' },
//   { id: 'JABARNA', ward: 'JABARNA' },
//   { id: 'JAHUN', ward: 'JAHUN' },
//   { id: 'KALE', ward: 'KALE' },
//   { id: 'KANWA', ward: 'KANWA' },

//   // KAFIN HAUSA Wards
//   { id: 'BALANGU', ward: 'BALANGU' },
//   { id: 'DUMADUMIN TOKA', ward: 'DUMADUMIN TOKA' },
//   { id: 'GAFAYA', ward: 'GAFAYA' },
//   { id: 'JABO', ward: 'JABO' },
//   { id: 'KAFIN HAUSA', ward: 'KAFIN HAUSA' },
//   { id: 'KAZALEWA', ward: 'KAZALEWA' },
//   { id: 'MAJAWA', ward: 'MAJAWA' },
//   { id: 'MEZAN', ward: 'MEZAN' },
//   { id: 'RUBA', ward: 'RUBA' },
//   { id: 'SARAWA', ward: 'SARAWA' },
//   { id: 'ZAGO', ward: 'ZAGO' },

//   // KAUGAMA Wards
//   { id: 'ARBUS', ward: 'ARBUS' },
//   { id: 'ASKANDU', ward: 'ASKANDU' },
//   { id: 'DABUWARAN', ward: 'DABUWARAN' },
//   { id: 'DAKAIYAWA', ward: 'DAKAIYAWA' },
//   { id: 'HADIN', ward: 'HADIN' },
//   { id: 'JA\'E', ward: 'JA\'E' },
//   { id: 'JARKASA', ward: 'JARKASA' },
//   { id: 'KAUGAMA', ward: 'KAUGAMA' },
//   { id: 'MARKE', ward: 'MARKE' },
//   { id: 'UNGUWAR JIBRIN', ward: 'UNGUWAR JIBRIN' },
//   { id: 'YALO', ward: 'YALO' },

//   // KAZAURE Wards
//   { id: 'BA\'AUZINI', ward: 'BA\'AUZINI' },
//   { id: 'DABA', ward: 'DABA' },
//   { id: 'DABAZA', ward: 'DABAZA' },
//   { id: 'DANDI', ward: 'DANDI' },
//   { id: 'GADA', ward: 'GADA' },
//   { id: 'KANTI', ward: 'KANTI' },
//   { id: 'MARADAWA', ward: 'MARADAWA' },
//   { id: 'SABARU', ward: 'SABARU' },
//   { id: 'UNGUWAR AREWA', ward: 'UNGUWAR AREWA' },
//   { id: 'UNGUWAR GABAS', ward: 'UNGUWAR GABAS' },
//   { id: 'UNGUWAR YAMMA', ward: 'UNGUWAR YAMMA' },

//   // KIRIKA SAMMA Wards
//   { id: 'BATURIYA', ward: 'BATURIYA' },
//   { id: 'BULUNCHAI', ward: 'BULUNCHAI' },
//   { id: 'DOLERI', ward: 'DOLERI' },
//   { id: 'FANDUM', ward: 'FANDUM' },
//   { id: 'GAYIN', ward: 'GAYIN' },
//   { id: 'KIRIKA SAMMA', ward: 'KIRIKA SAMMA' },
//   { id: 'MADACHI', ward: 'MADACHI' },
//   { id: 'MARMA', ward: 'MARMA' },
//   { id: 'TSHEGUWA', ward: 'TSHEGUWA' },
//   { id: 'TARABU', ward: 'TARABU' },

//   // KIYAWA Wards
//   { id: 'ABALAGO', ward: 'ABALAGO' },
//   { id: 'ANDAZA', ward: 'ANDAZA' },
//   { id: 'FAKI', ward: 'FAKI' },
//   { id: 'GARKO', ward: 'GARKO' },
//   { id: 'GURUDUBA', ward: 'GURUDUBA' },
//   { id: 'KATANGA', ward: 'KATANGA' },
//   { id: 'KATUKA', ward: 'KATUKA' },
//   { id: 'KIYAWA', ward: 'KIYAWA' },
//   { id: 'KWANDA', ward: 'KWANDA' },
//   { id: 'MAJE', ward: 'MAJE' },
//   { id: 'TSURMA', ward: 'TSURMA' },

//   // MAIGATARI Wards
//   { id: 'BALARABE', ward: 'BALARABE' },
//   { id: 'DANKUMBO', ward: 'DANKUMBO' },
//   { id: 'FULATA', ward: 'FULATA' },
//   { id: 'GALADI', ward: 'GALADI' },
//   { id: 'JAJERI', ward: 'JAJERI' },
//   { id: 'KUKAYASKU', ward: 'KUKAYASKU' },
//   { id: 'MADANA', ward: 'MADANA' },
//   { id: 'MAIGATARI AREWA', ward: 'MAIGATARI AREWA' },
//   { id: 'MAIGATARI KUDU', ward: 'MAIGATARI KUDU' },
//   { id: 'MATOYA', ward: 'MATOYA' },
//   { id: 'TURBUS', ward: 'TURBUS' },

//   // MALAM MADORI Wards
//   { id: 'ARKI', ward: 'ARKI' },
//   { id: 'DUNARI', ward: 'DUNARI' },
//   { id: 'FATEKA AKURYA', ward: 'FATEKA AKURYA' },
//   { id: 'GARIN GABAS', ward: 'GARIN GABAS' },
//   { id: 'MAIRA KUMI-BARA MUSA', ward: 'MAIRA KUMI-BARA MUSA' },
//   { id: 'MAKA DDARI', ward: 'MAKA DDARI' },
//   { id: 'MALAM MADORI', ward: 'MALAM MADORI' },
//   { id: 'SHAIYA', ward: 'SHAIYA' },
//   { id: 'TAGWARO', ward: 'TAGWARO' },
//   { id: 'TASHENA', ward: 'TASHENA' },
//   { id: 'TONIKUTARA', ward: 'TONIKUTARA' },

//   // MIGA Wards
//   { id: 'DANGYATIN', ward: 'DANGYATIN' },
//   { id: 'GARBO', ward: 'GARBO' },
//   { id: 'HANTSU', ward: 'HANTSU' },
//   { id: 'KOYA', ward: 'KOYA' },
//   { id: 'MIGA', ward: 'MIGA' },
//   { id: 'SABON GARI TAKANEBU', ward: 'SABON GARI TAKANEBU' },
//   { id: 'SANSANI', ward: 'SANSANI' },
//   { id: 'TSAKUWAWA', ward: 'TSAKUWAWA' },
//   { id: 'YANDUNA', ward: 'YANDUNA' },
//   { id: 'ZAREKU', ward: 'ZAREKU' },

//   // RINGIM Wards
//   { id: 'CHAI-CHAI', ward: 'CHAI-CHAI' },
//   { id: 'DABI', ward: 'DABI' },
//   { id: 'KAFIN BABUSHE', ward: 'KAFIN BABUSHE' },
//   { id: 'KARSHI', ward: 'KARSHI' },
//   { id: 'KYARAMA', ward: 'KYARAMA' },
//   { id: 'RINGIM', ward: 'RINGIM' },
//   { id: 'SANKARA', ward: 'SANKARA' },
//   { id: 'SINTILMAWA', ward: 'SINTILMAWA' },
//   { id: 'TOFA', ward: 'TOFA' },
//   { id: 'YANDUTSE', ward: 'YANDUTSE' },

//   // RONI Wards
//   { id: 'AMARYAWA', ward: 'AMARYAWA' },
//   { id: 'BARAGUMI', ward: 'BARAGUMI' },
//   { id: 'DANSURE', ward: 'DANSURE' },
//   { id: 'FARA', ward: 'FARA' },
//   { id: 'GORA', ward: 'GORA' },
//   { id: 'KWAITA', ward: 'KWAITA' },
//   { id: 'RONI', ward: 'RONI' },
//   { id: 'SANKAU', ward: 'SANKAU' },
//   { id: 'TUNAS', ward: 'TUNAS' },
//   { id: 'YANZAKI', ward: 'YANZAKI' },
//   { id: 'ZUGAI', ward: 'ZUGAI' },

//   // SULE-TANKARKAR Wards
//   { id: 'ALBASU', ward: 'ALBASU' },
//   { id: 'AMANGA', ward: 'AMANGA' },
//   { id: 'DANGWANKI', ward: 'DANGWANKI' },
//   { id: 'DANLADI', ward: 'DANLADI' },
//   { id: 'DANZOMO', ward: 'DANZOMO' },
//   { id: 'JEKE', ward: 'JEKE' },
//   { id: 'SHABARU', ward: 'SHABARU' },
//   { id: 'SULE-TANKARKAR', ward: 'SULE-TANKARKAR' },
//   { id: 'TAKATSABA', ward: 'TAKATSABA' },
//   { id: 'YANDAMO', ward: 'YANDAMO' },

//   // TAURA Wards
//   { id: 'AJAURA', ward: 'AJAURA' },
//   { id: 'CHAKWAIKWAIWA', ward: 'CHAKWAIKWAIWA' },
//   { id: 'CHUKUTO', ward: 'CHUKUTO' },
//   { id: 'GUJUNGU', ward: 'GUJUNGU' },
//   { id: 'KIRI', ward: 'KIRI' },
//   { id: 'KWALAM', ward: 'KWALAM' },
//   { id: 'MAJE', ward: 'MAJE' },
//   { id: 'MAJIYA', ward: 'MAJIYA' },
//   { id: 'S/GARIN YAYA', ward: 'S/GARIN YAYA' },
//   { id: 'TAURA', ward: 'TAURA' },

//   // YANKWASHI Wards
//   { id: 'ACHILAFIYA', ward: 'ACHILAFIYA' },
//   { id: 'BELAS', ward: 'BELAS' },
//   { id: 'DAWAN-GAWO', ward: 'DAWAN-GAWO' },
//   { id: 'GWARTA', ward: 'GWARTA' },
//   { id: 'GURJIYA', ward: 'GURJIYA' },
//   { id: 'KARKARNA', ward: 'KARKARNA' },
//   { id: 'KUDA', ward: 'KUDA' },
//   { id: 'RINGIM', ward: 'RINGIM' },
//   { id: 'YANKWASHI', ward: 'YANKWASHI' },
//   { id: 'ZUNGUMBA', ward: 'ZUNGUMBA' }

//     ];


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
            const response = await axios.get('https://api.scan-verify.com/api/customer/data', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Product added:', response.data.customer);


                setShopData(response.data.customer)
                console.log(customers)

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
                console.log(customers)

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
                        <span><i className=" pi pi-user-plus"></i></span>
                        <span><b>Add Users</b></span>
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
            <Dialog modal={true}   header="Users Form" visible={visible} className='sm:w-1/2 px-4' style={{ width:'80%'}} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

            <h1 className=" font-bold text-2xl place-self-start my-5">Users Information</h1>
            <form onSubmit={handleSubmit}>

                <div className="card flex justify-content-center w-full">
                    <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                        <StepperPanel header="Basic Info">
                            <div className="flex flex-row h-auto">
                                <div className="border-2 border-dashed surface-border border-round px-4 py-6 w-full surface-ground  justify-content-center align-items-center font-medium">

                                <InputField
                                    id="full_name"
                                    label="Full Name"
                                    type="text"
                                    name="full_name"
                                    placeholder="Full Name"
                                    value={formData.full_name}
                                    onChange={(e)=>{handleInputChange('full_name',e.target.value)}}
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


                                <InputField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e)=>{handleInputChange('email',e.target.value)}}
                                />


                            <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                    Select Role
                            </label>
                            <div className="card flex justify-content-center w-full  my-3">
                                    <Dropdown filter={true} placeholder='Select Role'  value={formData.role} onChange={(e)=> {handleInputChange('role',e.target.value) }} options={roleData} optionLabel="name" className="w-full text-green-500 border border-green-500 px-4 py-2" />
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
                                            Add Users
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


<h1 className='text-gray-700 font-bold text-2xl'>Users </h1>

<DataTable
  value={customers}
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

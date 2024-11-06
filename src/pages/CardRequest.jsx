import { useEffect,useRef, useState } from 'react';
import axios from '../../src/api'; // Adjust the path accordingly
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
import Preloader from '../components/Preloader';
// import Staffs from '../components/Staffs';
import * as XLSX from 'xlsx';
import { FaExclamationCircle, FaSave } from 'react-icons/fa';
import Banner from '../components/Banner';
import Modal from '../components/Modal';

export default function CardRequest({ auth }) {
    const [customers, setCustomersData] = useState([]);
    const [customer, setCustomer] = useState([]);
    const [shopdata, setShopData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const stepperRef = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [employ, setIsEmploy] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [preloading, setPreloading] = useState(false);
    const [selectedShop, setSelectedShop] = useState([]);
    const [data, setData] = useState([]);
    const [selectedCat, setSelectedCat] = useState('');
    const [catVal, setCatVal] = useState('');
    const [subCatVal, setSubCatVal] = useState('');
    const [subCatArray, setSubCatArray] = useState('');
    const [gender, setGender] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [agentFound, setAgentFound] = useState(false);
    const [accountMatched, setAccountMatched] = useState(false);
    const [status, setStatus] = useState('');
    const [isVerify, setIsVerify] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);

   

    

    // const [selectedLga, setSelectedLga] = useState();
    const [selectedLga, setSelectedLga] = useState([
        { id: 1, name: "Auyo" },
        { id: 2, name: "Babura" },
        { id: 3, name: "Biriniwa" },
        { id: 4, name: "Birnin Kudu" },
        { id: 5, name: "Buji" },
        { id: 6, name: "Dutse" },
        { id: 7, name: "Gagarawa" },
        { id: 8, name: "Garki" },
        { id: 9, name: "Gumel" },
        { id: 10, name: "Guri" },
        { id: 11, name: "Gwaram" },
        { id: 12, name: "Gwiwa" },
        { id: 13, name: "Hadejia" },
        { id: 14, name: "Jahun" },
        { id: 15, name: "Kafin Hausa" },
        { id: 16, name: "Kazaure" },
        { id: 17, name: "Kiri Kasama" },
        { id: 18, name: "Kiyawa" },
        { id: 19, name: "Kaugama" },
        { id: 20, name: "Maigatari" },
        { id: 21, name: "Malam Madori" },
        { id: 22, name: "Miga" },
        { id: 23, name: "Ringim" },
        { id: 24, name: "Roni" },
        { id: 25, name: "Sule Tankarkar" },
        { id: 26, name: "Taura" },
        { id: 27, name: "Yankwashi" }
      ]);
    const [catId, setCatId] = useState(null);
    const [formData, setFormData] = useState({
        app_type:'',
        full_name: '',
        address: '',
        contact: '',
        customer_type: '',
        psn: '',
        bvn:'',
        ward:'',
        agent_id:'',
        town:'',
        nin:'',
        lga:'',
        contact:'',
        email:'',
        mda:'',
        rank:'',
        level:'',
        dob:'',
        gender:'',
        passport:'',
        bizipay_account:'',
        moniepoint_account:'',
    
    });


    const [errorMessages, setErrorMessages] = useState({
        address: '',
        contact: '',
        psn: '',
        lga: '',
        ward: '',
        moniepoint_account: '',
    });
    
    
    const fileUploadRef = useRef(null); // Create a ref for the FileUpload component
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // localStorage.setItem('token','10|WlwsrUGd8endOmy1gvy1ZLFR5BI2Mk7PVuiurjFxec840530')

  

    const customerType =[
        { "id": 1, "name": "Individual" },
        { "id": 2, "name": "Employee" },
    ]



  
   
    const wardsData = [
        { id: 'AUYO', ward: 'AUYO' },
        { id: 'AUYAKAYI', ward: 'AUYAKAYI' },
        { id: 'AYAMA', ward: 'AYAMA' },
        { id: 'AYAN', ward: 'AYAN' },
        { id: 'GAMAFOI', ward: 'GAMAFOI' },
        { id: 'GAMSARKA', ward: 'GAMSARKA' },
        { id: 'GATAFA', ward: 'GATAFA' },
        { id: 'KAFUR', ward: 'KAFUR' },
        { id: 'TSIDIR', ward: 'TSIDIR' },
        { id: 'UNIK', ward: 'UNIK' },
        { id: 'BABURA', ward: 'BABURA' },
        { id: 'BATALI', ward: 'BATALI' },
        { id: 'DORAWA', ward: 'DORAWA' },
        { id: 'GARU', ward: 'GARU' },
        { id: 'GASAKOLI', ward: 'GASAKOLI' },
        { id: 'INSHARUWA', ward: 'INSHARUWA' },
        { id: 'JIGAWA', ward: 'JIGAWA' },
        { id: 'KANYA', ward: 'KANYA' },
        { id: 'KUZUNZUMI', ward: 'KUZUNZUMI' },
        { id: 'KYAMBO', ward: 'KYAMBO' },
        { id: 'TAKWASA', ward: 'TAKWASA' },
        { id: 'BIRNIN KUDU', ward: 'BIRNIN KUDU' },
        { id: 'KANGIRE', ward: 'KANGIRE' },
        { id: 'KANTOGA', ward: 'KANTOGA' },
        { id: 'KIYAKO', ward: 'KIYAKO' },
        { id: 'KWANGWARA', ward: 'KWANGWARA' },
        { id: 'LAFIYA', ward: 'LAFIYA' },
        { id: 'SUNDIMINA', ward: 'SUNDIMINA' },
        { id: 'SURKO', ward: 'SURKO' },
        { id: 'UNGUWARYA', ward: 'UNGUWARYA' },
        { id: 'WURNO', ward: 'WURNO' },
        { id: 'YALWAN DAMAI', ward: 'YALWAN DAMAI' },
        { id: 'BATU', ward: 'BATU' },
        { id: 'BIRNIWA', ward: 'BIRNIWA' },
        { id: 'DANGWALERI', ward: 'DANGWALERI' },
        { id: 'DIGINSA', ward: 'DIGINSA' },
        { id: 'FAGI', ward: 'FAGI' },
        { id: 'KACHALLARI', ward: 'KACHALLARI' },
        { id: 'KARANKA', ward: 'KARANKA' },
        { id: 'KAZURA', ward: 'KAZURA' },
        { id: 'MACHINAMARI', ward: 'MACHINAMARI' },
        { id: 'MATAMU', ward: 'MATAMU' },
        { id: 'NGUWA', ward: 'NGUWA' },
        { id: 'AHOTO', ward: 'AHOTO' },
        { id: 'BUJI', ward: 'BUJI' },
        { id: 'CHURBUN', ward: 'CHURBUN' },
        { id: 'GANTSA', ward: 'GANTSA' },
        { id: 'FALAGERI', ward: 'FALAGERI' },
        { id: 'KAWAYA', ward: 'KAWAYA' },
        { id: 'KUKUMA', ward: 'KUKUMA' },
        { id: 'K/LELEN KUDU', ward: 'K/LELEN KUDU' },
        { id: 'MADABE', ward: 'MADABE' },
        { id: 'Y/TUKUR', ward: 'Y/TUKUR' },
        { id: 'ABAYA', ward: 'ABAYA' },
        { id: 'CHAMO', ward: 'CHAMO' },
        { id: 'DUNDUBUS', ward: 'DUNDUBUS' },
        { id: 'DURU', ward: 'DURU' },
        { id: 'JIGAWAR TSADA', ward: 'JIGAWAR TSADA' },
        { id: 'KACHI', ward: 'KACHI' },
        { id: 'KARNAYA', ward: 'KARNAYA' },
        { id: 'KUDAI', ward: 'KUDAI' },
        { id: 'LIMAWA', ward: 'LIMAWA' },
        { id: 'MADOBI', ward: 'MADOBI' },
        { id: 'SAKWAYA', ward: 'SAKWAYA' },
        { id: 'BUDURU', ward: 'BUDURU' },
        { id: 'DOKO', ward: 'DOKO' },
        { id: 'GARKI', ward: 'GARKI' },
        { id: 'GWARZON GARKI', ward: 'GWARZON GARKI' },
        { id: 'JIRIMA', ward: 'JIRIMA' },
        { id: 'KANYA', ward: 'KANYA' },
        { id: 'KARGO', ward: 'KARGO' },
        { id: 'KORE', ward: 'KORE' },
        { id: 'MUKU', ward: 'MUKU' },
        { id: 'RAFIN MARKE', ward: 'RAFIN MARKE' },
        { id: 'SIYORI', ward: 'SIYORI' },
        { id: 'GAGARAWA GARI', ward: 'GAGARAWA GARI' },
        { id: 'GAGARAWA TASHA', ward: 'GAGARAWA TASHA' },
        { id: 'GARIN CHIROMA', ward: 'GARIN CHIROMA' },
        { id: 'KORE BALATU', ward: 'KORE BALATU' },
        { id: 'MADAKA', ward: 'MADAKA' },
        { id: 'MAIADUWA', ward: 'MAIADUWA' },
        { id: 'MAIKILILI', ward: 'MAIKILILI' },
        { id: 'MEDU', ward: 'MEDU' },
        { id: 'YALAWA', ward: 'YALAWA' },
        { id: 'ZARADA', ward: 'ZARADA' },
        { id: 'BAIKARYA', ward: 'BAIKARYA' },
        { id: 'DANAMA', ward: 'DANAMA' },
        { id: 'DANTANOMA', ward: 'DANTANOMA' },
        { id: 'GALAGAMMA', ward: 'GALAGAMMA' },
        { id: 'GARIN GAMBO', ward: 'GARIN GAMBO' },
        { id: 'GARIN ALHAJI BARKA', ward: 'GARIN ALHAJI BARKA' },
        { id: 'GUSAU', ward: 'GUSAU' },
        { id: 'HAMMADO', ward: 'HAMMADO' },
        { id: 'KOFAR AREWA', ward: 'KOFAR AREWA' },
        { id: 'KOFAR YAMMA', ward: 'KOFAR YAMMA' },
        { id: 'ZANGO', ward: 'ZANGO' },
        { id: 'ABUNABO', ward: 'ABUNABO' },
        { id: 'ADIYANI', ward: 'ADIYANI' },
        { id: 'DAWA', ward: 'DAWA' },
        { id: 'GARBAGAL', ward: 'GARBAGAL' },
        { id: 'GURI', ward: 'GURI' },
        { id: 'KADIRA', ward: 'KADIRA' },
        { id: 'LAFIYA', ward: 'LAFIYA' },
        { id: 'MARGADU', ward: 'MARGADU' },
        { id: 'MATARA BABA', ward: 'MATARA BABA' },
        { id: 'MUSARI', ward: 'MUSARI' },
        { id: 'BASIRKA', ward: 'BASIRKA' },
        { id: 'DINGAYA', ward: 'DINGAYA' },
        { id: 'FAGAM', ward: 'FAGAM' },
        { id: 'FARIN DUTSE', ward: 'FARIN DUTSE' },
        { id: 'GWARAM TSOHUWA', ward: 'GWARAM TSOHUWA' },
        { id: 'BUNTUSU', ward: 'BUNTUSU' },
        { id: 'DABI', ward: 'DABI' },
        { id: 'DARINA', ward: 'DARINA' },
        { id: 'F/YAMMA', ward: 'F/YAMMA' },
        { id: 'GUNTAI', ward: 'GUNTAI' },
        { id: 'GWIWA', ward: 'GWIWA' },
        { id: 'KORAYEL', ward: 'KORAYEL' },
        { id: 'RORAU', ward: 'RORAU' },
        { id: 'SHAFE', ward: 'SHAFE' },
        { id: 'YOLA', ward: 'YOLA' },
        { id: 'ZAUMAR SAINAWA', ward: 'ZAUMAR SAINAWA' },
        // HADEJIA Wards
  { id: 'ATAFI', ward: 'ATAFI' },
  { id: 'DUBANTU', ward: 'DUBANTU' },
  { id: 'GAGULMARI', ward: 'GAGULMARI' },
  { id: 'KASUWAR KUDA', ward: 'KASUWAR KUDA' },
  { id: 'KASUWAR KOFA', ward: 'KASUWAR KOFA' },
  { id: 'MAJEMA', ward: 'MAJEMA' },
  { id: 'MATSARO', ward: 'MATSARO' },
  { id: 'RUMFA', ward: 'RUMFA' },
  { id: 'SABON GARU', ward: 'SABON GARU' },
  { id: 'YANKOLI', ward: 'YANKOLI' },
  { id: 'YAYARI', ward: 'YAYARI' },

  // JAHUN Wards
  { id: 'AUJARA', ward: 'AUJARA' },
  { id: 'GANGAWA', ward: 'GANGAWA' },
  { id: 'GAUZA TAZARA', ward: 'GAUZA TAZARA' },
  { id: 'GUNKA', ward: 'GUNKA' },
  { id: 'HARBO SABUWA', ward: 'HARBO SABUWA' },
  { id: 'HARBO TSOHUWA', ward: 'HARBO TSOHUWA' },
  { id: 'IDANDUNA', ward: 'IDANDUNA' },
  { id: 'JABARNA', ward: 'JABARNA' },
  { id: 'JAHUN', ward: 'JAHUN' },
  { id: 'KALE', ward: 'KALE' },
  { id: 'KANWA', ward: 'KANWA' },

  // KAFIN HAUSA Wards
  { id: 'BALANGU', ward: 'BALANGU' },
  { id: 'DUMADUMIN TOKA', ward: 'DUMADUMIN TOKA' },
  { id: 'GAFAYA', ward: 'GAFAYA' },
  { id: 'JABO', ward: 'JABO' },
  { id: 'KAFIN HAUSA', ward: 'KAFIN HAUSA' },
  { id: 'KAZALEWA', ward: 'KAZALEWA' },
  { id: 'MAJAWA', ward: 'MAJAWA' },
  { id: 'MEZAN', ward: 'MEZAN' },
  { id: 'RUBA', ward: 'RUBA' },
  { id: 'SARAWA', ward: 'SARAWA' },
  { id: 'ZAGO', ward: 'ZAGO' },

  // KAUGAMA Wards
  { id: 'ARBUS', ward: 'ARBUS' },
  { id: 'ASKANDU', ward: 'ASKANDU' },
  { id: 'DABUWARAN', ward: 'DABUWARAN' },
  { id: 'DAKAIYAWA', ward: 'DAKAIYAWA' },
  { id: 'HADIN', ward: 'HADIN' },
  { id: 'JA\'E', ward: 'JA\'E' },
  { id: 'JARKASA', ward: 'JARKASA' },
  { id: 'KAUGAMA', ward: 'KAUGAMA' },
  { id: 'MARKE', ward: 'MARKE' },
  { id: 'UNGUWAR JIBRIN', ward: 'UNGUWAR JIBRIN' },
  { id: 'YALO', ward: 'YALO' },

  // KAZAURE Wards
  { id: 'BA\'AUZINI', ward: 'BA\'AUZINI' },
  { id: 'DABA', ward: 'DABA' },
  { id: 'DABAZA', ward: 'DABAZA' },
  { id: 'DANDI', ward: 'DANDI' },
  { id: 'GADA', ward: 'GADA' },
  { id: 'KANTI', ward: 'KANTI' },
  { id: 'MARADAWA', ward: 'MARADAWA' },
  { id: 'SABARU', ward: 'SABARU' },
  { id: 'UNGUWAR AREWA', ward: 'UNGUWAR AREWA' },
  { id: 'UNGUWAR GABAS', ward: 'UNGUWAR GABAS' },
  { id: 'UNGUWAR YAMMA', ward: 'UNGUWAR YAMMA' },

  // KIRIKA SAMMA Wards
  { id: 'BATURIYA', ward: 'BATURIYA' },
  { id: 'BULUNCHAI', ward: 'BULUNCHAI' },
  { id: 'DOLERI', ward: 'DOLERI' },
  { id: 'FANDUM', ward: 'FANDUM' },
  { id: 'GAYIN', ward: 'GAYIN' },
  { id: 'KIRIKA SAMMA', ward: 'KIRIKA SAMMA' },
  { id: 'MADACHI', ward: 'MADACHI' },
  { id: 'MARMA', ward: 'MARMA' },
  { id: 'TSHEGUWA', ward: 'TSHEGUWA' },
  { id: 'TARABU', ward: 'TARABU' },

  // KIYAWA Wards
  { id: 'ABALAGO', ward: 'ABALAGO' },
  { id: 'ANDAZA', ward: 'ANDAZA' },
  { id: 'FAKI', ward: 'FAKI' },
  { id: 'GARKO', ward: 'GARKO' },
  { id: 'GURUDUBA', ward: 'GURUDUBA' },
  { id: 'KATANGA', ward: 'KATANGA' },
  { id: 'KATUKA', ward: 'KATUKA' },
  { id: 'KIYAWA', ward: 'KIYAWA' },
  { id: 'KWANDA', ward: 'KWANDA' },
  { id: 'MAJE', ward: 'MAJE' },
  { id: 'TSURMA', ward: 'TSURMA' },

  // MAIGATARI Wards
  { id: 'BALARABE', ward: 'BALARABE' },
  { id: 'DANKUMBO', ward: 'DANKUMBO' },
  { id: 'FULATA', ward: 'FULATA' },
  { id: 'GALADI', ward: 'GALADI' },
  { id: 'JAJERI', ward: 'JAJERI' },
  { id: 'KUKAYASKU', ward: 'KUKAYASKU' },
  { id: 'MADANA', ward: 'MADANA' },
  { id: 'MAIGATARI AREWA', ward: 'MAIGATARI AREWA' },
  { id: 'MAIGATARI KUDU', ward: 'MAIGATARI KUDU' },
  { id: 'MATOYA', ward: 'MATOYA' },
  { id: 'TURBUS', ward: 'TURBUS' },

  // MALAM MADORI Wards
  { id: 'ARKI', ward: 'ARKI' },
  { id: 'DUNARI', ward: 'DUNARI' },
  { id: 'FATEKA AKURYA', ward: 'FATEKA AKURYA' },
  { id: 'GARIN GABAS', ward: 'GARIN GABAS' },
  { id: 'MAIRA KUMI-BARA MUSA', ward: 'MAIRA KUMI-BARA MUSA' },
  { id: 'MAKA DDARI', ward: 'MAKA DDARI' },
  { id: 'MALAM MADORI', ward: 'MALAM MADORI' },
  { id: 'SHAIYA', ward: 'SHAIYA' },
  { id: 'TAGWARO', ward: 'TAGWARO' },
  { id: 'TASHENA', ward: 'TASHENA' },
  { id: 'TONIKUTARA', ward: 'TONIKUTARA' },

  // MIGA Wards
  { id: 'DANGYATIN', ward: 'DANGYATIN' },
  { id: 'GARBO', ward: 'GARBO' },
  { id: 'HANTSU', ward: 'HANTSU' },
  { id: 'KOYA', ward: 'KOYA' },
  { id: 'MIGA', ward: 'MIGA' },
  { id: 'SABON GARI TAKANEBU', ward: 'SABON GARI TAKANEBU' },
  { id: 'SANSANI', ward: 'SANSANI' },
  { id: 'TSAKUWAWA', ward: 'TSAKUWAWA' },
  { id: 'YANDUNA', ward: 'YANDUNA' },
  { id: 'ZAREKU', ward: 'ZAREKU' },

  // RINGIM Wards
  { id: 'CHAI-CHAI', ward: 'CHAI-CHAI' },
  { id: 'DABI', ward: 'DABI' },
  { id: 'KAFIN BABUSHE', ward: 'KAFIN BABUSHE' },
  { id: 'KARSHI', ward: 'KARSHI' },
  { id: 'KYARAMA', ward: 'KYARAMA' },
  { id: 'RINGIM', ward: 'RINGIM' },
  { id: 'SANKARA', ward: 'SANKARA' },
  { id: 'SINTILMAWA', ward: 'SINTILMAWA' },
  { id: 'TOFA', ward: 'TOFA' },
  { id: 'YANDUTSE', ward: 'YANDUTSE' },

  // RONI Wards
  { id: 'AMARYAWA', ward: 'AMARYAWA' },
  { id: 'BARAGUMI', ward: 'BARAGUMI' },
  { id: 'DANSURE', ward: 'DANSURE' },
  { id: 'FARA', ward: 'FARA' },
  { id: 'GORA', ward: 'GORA' },
  { id: 'KWAITA', ward: 'KWAITA' },
  { id: 'RONI', ward: 'RONI' },
  { id: 'SANKAU', ward: 'SANKAU' },
  { id: 'TUNAS', ward: 'TUNAS' },
  { id: 'YANZAKI', ward: 'YANZAKI' },
  { id: 'ZUGAI', ward: 'ZUGAI' },

  // SULE-TANKARKAR Wards
  { id: 'ALBASU', ward: 'ALBASU' },
  { id: 'AMANGA', ward: 'AMANGA' },
  { id: 'DANGWANKI', ward: 'DANGWANKI' },
  { id: 'DANLADI', ward: 'DANLADI' },
  { id: 'DANZOMO', ward: 'DANZOMO' },
  { id: 'JEKE', ward: 'JEKE' },
  { id: 'SHABARU', ward: 'SHABARU' },
  { id: 'SULE-TANKARKAR', ward: 'SULE-TANKARKAR' },
  { id: 'TAKATSABA', ward: 'TAKATSABA' },
  { id: 'YANDAMO', ward: 'YANDAMO' },

  // TAURA Wards
  { id: 'AJAURA', ward: 'AJAURA' },
  { id: 'CHAKWAIKWAIWA', ward: 'CHAKWAIKWAIWA' },
  { id: 'CHUKUTO', ward: 'CHUKUTO' },
  { id: 'GUJUNGU', ward: 'GUJUNGU' },
  { id: 'KIRI', ward: 'KIRI' },
  { id: 'KWALAM', ward: 'KWALAM' },
  { id: 'MAJE', ward: 'MAJE' },
  { id: 'MAJIYA', ward: 'MAJIYA' },
  { id: 'S/GARIN YAYA', ward: 'S/GARIN YAYA' },
  { id: 'TAURA', ward: 'TAURA' },

  // YANKWASHI Wards
  { id: 'ACHILAFIYA', ward: 'ACHILAFIYA' },
  { id: 'BELAS', ward: 'BELAS' },
  { id: 'DAWAN-GAWO', ward: 'DAWAN-GAWO' },
  { id: 'GWARTA', ward: 'GWARTA' },
  { id: 'GURJIYA', ward: 'GURJIYA' },
  { id: 'KARKARNA', ward: 'KARKARNA' },
  { id: 'KUDA', ward: 'KUDA' },
  { id: 'RINGIM', ward: 'RINGIM' },
  { id: 'YANKWASHI', ward: 'YANKWASHI' },
  { id: 'ZUNGUMBA', ward: 'ZUNGUMBA' }

    ];


   



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

    };

// useEffect(() => {
//     try {
//         let response = axios.get('https://api.scan-verify.com/api/sendSms');

//         console.log("sms",response.data)
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//         return [];
//       }
// }, []);

useEffect(() => {

        if(formData?.customer_type?.name == customerType[1]?.name){
            setIsEmploy(true);
        }else{
            setIsEmploy(false);
        }
}, [formData.customer_type]);

    const handleInputChange = (field,value) => {
        
        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

useEffect(() => {
    setIsEmploy(true)
    setFormData((prevState) => ({
        ...prevState,   
        customer_type: customerType[0]
    }))
},[]);

useEffect(() => {
    
    if (formData?.psn?.length == 6) {
    
        verifyPSN()
    
    }
    
}, [formData.psn]);

// useEffect(() => {
//     if (formData?.agent_id?.length == 10 || formData?.agent_id?.length == 11 ) {
//         verifyAgent();
//     }
// }, [formData.agent_id]);

useEffect(() => {
    if (formData?.moniepoint_account?.length == 10) {
        verifyMoniepointAccount();
    }
}, [formData.moniepoint_account]);


    const fetchStates = async () => {
        try {
            const response = await axios.get('https://nga-states-lga.onrender.com/?state=Jigawa');
            return response.data.lga;
        } catch (error) {
            return [];
        }
    };





            const toast = useRef(null);

            const showSuccess = (severity,summary,message) => {
                toast.current.show({severity:severity, summary: summary, detail:message, life: 10000});
            }
            const accept = () => {
                if (toast.current) {
                    handleSubmit();
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

            const handleSubmit = async () => {
             
            
                const form = new FormData();
                // let errorMessages = {};
            
                // // Validate formData fields
                // if (!formData.psn || formData.psn.trim() === '') {
                //     errorMessages.psn = 'PSN is required';
                // }
            
                // if (!formData.lga || !formData.lga.name) {
                //     errorMessages.lga = 'LGA is required';
                // }
            
                // if (!formData.ward || !formData.ward.ward) {
                //     errorMessages.ward = 'Ward is required';
                // }
            
                // if (!formData.contact || formData.contact.trim() === '') {
                //     errorMessages.contact = 'Contact is required';
                // } else if (formData.contact.length > 11) {
                //     errorMessages.contact = 'Contact must be 11 digits or less';
                // }
            
                // if (!formData.card_id || formData.card_id.trim() === '') {
                //     errorMessages.card_id = 'Card ID is required';
                // }
            
                // // Check if there are any error messages
                // if (Object.keys(errorMessages).length > 0) {
                //     console.log(errorMessages);
                //     setErrorMessages(errorMessages);
                //     return; // Stop the submission if there are validation errors
                // }
            
                // Append each field from formData to the FormData object
                form.append('psn', formData.psn);
                form.append('lga', formData?.lga?.name);
                form.append('address', formData?.address);
                form.append('ward', formData?.ward?.ward);
                form.append('contact', formData?.contact || undefined);
                form.append('card_id', formData?.card_id);
            
                setProcessing(true);
                try {
                    const response = await axios.post('https://api.scan-verify.com/api/apply-card', form, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
            
                    setProcessing(false);
                    if (response.data.success === true) {
                 
                        setFormData([]); // Reset form data after successful submission
                        setVisible(false);
                        showSuccess('success', "Customer", response.data.message);
                    } else {
                        showSuccess('error', "Customer", response.data.message);
                    }
                } catch (error) {
                    setProcessing(false);
                    showSuccess('error', "Shop", error?.request?.response);
                    console.error('Error adding product:', error?.request?.response);
                }
            };
            

    const handleUpdateAccount = async () => {
      

        const form = new FormData();
       
        let errorMessages = {};

        if(!formData.psn || formData.psn.trim() === ''){
            errorMessages.psn = 'PSN is required';
        }

        if(!formData.moniepoint_account || formData.moniepoint_account.trim() === ''){
            errorMessages.moniepoint_account = 'Moniepoint account is required';
        }

        if(Object.keys(errorMessages).length > 0){
            showSuccess('error',"Empty",errorMessages.psn)
            showSuccess('error',"Empty",errorMessages.moniepoint_account)
            setErrorMessages(errorMessages);
            return;
        }

        
        // Append each field from formData to the FormData object
        form.append('psn', formData.psn);
        form.append('moniepoint_account', formData.moniepoint_account);

        setProcessing(true);
        try {
            const response = await axios.post('https://api.scan-verify.com/api/customer/update-account',form, {
                headers: {
                   'Content-Type': 'multipart/form-data'
                }
            });

            setProcessing(false);
            if(response.data.success === true){

                // setFormData([]);
                showSuccess('success',"Customer",response.data.message)

            }else{
                showSuccess('error',"Customer",response.data.message)
            }
        } catch (error) {
            setProcessing(false);
            showSuccess('error',"Shop",error?.request?.response)
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


    const verifyPSN = async () => {
        // setProcessing(true); // Start processing

        try {
            // Make the GET request to verify the sale
            const response = await axios.get(`https://api.scan-verify.com/api/customer/verify/${formData.psn}?q=1`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Handle the successful response here
            if (response.data.success == true) {

                console.log('Error', response.data.message)
                showSuccess('success', 'PSN Verify', response?.data?.message);
                setData(response.data?.customer)
                console.log(data);

                    setFormData((prevState) => ({
                        ...prevState,
                        full_name: response.data?.psn?.staff_name,
                    }));

            } else {
                setNotFound(true)
                // showSuccess('error', 'PSN Verify', "PSN Not found");
                showSuccess('error', 'PSN Verify', response.data.message);
            }

        } catch (error) {
            // Handle errors and display a relevant message
            console.error('Error PSN Verify:', error);
            showSuccess('error', 'PSN Verify', error.response);
        } finally {
            // Ensure processing is stopped regardless of the outcome
            setProcessing(false);
        }
    };
    const handleAppTypeChange = (e) => {
        const { value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            app_type: value
        }));

    };

    useEffect(() => {

        setVisible(true)
        setStatus(formData?.app_type?.id)
      
    }, [formData?.app_type, status]);
    


    const verifyMoniepointAccount = async () => {
 
        try {
            // Send the GET request to Paystack
            const response = await fetch(`https://api.paystack.co/bank/resolve?account_number=${formData.moniepoint_account}&bank_code=50515`, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_Bank_API_KEY}`,
                },
                timeout: 30000  // Timeout in milliseconds    
            });
            const data = await response.json();
            
            // Ensure content has the 'data' key and that the request was successful
            if (data.status === true && data.data.account_name) {
                console.log('Success account resolve:', data);
                // Extract the name safely
                const nameParts = data.data.account_name.split(' ');

                // alert(`nameParts: ${nameParts}`);

                let fName = '';
                let lName = '';
                // alert(`nameParts: ${nameParts}`);
                if(nameParts.length > 2) {
                    fName = nameParts[0] + ' ' + nameParts[1];
                    lName = nameParts[2];
                    // alert(`fName: ${fName}, lName: ${lName}`);
                } else {
                    fName = nameParts[0];
                    lName = nameParts[1];
                    // alert(`fName: ${fName}, lName: ${lName}`);
                }
                
                
                const fullNameArray = formData.full_name.toLowerCase().split(' ');
                if(fullNameArray == '') {
                    showSuccess('error', 'Account Verification', 'PSN must be verified, then name retrieve');
                }
                const isMatch = fullNameArray.some((name) => {
                    const foundName = name.length > 2 ? name.substring(0, 3) : name;
                    return [fName, lName].some((n) => n.toLowerCase().includes(foundName));
                });
                if(isMatch) {
                    showSuccess('success', 'Moniepoint Account Verification', `Name  matched ${fName} ${lName}`);
                   setAccountMatched(true)
                    return `${fName} ${lName}`;
                } else {

                    // alert(`fName: ${fName}, lName: ${lName}`);
                    showSuccess('error', 'Moniepoint Account Verification', `Name doesn't matched  ${formData?.full_name}`);
                    setAccountMatched(true)
                    return null;
                }
            } else {
                showSuccess('error', 'Account Verification', 'This account is not Valid Moniepoint Account');
                return null;  // Fallback in case no valid name is found
            }
        } catch (error) {
            // Handle the exception
            if (error.response) {
                const { status, data } = error.response;
                // You could log the error or return a message if needed
                // console.error(`HTTP Error ${status}: ${data}`);
            } else {
                // console.error("Request failed:", error.message);
            }
            return null;  // Return empty string on error
        }
    }

    const footer = <Button label="Close" className="p-button-raised p-button-success" onClick={() => setVisible(false)} />;

    return (


<div className="container w-full my-5 mb-5 rounded-2xl mx-auto ">

<Helmet>
        <title>Apply Card | Jigawa Palliative Form</title>
        <meta name="address" content="Palliative by Jigawa State Gov't by Danmodi." />

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
{preloading && (<Preloader />)}
        <div className=" justify-content-center">

            <div className="mx-auto md:w-1/2 sm:max-w-max-[50%] h-full bg-white px-3.5 py-2.5 rounded-md justify-between ">
            <Toast ref={toast} />

            <div className="bg-gradient-to-r  from-green-400 to-green-500 px-2 rounded-2xl mx-auto mb-5">
              <Banner /> 
            </div>
            {/* <div className="bg-gradient-to-r from-green-400 to-green-500 p-5 rounded-2xl mx-auto mb-5">
                <h1 className=" font-bold text-2xl text-center mx-auto place-self-center mt-5 text-white">Jigawa State Palliative Shop Application Form</h1>
                <h5 className="text-1xl place-self-center my-2 text-white mx-auto text-center mb-5">Initiated by Gov. Umar Namadi Danmodi</h5>
            </div> */}


<div className="mx-auto w-full h-full bg-white p-3 rounded-md justify-between ">

<ConfirmDialog
             visible={visibleConfirm}
             message =  'I confirmed that my Moniepoint Account has been credited with ₦1000'
             header = 'Confirmation'
             icon = 'pi pi-trash'
             onHide={() => setVisibleConfirm(false)}
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
            <Toast ref={toast} />
            <Modal
                visible={visible}
                setVisible={setVisible}
                title="Announcement"
                footer={footer}
                >
                    <p className="text-center text-sm font-light">
                        <span className="font-bold text-red-500">Disclaimer:</span> Jigawa State Palliative Project Registration
                        <br />
                        The Jigawa State Government and Bizi Mobile Cashless Consultant Ltd. strictly prohibit any agent from collecting registration fees for the Palliative Project. Registration is free. Beneficiaries can only deposit ₦1000 into their Moniepoint account for ATM card activation. Report any unauthorized fee demands immediately.
                    </p>
                </Modal>
           
            <form>

                <div className="card justify-content-center w-full h-auto">
                 
                            <div className=" h-auto">
                                <div className="border-2 border-dashed surface-border border-round px-4 py-6 w-full surface-ground  justify-content-center align-items-center font-medium">

                         
                             
                                    <>
                                     <label  className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                                        Personal Service Number (PSN)
                                    </label>
                                        <input
                                            id="psn"
                                            type="text"
                                            name="psn"
                                            minLength={1}
                                            maxLength={6}
                                            required={true}
                                            placeholder="PSN Number"
                                            value={formData?.psn}
                                            onChange={(e)=>{handleInputChange('psn',e.target.value)}}
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-white  text-base font-medium font-bold text-[#e40808] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />

                                             {errorMessages?.psn && <span className="text-sm text-red-500">{errorMessages?.psn}</span>}

                                        <div className="flex flex-row w-1/2 h-auto py-2 my-2 border border-2 border-green-500">                                    
                                            <Image src={data?.passport} zoomSrc={data?.passport}  alt="Image" width="100" height="100" preview />
                                        </div>

                                    </>

                                 

                                    <>
                                     <label  className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                                        Full Name
                                    </label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            name="full_name"
                                            value={data?.full_name}
                                            disabled={true}
                                            placeholder="Full Name"
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-gray-200 text-base font-medium font-bold text-[#07074D] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />
                                        
                                    </>
                                    <>
                                     <label  className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                                        MoniePoint Account
                                    </label>
                                        <input
                                            id="moniepoint_account"
                                            type="text"
                                            name="moniepoint_account"
                                            value={data?.moniepoint_account}
                                            disabled={true}
                                            placeholder="Moniepoint Account"
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-gray-200 text-base font-medium font-bold text-[#07074D] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />
                                    </>
                                    <>
                                     <label  className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                                        LGA
                                    </label>
                                        <input
                                            id="lga"
                                            type="text"
                                            name="lga"
                                            value={data?.lga}
                                            disabled={true}
                                            placeholder="LGA"
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-gray-200 text-base font-medium font-bold text-[#07074D] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />
                                   
                                    </>

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
                                    {errorMessages?.address && <span className="text-sm text-red-500">{errorMessages?.address}</span>}
                                    </div>


                                    <>

                                    <label htmlFor="contact" className="mb-3 block text-base font-bold text-[#07074D]">
                                            Contact
                                    </label>
                                    <input
                                            id="psn"
                                            type="text"
                                            name="psn"
                                            placeholder="Phone Number"
                                            value={formData.contact}
                                            onChange={(e) => handleInputChange('contact', e.target.value)}
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-white  text-base font-medium font-bold text-[#e40808] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />
                                          {errorMessages?.contact && (
                                            <span className="text-sm text-red-500">{errorMessages.contact}</span>
                                        )}

                                     
                                        {/* <input
                                            id="contact"
                                            type="text"
                                            name="contact"
                                            value={data.contact || ''}
                                            onChange={(e) => handleInputChange('contact', e.target.value)}
                                            placeholder="Phone Number"
                                            className="rounded-md py-3 px-5 border w-full border-green-500 text-base font-medium font-bold text-[#07074D] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        /> */}
                                      
                                    </>

                                  

                                    <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                            Select LGA
                                    </label>
                                    <div className="card flex justify-content-center w-full  my-3">
                                            <Dropdown filter={true} placeholder='Selec t LGA'  inputId="dd-state" value={formData.lga} optionLabel='name' onChange={(e)=> {handleInputChange('lga',e.target.value) }} options={selectedLga}  className="w-full text-green-500 border border-green-500 px-4 py-2" />
                                            {errorMessages?.lga && <span className="text-sm text-red-500">{errorMessages?.lga}</span>}
                                    </div>
                                       


                                <label htmlFor="cat" className="my-3 block font-bold text-base font-medium text-[#07074D]">
                                        Select Ward (Polling Units)
                                </label>
                                <div className="card flex justify-content-center w-full  my-3">
                                        <Dropdown filter={true}       required={true} inputId="dd-state" value={formData.ward} placeholder='Select Ward' onChange={(e)=> {handleInputChange('ward',e.target.value) }} options={wardsData} optionLabel='ward'  className="w-full text-green-500 border border-green-500 px-4 py-2" />
                                </div>



                                    <div className='flex flex-wrap'>                                 
                                            <button
                                            type="button" 
                                            onClick={()=>{setVisibleConfirm(true)}}
                                            disabled={processing}
                                            className={`hover:shadow-form flex flex-row   w-full items-center justify-content-center py-3 px-4 text-center text-base font-semibold outline-none ${processing ? 'bg-green-300' : 'bg-green-500'}`}
                                            >
                                                {processing && (
                                                    <div className="items-center">
                                                        <ProgressSpinner style={{ width: '30px', height: '30px', color: 'red' }} strokeWidth="6" fill="none" animationDuration=".2s" />
                                                    </div>
                                                )}
                                                <div className=" flex flex-row gap-x-3 items-center justify-center text-white">
                                                    <FaSave className='font-bold' />
                                                    <span className='font-bold'>Apply</span>
                                                </div>
                                        </button>
                                    
                               
                                    </div>

                                {/* End of the Form */}

                                </div>
                            </div>
                                     
                </div>




                </form>
                </div>
            </div>
        </div>

</div>
    );
}

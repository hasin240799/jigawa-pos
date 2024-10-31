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
import { FaThumbsUp } from 'react-icons/fa';


export default function CardActivation({ auth }) {
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

  
    const [formData, setFormData] = useState({
        psn: '',
        card_id:'',
    });




    const handleInputChange = (field,value) => {

        setFormData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };



useEffect(() => {
    if (formData?.psn?.length == 6) {
       verifyPSN()
    }
    
}, [formData.psn]);

useEffect(() => {
    if (formData?.agent_id?.length == 10 || formData?.agent_id?.length == 11 ) {
        verifyAgent();
    }
}, [formData.agent_id]);




    const fetchStates = async () => {
        try {
            const response = await axios.get('https://nga-states-lga.onrender.com/?state=Jigawa');
            return response.data.lga;
        } catch (error) {
            return [];
        }
    };




      /**
     * Handles exporting the loans data to an Excel file
     */
    const handleExport = () => {
        // Extract the relevant fields from the loans data
        const dataToExport = customer.map(data => ({
            "ID": data.id,
            "Created By": data.create_by_id,
            "Full Name": data.full_name,
            "Address": data.address,
            "Contact": data.contact,
            "Customer Type": data.customer_type,
            "PSN": data.psn,
            "BVN": data.bvn,
            "Email": data.email,
            "MDA": data.mda,
            "Rank": data.rank,
            "Level": data.level,
            "Date of Birth": data.dob,
            "Gender": data.gender,
            "Passport": data.passport,
            "Bizipay Account": data.bizipay_account,
            "Salary Account": data.salary_account,
            "Salary Bank": data.salary_bank,
            "Created At": data.created_at,
            "Updated At": data.updated_at,
            "Ward": data.ward,
            "Town": data.town,
            "NIN": data.nin,
            "LGA": data.lga,
            "Net Salary": data.net_salary,
            "Agent ID": data.agent_id,
            "Bizi Name": data.bizi_name
           
        })); 
 
        // Create a new workbook and add a worksheet
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Loans"); 


        // Generate Excel file and download it
        XLSX.writeFile(wb, `Customers.xlsx`);
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
        form.append('psn', formData?.psn);    
        form.append('card_id', formData?.card_id);
 
       
      


        setProcessing(true);
        try {
            const response = await axios.post('https://api.scan-verify.com/api/card-requests',form, {
                headers: {
                   'Content-Type': 'multipart/form-data'
                }
            });
            

            setProcessing(false);
            if(response.data.success === true){

                
                fetchUsers();
                setFormData([]);
                setVisible(false);
                showSuccess('success',"Customer",response.data.message)
            }else{
                showSuccess('error',"Customer",response.data.message)
            }
        } catch (error) {
            setProcessing(false);
            showSuccess('error',"Shop",error?.request?.response)
            console.error('Error adding product:', error?.request?.response);
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

    const verifyAgent = async () => {
        setProcessing(true); // Start processing
        
        try {
            // Make the GET request to verify the sale
            const response = await fetch(`https://app.jigawapalliative.com.ng/api/bizi-agent?bizi_code=${formData.agent_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_AGENT_API_KEY}`
                }
            });
         
            const data = await response.json();
            // Handle the successful response here
            if (data.success == true) {

                console.log('Error', data.message)
                
                if(data.agent.agent_id === formData.agent_id) {
                    setAgentFound(true)
                    showSuccess('success', 'Agent Verify', "Agent Code is valid");
                }else{
                    showSuccess('error', 'Agent Verify', "Agent ID does not match");
                    setAgentFound(false)
                }
                   

            } else {
                setNotFound(true)
                showSuccess('error', 'Agent Verify', data.message);
            }

        } catch (error) {
            // Handle errors and display a relevant message
            console.error('Error Agent Verify:', error);
            showSuccess('error', 'Agent Verify', error.message);
        } finally {
            // Ensure processing is stopped regardless of the outcome
            setProcessing(false);
        }
    };

    useEffect(() => {
        if (formData?.moniepoint_account?.length == 10) {
            verifyMoniepointAccount();
        }
    }, [formData.moniepoint_account]);

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

     const  fetchUsers  = async ()=>{
        try {
            const response = await axios.get('https://api.scan-verify.com/api/fetch/card-requests', {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        
            
            setCustomersData(response.data)
            console.log(response.data)
       

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

                
    //             setCustomer(response.data.customer)

    //             // console.log(customers)

    //     } catch (error) {
    //         console.error('Error adding product:', error);
    //     }
    //  }

    useEffect(() => {

        fetchUsers();
    }, []);

    const ImageBody = (rowData) => {
        return (

            <Image src={rowData.image} zoomSrc={rowData.image}  alt="Image" width="40" height="30" preview />

        );
    };



    const STATUS_PENDING = 'PENDING';
    const STATUS_APPROVED = 'APPROVED';
    const STATUS_DECLINED = 'DECLINED';

    const getSeverity = (status) => {
        switch (status) {
            case STATUS_PENDING:
                return 'warning';

            case STATUS_APPROVED:
                return 'success';

            case STATUS_DECLINED:
                return 'danger';

            default:
                return null;
        }
    };



    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.card_status.charAt(0).toUpperCase() + rowData.card_status.slice(1)} className='px-4 py-2' severity={getSeverity(rowData.card_status)}></Tag>;
    };


const PhotoBody = (rowData) => {
    return (

        <Image src={rowData.customer.passport} zoomSrc={rowData.customer.passport}  alt="Image" width="40" height="30" preview />

    );
};


    const header = (
        <div className="flex items-center justify-items-center mx-auto my-auto justify-end pl-3">
          <h2 className="text-2xl text-dark font-bold mb-4"></h2>

          <span className="">

          {/* <Button type="button" icon="pi pi-file-excel text-green-500 text-2xl" severity="warning" rounded onClick={handleExport} data-pr-tooltip="PDF">Download Customers</Button> */}
             
             <button
                onClick={()=>{!visible && setVisible(true)}}
               className='border sm:w-[80%] md:w-[80%]  from-green-400 to-green-300 bg-green-500  text-white px-4 py-2  rounded-md shadow-md '>
                <div className='flex flex-row gap-x-2 items-center justify-center my-auto mx-auto'>
                        <span><i className=" pi pi-user-plus"></i></span>
                        <span><b>Activate</b></span>
                </div>
             </button>
          </span>

          <span className="p-input-icon-left mx-auto">
            <InputText
              type="search"
              className='sm:w-[60%] md:w-[60%] h-5 m-3 border border-green-500 py-3 px-2'
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
        <title>Card Activation</title>
        <meta name="address" content="Learn more about us on this page." />
        <meta name="keywords" content="about, my app" />
        <meta property="og:title" content="About Us - My App" />
        <meta property="og:address" content="Learn more about us on this page." />
</Helmet>

<Toast ref={toast} />
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

            {/* <ConfirmDialog
                visible={visibleConfirm}
                onHide={() => setVisibleConfirm(false)}
                message="Are you sure you want to activate this card?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={accept}
                reject={reject}
            /> */}

{preloading && (<Preloader />)}
        <div className="card flex justify-content-center">
            <Dialog modal={true}   header="Card Activation Form" visible={visible} className='sm:w-1/2 px-2 h-full' style={{ width:'50%',height:'60%'}} onHide={() => {if (!visible) return; setVisible(false); }}>

            <div className="mx-auto w-full h-full bg-white p-6 rounded-md justify-between ">
            <Toast ref={toast} />

           
            <form>

                <div className="card flex justify-content-center w-full h-auto">
                 
                            <div className="flex flex-row h-auto">
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
                                    <>
                                     <label  className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                                        Contact
                                    </label>
                                        <input
                                            id="contact"
                                            type="text"
                                            name="contact"
                                            value={data?.contact}
                                            onChange={(e)=>{handleInputChange('contact',e.target.value)}}
                                            placeholder="Contact"
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-gray-200 text-base font-medium font-bold text-[#07074D] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />
                                    </>

                                   
                                    <>
                                     <label  className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                                       Card ID
                                    </label>
                                        <input
                                            id="card_id"
                                            type="text"
                                            name="card_id"
                                            maxLength={5}
                                            minLength={1}                                            
                                            required={true}
                                            placeholder="Card ID"
                                            value={formData?.card_id}
                                            onChange={(e)=>{handleInputChange('card_id',e.target.value)}}
                                            className="rounded-md py-3 px-5 border w-full border-green-500 bg-white  text-base font-medium font-bold text-[#e40808] outline-none focus:border-[#6A64F1] focus:shadow-md"
                                        />

                                    </>
                                    
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
                                                    <FaThumbsUp className='font-bold' />
                                                    <span className='font-bold'> Activate</span>
                                                </div>
                                        </button>
                                    
                               
                                    </div>

                                {/* End of the Form */}

                                </div>
                            </div>
                                     
                </div>




                </form>
                </div>
            </Dialog>
        </div>


<h1 className='text-gray-700 font-bold text-2xl'>Card Activation</h1>

<DataTable
  value={customers}
  scrollable
  rowHover
  className=' my-5  '
  paginator rows={10}
   scrollHeight="500px"
  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  currentPageReportTemplate="{first} to {last} of {totalRecords}"
  tableStyle={{ minWidth: '70rem', height:"50%" }}
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
    field="customer.full_name"
    header="Full Name"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="customer.contact"
    header="Phone Number"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="customer.moniepoint_account"
    header="Moniepoint Account"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />

<Column
    field="user.name"
    header="Activated by"
    sortable
    filter
    filterPlaceholder="Search by Product Name"
  />





 <Column
    body={statusBodyTemplate}
    header="Card Status"
    style={{width:'auto'}}
    sortable
  />

  <Column
    body={PhotoBody}
    header="Passport"

  />


  {/* <Column header="Actions" body={actionButtonTemplate} /> */}

</DataTable>
</div>
    );
}

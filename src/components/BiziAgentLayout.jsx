
import { PanelMenu } from 'primereact/panelmenu';
import React, { useState, useRef,useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { Ripple } from 'primereact/ripple';
import { StyleClass } from 'primereact/styleclass';
import { BiAnalyse, BiCameraMovie, BiListOl, BiMenu, BiTv } from 'react-icons/bi';
import { BiLayerPlus } from '@react-icons/all-files/bi/BiLayerPlus';
import { BiLayer } from 'react-icons/bi';
import '../../src/index.css'
import { Link } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
// import Header from './Header';
import { useLocation } from 'react-router-dom';
import Preloader from '../components/Preloader';
import { FaBars, FaMoneyBill, FaNetworkWired, FaRegistered } from "react-icons/fa";
import Logo from './Logo';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
const BiziAgentLayout = () => {

    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const [token,setToken]= useState('');
    const [role,setRole]= useState('');
    const [balance,setBalance]= useState(0.0);
    const [name,setName]= useState('');


    
    const handleFund =()=>{

        navigate('/user/fund-wallet');
    }

    useEffect(() => {
        const tokens = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');
        
        if (tokens !== null) {
                setToken(tokens);
        }else{
            setToken('')
        }

        if (userRole !== null) {
            setRole(userRole);
        }else{
            setRole('')
        }

        setLoading(true);
      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // Adjust the timeout as needed

      return () => clearTimeout(timer);
    }, [location]);

   

    useEffect(() => {
      const interval = setInterval(() => {
        const balanceFromStorage = localStorage.getItem('balance');
        if (balanceFromStorage) {
          const balance = parseFloat(balanceFromStorage);
          setBalance(balance);
        }

      }, 3000);
      return () => clearInterval(interval);
    }, []);
    
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const name = userData.name;
        setName(name);
      }
    }, []);





    const [visible, setVisible] = useState(false);
    const btnRef1 = useRef(null);
    const btnRef2 = useRef(null);
    const btnRef3 = useRef(null);
    const btnRef4 = useRef(null);
    const btnRef5 = useRef(null);
    const btnRef6 = useRef(null);

    const handleVisible= ()=>{
        if (!visible) {
            setVisible(true)
        }
    }


    const handleLogout = ()=>{
        localStorage.removeItem('token');
        window.location.reload();
    }



    return (
        <>

      {token? (
        <div className=' container-fluid w-full bg-green-600  py-4 justify-content-evenly sticky'>
                <div className=' grid grid-cols-4 ml-6 mr-6 gap-4 justify-between  text-white items-center'>
                    <div className='relative items-center'>
                        <button onClick={handleVisible} className=' rounded-lg outline-0 btn'><FaBars className=' w-9 h-9'/></button>
                        <span className="ml-4 inline-flex align-items-center gap-2">
                            <Logo/>
                        </span>
                    </div>
                    <span className=' px-6 py-2 font-bold font-sans rounded-md bg-white text-black border w-auto'>
                        Balance: ₦{
                            new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(balance)
                        }
                    </span>
                </div>
        </div>
      ):(
        <div className=' container-fluid w-full bg-green-600  py-2 justify-content-evenly sticky'>
                <div className=' grid grid-cols-4 ml-6 gap-4  text-white items-center'>
                    <span className="inline-flex align-items-center gap-2">
                    <Logo/>

                    </span>
                </div>
        </div>

      )}

        {loading && <Preloader/>} {/* Show Preloader while loading */}

        <Sidebar
        visible={visible}
        onHide={() => setVisible(false)}

        content={({ closeIconRef, hide }) => (
            <div className="min-h-screen flex relative lg:static surface-ground">
                <div id="app-sidebar-2" className="" style={{ width: '280px' }}>
                    <div className="flex flex-column h-full">
                        <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                            <span className="inline-flex align-items-center gap-2">
                                <Logo/>

                            </span>
                            <span>
                                <Button type="button" ref={closeIconRef} onClick={(e) => hide(e)} icon="pi pi-times" rounded outlined className="h-2rem w-2rem"></Button>
                            </span>
                        
                        </div>
                        <span className=' mx-auto font-bold text-black font-sans'>{name}</span>
                        <span className=' mx-auto mb-3 font-bold '>Bizipay Agent User</span>
                       {role !== 'bizi_agent_team' && (
                         <button onClick={handleFund} className='mx-auto items-center justify-items-center grid grid-cols-2 px-6 py-2 font-bold font-sans rounded-md bg-green-500 focus:ring-green-500 focus:bg-green-900 focus:ring-2 focus:ring-opacity-50 text-white border w-auto'>
                            <FaMoneyBill/> 
                            <span>Fund Wallet</span>
                         </button>
                       )

                       }
                        <div className="overflow-y-auto items-center">                       
                            <ul className="list-none p-3 m-0">
                                <li>
                                    <ul className="list-none p-0 m-0 overflow-hidden">
                                        <li>
                                            <Link
                                                to="/dashboard" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-home mr-2"></i>
                                                <span className="font-medium">Dashboard</span>
                                                <Ripple />
                                            </Link>
                                        </li>
                                       

                                      
                                        <li>
                                            <Link
                                                to="/apply-form" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className=" mr-2"><FaRegistered/></i>
                                                <span className="font-medium">Onbording Form </span>
                                                <Ripple />
                                            </Link>
                                        </li>
                                       


                                        <li>
                                            <Link
                                                to="/user/change-password" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-lock mr-2"></i>
                                                <span className="font-medium">Change Password </span>
                                                <Ripple />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="#" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-cog mr-2"></i>
                                                <span className="font-medium">Settings</span>
                                                <Ripple />
                                            </Link>
                                        </li>
                                        <li>
                                            <div
                                            onClick={handleLogout}

                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-sign-out mr-2"></i>
                                                <span className="font-medium">Logout</span>
                                                <Ripple />
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        {/* <div className="mt-auto">
                            <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                            <a v-ripple className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple">
                                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
                                <span className="font-bold">Amy Elsner</span>
                            </a>
                        </div> */}
                    </div>
                </div>
            </div>
        )}
    ></Sidebar>
    </>
    );
};

export default BiziAgentLayout;


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
import { FaBars, FaBroadcastTower, FaNetworkWired } from "react-icons/fa";
import Logo from './Logo';
import { Tag } from 'primereact/tag';

const BiziAdminLayout = () => {

    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [token,setToken]= useState('')

    useEffect(() => {
        const tokens = localStorage.getItem('token');

        if (tokens !== null) {
                setToken(tokens);
        }else{
            setToken('')
        }

        setLoading(true);
      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000); // Adjust the timeout as needed

      return () => clearTimeout(timer);
    }, [location]);

    function VscPackage(props) {
      return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 16 16" height="1em" width="1em" {...props}><path fillRule="evenodd" clipRule="evenodd" d="M8.61 3l5.74 1.53L15 5v6.74l-.37.48-6.13 1.69-6.14-1.69-.36-.48V5l.61-.47L8.34 3h.27zm-.09 1l-4 1 .55.2 3.43.9 3-.81.95-.29-3.93-1zM3 11.36l5 1.37V7L3 5.66v5.7zM9 7v5.73l5-1.37V5.63l-2.02.553V8.75l-1 .26V6.457L9 7z" /></svg>;
    }



function FaList(props) {
  return <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 512 512" height="1em" width="1em" {...props}><path d="M61.77 401l17.5-20.15a19.92 19.92 0 0 0 5.07-14.19v-3.31C84.34 356 80.5 352 73 352H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h22.83a157.41 157.41 0 0 0-11 12.31l-5.61 7c-4 5.07-5.25 10.13-2.8 14.88l1.05 1.93c3 5.76 6.29 7.88 12.25 7.88h4.73c10.33 0 15.94 2.44 15.94 9.09 0 4.72-4.2 8.22-14.36 8.22a41.54 41.54 0 0 1-15.47-3.12c-6.49-3.88-11.74-3.5-15.6 3.12l-5.59 9.31c-3.72 6.13-3.19 11.72 2.63 15.94 7.71 4.69 20.38 9.44 37 9.44 34.16 0 48.5-22.75 48.5-44.12-.03-14.38-9.12-29.76-28.73-34.88zM496 224H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16zm0 320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h64a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H64V40a8 8 0 0 0-8-8H32a8 8 0 0 0-7.14 4.42l-8 16A8 8 0 0 0 24 64h8v64H16a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8zm-3.91 160H80a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8H41.32c3.29-10.29 48.34-18.68 48.34-56.44 0-29.06-25-39.56-44.47-39.56-21.36 0-33.8 10-40.46 18.75-4.37 5.59-3 10.84 2.8 15.37l8.58 6.88c5.61 4.56 11 2.47 16.12-2.44a13.44 13.44 0 0 1 9.46-3.84c3.33 0 9.28 1.56 9.28 8.75C51 248.19 0 257.31 0 304.59v4C0 316 5.08 320 12.09 320z" /></svg>;
}


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
                <div className=' grid grid-cols-4 ml-6 gap-4  text-white items-center'>

                    <button onClick={handleVisible} className=' rounded-lg outline-0 btn'><FaBars className=' w-9 h-9'/></button>
                    <span className="inline-flex align-items-center gap-2">
                        <Logo/>
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
                        <div className="overflow-y-auto">
                        <span className=' mx-auto '>Bizipay Admin User</span>
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
                                            <StyleClass
                                                nodeRef={btnRef6}
                                                selector="@next"
                                                enterClassName="hidden"
                                                enterActiveClassName="slidedown"
                                                leaveToClassName="hidden"
                                                leaveActiveClassName="slideup"
                                            >
                                                <a ref={btnRef6} className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full">
                                                            <i className=" text-green-500  mr-2">< FaBroadcastTower/></i>
                                                            <span className="font-medium text-green-500">Live Shopping</span>
                                                            <i className="pi pi-chevron-down ml-auto mr-1"></i>
                                                            <Ripple />
                                                </a>

                                            </StyleClass>

                                            <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                                                <li>
                                                    <Link
                                                        to="/cctv/map" // Update the path as per your routing setup
                                                        className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                                    >
                                                        <i className="mr-2"><BiTv /></i>
                                                        <span className="font-medium">Shops CCTV/Map</span>
                                                        <Ripple />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/sales/realtime" // Update the path as per your routing setup
                                                        className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                                    >
                                                        <i className="mr-2"><BiAnalyse/></i>
                                                        <span className="font-medium">Realtime Sales</span>
                                                        <Ripple />
                                                    </Link>
                                                </li>

                                                <li>
                                                    <Link
                                                        to="/stocks/realtime" // Update the path as per your routing setup
                                                        className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                                    >
                                                        <i className="mr-2"><BiAnalyse/></i>
                                                        <span className="font-medium">Realtime Stocks</span>
                                                        <Ripple />
                                                    </Link>
                                                </li>


                                            </ul>
                                        </li>

                                        <li>
                                            <Link
                                                to="/product/list" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="mr-2"><BiListOl /></i>
                                                <span className="font-medium">Products list</span>
                                                <Ripple />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/sales/view" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="mr-2"><BiListOl /></i>
                                                <span className="font-medium">View Sales</span>
                                                <Ripple />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/stock/view" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="mr-2"><BiListOl /></i>
                                                <span className="font-medium">View Stocks</span>
                                                <Ripple />
                                            </Link>
                                        </li>


                                        <li>
                                            <Link
                                                to="/shop/purchase" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="mr-2"><BiListOl /></i>
                                                <span className="font-medium">Shop Purchase</span>
                                                <Ripple />
                                            </Link>
                                        </li>



                                        <li>
                                            <Link
                                                to="/bizi-users/add" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-users mr-2"></i>
                                                <span className="font-medium">Users </span>
                                                <Ripple />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/customer/add" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-users mr-2"></i>
                                                <span className="font-medium">Customers </span>
                                                <Ripple />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/shop/supply" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-shopping-bag mr-2"></i>
                                                <span className="font-medium">Shop Supply </span>
                                                <Ripple />
                                            </Link>
                                        </li>


                                        <li>
                                            <Link
                                                to="/store/supply" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-shopping-cart mr-2"></i>
                                                <span className="font-medium">Store Supply </span>
                                                <Ripple />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="sales/reprint" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi  pi-print mr-2"></i>
                                                <span className="font-medium">Reprint Receipt <Tag severity="success" className='' value="New"></Tag></span>
                                                <Ripple />
                                            </Link>
                                        </li>

                                        <li>
                                            <Link
                                                to="/verify/customer" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-verified mr-2"></i>
                                                <span className="font-medium">Verify Customer </span>
                                                <Ripple />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/sales/verify" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-verified mr-2"></i>
                                                <span className="font-medium">Verify Sale Receipt </span>
                                                <Ripple />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/verify/view" // Update the path as per your routing setup
                                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                                            >
                                                <i className="pi pi-verified mr-2"></i>
                                                <span className="font-medium">View Picked Purchase </span>
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

export default BiziAdminLayout;

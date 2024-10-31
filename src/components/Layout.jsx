// src/components/Layout.js
import React,{useState,useEffect} from 'react';

import SidebarLayout from './SidebarLayout';
import Footer from './Footer';
import  "primereact/resources/themes/arya-green/theme.css";
import BiziAgentLayout from './BiziAgentLayout';
import StakeholderLayout from './StakeholderLayout';
import { useNavigate } from 'react-router-dom';
import ShopAgentLayout from './ShopAgentLayout';
import StoreAgentLayout from './StoreAgent';
import FinanceLayout from './FinanceLayout';
import StoreAdminLayout from './StoreAdminLayout';
import BiziAdminLayout from './BiziAdminLayout';
import BiziCardAgentLayout from './BiziCardAgent';


const Layout = ({ children }) => {
    const [tokens,setToken]= useState(null);
    const [role,setRole]= useState(null);
    const navigate= useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        setToken(token);
        setRole(role);
    }, [navigate]);

    let layoutComponent;

  // Use a switch statement to decide which layout to render
  switch (role) {
    case 'admin':
      layoutComponent = <SidebarLayout />;
      break;

    case 'bizi_admin':
      layoutComponent = <BiziAdminLayout/>;
      break;

    case 'bizi_agent':
      layoutComponent = <BiziAgentLayout />;
      break;

    case 'bizi_card_agent':
      layoutComponent = <BiziCardAgentLayout />;
      break;

    case 'bizi_agent_staff':
      layoutComponent = <BiziAgentLayout />;
      break;

    case 'shop_agent':
      layoutComponent = <ShopAgentLayout />;
      break;
    case 'store_agent':
      layoutComponent = <StoreAgentLayout />;
      break;

    case 'stakeholder':
        layoutComponent = <StakeholderLayout/>;
        break;

    case 'finance':
        layoutComponent = <FinanceLayout/>;
        break;

    case 'shop_admin':
       layoutComponent = <StoreAdminLayout/>;
       break;

    default:
      layoutComponent = null; // Render nothing or provide a fallback layout
  }

    return (

              <div className="min-h-screen flex flex-col">
                    <main className="flex-grow">
                        {layoutComponent}
                        <div className=" w-full contents">
                            {children}
                        </div>
                    </main>
            <Footer />
        </div>
    );
};

export default Layout;

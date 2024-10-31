// src/pages/LoginPage.js
import React, { useState,useEffect, useRef } from 'react';
import { Button, InputText, Password, Card } from 'primereact';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../../components/InputField';
import { ProgressSpinner } from 'primereact/progressspinner'; 
import { Toast } from 'primereact/toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const load = () => {
      setLoading(true);

      setTimeout(() => {
          setLoading(false);
      }, 2000);
  };

  const toast = useRef(null);

    const showSuccess = (severity,summary,message) => {
        toast.current.show({severity:severity, summary: summary, detail:message, life: 10000});
    }



  const handleLogin = async (e) => {
    e.preventDefault();

    setProcessing(true);
    // Ensure email and password are filled
    if (email && password) {
        try {
            // First, call the CSRF cookie endpoint
            await axios.get('https://api.scan-verify.com/sanctum/csrf-cookie');

            // After setting the CSRF cookie, make the POST request to your login endpoint
            const response = await axios.post('https://api.scan-verify.com/api/login', {
                email: email,
                password: password,
            });

            setProcessing(false);
            if (response.data.success) {
                // Get the token from the response
                const token = response.data.token;
                const role = response.data.role;
                const user = response.data.user;

                // Store the token in local storage
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                // Store the user data in local storage after stringifying it
                localStorage.setItem('userData', JSON.stringify(user));
                localStorage.setItem('balance', user?.agent?.balance);

                showSuccess('success', 'Login', 'Login successfully');

                setTimeout(() => {
                    navigate('/dashboard');
                }, 3000);

            } else if(response.status == 403) {
                showSuccess('error', 'Login', response.data.message);

            }else{
              showSuccess('error', 'Login', response.data.error);
            }

            // Redirect to the dashboard

        } catch (error) {

            setProcessing(false);
            
            // Handle errors here (e.g., show an error message)
            showSuccess('error', 'Login', error.response.data.message);
            console.error('Login failed:', error);
        }
    } else {
        showSuccess('error', 'Login', 'Please enter both email and password.');
    }
};

useEffect(() => {


    const token = localStorage.getItem('token');
    const message403 = localStorage.getItem('message_403');

    if (token) {

      window.location.href="/dashboard"

    }else{
        navigate('/login');
    }

    if(message403 !== null){
      showSuccess('error', 'Login', message403);
    }

  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Toast ref={toast} />
      <Card className="md:w-1/2 sm:w-full max-w-screen-sm p-6 shadow-md items-center mx-auto">
      <img src="https://www.jigawapalliative.com.ng/wp-content/uploads/2024/07/e-500-x-199-px-1-e1721594916831.png" className='mx-auto  w-30 h-30' />
       <h1 className='font-bold mb-4 mx-auto text-black place-self-center text-2xl'>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="p-fluid">
            <div className="p-field mb-4">
              <label htmlFor="email" className='font-bold text-[#41bd18]'>Email</label>
              <InputField
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={"Enter your email"}
                required
              />
            </div>
            <div className="p-field mb-4">

            <div className='grid grid-cols-2 items-center justify-items-center'>
            <label htmlFor="password" className='font-bold text-[#41bd18]'>Password</label>

                <input
                    id="password"
                    placeholder={"Enter your password"}
                    value={password}
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-md  py-3 px-5 border w-full border-green-500 bg-white  text-base font-medium font-bold text-bold outline-none focus:border-[#012206] focus:shadow-md"
                />


            </div>


            </div>

            <div className="card flex flex-wrap justify-content-center gap-3">
                        <button
                        onClick={handleLogin}
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
                                    Login
                                </div>
                        </button>
                </div>

          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;

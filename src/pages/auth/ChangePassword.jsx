import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import InputField from '../../components/InputField';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null);

    const showSuccess = (severity, summary, message) => {
        toast.current.show({ severity: severity, summary: summary, detail: message, life: 10000 });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Ensure all password fields are filled
        if (currentPassword && newPassword && confirmPassword) {
            if (newPassword !== confirmPassword) {
                showSuccess('error', 'Change Password', 'New password and confirm password do not match.');
                setProcessing(false);
                return;
            }

            try {
                
                // Call the CSRF cookie endpoint
                await axios.get('https://api.bizipay.ng/sanctum/csrf-cookie');

                // Make the POST request to your change password endpoint
                const response = await axios.post('https://api.scan-verify.com/api/change-password', {
                    current_password: currentPassword,
                    new_password: newPassword,
                });

                setProcessing(false);
                if (response.data.success) {
                    showSuccess('success', 'Change Password', 'Password changed successfully.');

                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 3000);

                } else {
                    showSuccess('error', 'Change Password', 'Password change failed. check the again');
                }
            } catch (error) {
                setProcessing(false);
                showSuccess('error', 'Change Password', 'Password change failed: Invalid credentials.');
                console.error('Password change failed:', error);
            }
        } else {
            showSuccess('error', 'Change Password', 'Please fill in all fields.');
            setProcessing(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toast ref={toast} />
            <Card className="md:w-1/2 sm:w-full max-w-screen-sm p-6 shadow-md items-center mx-auto">
                <h1 className='font-bold mb-4 mx-auto text-black place-self-center text-2xl'>Change Password</h1>
                <form onSubmit={handleChangePassword}>
                    <div className="p-fluid">
                        <div className="p-field mb-4">
                            <label htmlFor="currentPassword" className='font-bold text-[#41bd18]'>Current Password</label>
                            <InputField
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                type="password"
                                placeholder={"Enter your current password"}
                                required
                            />
                        </div>
                        <div className="p-field mb-4">
                            <label htmlFor="newPassword" className='font-bold text-[#41bd18]'>New Password</label>
                            <InputField
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="password"
                                placeholder={"Enter your new password"}
                                required
                            />
                        </div>
                        <div className="p-field mb-4">
                            <label htmlFor="confirmPassword" className='font-bold text-[#41bd18]'>Confirm New Password</label>
                            <InputField
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                type="password"
                                placeholder={"Confirm your new password"}
                                required
                            />
                        </div>

                        <div className="card flex flex-wrap justify-content-center gap-3">
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
                                    Change Password
                                </div>
                            </button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;

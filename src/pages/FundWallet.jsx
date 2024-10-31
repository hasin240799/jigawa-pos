import React, { useState,useEffect,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import Modal from '../components/Modal';
import { Button } from 'primereact/button';


export default function FundWallet() {
  const [amount, setAmount] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const alert = useRef();

  const [visible, setVisible] = useState(true);

  const footer = <Button label="Close" className="p-button-raised p-button-success" onClick={() => setVisible(false)} />;
//   useEffect(() => {
//     // Parse the query parameters
//     const queryParams = new URLSearchParams(location.search);
    
//     // Extract the 'reference' parameter
//     const ref = queryParams.get('reference');
    
//     // Set the reference in the state
//     setReference(ref);

//     // Optionally, perform additional actions or API calls with the reference here
//     if (ref) {
//         // Example: Verify payment or fetch additional data based on reference
//         console.log('Reference parameter:', ref);
//         // alert(ref)
//         verifyPayment(ref);
//         // Add your API call or other logic here
//     }
// }, [location.search]); // Depend on location.search to re-run when query params change
const hasVerified = useRef(false);

useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const ref = queryParams.get('reference');
  
  setReference(ref);

  if (ref && !hasVerified.current) {
      console.log('Reference parameter:', ref);
      verifyPayment(ref);
      hasVerified.current = true;
  }
}, []);

const showSuccess = (severity,summary,message) => {
  alert.current.show({severity:severity, summary: summary, detail:message, life: 10000});
}




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    

    try {
     
      const response = await axios.post('https://api.scan-verify.com/api/create-transaction-split',JSON.stringify({ amount }), {
        headers: {
            'Content-Type': 'application/json',
        }
    });   
     

        if (response.data.status === true) {
         
          showSuccess(
            'success',
            "Payment",
            `You are to compelete your payment in Paystack to pay ${amount}`
          );
           
          
          setTimeout(() => {
            window.location.href = response.data.data.authorization_url; // Redirect to Paystack payment page
          },1000);
        
        } else {
            // Handle error
 
            setError(response.data.message);
            showSuccess(
              'error',
              "Payment",
              response.data.message
            );

            console.error('Error initializing payment:', response.data.message);
        }

    } catch (err) {
      alert('Error initializing payment')
      console.log(err)
      setError(err);
    } finally {
      setLoading(false);
    }
  };


  const verifyPayment = async (reference) => {
    try {
        const response = await axios.post('https://api.scan-verify.com/api/verify-payment', { reference });
        if (response.data.status === 'success') {

          showSuccess(
            'success',
            "Payment",
            `Payment was successful!`
          );
           
          localStorage.setItem('balance',response.data.user.agent.balance)

            // Update UI accordingly
        } else {
          localStorage.setItem('balance',response.data.user.agent.balance)
         
          showSuccess(
            'error',
            "Payment",
            'Payment failed: ' + response.data.message
          );
           
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Fund Wallet</h2>
        <Toast ref={alert} />
        {transactionStatus && (
          <div className="p-4 mb-4 text-green-700 bg-green-100 rounded">
            {transactionStatus}
          </div>
        )}

      
        {error && (
          <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        <Modal
          visible={visible}
          setVisible={setVisible}
          title="Announcement"
          footer={footer}
        >
            <p>
          
            </p>
        </Modal>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-600"
              required
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {loading ? 'Processing...' : 'Fund Wallet'}
          </button>
        </form>
      </div>
    </div>
  );
};


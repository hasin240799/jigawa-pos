import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Preloader from '../components/Preloader';
import DateUtil from '../components/DateUtil';

const RealtimeStocks = () => {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState([]);
    const [shops, setShops] = useState([]);
    const [shopsData, setShopsData] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const pollingInterval = 10000; // Poll every 10 seconds

    useEffect(() => {
        // Fetch shops data
        const fetchShops = async () => {
            try {
                const response = await axios.get('https://api.scan-verify.com/api/shops');
                setShops(response.data);
            } catch (error) {
                console.error('Error fetching shops:', error);
            }
        };

        fetchShops();
    }, []);



    const fetchShops = async () => {
        try {
            const params = selectedShop ? { shop_id: selectedShop } : {};
            const response = await axios.get('https://api.scan-verify.com/api/shops');
            setShopsData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stock report:', error);
            setLoading(false);
        }
    };

     useEffect(() => {
            fetchShops()
     }, []);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const params = selectedShop ? { shop_id: selectedShop } : {};
                const response = await axios.get('https://api.scan-verify.com/api/realtime-stocks', { params });
                setReport(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stock report:', error);
                setLoading(false);
            }
        };

        fetchReport();
        const intervalId = setInterval(fetchReport, pollingInterval);

        return () => clearInterval(intervalId);
    }, [selectedShop, pollingInterval]);

    return (
        <div className="container-fluid px-2 py-5">
            {loading && <Preloader />}

            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 mx-auto justify-center">
                    <h2 className="text-xl font-bold mb-4">Real-time Shop Stock Data</h2>

                    <div className="mb-4">
                        <label htmlFor="shop-filter" className="block text-gray-700 font-semibold mb-2">Filter by Shop</label>
                        <select
                            id="shop-filter"
                            value={selectedShop || ''}
                            onChange={(e) => setSelectedShop(e.target.value)}
                            className="border border-gray-300 rounded-md py-2 px-4 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            <option value="" className="text-gray-700 bg-white">All Shops</option>
                            {shopsData.map((shop) => (
                                <option
                                    key={shop.id}
                                    value={shop.id}
                                    className="text-gray-700 bg-white hover:bg-green-500 hover:text-white"
                                >
                                    {shop.shopname}
                                </option>
                            ))}
                        </select>
                    </div>


                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="py-3 px-4  text-white bg-black font-semibold">Shops</th>
                                <th className="py-3 px-4  text-white bg-black font-semibold">Products</th>
                                <th className="py-3 px-4 text-left text-white bg-green-500 font-semibold">Quantity In</th>
                                <th className="py-3 px-4 text-left text-white bg-red-500 font-semibold">Quantity Out</th>
                                <th className="py-3 px-4 text-left text-white bg-yellow-500 font-semibold">Stock Balance</th>
                                <th className="py-3 px-4  text-white bg-black font-semibold">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b border-gray-200">{item.shop?.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{item.product?.name}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-white bg-green-500">{item.qty_in}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-white bg-red-500">{item.qty_out}</td>
                                    <td className="py-2 px-4 border-b border-gray-200 text-black bg-yellow-500">{item.qty_in - item.qty_out}</td>
                                    <td className="py-2 px-4 border-b border-gray-200"><DateUtil date={item.updated_at} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RealtimeStocks;

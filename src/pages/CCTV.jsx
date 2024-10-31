// src/pages/CCTV.js
import React,{useRef} from 'react';
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';
import { Card } from 'primereact/card';

import { useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import Preloader from '../components/Preloader';
import { MapContainer, TileLayer, Marker,  LayersControl,Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaStore } from 'react-icons/fa';
import ReactDOMServer from 'react-dom/server';
import { BarChart, Bar, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label, Line } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import 'mapbox-gl/dist/mapbox-gl.css';

const items = [
    {
        'title':"Total Customers",
        'count':34,
        'icon':'pi pi-user'
    },
    {
        'title':"Total Sales",
        'count':50,
        'icon':'pi pi-cart-plus'
    },
    {
        'title':"Total Shops",
        'count':1,
        'icon':'pi pi-shopping-bag'
    },
    {
        'title':"Total Agents",
        'count':20,
        'icon':'pi pi-user'
    }
]

const salesByTimeData = [
    { time: '2024-08-01', sales: 50000 },
    { time: '2024-08-02', sales: 45000 },
    { time: '2024-08-03', sales: 60000 },
    { time: '2024-08-04', sales: 70000 },
    { time: '2024-08-05', sales: 40000 },
    { time: '2024-08-06', sales: 80000 },
    { time: '2024-08-07', sales: 65000 },
    { time: '2024-08-08', sales: 75000 },
    { time: '2024-08-09', sales: 50000 },
    { time: '2024-08-10', sales: 90000 },
    { time: '2024-08-11', sales: 120000 },
    { time: '2024-08-12', sales: 30000 },
    { time: '2024-08-13', sales: 9000 },
    { time: '2024-08-14', sales: 4000 },
    { time: '2024-08-15', sales: 560000 },
    { time: '2024-08-16', sales: 94000 },
    // Add more data as needed
  ];


mapboxgl.accessToken = "pk.eyJ1IjoiaGFzaW4yNDA3OTkiLCJhIjoiY20wNDA5OHB5MDJtMjJqcjVyZDdybWFlOSJ9.7ppOGEH_xHYaw6tHlUk0uA";


const CCTV = () => {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const mapContainerRef = useRef(null);

    const [selectedShop, setSelectedShop] = useState(null);

    const [map, setMap] = useState(null);
    const { BaseLayer, Overlay } = LayersControl;
    const shopIcon = new L.Icon({
        iconUrl: require('./shop.svg'),
        iconSize: [25, 25],
      });


      const jigawaBounds = [
        [8.3566, 11.0255], // Southwest coordinates
        [10.8969, 13.2061] // Northeast coordinates
    ];

    // GeoJSON data for Jigawa State boundary
    const jigawaGeoJSON = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [9.5, 12.0],
                            [10.0, 12.0],
                            [10.0, 13.0],
                            [9.5, 13.0],
                            [9.5, 12.0]
                        ]
                    ]
                },
                "properties": {
                    "name": "Jigawa State"
                }
            }
        ]
    };
      const shopSalesData = [
        { shopName: 'Auyo', sales: 150 },
        { shopName: 'Babura', sales: 120 },
        { shopName: 'Biriniwa', sales: 200 },
        { shopName: 'Birnin Kudu', sales: 300 },
        { shopName: 'Buji', sales: 110 },
        { shopName: 'Dutse', sales: 3000 },
        { shopName: 'Gagarawa', sales: 90 },
        { shopName: 'Garki', sales: 70 },
        { shopName: 'Gumel', sales: 0 },
        { shopName: 'Guri', sales: 130 },
        { shopName: 'Gwaram', sales: 250 },
        { shopName: 'Gwiwa', sales: 180 },
        { shopName: 'Hadeja', sales: 200 },
        { shopName: 'Jahun', sales: 220 },
        { shopName: 'Kafin Hausa', sales: 190 },
        { shopName: 'Kaugama', sales: 160 },
        { shopName: 'Kazaure', sales: 310 },
        { shopName: 'Kiri Kasama', sales: 140 },
        { shopName: 'Kiyawa', sales: 210 },
        { shopName: 'Maigatari', sales: 170 },
        { shopName: 'Malam Madori', sales: 150 },
        { shopName: 'Miga', sales: 90 },
        { shopName: 'Ringim', sales: 260 },
        { shopName: 'Roni', sales: 80 },
        { shopName: 'Sule Tankarkar', sales: 100 },
        { shopName: 'Taura', sales: 130 },
        { shopName: 'Yankwashi', sales: 60 }
    ];


      const totalProductsData = [
        { category: 'Rice 10KG', count: 400 },
        { category: 'Beans 10KG', count: 300 },
        { category: 'Gari 5KG', count: 300 },
        { category: 'Maize 10KG', count: 200 },
        // Add more data as needed
      ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const [shops] = useState([
        { id: 1, name: 'Auyo Shop LGA', latitude: 12.4876, longitude: 10.0183, sales: 1500, inventory: 120, status: 'inactive' },
        { id: 2, name: 'Babura Shop LGA', latitude: 12.0672, longitude: 10.2163, sales: 1400, inventory: 110, status: 'inactive' },
        { id: 3, name: 'Biriniwa Shop LGA', latitude: 12.4516, longitude: 10.1360, sales: 1600, inventory: 130, status: 'inactive' },
        { id: 4, name: 'Birnin Kudu Shop LGA', latitude: 12.7845, longitude: 10.2123, sales: 2200, inventory: 140, status: 'inactive' },
        { id: 5, name: 'Buji Shop LGA', latitude: 12.4900, longitude: 10.0184, sales: 1300, inventory: 100, status: 'inactive' },
        { id: 6, name: 'Dutse Shop LGA', latitude: 11.693771, longitude: 9.349185, sales: 3000, inventory: 100, status: 'active' },
        { id: 7, name: 'Gagarawa Shop LGA', latitude: 12.3987, longitude: 9.9395, sales: 1100, inventory: 90, status: 'inactive' },
        { id: 8, name: 'Garki Shop LGA', latitude: 11.7937, longitude: 9.7172, sales: 1000, inventory: 80, status: 'inactive' },
        { id: 9, name: 'Gumel Shop LGA', latitude: 12.6752, longitude: 10.3350, sales: 800, inventory: 70, status: 'inactive' },
        { id: 10, name: 'Guri Shop LGA', latitude: 12.5865, longitude: 10.2915, sales: 1500, inventory: 130, status: 'inactive' },
        { id: 11, name: 'Gwaram Shop LGA', latitude: 12.5192, longitude: 10.0446, sales: 2000, inventory: 150, status: 'inactive' },
        { id: 12, name: 'Gwiwa Shop LGA', latitude: 12.2851, longitude: 10.2355, sales: 1700, inventory: 110, status: 'inactive' },
        { id: 13, name: 'Hadeja Shop LGA', latitude: 12.4506, longitude: 10.0404, sales: 2000, inventory: 150, status: 'inactive' },
        { id: 14, name: 'Jahun Shop LGA', latitude: 12.8315, longitude: 9.8535, sales: 1800, inventory: 120, status: 'inactive' },
        { id: 15, name: 'Kafin Hausa Shop LGA', latitude: 12.4133, longitude: 10.2413, sales: 1400, inventory: 100, status: 'inactive' },
        { id: 16, name: 'Kaugama Shop LGA', latitude: 12.4919, longitude: 10.1381, sales: 1500, inventory: 110, status: 'inactive' },
        { id: 17, name: 'Kazaure Shop LGA', latitude: 12.8144, longitude: 10.3845, sales: 2500, inventory: 140, status: 'inactive' },
        { id: 18, name: 'Kiri Kasama Shop LGA', latitude: 12.6290, longitude: 10.3790, sales: 1300, inventory: 90, status: 'inactive' },
        { id: 19, name: 'Kiyawa Shop LGA', latitude: 12.7353, longitude: 10.2660, sales: 1600, inventory: 120, status: 'inactive' },
        { id: 20, name: 'Maigatari Shop LGA', latitude: 12.6148, longitude: 10.3577, sales: 1200, inventory: 100, status: 'inactive' },
        { id: 21, name: 'Malam Madori Shop LGA', latitude: 12.4125, longitude: 10.0214, sales: 1400, inventory: 110, status: 'inactive' },
        { id: 22, name: 'Miga Shop LGA', latitude: 12.5814, longitude: 10.2814, sales: 1000, inventory: 90, status: 'inactive' },
        { id: 23, name: 'Ringim Shop LGA', latitude: 12.5564, longitude: 10.3702, sales: 2300, inventory: 140, status: 'inactive' },
        { id: 24, name: 'Roni Shop LGA', latitude: 12.4276, longitude: 10.0368, sales: 1100, inventory: 80, status: 'inactive' },
        { id: 25, name: 'Sule Tankarkar Shop LGA', latitude: 12.4496, longitude: 10.0778, sales: 1300, inventory: 90, status: 'inactive' },
        { id: 26, name: 'Taura Shop LGA', latitude: 12.3344, longitude: 10.0546, sales: 1200, inventory: 100, status: 'inactive' },
        { id: 27, name: 'Yankwashi Shop LGA', latitude: 12.3789, longitude: 10.1441, sales: 900, inventory: 70, status: 'inactive' }
    ]);


      const createIcon = (iconComponent) => {
        return L.divIcon({
          html: ReactDOMServer.renderToString(iconComponent),
          iconSize: [24, 24],
          className: 'custom-marker',
        });
      };

    useEffect(() => {

      // Simulate loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the timeout as needed

      return () => clearTimeout(timer);
    }, [location]);

    useEffect(() => {
        // Initialize the map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            // style: 'mapbox://styles/mapbox/streets-v11',
            bounds: jigawaBounds, // Set the initial bounds to Jigawa State
            fitBoundsOptions: { padding: 20 },// Add some padding around the bounds
        });


        // Wait until the style has fully loaded
        map.on('load', () => {




        // Add zoom controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add markers with custom shop icon
        shops.forEach(shop => {


            const markerElement = document.createElement('div');
            markerElement.innerHTML = ReactDOMServer.renderToString(
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {shop.status === 'active' ? (
                        <>
                            <FaStore style={{ fontSize: '30px', color: 'green', marginRight: '8px' }} />
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{shop.name}</span>
                        </>
                    ) : (
                        <>
                            <FaStore style={{ fontSize: '30px', color: 'red', marginRight: '8px' }} />
                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{shop.name}</span>
                        </>
                    )}
                </div>
            );

             new mapboxgl.Marker(markerElement)
                .setLngLat([shop.longitude, shop.latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25,  })
                    .setHTML(`
                        <div class="w-80 max-w-xs p-4 bg-white rounded-lg shadow-lg text-gray-800">
                            <h4 class="text-lg font-semibold mb-2">${shop.name}</h4>
                            <p class="text-sm mb-1"><strong>Sales:</strong> ${shop.sales}</p>
                            <p class="text-sm mb-1"><strong>Inventory:</strong> ${shop.inventory}</p>
                            <p class="text-sm font-semibold mb-2"><strong>Other analytics:</strong></p>
                            <ul class="text-sm list-disc list-inside pl-4">
                                <li>Detail 1</li>
                                <li>Detail 2</li>
                                <li>Detail 3</li>
                            </ul>
                        </div>
                    `)
                )
                .addTo(map);
            });
        });

        // Save the map instance to the state
        setMap(map);

        // Clean up on unmount
        return () => map.remove();
    }, []); // Empty dependency array ensures this effect runs only once


    return (

    <div className="container-fluid px-2 py-5">
       {loading && <Preloader/>} {/* Show Preloader while loading */}
        {/* <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-6 mx-auto justify-center items-center'>
            {items.map((item)=>{
                    return(
                        <>
                        <div className=' bg-white p-4 rounded-md  border w-1/5 h-auto grid grid-cols-3 '>
                            <div className='bg-green-500  text-white p-3  rounded-lg justify-items-center'><i className={`${item.icon} items-center`} style={{ fontSize: '2.0rem' }}></i></div>
                            <div className='px-2 py-2  '>
                                <span className='flex flex-row font-extrabold font-sans text-1xl'>{item.title}</span>
                                <span className='flex flex-row text-gray-500'>{item.count}</span>
                            </div>
                        </div>
                        </>
                    )
                })
            }
        </div> */}  

        <div className="container-fluid px-2 py-5">
            <div id="map-container" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
        </div>

    </div>

    );
};

export default CCTV;

// src/components/AddressField.js

import React from 'react';

const AddressField = ({ id, label, name, placeholder, value, onChange }) => {
    return (
        <div className="w-full px-3 sm:w-1/2">
            <div className="mb-5">
                <label htmlFor={id} className="mb-3 block text-base font-medium text-[#07074D]">
                    {label}
                </label>
                <input
                    type="text"
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
            </div>
        </div>
    );
};

export default AddressField;

// src/components/InputField.js

import React from 'react';

const InputField = ({ id, label, type, name, placeholder, value, required=true,onChange,className="w-full py-3 px-5",minLength, maxLength,...props }) => {
    return (
        <div className="mb-5">
         

                
                     <>
                    <label htmlFor={id} className="mb-3 block text-base font-medium font-bold text-[#07074D]">
                         {label}
                    </label>
                    <input
                        type={type}
                        id={id}
                        {...props}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        minLength={minLength}
                        maxLength={maxLength}
                        className={"rounded-md border w-full border-green-500 bg-white  text-base font-medium font-bold text-[#0e3f15] outline-none focus:border-[#6A64F1] focus:shadow-md"+className}
                    />
                    {props.error && <span className="text-sm text-red-500">{props.error}</span>}
                </>
          
           
           
        </div>
    );
};

export default InputField;


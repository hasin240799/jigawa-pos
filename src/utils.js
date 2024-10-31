// src/utils/transformToNaira.js

export const transformToNaira = (code) => {
    // Convert the input to a number and format it as currency
    const formattedNumberPart = parseInt(code, 10).toLocaleString('en-NG');

    // Combine with the Naira symbol
    return `₦${formattedNumberPart}`;
  };

import React from 'react';
import { format } from 'date-fns';

const DateUtil = ({ date }) => {
    // Implement your date formatting logic here
    return (
        <>{format(new Date(date), 'PPPpp')}</> // or use moment
    );
};

export default DateUtil;

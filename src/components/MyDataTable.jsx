// MyDataTable.js
import React from 'react';
import DataTable from 'react-data-table-component'

function MyDataTable({ columns, data, header }) {
    return (
        <div>
            <h1 className=" mx-auto text-3xl font-bold">{header}</h1>
            <DataTable
                columns={columns}
                data={data}
                //pagination // Enables pagination
                //highlightOnHover // Highlights rows on hover
                //selectableRows // Allows row selection
            />
        </div>
    );
}

export default MyDataTable;

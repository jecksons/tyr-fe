import MaterialTable from 'material-table';
import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import {theme, tableIcons} from '../TableUtils';
import { useHistory } from 'react-router';

export default  function ResourceTable(tableData){

    const columns = [
        {field: 'name', title: 'Name'},
        {
            field: 'available', 
            title: 'Available',
            type: 'boolean'
        },
        {field: 'opened_duration', title: 'Opened tasks in hrs'},
        {field: 'opened_tasks', title: 'Opened tasks'},
        {field: 'delayed_tasks', title: 'Delayed tasks'},
        {field: 'delay_perc', title: '% delayed'}
    ];

    const history = useHistory();

    function onResourceRowClick(event, rowData){
        history.push('/resources/' + rowData.id);
    }    

    return (
        <ThemeProvider theme={theme}>
            <MaterialTable 
            title="Resources" 
            data={tableData.tableData} 
            icons={tableIcons}
            columns={columns}        
            onRowClick={onResourceRowClick}        
            style={
                {
                    boxShadow: 'none',
                    borderRadius: '0'
                }
            }
            options={
                { 
                    search: true, 
                    paging: true, 
                    filtering: true,
                    exportButton: true, 
                    pageSize: 20,
                    maxBodyHeight: '60vh',
                    padding: 'dense',
                    headerStyle: {
                        color: '#9E9E9E'
                      }
                }
            }/>
        </ThemeProvider>
        
    );

}
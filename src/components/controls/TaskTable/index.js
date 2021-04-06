import MaterialTable from 'material-table';
import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import {theme, tableIcons} from '../TableUtils';
import { useHistory } from 'react-router';

export default  function TaskTable(tableData){

    const columns = [
        {field: 'id', title: '#'},
        {field: 'title', title: 'Task'},
        {field: 'location', title: 'Location'},
        {field: 'when', title: 'When', type: 'date'},
        {field: 'who', title: 'Who'},
        {field: 'status', title: 'Status'}
    ];

    const history = useHistory();

    function onTaskRowClick(event, rowData){
        history.push('/tasks/' + rowData.id);
    }    

    return (
        <ThemeProvider theme={theme}>
            <MaterialTable 
            title="Tasks" 
            data={tableData.tableData} 
            icons={tableIcons}
            columns={columns}        
            onRowClick={onTaskRowClick}        
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
                    minBodyHeight: '60vh',
                    padding: 'dense',
                    headerStyle: {
                        color: '#9E9E9E'
                      }
                }
            }/>
        </ThemeProvider>
        
    );

}
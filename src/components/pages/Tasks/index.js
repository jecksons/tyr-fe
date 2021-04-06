import './tasks.css';
import React, {useEffect, useState} from 'react';
import TaskTable from '../../controls/TaskTable';
import api from '../../../services/api';

export default function Tasks(){

    const [taskData, setTaskData] = useState({
        loaded: false,
        items: []
    });
    


    useEffect(() => {
        api.get('/tasklist')
        .then((ret) => {
            let tableData = [];            
            ret.data.forEach((item) => {
                const data = item;                                                
                tableData.push( 
                    {
                        id: data.id,
                        title: data.name,
                        location: data.location,
                        status: data.task_status,
                        who: data.resources,
                        when: (new Date(data.deadline))
                    }
                );
            });
            setTaskData({loaded: true, items: tableData});    
        }
        );
    }, [] );


    return (
        <div id="tasks" className="parent-page-center">
            <div id="tasks-box" className="client-center">           
                <div id="tasks-panel" className="parent-container-controls">                            
                    <section id="tasks-list">
                        {taskData.loaded ?  
                            <TaskTable tableData={taskData.items} ></TaskTable> 
                             : 
                            (
                                <div id="loading">
                                    <strong>Loading data</strong>
                                </div>                                
                            )                        
                        }                                
                    </section>                                                
                </div>                                
            </div>
        </div>
    )
}
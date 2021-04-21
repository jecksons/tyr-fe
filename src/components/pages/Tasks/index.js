import './tasks.css';
import React, {useCallback, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import api from '../../../services/api';
import moment from 'moment';
import {BsArrowLeftShort, BsArrowRightShort} from 'react-icons/bs';


const taskPageSize =  5;
const emptySelectOption = {value: '', label: 'Select...'};

export default function Tasks(props){

    const [taskItems, setTaskItems] = useState([]);
    const [taskListInfo, setTaskListInfo] = useState({});
    const [itemsLoaded, setItemsLoaded] = useState(false);    
    const [sortOption, setSortOption] = useState('');
    const [statusOption, setStatusOption] = useState('');
    const history = useHistory();
    const [rowOffset, setRowOffset] = useState(0);
    const [taskStatusItems, setTaskStatusItems] = useState([]);
    const [taskSortOptions, setTaskSortOptions] = useState([]);

    useEffect(() => {
        Promise.all(
            [
                api.get(`/tasklist/sortoptions/`),
                api.get(`/task_status/?business=${props.userData.businessID}`),
            ]
        ).then((results) => {
            let retSort = results[0].data;
            retSort.unshift(emptySelectOption);
            setTaskSortOptions(retSort);
            let retStatus = results[1].data.map((itm) => {
                return {value: itm.id, label: itm.name}
            });
            retStatus.unshift(emptySelectOption);
            setTaskStatusItems(retStatus);
        });
    }, [props.userData]);

    

    useEffect(() => {        
        let getOptions = `?offset=${rowOffset}&limit=${taskPageSize}&business=${props.userData.businessID}`;
        if (statusOption !== ''){
            getOptions += `&status=${statusOption}`;            
        }        
        if (sortOption !== ''){
            getOptions += `&sort_by=${sortOption}`;
        }        
        api.get(`/tasklist/${getOptions}`)
        .then((ret) => {
            let tableData = [];            
            ret.data.results.forEach((item) => {
                const data = item;                                                
                tableData.push(                     
                    {
                        id: data.id,                        
                        title: data.name,
                        location: data.location,
                        status: data.task_status,
                        who: data.resources,
                        task_code: data.task_code,
                        product: data.product_name,
                        partner: data.partner_name,
                        when: (new Date(data.deadline))
                    }
                );
            });            
            setTaskListInfo(ret.data.metadata);
            setTaskItems(tableData);
            setItemsLoaded(true);
        }
        );
    }, [sortOption, rowOffset, statusOption, props.userData] );


    const handlePagePosition = useCallback((e, next) => {
        e.preventDefault();
        if (next === false){
            if (taskListInfo.offset > 0) {
                let newOffset = taskListInfo.offset - taskPageSize;
                if (newOffset < 0) {
                    newOffset = 0;
                }
                setRowOffset(newOffset);
            }
        } else {
            if ((taskListInfo.offset + taskPageSize) < taskListInfo.total) {
                setRowOffset(taskListInfo.offset + taskPageSize);
            }
        }


    }, [taskListInfo])

    function renderTasks(){
        return (
            <div>
                <section id="header-tasklist">                                            
                    <strong id="info-tasks">Tasks</strong>
                    <div id="header-tasklist-group">
                        <div className="task-list-header-input">
                            <label className="label-default">Status</label>
                            <select className="text-default"  onChange={(e) => setStatusOption(e.target.value)}>
                                {
                                    taskStatusItems.map((opt) => <option value={opt.value} key={opt.value}>{opt.label}</option> )
                                }
                            </select>
                        </div>                                        
                        <div className="task-list-header-input">
                            <label className="label-default">Sort by</label>
                            <select className="text-default" value={sortOption} onChange={(e) => setSortOption(e.target.value)} >
                                {
                                    taskSortOptions.map((opt) => <option value={opt.value} key={opt.value}>{opt.label}</option> )
                                }
                            </select>
                        </div>                    
                        <div className="pagination-default">
                            <h2>{`${taskListInfo.offset + 1}-${
                                                (taskListInfo.offset + taskListInfo.limit) > taskListInfo.total ? taskListInfo.total : 
                                                (taskListInfo.offset + taskListInfo.limit)
                                                } of ${taskListInfo.total}`}</h2>
                            <button id="prior-page" onClick={(e) => handlePagePosition(e, false)}>
                                <BsArrowLeftShort size={20}></BsArrowLeftShort>
                            </button>
                            <button id="next-page" onClick={(e) => handlePagePosition(e, true)}>
                                <BsArrowRightShort size={20}></BsArrowRightShort>
                            </button>
                        </div>
                    </div>                                      
                </section>
                <ul >
                    {taskItems.map((itm) => 
                        <li key={itm.id} className="task-list-item" 
                            onClick={() => {
                                history.push('/tasks/' + itm.id);
                            }}>
                            <div id="task-list-item-header">                                
                                <h2>{itm.title}</h2>
                                <h2  id="task-id">{itm.task_code}</h2>
                            </div>
                            <div id="task-list-item-detail">
                                <h3>{itm.partner}</h3>
                                {itm.location && <h3>{`Location: ${itm.location}`}</h3>}                                
                                {itm.product && <h3>{`Product: ${itm.product}`}</h3>}                                                                
                                <h3>{itm.status}</h3>
                                <h3>{moment(itm.when).format('llll')}</h3>                                                                        
                                <h3>{itm.who}</h3>
                            </div>                                                                
                        </li> )}
                </ul>
            </div>
        )
    }


    return (
        <div id="tasks" className="parent-page-center">
            <div id="tasks-box" className="client-center">           
                <div id="tasks-panel" className="parent-container-controls">                            
                    <section id="tasks-list">
                        {itemsLoaded ?  
                            renderTasks()
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
    );

    /* 
{taskData.loaded ?  
                            <TaskTable tableData={taskData.items} ></TaskTable> 
                             : 
                            (
                                <div id="loading">
                                    <strong>Loading data</strong>
                                </div>                                
                            )                        
                        }                                
    */
}
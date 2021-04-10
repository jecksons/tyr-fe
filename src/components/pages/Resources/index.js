import './resources.css';
import React, {useCallback, useEffect, useState} from 'react';
import api from '../../../services/api';
import ResourceTable from '../../controls/ResourceTable';
import {useHistory} from 'react-router-dom';


const resSortOptions = [
    {
        value: 'name',
        name: 'Name'
    },
    {
        value: 'available',
        name: 'Available'
    },    
    {
        value: 'opened_tasks_asc',
        name: 'Opened tasks asc'
    },
    {
        value: 'opened_tasks_desc',
        name: 'Opened tasks desc'
    }           
];

export default function Resources(){


    const [resourceItems, setResourceItems] = useState([]);
    const [showOnlyAvailables, setShowOnlyAvailables] = useState(true);
    const [sortOrder, setSortOrder] = useState('name');
    const history = useHistory();

    const sortResItems = useCallback((resItems, sortOption) => {        
        const newItems = resItems.sort((valueA, valueB) => {
            let ret = 0;
            if (sortOption === 'available') {                
                if (valueA.available !== valueB.available) {
                    ret = valueA.available === true ? -1 : 1;
                }
            } else if (sortOption === 'opened_tasks_desc') {                
                if (valueA.opened_tasks > valueB.opened_tasks) {
                    ret = -1;
                } else if (valueA.opened_tasks < valueB.opened_tasks) {
                    ret = 1;
                }                            
            } else if (sortOption === 'opened_tasks_asc') {                
                if (valueA.opened_tasks > valueB.opened_tasks) {
                    ret = 1;
                } else if (valueA.opened_tasks < valueB.opened_tasks) {
                    ret = -1;
                }                             
            } 
            if (ret === 0)  {
                ret = valueA.name.localeCompare(valueB.name);
            }        
            return ret;
        } );
        setResourceItems(newItems);        
    }, [] );
    
    const handleSortOrder = useCallback((newOrder) => {
        setSortOrder(newOrder);        
        sortResItems(resourceItems, newOrder);        
    }, [resourceItems, sortResItems]); 
    
    
    const handleGetItems = useCallback((newItems) => {
        sortResItems(newItems, sortOrder);        
    }, [sortOrder, sortResItems]);     
    
    useEffect(() => {     
        api.get('/resourcelist', {
            params: {
                onlyavailables: showOnlyAvailables === true ? 'Y' : 'N'
            }
        })
        .then((ret) => {
            let newData = [];
            ret.data.forEach((item) => {newData.push(item)});
            handleGetItems(newData);
        });
    }, [showOnlyAvailables]) ; // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div id="main-resources" className="parent-page-center">
            <div id="center-resources" className="client-center">
                <div id="box-resources" className="parent-container-controls">
                    <section id="header-resources">
                        <button className="button-default-action"  onClick={() => { history.push('/newresource')}}>New</button>                        
                        <div id="header-resources-options">
                            <div id="sort-resources">
                                <label className="label-default">Sort by</label>
                                <select 
                                    name="sortOrder"                                 
                                    className="text-default"
                                    id="sortColumn"
                                    value={sortOrder}
                                    onChange={(e) => {handleSortOrder(e.target.value)}}
                                    >
                                    {
                                        resSortOptions.map((itm) => <option key={itm.value} value={itm.value}>{itm.name}</option>)
                                    }
                                </select>
                            </div>
                            <label id="show-unavailables" className="check-default">
                                <input 
                                    type="checkbox" 
                                    id="chk-unavailables"                                                                 
                                    checked={showOnlyAvailables} 
                                    onChange={(e) => {setShowOnlyAvailables(e.target.checked)}}                             
                                />
                                Only availables
                            </label>
                        </div>                        
                    </section>                            
                    <section id="resources-list">
                        <ResourceTable tableData={resourceItems}>

                        </ResourceTable>
                    </section>        
                    <section id="resources-cards">
                        <ul>
                            {resourceItems.map((itm) =>                             
                                <li key={itm.id}
                                    onClick={() => {history.push(`/resources/${itm.id}`)}}
                                    >
                                    <div  
                                        className={`res-card-item${itm.available === false ? '-unavailable' : ''}`}>
                                            <div className="res-detail-header">
                                                <h2>{itm.name}</h2>
                                                {itm.available === false && <h2 id="unavailable">Unavailable</h2>}                                            
                                            </div>                                        
                                            <div className="res-detail-group">
                                                <h3 id="lead">{`${itm.opened_duration} scheduled hrs` }</h3>                                            
                                                <h3>{`${itm.opened_tasks} tasks`}</h3>
                                                <h3>{`${itm.delayed_tasks} delayed tasks (${itm.delay_perc} %)`}</h3>
                                            </div>                                                                               
                                    </div>                                                                        
                                </li>                                                            
                            )}
                        </ul>                        
                    </section>                            
                </div>                
            </div>            
        </div>
    );
}
import './resources.css';
import React, {useEffect, useState} from 'react';
import api from '../../../services/api';
import ResourceTable from '../../controls/ResourceTable';
import {useHistory} from 'react-router-dom';

export default function Resources(){


    const [resourceItems, setResourceItems] = useState([]);
    const [showOnlyAvailables, setShowOnlyAvailables] = useState(true);
    const history = useHistory();

    useEffect(() => {     
        api.get('/resourcelist', {
            params: {
                onlyavailables: showOnlyAvailables === true ? 'Y' : 'N'
            }
        })
        .then((ret) => {
            let newData = [];
            ret.data.forEach((item) => {newData.push(item)});
            setResourceItems(newData);
        });

    }, [showOnlyAvailables]);


    return (
        <div id="main-resources" className="parent-page-center">
            <div id="center-resources" className="client-center">
                <div id="box-resources" className="parent-container-controls">
                    <section id="header-resources">
                        <button className="button-default-action"  onClick={() => { history.push('/newresource')}}>New</button>                        
                        <label id="show-unavailables" className="check-default">
                            <input 
                                type="checkbox" 
                                id="chk-unavailables"                                                                 
                                checked={showOnlyAvailables} 
                                onChange={(e) => {setShowOnlyAvailables(e.target.checked)}}                             
                            />
                            Only availables
                        </label>
                    </section>        
                    <section id="resources-list">
                        <ResourceTable tableData={resourceItems}>

                        </ResourceTable>
                    </section>        
                </div>                
            </div>            
        </div>
    );
}
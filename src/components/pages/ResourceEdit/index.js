import React from 'react';
import './resourceedit.css';
import ResourceEditCtrl from '../../controls/ResourceEditCtrl';

export default function ResourceEdit(props){
    

    return (
        <div className="parent-page-center">
            <div className="client-center">
                {
                    (props.match.params.id &&  (props.match.params.id !== '')) ? 
                    (
                        <ResourceEditCtrl resourceID={props.match.params.id} userData={props.userData}>
                        </ResourceEditCtrl>
                    ) : 
                    (
                        <ResourceEditCtrl userData={props.userData}>
                        </ResourceEditCtrl>                        
                    )
                }                                
            </div>
        </div>
    );

}
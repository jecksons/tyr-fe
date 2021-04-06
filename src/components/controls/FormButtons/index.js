import React, {useState} from 'react';
import './formbuttons.css';
import DialogMsg from '../DialogMsg';


export default function FormButtons(props){


    const [confirmMsg, setConfirmMsg] = useState('');

    let callBackClick = props.onClick;

    function onConfirmDelete(){
        setConfirmMsg('');
        callBackClick(null, 'delete');
    }
    
    function onRefuseDelete(){
        setConfirmMsg('');        
    }

    function onBtnClick(e, action){
        e.preventDefault();
        if (callBackClick){
            if (action === 'delete') {
                setConfirmMsg('Confirm delete?');
            } else callBackClick(e, action);
        }
    }

    return (
        <div id="bottom-buttons"   className="full-buttons">
            <div id="right-buttons">
                <button  className="button-default-action"  onClick={(e) => onBtnClick(e, 'save')} disabled={props.postingData}>Save</button>
                <button  className="button-default" onClick={(e) => onBtnClick(e, 'saveandnew')} disabled={props.postingData}>Save and New</button>
                <button  className="button-default" onClick={(e) => onBtnClick(e, 'saveandcopy')} disabled={props.postingData}>Save and Copy</button>                
                {
                    ((!props.hideDelete) || (props.hideDelete === false)) &&
                    (
                        <button className="button-default" onClick={(e) => onBtnClick(e, 'delete')} disabled={props.postingData}>Delete</button>
                    )
                }                          
            </div>                     
            <DialogMsg 
                message={confirmMsg} 
                onYes={onConfirmDelete}
                onNo={onRefuseDelete}
             >
            </DialogMsg>
        </div>      
    );

}
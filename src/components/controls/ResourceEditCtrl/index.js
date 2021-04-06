import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import api from '../../../services/api';
import FormButtons from '../FormButtons';
import './resourceeditctrl.css';
import {FaArrowLeft} from 'react-icons/fa';

const STD_RESOURCE = {
    id: 0,
    name: '',
    available: true
};

export default function ResourceEditCtrl(props){

    const history = useHistory();
    const [editValues, setEditValues] = useState(STD_RESOURCE);
    const [postingData, setPostingData] = useState(false);
    const [resourceLoaded, setResourceLoaded] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [editingName, setEditingName] = useState('');


    function handleChangeInput(e){
        let newValues = {...editValues}
        if (e.target.type === 'checkbox'){
            newValues[e.target.name] = e.target.checked;
        } else {
            newValues[e.target.name] = e.target.value;
        }
        setEditValues(newValues);
    }


    function resetValues(keepValues){
        setResourceLoaded(true);
        setPostingData(false);
        if (!keepValues){
            setEditValues({...STD_RESOURCE});
        } else {            
            setEditValues({...editValues, id: 0});
        }        
        setAlertMessage('');
    }

    function handleFormClick(e, action){
        setAlertMessage('');
        if (action === 'delete') {
            setPostingData(true);            
            api.delete(`/resources/id/${props.resourceID}`,
            {validateStatus: (status) => {
                console.log(status);
                return status < 600;
            }}
            )
            .then((ret) => {
                setPostingData(false);            
                if (ret.status === 200) {
                    history.push('/resources');
                } else {                    
                    if (ret.data.error) {
                        setAlertMessage(ret.data.error);
                    } else {
                        setAlertMessage(ret.statusText);
                    }                    
                }
            })
            .catch((err) => {
                setPostingData(false);            
                setAlertMessage(err.message);
            })
        } else {            
            if (editValues.name === ''){
                setAlertMessage('Fill the name field!');
            } else {
                setPostingData(true);
                let postResource = {
                    name: editValues.name,
                    available: editValues.available
                };
                if (editValues.id > 0 ) {
                    postResource.id = editValues.id;
                }
                api.post('/resources',
                    postResource
                )
                .then((ret) => {
                    setPostingData(false);
                    if (ret.status === 200) {                        
                        if (action === 'saveandnew') {
                            resetValues(false);
                        } else if (action === 'saveandcopy') {
                            resetValues(true);                            
                        } else  {
                            history.push('/resources');
                        }
                    } else {
                        setAlertMessage(ret.statusText);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setAlertMessage(err.message);
                    setPostingData(false);
                });
            }            
        }

    }

    function renderForm(){
        if (resourceLoaded){
            return (
                <form id="resource">
                    <label>Name</label>
                    <input 
                        value={editValues.name} 
                        name="name" 
                        onChange={handleChangeInput} 
                        required 
                        autoFocus
                        className="text-default"
                    /> 
                    <label id="available">                    
                        <input type="checkbox" checked={editValues.available} name="available" onChange={handleChangeInput}/>
                        Available
                    </label>
                    <hr/>
                    <FormButtons hideDelete={false} onClick={handleFormClick} postingData={postingData} >
                    </FormButtons>
                </form>
            );
        } else return null;        
    }
    

    useEffect(() => {
        if (!props.resourceID || props.resourceID === 0){
            setResourceLoaded(true);
            setPostingData(false);
            setEditValues({...STD_RESOURCE});
            setAlertMessage('');
        } else {
            setResourceLoaded(false);
            api.get(`/resources/id/${props.resourceID}`)
            .then((ret) => {
                if (ret.status === 200) {
                    setEditValues({
                        id: ret.data.id,
                        name: ret.data.name,
                        available: ret.data.available
                    });     
                    setEditingName(ret.data.name);
                    setResourceLoaded(true);
                    setAlertMessage('');
                } else {
                    setAlertMessage(ret.statusText);                
                }                             
            }
            ).catch((err) => {
                setAlertMessage(err.message);                
            });
        }   

    }, [props.resourceID, ]);

    
    
    function renderAlert() {
        return alertMessage !== '' && 
                        (
                            <div id="alert-div">
                                <strong id="alert-message">{alertMessage}</strong>
                            </div>                            
                        );                        
    }


    function renderHeader(){
        return (
            <section id="resource-header">
                    <button type="button" onClick={(e) => {
                        history.push('/resources');
                    }}>
                        <FaArrowLeft alt="back" size={24}>
                        </FaArrowLeft>                            
                    </button>                                 
                    {
                        resourceLoaded ? 
                        (
                            editValues.id > 0 ?
                            (<strong>EDITING RESOURCE {editingName} </strong>) :
                            (<strong>NEW RESOURCE</strong>)
                        ) :                       
                        (<strong>Loading</strong>) 
                    }                    
            </section>

        )
    }
    
    return (
        <div id="box-resource">
            {renderHeader()}
            <hr/>
            {renderAlert()}
            {renderForm()}
        </div>
    );

}
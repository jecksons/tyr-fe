import React, {useState} from 'react';
import './styles.css';
import Modal from 'react-modal';
import api from '../../../services/api';


export default function EditDialog(props){

    const [alertMessage, setAlertMessage] = useState('');
    const [postingData, setPostingData] = useState(false);
    

    function closeModal(e){
        if (e) e.preventDefault();        
        resetValues();
        if (props.onCancel) {
            props.onCancel();
        }
    }    

    function resetValues() {
        props.resetEditingValues();
        setAlertMessage('');
        setPostingData(false);
    }    

    function handleSubmit(e){
        e.preventDefault();        
        const newModel =  props.getAddModel();        
        setPostingData(true);
        api.post(props.apiURL,
            newModel,
            {
                validateStatus: (status) => status < 600
            }
        )
        .then((ret) => {     
            if (ret.status === 200) {
                closeModalYes(ret.data);            
            } else {
                setAlertMessage(ret.data.error);
                setPostingData(false);
            }            
        })
        .catch((err) => {
            setAlertMessage(err.statusText);            
            setPostingData(false);
        });
    }

    function closeModalYes(newModel){        
        resetValues();
        if (props.onSuccess) {
            props.onSuccess(newModel);
        }
    }

    if (props.showDialog){
        return (
            <Modal
                isOpen={props.showDialog}
                onRequestClose={closeModal}
                overlayClassName="overlay-dialog-content"
                className="dialog-content"                
            >                
                <div id="main-dialog">                                    
                    <div className="msg-client-dialog">
                        <section className="form-header" id="title-form-partner">
                            <strong>{props.title}</strong>
                        </section>                        
                        <form onSubmit={handleSubmit}>
                            {props.formContent()}                            
                            <div className="alert-message">                            
                            {alertMessage !== '' && <span>{alertMessage}</span>}
                            </div>
                            <div className="dialog-buttons">
                                <button disabled={postingData} type="submit"  className="button-default-action">Save</button>
                                <button disabled={postingData} onClick={closeModal}  className="button-default">Cancel</button>
                            </div>                                                
                        </form>
                    </div>                    
                </div>                
            </Modal>
        )
    } else return null;    

};
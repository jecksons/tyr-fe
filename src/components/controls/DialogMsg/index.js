import React from 'react';
import './styles.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');


export default function DialogMsg(props){

    function closeModal(){
        if (props.onNo) {
            props.onNo();
        }
    }    

    function closeModalYes(){
        if (props.onYes) {
            props.onYes();
        }
    }

    if (props.message !== '') {
        return (                
            <Modal
                isOpen={props.message !== ''}
                onRequestClose={closeModal}
                overlayClassName="overlay-dialog-content"
                className="dialog-content"
            >                
                <div id="main-dialog">                                    
                    <div className="msg-client-dialog">
                        <strong>{props.message}</strong>
                        <div className="dialog-buttons">
                            <button onClick={closeModalYes}  className="button-default-action">Yes</button>
                            <button onClick={closeModal}  className="button-default">No</button>
                        </div>                    
                    </div>                    
                </div>                
            </Modal>
        );
    } else return null;

    

};
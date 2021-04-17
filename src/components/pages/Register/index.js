import React, {useState} from 'react';
import {useHistory } from 'react-router-dom';
import './register.css';
import firebase from '../../../services/firebase';
import AlertBox from '../../controls/AlertBox';

export default function Register(){

    const [userData, setUserData] = useState(
        {
            name: '',
            email: '',
            password: ''
        }
    );

    const [alertMessage, setAlertMessage] = useState('');
    const [registering, setRegistering] = useState(false);
    const history = useHistory();

    function handleInput(e) {
        setUserData( {...userData, [e.target.name]: e.target.value});
    }    

    function registerUser() {
        setRegistering(true);
        
        async function regUser() {    
            try {
                await firebase.register(userData.name, userData.email, userData.password)
                .catch((error) => {
                    setAlertMessage(error.message);                
                })
                .then(() => {
                    if (firebase.getCurrent()) {                                            
                        history.replace('/businesschoose');
                    }
                }                
                );
            } catch (error){
                setAlertMessage(error.message);
            } finally {
                setRegistering(false);
            }        
        }
        regUser();    
    }      
    

    function handleSubmit(e){
        e.preventDefault();
        registerUser();
    }

    return (
        <div id="register">
            <div id="register-align">
                <section id="register-box">
                    <strong id="header">
                        Login
                    </strong>
                    {alertMessage !== '' && (<AlertBox msg={alertMessage}></AlertBox>)}
                    <form id="register" onSubmit={handleSubmit}>
                        <label className="label-default">Name</label>
                        <input className="text-default" name="name" required={true} autoFocus={true}  value={userData.name} onChange={handleInput} />
                        <label className="label-default" required={true}>Email</label>
                        <input type="email" className="text-default"  name="email" value={userData.email} onChange={handleInput}/>
                        <label className="label-default" required={true}>Password</label>
                        <input type="password" className="text-default" name="password" value={userData.password} onChange={handleInput}/>
                        <div id="bottom-register">
                            <button type="submit" className="button-default" disabled={registering} id="btn-register">Register</button>                        
                        </div>                        
                    </form>                                        
                </section>
            </div>            
        </div>
    );
}
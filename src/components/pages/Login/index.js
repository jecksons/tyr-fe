import React, { useState } from 'react';
import './login.css';
import {Link, useHistory} from 'react-router-dom';
import {FcGoogle} from "react-icons/fc";
import {FaFacebookF} from "react-icons/fa";
import AlertBox from '../../controls/AlertBox';
import firebase from '../../../services/firebase';

export default function Login(){

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [alertMessage, setAlertMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const history = useHistory();


    function handleLoginData(e){
        setLoginData({...loginData, [e.target.name]:  e.target.value})        
    }

    function handleSubmit(e) {
        e.preventDefault();
        let currentPath =  window.location.pathname;
        async function login() {
            await firebase.login(loginData.email, loginData.password)
            .catch((error) => {
                setAlertMessage(error.message);
            }                    
            ).then(() => {                
                if (firebase.getCurrent()) {
                    if (currentPath === '/login') {
                        history.push('/');
                    } else {
                        history.push(currentPath);
                    }                                        
                }  else {
                    setProcessing(false);
                }                             
            });
        } 
        setProcessing(true);
        login();
    }

    function renderLogin() {
        return (
            <div id="login">
                <div id="login-align">
                    <section id="login-box">
                        <strong id="header">
                            Login
                        </strong>
                        {alertMessage !== '' && (<AlertBox msg={alertMessage}></AlertBox>)}
                        <form id="login" onSubmit={handleSubmit}>
                            <label className="label-default" >Email</label>
                            <input type="email" className="text-default"  autoFocus={true} required={true} value={loginData.email} name="email" onChange={handleLoginData}/>
                            <label className="label-default">Password</label>
                            <input type="password" className="text-default" required={true} value={loginData.password} name="password" onChange={handleLoginData}/>
                            <div id="bottom-login">
                                <button type="submit" id="btn-login" className="button-default" disabled={processing}>Login</button>                        
                            </div>                        
                        </form>                    
                        <div id="other-registers">
                            <button className="external-signup">
                                Google Login
                                <FcGoogle size={16} />
                            </button>
                            <button id="fb-login" className="external-signup">
                                Facebook Login 
                                <FaFacebookF size={16}/>
                            </button>
                        </div>                    
                        <div id="register">
                            <Link to="/register"> You still don't have a login?</Link>
                        </div>                    
                    </section>
                </div>            
            </div>
        );
    }
         
    return renderLogin(); 
}
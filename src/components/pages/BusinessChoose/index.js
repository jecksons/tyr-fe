import React, { useEffect, useState } from 'react';
import api from '../../../services/api';
import './styles.css';
import Select from 'react-select';
import { useHistory } from 'react-router';

export default function BusinessChoose(props){

    const [userBusinesses, setUserBusinesses] = useState([]);
    const [businessesLoaded, setBusinessesLoaded] = useState(false);
    const [newBusinessName, setNewBusinessName] = useState('');
    const [segmentOptions, setSegmentOptions] = useState([]);
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [formError, setFormError] = useState('');
    const [posting, setPosting] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [createNewBusiness, setCreateNewBusiness] = useState(false);
    const history = useHistory();

    const onSucessGetUser = () => {
        history.replace('/');
      };

    useEffect(() => {
        let isSubscribed = true;
        setBusinessesLoaded(false);
        if (props.userData && 
            props.userData.userID > 0 &&
            props.userData.isLogged === true) {           
            api.get(`/business/?user=${props.userData.userID}`)
            .then((ret) => {
                if (isSubscribed === true) {
                    const retBusiness = ret.data.map((itm) => {
                        return {
                            value: itm.id,
                            label: itm.name                        
                        };
                    });
                    setUserBusinesses(retBusiness);
                    setBusinessesLoaded(true);
                }
                
            });         
        } 
        return () => (isSubscribed = false);
    }, [props.userData]);

    useEffect(() => {        
        api.get(`/business_segments`)
        .then((ret) => {            
            const retSegments = ret.data.map((itm) => {
                return {
                    value: itm.id,
                    label:  <div className="option-select-img"><img src={itm.img} alt={`option ${itm.name}`}/>{itm.name}</div>
                };
            });
            setSegmentOptions(retSegments);            
        });             
    }, []);    

    function handleSelectSegment(option){
        if (option) {
            setSelectedSegment(option.value);        
        }        
    }

    function handleCreateBusiness(e) {
        e.preventDefault();
        const newBusiness = {
            name: newBusinessName,
            user: props.userData.userID,
            segment: selectedSegment
        };        
        setPosting(true);
        setFormError('');
        api.post('/business',
            newBusiness
        )
        .then((ret) => {
            if (props.onSelectBusiness) {
                props.onSelectBusiness(onSucessGetUser);
            }
        })
        .catch((err) => {
            setPosting(false);
            if (err.error) {
                setFormError(err.error);
            } else {
                setFormError(err);
            }           
        })
    }


    function getCreateForm(){
        return (
        <form className="create-business">
            <label className="label-default">Business segment</label>
            <Select 
                options={segmentOptions}
                onChange={handleSelectSegment}
                className="react-select-container">
            </Select>
            <label className="label-default">Name</label>
            <input className="text-default" value={newBusinessName} onChange={(e) => setNewBusinessName(e.target.value)}/>
            {
                formError !== '' && <div className="alert-message">{formError}</div>
            }
            <div className="bottom-form-create-business">
                <button className="button-default-action" 
                    disabled={ !selectedSegment || newBusinessName ==='' || posting } 
                    onClick={handleCreateBusiness}
                    >Create</button>
            </div>            
        </form>    
        );
    }

    function handleSelectBusiness(e){
        e.preventDefault();
        const postItem = {
            id_user: props.userData.userID,
            id_business: selectedBusiness
        };
        setPosting(true);
        api.post('/users/selectbusiness/',
            postItem
        )
        .then((ret) => {
            if (props.onSelectBusiness) {
                props.onSelectBusiness(onSucessGetUser);
            } else {
                setPosting(false);
            }
        })
        .catch((err) => {
            if (err.error) {
                setFormError(err.error);
            } else {
                setFormError(err);
            }
            setPosting(false);
        })
    }


    function renderSelectBusiness(){
        return (
            <section className="select-business">
                <h1>{`Hello, ${props.userData.name}!`}</h1>
                {createNewBusiness === true ? 
                    getCreateForm() : 
                    (
                        <div>
                            <form onSubmit={handleSelectBusiness}>
                                <h2>Please select your Business to continue</h2>
                                <Select
                                    options={userBusinesses}
                                    className="react-select-container"
                                    onChange={(option => {
                                        if (option) {
                                            setSelectedBusiness(option.value);
                                        } else 
                                            setSelectedBusiness(null);
                                    })}
                                    >                    
                                </Select>
                                <button className="button-default-action" 
                                    disabled={posting || !selectedBusiness}                        
                                    type="submit"
                                >Lets go!</button>                    
                            </form>
                            <button className="button-default"  
                                onClick={(e) => {setCreateNewBusiness(true)}}
                                id="set-create-business">
                            ...or you may need a <span>new Business</span>
                            </button>                
                        </div>
                    )
                }                
            </section>
        );
    }

    function renderConnectBusiness(){
        return (
            <section className="connect-business">
                <h2>You need to connect to an existent Business, contacthing their administrator</h2>
                <h3>or</h3>
                <h2>Create a new Business for you</h2>
                {getCreateForm()}            
            </section>
        )
    }
    

    if (props.userData && 
        props.userData.userID > 0 &&
        props.userData.isLogged === true) {
        return (
            <div   className="parent-page-center">
                <div className="client-center">           
                    <div  className="parent-container-controls">                            
                        {businessesLoaded ?                                                             
                                    userBusinesses.length >  0 ? 
                                    renderSelectBusiness() : 
                                    renderConnectBusiness()
                                    :
                                <strong id="loading-info">
                                    Loading data...                            
                                </strong>                                                
                        }
                        
                    </div>                                
                </div>
            </div>            
        )
    } else  {
        return null;        
    }
    
    
}
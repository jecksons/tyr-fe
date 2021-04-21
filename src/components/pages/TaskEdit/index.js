import React, {useEffect, useState} from 'react';
import './styles.css';
import api from '../../../services/api';
import FormButtons from '../../controls/FormButtons';
import {FaArrowLeft} from 'react-icons/fa';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import {BsFillPlusSquareFill} from 'react-icons/bs';
import {TiDelete} from 'react-icons/ti';
import {MdDeleteForever} from 'react-icons/md';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import {useHistory} from 'react-router-dom';
import moment from 'moment';
import Toast from '../../controls/Toast';
import PartnerEditModal from '../../controls/PartnerEditModal';
import ResourceEditModal from '../../controls/ResourceEditModal';
import ProductEditModal from '../../controls/ProductEditModal';

const DEF_EDIT_VALUES = {
        id: 0,
        name: '',
        details: '',
        location: '',
        id_product: 'produto',
        estimated_duration: '',
        id_task_type: 0,
        deadline: null,
        scheduled_start: null,
        id_partner: 0,
        task_code: ''
    };

const FS_INITIAL = 0;    
const FS_LOADED = 1;
const FS_POSTING = 2;


const CAPTION_FIELDS ={
    name: 'Description',
    details: 'Details',
    location: 'Location',
    id_product: 'Product',
    estimated_duration: 'Duration (in hours)',
    id_task_type: 'Task type',
    deadline: 'Deadline',
    scheduled_start: 'Scheduled start',
    id_partner: 'Partner'   
};

export default function TaskEdit(props){

    const [editingValues, setEditingValues] = useState({...DEF_EDIT_VALUES});
    const [formState, setFormState] = useState(FS_INITIAL);    
    const [formValidation, setFormValidation] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
    const [taskTypes, setTaskTypes] = useState([]);
    const [taskResources, setTaskResources] = useState([]);
    const [availableResources, setAvailableResources] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selResKey, setSelResKey] = useState(0);
    const [selTaskTypeKey, setSelTaskTypeKey] = useState(0);
    const [taskReadOnlyValues, setTaskReadOnlyValues] = useState({});
    const [nextStatusList, setNextStatusList] = useState([]);
    const [selStatusKey, setSelStatusKey] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [taskEvents, setTaskEvents] = useState([]);
    const [observationStatus, setObservationStatus] = useState('');
    const [alertMessageStatus, setAlertMessageStatus] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [toastMsg, setToastMsg] = useState('');
    const [defaultPartners, setDefaultPartners] = useState([]);
    const [showPartnerDialog, setShowPartnerDialog] = useState(false);
    const [selPartnerKey, setSelPartnerKey] = useState(0);
    const [showResourceDialog, setShowResourceDialog] = useState(false);
    const [resourceDefault, setResourceDefault] = useState(null);
    const [selProductKey, setSelProductKey] = useState(0);
    const [defaultProducts, setDefaultProducts] = useState([]);
    const [showProductDialog, setShowProductDialog] = useState(false);


    const defSelectStyle = {
        control: base => ({
          ...base,
          borderRadius: 0,
          borderTop: 0,
          borderLeft: 0,
          borderRight: 0,
          marginBottom: "1rem",
          borderBottom: "1px solid #c9c9c9",
          boxShadow: "none"
        })
    }

    const history = useHistory();



    useEffect(() => {
        let isSubscribed = true;
        api.get(`/task_types/available/?business=${props.userData.businessID}`)
        .then((ret) => {
            if (ret.status === 200) {
                if (isSubscribed === true){
                    let newTypes = [];

                    ret.data.forEach((item) => {
                        newTypes.push(
                            {
                                value: item.id,
                                label: item.name,
                                location_setting: item.location_setting,
                                product_setting: item.product_setting,
                                resource_setting: item.resource_setting,
                                scheduled_start_setting: item.scheduled_start_setting,
                                deadline_setting: item.deadline_setting
                            }
                        );
                    })
                    setTaskTypes(newTypes);
                }
                
            } else {
                console.log(ret);
            }
        })
        .catch((err) => console.log(err));

        api.get(`/resources/?onlyavailables=y&business=${props.userData.businessID}`)
        .then((ret) => {
            if (ret.status === 200) {
                if (isSubscribed === true){
                    let newRes = [];
                    ret.data.forEach((item) => {
                        newRes.push(
                            {
                                value: item.id,
                                label: item.name
                            }
                        );
                    })
                    setAvailableResources(newRes);
                }                
            } else {
                console.log(ret);
            }
        })
        .catch((err) => console.log(err));    
        return () => (isSubscribed = false);
    }, [props.userData]);

    useEffect(() => {                    
        const resetValidation = function() {
            let fmVal = {};
            Object.keys(DEF_EDIT_VALUES).forEach((key, index) => {
                if (key !== 'id') {
                    fmVal[key] = {
                        validated: false,
                        error: ''
                    };                
                }                
            });
            setFormValidation(fmVal);
        }                    


        const getTaskNextStatus = function() {
            api.get(`/tasks/nextstatus/${props.match.params.id}`,
            {
                validateStatus: (status) => status < 600
            }
            )
            .then((retStatus) => {
                if (retStatus.status === 200) {
                    setNextStatusList(
                        retStatus.data.map(
                            (staItem) => ({
                            value: staItem.id,
                            label: staItem.name
                            }) 
                        )
                    );                            
                } else {
                    if (retStatus.data.error) {
                        console.log(retStatus.data.error);
                    } else {
                        console.log(retStatus.statusText);
                    }                            
                }
            })
            .catch((errStatus) => {
                if (errStatus.data.error) {
                    console.log(errStatus.data.error);
                } else {
                    console.log(errStatus.statusText);
                }
            });
        }

        const getTaskEvents = function() {
            api.get(`/tasks/events/${props.match.params.id}`,
            {
                validateStatus: (status) => status < 600
            }
            )
            .then((retEve) => {
                if (retEve.status === 200) {
                    setTaskEvents(
                        retEve.data.map(
                            (eveItem) => (
                                {
                                    id: eveItem.id,
                                    event_date: eveItem.event_date,
                                    status_name: eveItem.status_name,
                                    observation: eveItem.observation
                                }
                            )
                        )
                    );                            
                } else {
                    if (retEve.data.error) {
                        console.log(retEve.data.error);
                    } else {
                        console.log(retEve.statusText);
                    }                            
                }
            })
            .catch((errEve) => {
                if (errEve.data.error) {
                    console.log(errEve.data.error);
                } else {
                    console.log(errEve.statusText);
                }
            });
        }        

        if (props.match.params.id) {
            setFormState(FS_INITIAL);
            api.get(`/tasks/id/${props.match.params.id}`,
                {
                    validateStatus: (status) => status < 600
                }
            )
            .then((ret) => {                
                if (ret.status === 200) {
                    const data = ret.data;
                    let newTask = {...DEF_EDIT_VALUES,
                        id: data.id,
                        name: data.name,
                        details: data.details,
                        estimated_duration: data.estimated_duration,
                        id_task_type: data.id_task_type,
                        id_task_status: data.id_task_status,
                        created: data.created,
                        task_code: data.task_code
                    };
                    if (data.location) {
                        newTask.location = data.location;
                    }
                    if (data.id_product) {
                        newTask.id_product = data.id_product;
                    }
                    if (data.deadline) {
                        newTask.deadline = data.deadline;
                    }
                    if (data.scheduled_start) {
                        newTask.scheduled_start = data.scheduled_start;
                    }       
                    let resItems = [];
                    if (data.resources) {
                        resItems = data.resources.map((item) => 
                        ({
                            id: item.id_resource,
                            name: item.name
                        })
                        );
                    }
                    let defPartners = [];
                    if (data.partner) {
                        defPartners.push({
                            value: data.partner.id,
                            label: data.partner.name
                        });
                        newTask.id_partner = data.partner.id;
                    };
                    setDefaultPartners(defPartners);
                    let defProducts = [];
                    if (data.product) {
                        defProducts.push({
                            value: data.product.id,
                            label: data.product.name
                        });
                        newTask.id_product = data.product.id;
                    };
                    setDefaultProducts(defProducts);
                    setTaskResources(resItems);                    
                    setTaskReadOnlyValues(
                        {
                            status: {
                                name: data.status.name, 
                                can_edit: data.status.can_edit
                            } ,
                            task_type: {
                                name: data.task_type.name, 
                                location_setting: data.task_type.location_setting,
                                product_setting: data.task_type.product_setting,
                                resource_setting: data.task_type.resource_setting,
                                scheduled_start_setting: data.task_type.scheduled_start_setting,
                                deadline_setting: data.task_type.deadline_setting
                            }
                        }
                    );
                    resetValidation();                    
                    setEditingValues(newTask);
                    setFormState(FS_LOADED);
                    setAlertMessage('');
                    setNextStatusList([]);
                    setTaskEvents([]);
                    getTaskNextStatus();
                    getTaskEvents();                   
                } else {
                    if (ret.data.error) {
                        setAlertMessage(ret.data.error);                        
                    } else {
                        setAlertMessage(ret.statusText);                        
                    }                 
                }
            })
        } else {
            setEditingValues({...DEF_EDIT_VALUES});
            setFormState(FS_LOADED);            
            setAlertMessage('');
            setTaskResources([]);                    
            resetValidation();
            setTaskReadOnlyValues(
                {
                    status: {
                        name: '', 
                        can_edit: true
                    } ,
                    task_type: {
                        name: '', 
                        location_setting: 0,
                        product_setting: 0,
                        resource_setting: 0,
                        scheduled_start_setting: 0,
                        deadline_setting: 0

                    }
                }
            );
        }       
    }, [props.match.params.id, refreshKey]);

    function renderHeader(){
        return (
            <section className="form-header" id="title-form">
                <div>
                    <button onClick={(e) => {e.preventDefault(); history.push('/tasks')}}>
                        <FaArrowLeft size={24}/>                    
                    </button>
                    <strong>
                        {
                            formState === FS_INITIAL ? 'Loading' : 
                                (
                                    editingValues.id === 0 ?  'NEW TASK' : `TASK ${editingValues.task_code}`
                                )                    
                        }
                    </strong>                                                               
                </div>
                <Toast message={toastMsg} onSetMsg={(msg) => {setToastMsg(msg)}}>
                </Toast>                
            </section>            
            
        );
    }

    function postingData(){
        return formState === FS_POSTING;
    }

    function handleValidation(target){
        let fmVal = {...formValidation};
        let keyVal =  fmVal[target.name];
        let nameCap = CAPTION_FIELDS[target.name];
        keyVal.error = '';
        keyVal.validated = true;        
        let fieldRequired = false;
        const fieldCfg = taskReadOnlyValues.task_type[`${target.name}_setting`];
        if (fieldCfg) {
            fieldRequired = fieldCfg === 2;            
        }        
        if (target.name === 'deadline' || target.name === 'scheduled_start') {
            if (fieldRequired === true) {
                if (!target.value) {
                    keyVal.error = `${nameCap} is required and cannot be empty.`;
                    keyVal.validated = false;
                }            
            }
            
        } else  if (target.name === 'id_task_type') {
            if (target.value <= 0) {
                keyVal.error = `${nameCap} is required and cannot be empty.`;
                keyVal.validated = false;
            }                        
        } else  if (target.name === 'id_partner') {
            if (target.value <= 0) {
                keyVal.error = `${nameCap} is required and cannot be empty.`;
                keyVal.validated = false;
            }                        
        } else  if (target.name === 'estimated_duration') {
            if (target.value <= 0) {
                keyVal.error = `${nameCap} is required and cannot be empty.`;
                keyVal.validated = false;
            }                        
        }          
        else if (fieldRequired === true){
            if (target.value === '') {
                keyVal.error = `${nameCap} is required and cannot be empty.`;
                keyVal.validated = false;
            }
        }       
        
        fmVal[target.name] = keyVal;
        setFormValidation(fmVal);
        return keyVal.validated;
    }

    function handleInput(e){
        setEditingValues({...editingValues, [e.target.name]: e.target.value});
        handleValidation(e.target);
    }

    function handleSubmit(e, action){
        const resetValidation = function() {
            let fmVal = {};
            Object.keys(DEF_EDIT_VALUES).forEach((key, index) => {
                if (key !== 'id') {
                    fmVal[key] = {
                        validated: false,
                        error: ''
                    };                
                }
                
            });
            setFormValidation(fmVal);
        }         

        const postTask = function () {
            let newTask = {
                name: editingValues.name,
                details: editingValues.details,
                location: editingValues.location,
                estimated_duration: editingValues.estimated_duration,
                id_task_type: editingValues.id_task_type,
                id_business: props.userData.businessID,
                id_user: props.userData.userID,
                id_partner: editingValues.id_partner,
            };
            const cfgField = taskReadOnlyValues.task_type;
            if (cfgField.deadline_setting > 0 && editingValues.deadline) {
                newTask.deadline = editingValues.deadline;
            }
            if (cfgField.scheduled_start_setting > 0 && editingValues.scheduled_start) {
                newTask.scheduled_start = editingValues.scheduled_start;
            }                
            if (cfgField.product_setting > 0 && editingValues.id_product > 0) {
                newTask.id_product = editingValues.id_product;
            }                            
            if (editingValues.id > 0) {
                newTask.id = editingValues.id;
            }
            newTask.resources = taskResources.map((resItem) =>  (
                {
                    id_resource: resItem.id
                }
            ) );      
            setFormState(FS_POSTING);
            api.post('/tasks',
                newTask,
                {
                    validateStatus: (status) => status < 600
                }
             )
             .then((ret) =>  {
                 setFormState(FS_LOADED);
                 if (ret.status === 200) {
                    if (action === 'saveandnew') {
                        setEditingValues({...DEF_EDIT_VALUES});               
                        setSelResKey(selResKey+1);   
                        setSelTaskTypeKey(selTaskTypeKey+1);                               
                        setDefaultProducts([]);
                        setDefaultPartners([]);                        
                        setSelProductKey(selProductKey +1);
                        setSelPartnerKey(selPartnerKey + 1);
                        setTaskResources([]);
                        resetValidation();                       
                        setToastMsg('Successfully saved!');
                    } else if (action === 'saveandcopy') {
                        setEditingValues({...editingValues, id: 0});
                        setToastMsg('Successfully saved!');
                    } else {
                        history.push('/tasks');
                    }
                    setAlertMessage('');                        
                 } else {
                     if (ret.data.error) {
                         setAlertMessage(ret.data.error);
                     } else {
                        setAlertMessage(ret.statusText);
                     }
                 }
             })
             .catch((err) =>  {
                setFormState(FS_LOADED);
                if (err.error) {
                    setAlertMessage(err.error);
                } else {
                   setAlertMessage(err);
                }                     
            });      
        }

        if (action === 'delete') {
            setFormState(FS_POSTING);
            api.delete(`/tasks/id/${editingValues.id}`,
                {
                    validateStatus: (status) => status < 600
                }
            )
            .then((ret) => {
                if (ret.status === 200) {
                    history.push('/tasks');
                } else {
                    if (ret.data.error) {
                        setAlertMessage(ret.data.error);
                    } else {
                        setAlertMessage(ret.statusText);
                    }
                    setFormState(FS_LOADED);
                }
            })
            .catch((err) => {
                if (err.error) {
                    setAlertMessage(err.error);
                } else {
                    setAlertMessage(err.message);
                }
            });            
        } else {
            const fmVal = {...formValidation};
            const keys =  Object.keys(fmVal);
            if (keys.every((item) => fmVal[item].validated === true)) {                
                postTask();                      
            } else {                    
                let afterVal = true;
                Object.keys(fmVal).forEach((key, idxKey) => {
                    let target = {
                        name: key,
                        value: editingValues[key]
                    };
                    if (afterVal) {
                        afterVal = handleValidation(target);
                    } else {
                        handleValidation(target);
                    }                    
                });              
                if (afterVal){
                    postTask();
                } else {
                    setAlertMessage('Verify the alert messages!');
                }                
            }
        }        
    }

    function handleTaskType(selectedOption){
        let selValue = 0;
        let configValues = {...taskReadOnlyValues};
        if (selectedOption){
            selValue = selectedOption.value;
            configValues.task_type.location_setting = selectedOption.location_setting;
            configValues.task_type.product_setting = selectedOption.product_setting;
            configValues.task_type.resource_setting = selectedOption.resource_setting;
            configValues.task_type.scheduled_start_setting = selectedOption.scheduled_start_setting;
            configValues.task_type.deadline_setting = selectedOption.deadline_setting;
        } else {
            configValues.task_type.location_setting = 0;
            configValues.task_type.product_setting = 0;
            configValues.task_type.resource_setting = 0;
            configValues.task_type.scheduled_start_setting = 0;
            configValues.task_type.deadline_setting = 0;
        }
        handleInput({target: {name: 'id_task_type', value: selValue} });
        setTaskReadOnlyValues(configValues);
    }

    function handleResource(selectedOption){        
        if (selectedOption) {
            setSelectedResource({...selectedOption});
            
        } else {
            setSelectedResource(null);
        }        
    }

    function handleAddNewResource(e){
        e.preventDefault();
        setShowResourceDialog(true);

    }

    const onCloseResourceDialog =  (newResource) => {
        setShowResourceDialog(false);
        if (newResource){
            const newResourceOption = {
                value: newResource.id,
                label: newResource.name
            };            
            let newItems = [...availableResources, newResourceOption];
            setAvailableResources(newItems);
            setResourceDefault(newResourceOption);
            const resourceKey =  selResKey + 1;
            setSelResKey(resourceKey);            
            handleResource(newResourceOption);
        }
    }    

    function getResourceSelect() {
        return (
            <div className="input-form">
                <div className="select-header">
                    <label className="label-default">Resources</label>
                    <button className="select-add-new" id="add-new-resource" onClick={handleAddNewResource}>Add new</button>
                    <ResourceEditModal
                            showDialog={showResourceDialog}
                            onSuccess={onCloseResourceDialog}
                            onCancel={onCloseResourceDialog}
                            userData={props.userData}
                            />                      
                </div>                
                <Select 
                    options={availableResources} 
                    key={selResKey} 
                    name="resource" 
                    onChange={handleResource} 
                    isClearable={true} 
                    styles={defSelectStyle}
                    defaultValue={resourceDefault}
                    />                                 
            </div>  
            );               
    }


    const loadPartnerOptions = (inputValue, callback) => {        
        setTimeout(() => {                        
            api.get(`/partners/taskavailable/?business=${props.userData.businessID}&offset=0&limit=30&searchtext=${inputValue}`)
            .then((ret) => {                
                const items = ret.data.results.map((itm) => {
                    return {
                        value: itm.id,
                        label: itm.name
                    };
                });
                callback(items);                
            });                        
        }, 2500);
    }

    const loadProductOptions = (inputValue, callback) => {        
        setTimeout(() => {                        
            api.get(`/products/taskavailable/?business=${props.userData.businessID}&offset=0&limit=30&searchtext=${inputValue}`)
            .then((ret) => {                
                const items = ret.data.results.map((itm) => {
                    return {
                        value: itm.id,
                        label: itm.name
                    };
                });
                callback(items);                
            });                        
        }, 2500);
    }

    function handlePartner(selectedOption){
        let selValue = 0;
        if (selectedOption){
            selValue = selectedOption.value;
        }
        handleInput({target: {name: 'id_partner', value: selValue} });
    }

    const onClosePartnerDialog =  (newPartner) => {
        setShowPartnerDialog(false);
        if (newPartner){
            const newPartnerOption = {
                value: newPartner.id,
                label: newPartner.name
            };            
            setDefaultPartners([newPartnerOption]);
            handlePartner(newPartnerOption);        
            const partnerKey =  selPartnerKey+1;
            setSelPartnerKey(partnerKey);
        }
    }

    function handleProduct(selectedOption){
        let selValue = 0;
        if (selectedOption){
            selValue = selectedOption.value;
        }
        handleInput({target: {name: 'id_product', value: selValue} });
    }


    const onCloseProductDialog =  (newProduct) => {
        setShowProductDialog(false);
        if (newProduct){
            const newOption = {
                value: newProduct.id,
                label: newProduct.name
            };            
            setDefaultProducts([newOption]);
            handleProduct(newOption);        
            const productKey =  selProductKey+1;
            setSelProductKey(productKey);
        }
    }    




    function getInputText(name){
        let label = CAPTION_FIELDS[name];
        if (name === 'deadline' || name === 'scheduled_start') {
            return (
            <div className="input-form-dates">
                <label className="label-default">{label}</label>
                <div className="pos-date-input">
                    <KeyboardDatePicker  
                        value={editingValues[name]} 
                        onChange={(date) => handleDateInput(name, date)} 
                        clearable
                        required
                        format="DD/MM/yyyy"                    
                    />
                </div>                
                <div className="invalid-input">{formValidation[name].error}</div>        
            </div>                     
            )        
        }         
        else if (name === 'estimated_duration') {
            return (
            <div className="input-form-dates">
                <label className="label-default">{label}</label>
                <input 
                    name={name}
                    type="number"
                    value={editingValues[name]} 
                    onChange={(e) => handleInput(e)}
                    className={`text-default${formValidation[name].error !== '' ? '-error' : ''}`}
                    />
                <div className="invalid-input">{formValidation[name].error}</div>        
            </div>  
            );                      
        } 
        else if (name === 'id_task_type') {
            return (
            <div className="input-form">
                <label className="label-default">{label}</label>
                <Select 
                    options={taskTypes} 
                    key={selTaskTypeKey} 
                    name="id_task_type" 
                    onChange={handleTaskType} 
                    isClearable={true} 
                    styles={defSelectStyle}
                    autoFocus={true}
                    />                                 
                <div className="invalid-input">{formValidation[name].error}</div>        
            </div>  
            );                      
        } else if (name === 'id_partner') {
            return (
                <div className="input-form">
                    <div className="select-header" >
                        <label className="label-default">{label}</label>
                        <button className="select-add-new" 
                            onClick={(e) => {
                                e.preventDefault();
                                setShowPartnerDialog(true);
                            }}>Add new</button>
                        <PartnerEditModal
                            showDialog={showPartnerDialog}
                            onSuccess={onClosePartnerDialog}
                            onCancel={onClosePartnerDialog}
                            userData={props.userData}
                            />  
                    </div>                                  
                    <AsyncSelect 
                        cacheOptions
                        loadOptions={loadPartnerOptions}
                        defaultOptions
                        className="react-select-container"
                        name={name}
                        key={selPartnerKey}
                        isClearable
                        defaultValue={defaultPartners.length > 0 ? defaultPartners[0] : null}
                        onChange={handlePartner}
                    />                                                     
                    <div className="invalid-input">{formValidation[name].error}</div>        
                </div>  
                );                 
        } else if (name === 'id_product') {
            return (
                <div className="input-form">
                    <div className="select-header" >
                        <label className="label-default">{label}</label>
                        <button className="select-add-new" 
                            onClick={(e) => {
                                e.preventDefault();
                                setShowProductDialog(true);
                            }}>Add new</button>
                        <ProductEditModal
                            showDialog={showProductDialog}
                            onSuccess={onCloseProductDialog}
                            onCancel={onCloseProductDialog}
                            userData={props.userData}
                            />  
                    </div>                                  
                    <AsyncSelect 
                        cacheOptions
                        loadOptions={loadProductOptions}
                        defaultOptions
                        className="react-select-container"
                        name={name}
                        key={selProductKey}
                        isClearable
                        defaultValue={defaultProducts.length > 0 ? defaultProducts[0] : null}
                        onChange={handleProduct}
                    />                                                     
                    <div className="invalid-input">{formValidation[name].error}</div>        
                </div>  
                );                 
        }   else
        return (
            <div className="input-form">
                <label className="label-default">{label}</label>
                <input 
                    name={name}
                    value={editingValues[name]} 
                    onChange={(e) => handleInput(e)}
                    className={`text-default${formValidation[name].error !== '' ? '-error' : ''}`}
                    />
                <div className="invalid-input">{formValidation[name].error}</div>        
            </div>
        );        
    }

    function addResource(e){
        e.preventDefault();
        if (selectedResource) {
            if (!taskResources.find((item) => item.id === selectedResource.value)) {
                let newRes = {
                    id: selectedResource.value,
                    name: selectedResource.label
                };
                setTaskResources([...taskResources, newRes]);
                setResourceDefault(null);
                setSelResKey(selResKey+1);
            }            
        }
    }

    function handleDeleteResource(e, item){
        e.preventDefault();
        let newRes = [...taskResources];
        newRes = newRes.filter((res) => res.id !== item.id);
        setTaskResources(newRes);
    }

    function renderResources(){
        if (taskResources.length > 0) {
            return (
                <div id="resource-list">
                    <ul>
                        {taskResources.map((item) => 
                            <li  key={item.id}>
                                    {item.name} 
                                    <button  onClick={(e) => handleDeleteResource(e, item) }>
                                        <TiDelete alt="delete"/>
                                    </button> </li>
                            )
                        }
                    </ul>
                    <button className="btn-form-full" 
                        onClick={
                            (e) => {
                                    e.preventDefault()
                                    setTaskResources([]);
                                }
                        }>
                        <MdDeleteForever size={24}/>
                    </button>
                </div>
            )
        }        
    }

    function handleDateInput(name, date){
        handleInput({target: {name: name, value: date}} );
    }


    function renderInfoTaskTop(){
        return (
            <div id="horiz-align">
                <div className="input-form">
                    <label className="label-default">Type</label>
                    <span className="text-ro-default">{taskReadOnlyValues.task_type.name}</span>
                </div>
                <div className="input-form" id="task-status">
                    <label className="label-default">Status</label>            
                    <span className="text-ro-default">{taskReadOnlyValues.status.name}</span>
                </div>
            </div>                        
        );
    }

    function handleActionClick(e) {
        e.preventDefault();
        setFormState(FS_POSTING);        
        if (selectedStatus) {
            let newStatus = {
                id: editingValues.id,
                id_task_status: selectedStatus.value,
                observationStatus: observationStatus
            }
            api.post('/tasks',
                newStatus,
                {
                    validateStatus: (status) => status < 600
                }            
            )
            .then((ret) => {
                setFormState(FS_LOADED);        
                if (ret.status === 200) {
                    setAlertMessageStatus();
                    setObservationStatus('');
                    setSelStatusKey(selStatusKey+1);
                    setSelectedStatus(null);
                    setRefreshKey(refreshKey+1);                                        
                } else {
                    if (ret.data.error) {
                        setAlertMessageStatus(ret.data.error)
                    } else {
                        setAlertMessageStatus(ret.statusText)
                    }
                }                
            })
            .catch((err) => {
                if (err.data.error) {
                    setAlertMessageStatus(err.data.error)
                } else {
                    setAlertMessageStatus(err.statusText)
                }
                setFormState(FS_LOADED);        
            });
        }
    }


    function renderActions(){
        return (                           
            <div className="parent-container-controls" id="parent-task-actions" >
                <form id="task-actions">
                    <section className="form-header">
                        <strong>Actions</strong>
                    </section>                               
                    <div className="input-form">
                        <label className="label-default">Change status to</label>
                        <Select 
                            options={nextStatusList} 
                            key={selStatusKey} 
                            name="id_task_status" 
                            onChange={setSelectedStatus} 
                            isClearable={true} 
                            styles={defSelectStyle}/>                                                 
                    </div>
                    <div className="input-form">
                        <label className="label-default">Observation</label>
                        <input className="text-default" value={observationStatus} onChange={(e) => setObservationStatus(e.target.value)}/>            
                    </div>                    
                    <div className="alert-message">                            
                        {alertMessageStatus !== '' && <span>{alertMessageStatus}</span>}
                    </div>                    
                    <button className="button-default-action" disabled={!selectedStatus || postingData()} onClick={handleActionClick}>Confirm</button>                    
                </form>            
            </div>            
        );
    }

    function renderTimeline(){
       

        return (
            <div className="parent-container-controls" id="timeline">
                <section className="form-header">
                    <strong>Timeline</strong>
                </section>                
                <ul>
                    {taskEvents.map((item) => {
                        return (
                            <li key={item.id}>
                                {item.status_name}
                                <br/>
                                <div id="normal-timeline-item">
                                    <span>{moment(item.event_date).fromNow()}</span>
                                </div>
                                <div id="normal-timeline-item-hover">
                                    <p>
                                        <span>{moment(item.event_date).format('llll')}</span>
                                        <br/>
                                        {item.observation}
                                    </p>                                    
                                </div>                                
                            </li>
                        );
                    })}
                </ul>
                
            </div>
        );
    }

    function renderForm(){
        return (
            <div>
                <MuiPickersUtilsProvider  utils={MomentUtils}>
                    <form id="edit-task">
                    <section >
                        <strong>Identifying</strong>
                        {
                            editingValues.id === 0 ? 
                            getInputText('id_task_type') : 
                            renderInfoTaskTop()
                        }                            
                        {getInputText('name')}
                        {getInputText('id_partner')}
                    </section>
                    <section >
                        <strong>What will be made</strong>
                        <div id="horiz-align">
                            {taskReadOnlyValues.task_type.location_setting > 0 && getInputText('location' )}
                            {taskReadOnlyValues.task_type.product_setting > 0 && getInputText('id_product')}
                        </div>                        
                        {getInputText('details')}                      
                    </section>
                    <section >
                        <strong>Planning</strong>
                        <div id="horiz-align">
                            {getInputText('estimated_duration')}                      
                            {taskReadOnlyValues.task_type.deadline_setting > 0 && getInputText('deadline')}                      
                            {taskReadOnlyValues.task_type.scheduled_start_setting > 0 &&  getInputText('scheduled_start')}                      
                        </div>                        
                        {taskReadOnlyValues.task_type.resource_setting > 0 && 
                            (
                                <div id="resources">
                                    <div id="resources-header">
                                        {getResourceSelect()}
                                        <button  className="btn-form-full" id="btn-add-resource" onClick={(e) => addResource(e)}>
                                            <BsFillPlusSquareFill alt="plus resource" size={24} ></BsFillPlusSquareFill>
                                        </button>
                                    </div>
                                    {renderResources()}                            
                                </div>                       
                            )                        
                        }                        
                    </section>
                    <div className="alert-message">                            
                        {alertMessage !== '' && <span>{alertMessage}</span>}
                    </div>
                    <FormButtons
                         postingData={postingData()}  
                         hideDelete={editingValues.id === 0}
                         onClick={handleSubmit}>

                    </FormButtons>
                    </form>
                </MuiPickersUtilsProvider>
            </div>
        )         
    }

    function renderLoading(){
        return <strong>Loading</strong>

    }   

    function renderTask(){

        return (
            <div id="back-align-horiz" >
                <div className="parent-container-controls">
                    {renderHeader()}
                    <hr/>
                    {renderForm()}
                </div>                
                {editingValues.id > 0 &&
                    (
                        <div id="task-side-options">
                            {nextStatusList.length > 0 && renderActions()}
                            {renderTimeline()}
                        </div>
                    )
                }                   
            </div>
        )
    }

        

    return (
        <div className="parent-page-center">
            <div className="client-center">
                {formState === FS_INITIAL ? renderLoading() : renderTask()}                                      
            </div>            
        </div>
    )

}

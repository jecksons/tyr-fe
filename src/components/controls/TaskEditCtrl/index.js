import './taskeditctrl.css';
import React, {useCallback, useEffect, useState} from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import Select from 'react-select';
import firebase from '../../../services/firebase';
import { useHistory } from 'react-router';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';


const initialTask = {
    id: '',
    title: '',
    location: '', 
    who: '', 
    whoOption: {value: ''},
    when: (new Date()),
    status: '',
    details: ''
};

const resources = [
    {value: '0', label: 'John'},
    {value: '1', label: 'Ribamar'},
    {value: '2', label: 'Mirosmar'},
    {value: '3', label: 'Pikachu'},
    {value: '4', label: 'Nino Paraíba'}
];

export default function TaskEditCtrl(props) {

    const whoSelectStyle = {
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


    const [task, setTask] = useState(
        initialTask
    );

    const history = useHistory();

    const [postingData, setPostingData] = useState(false);
    const [alertMessage, setAlertMessage]  = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingKey, setEditingKey] = useState(0);    
    const [loadedTask, setLoadedTask] = useState(false);

    function showSuccessMessage(){
        setSuccessMessage('Task sucessfully saved!');
        setTimeout(() => {
            setSuccessMessage('')

        }, 5000);
    }        

    function handleTask(e) {
        setTask({...task, [e.target.name]: e.target.value});
    }


    const handleWho = useCallback((selectedOption) => {
        const newTask = {...task};
        if (selectedOption) {
            newTask.who = selectedOption.label;
            newTask.whoOption = selectedOption;
        } else {
            newTask.who = '';
            newTask.whoOption = null;
        }        
        setTask(newTask);
    }, [task]);


    function onClickSubmit(e, action){
        e.preventDefault();  
        setPostingData(true);

        try{
            if (task.who === '') {
                throw new Error('Please select who will made!');
            }            
            const newTask = {
                title: task.title,
                location: task.location,
                who: task.who,
                whoID: task.whoOption.value,
                when: task.when,
                status: 'open',
                details: task.details
            };
            if (task.when._d) {
                newTask.when = task.when._d;
            } 
            console.log(newTask);

            async function saveTask(){
                let tasks = firebase.fb.collection('task');               
                let taskDoc;
                if (task.id !== '') {
                    taskDoc = tasks.doc(task.id); 
                } else {
                    taskDoc = tasks.doc(); 
                }
                taskDoc.set(
                    newTask
                )
                .then( () => {                    
                    if (action === 'save') {
                        history.push('/tasks');
                    } else if (action === 'saveandnew') {
                        setAlertMessage('');                    
                        setPostingData(false);
                        showSuccessMessage();
                        setTask({...initialTask});
                        /* reseta o who */
                        let editActual = editingKey;
                        editActual++;
                        setEditingKey(editActual);                        
                    } else if (action === 'saveandcopy') {
                        setAlertMessage('');                    
                        setPostingData(false);
                        showSuccessMessage();
                    }                                                                                
                }  
                )
                .catch((error) => {
                    setAlertMessage(error.message);        
                    setPostingData(false);
                });
            }
            saveTask();
        } catch(error) {
            setAlertMessage(error.message);        
            setPostingData(false);
        } 
    }

    function handleWhen(date) {
        setTask({...task, when: date});
    }

    function handleSubmit(e) {
        onClickSubmit(e, 'save');        
    }

    function renderform() {        

        if  (loadedTask && (!props.id || (loadedTask && task.id === props.id)) ) {
            return (
                <form className="task" onSubmit={handleSubmit}   >
                    <label className="label-default">Title</label>
                    <input type="text" required={true} value={task.title} onChange={handleTask} placeholder="Caption this task" className="text-default" name="title" autoFocus/> 
                    <label className="label-default">Where</label>
                    <input type="text" required={true} value={task.location} onChange={handleTask} placeholder="Where this task will be made" className="text-default" name="location"/> 
                    <label className="label-default">Who</label>
                    <Select options={resources}  key={editingKey} name="who" onChange={handleWho} isClearable={true} styles={whoSelectStyle} defaultValue={task.whoOption} />                       
                    <label className="label-default">When</label>
                    <MuiPickersUtilsProvider  utils={MomentUtils}>
                        <KeyboardDatePicker  
                            value={task.when} 
                            onChange={handleWhen} 
                            clearable
                            required
                            format="DD/MM/yyyy"
                        />
                    </MuiPickersUtilsProvider>                
                    <label className="label-default">Details</label>
                    <textarea id="details" className="textarea-default" required={true} name="details" value={task.details} onChange={handleTask}  />
                    <hr/>
                    <div id="bottom-buttons">
                        <button type="submit" value="save" className="button-default" disabled={postingData}>Save</button>
                        <button className="button-default" onClick={(e) => onClickSubmit(e, 'saveandnew')} disabled={postingData}>Save and New</button>
                        <button className="button-default" onClick={(e) => onClickSubmit(e, 'saveandcopy')} disabled={postingData}>Save and Copy</button>
                    </div>                        
                </form>
            );
        } else {
            return null;
        }        
    }

    function getTitleText(){
        let sTitle = '';        
        if (!props.id) {
            sTitle =  'NEW TASK';
        } else {
            if (loadedTask) {
                if (props.id  === task.id) {
                    sTitle =  'EDITING';
                }
            } else {
                sTitle = 'Loading';
            }
        }
        return (sTitle);
    }

    function backToTasks(){
        history.push('/tasks');
    }


    function renderHeader(){
        return (
            <div id="header-task">
                <div id="start-header-task" >
                    <button type="button" onClick={backToTasks}>
                        <FaArrowLeft alt="back" size={24}>
                        </FaArrowLeft>                            
                    </button>                                            
                    <h1 id="title">{getTitleText()}</h1>                    
                </div>
                {
                    successMessage !== ''  &&
                    (
                        <div id="success-div">
                            <strong>{successMessage}</strong>                            
                        </div>         
                    )
                }                        
            </div>
        )
    }

    function renderAlert() {
        return alertMessage !== '' && 
                        (
                            <div id="alert-div">
                                <strong id="alert-message">{alertMessage}</strong>
                            </div>                            
                        );                        
    }

    useEffect(() => {      
        console.log('no effect');
        async function getTaskInfo(taskID) {
            firebase.fb.collection('task').doc(taskID).get().then((snapshot) => {
                let taskupd = {...initialTask};           
                if (snapshot.exists) {                    
                    let item = snapshot.data();                    
                    taskupd.id = snapshot.id;
                    taskupd.title = item.title;
                    taskupd.location = item.location;
                    taskupd.status = item.status;
                    taskupd.when = (new Date(item.when.seconds * 1000));
                    taskupd.details = item.details;
                    taskupd.who = item.who;
                    taskupd.whoOption = resources.find( (element) => (element.value === item.whoID));                    
                } else {
                    taskupd.id = '';
                    setAlertMessage('Task not found!');
                }
                setLoadedTask(true);
                setTask(taskupd);     
            });        
        }
        if (props.id && props.id !== '') {
            getTaskInfo(props.id);
        } else {            
           let taskupd = {...initialTask};            
            setTask(taskupd);                 
            setLoadedTask(true);
            console.log('setou task');
        }

    }, [props]);    

    return (
        <section id="info-task">
            {renderHeader()}
            <hr/>
            {renderAlert()}
            {renderform()}                    
        </section>                
    );

}
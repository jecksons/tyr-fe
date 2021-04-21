import React, { useState } from 'react';
import EditDialog from '../EditDialog';

export default function ProductEditModal(props){

    const [editingValues, setEditingValues] = useState({
        name: ''
    });

    const getAddModel = () => {
        return {
            name: editingValues.name,
            id_business: props.userData.businessID,            
        };        
    };

    const handleInputChange = (e)  => {
        let newValues = {...editingValues, [e.target.name]: e.target.value}
        setEditingValues(newValues);
    }

    const resetEditingValues = () => {
        setEditingValues({name: ''});        
    }    

    const renderFormContent = () => {
        return (
            <div>
                <div className="input-form">
                    <label className="label-default">Name</label>
                    <input className="text-default"  
                            value={editingValues.name} 
                            autoFocus
                            required
                            name="name"
                            onChange={handleInputChange}/>                          
                </div>
            </div>
        )  
    }

    return (
        <EditDialog 
            onCancel={props.onCancel}
            onSuccess={props.onSuccess}
            resetEditingValues={resetEditingValues}
            title="NEW PRODUCT"
            apiURL="products/"
            getAddModel={getAddModel}
            formContent={renderFormContent}
            showDialog={props.showDialog}
        />
    );

};
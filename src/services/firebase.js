import app from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import api from './api';


let firebaseConfig = {
    apiKey: "AIzaSyBAX2texXXBX-NwHj-dHvm2s7W--WUKRGY",
    authDomain: "tyrproject-e21c5.firebaseapp.com",
    projectId: "tyrproject-e21c5",
    storageBucket: "tyrproject-e21c5.appspot.com",
    messagingSenderId: "631276829823",
    appId: "1:631276829823:web:f5fd7b5999d5afa5d5d34a",
    measurementId: "G-18LYSCSDHN"
  };


class Firebase {

    constructor(){
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);                    
        }        
        this.db = app.database();                    
        this.fb = app.firestore();
        this.storage = app.storage();
    }

    monitoreStateChanged(callback) {
        return app.auth().onAuthStateChanged(callback);
    }

    isInitialized(){
        return new Promise(resolve =>  {
            app.auth().onAuthStateChanged(resolve);
        });
    }    

    getCurrent(){
        return app.auth().currentUser && app.auth().currentUser.email;
    }    


    async register(name, email, password){
        await app.auth().createUserWithEmailAndPassword(email, password);
        const user = app.auth().currentUser;
        const uid = app.auth().currentUser.uid;
        const updUser = {
            name: name,
            uid: uid,
            email: email
        };
        await api.post('/users', updUser);        
        await user.updateProfile({
                displayName: name
                }
            );            
        return app.database().ref('user').child(uid).set({
            name: name,
            email: email
        });    
    }

    login(email, password) {
        return app.auth().signInWithEmailAndPassword(email, password);
    }

    logout(){
        return app.auth().signOut();
    }

    dateToTimeStamp(date){
        return app.firestore.Timestamp.fromDate(date);
    }

    async getUserName(callback) {
        if (!app.auth().currentUser) {
            return null;
        } 
        const uid = app.auth().currentUser.uid;
        await this.db.ref('user').child(uid).once('value')
        .then(callback);
    }

}

export default new Firebase();
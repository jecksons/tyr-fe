import './css/settings.css';
import './css/elements.css';
import './css/components.css';
import Header from './components/controls/Header';
import Footer from './components/controls/Footer';
import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import Tasks from './components/pages/Tasks';
import NotFound from './components/pages/NotFound';
import firebase from './services/firebase';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import TaskEdit from'./components/pages/TaskEdit';
import Resources from './components/pages/Resources';
import ResourceEdit from './components/pages/ResourceEdit';
import ProtectedRoute from './ProtectedRoute';
import BusinessChoose from './components/pages/BusinessChoose';
import api from './services/api';


class App extends Component {

  constructor (props){
    super(props);
    //this.onAuthChanged = thids;
    this.onChangeUserLogin = this.onChangeUserLogin.bind(this);
    this.onSelectBusiness = this.onSelectBusiness.bind(this);
  }

  state = {
    firebaseState: 0,
    userData: {
      userID: 0,
      name: '',
      email: '',
      uid: '',
      isLogged: false,
      businessID: 0,
      businessName: ''
    }    
  };  

  onChangeUserLogin(user, onSucessGetUser){
    let userData = {
      userID: 0,
      name: '',
      email: '',
      uid: '',
      isLogged: false,
      businessID: 0,
      businessName: ''
    }
    let firebaseState = this.state.firebaseState;
    if (user) {
      if (user.uid !== ''){
        userData.email = user.email;
        if (user.name) {
          userData.name = user.name
        } else {
          userData.name = user.displayName;
        }        
        userData.uid = user.uid;
      }
    }                
    firebaseState++;    
    if (userData.uid !== ''){
      api.get(`/users/uid/${userData.uid}`)
      .then((ret) => {
        userData.isLogged = true;
        userData.userID = ret.data.id;
        if (ret.data.business) {
          userData.businessID = ret.data.business.id;
          userData.businessName = ret.data.business.name;
        }        
        this.setState({firebaseState, userData});          
        if (onSucessGetUser) {
          onSucessGetUser();
        }
      })
      .catch((err) => {
        console.log('erro');
        console.log(err);
      });
    } else {
      this.setState({firebaseState, userData});  
    }
  }

  onSelectBusiness(onSucessGetUser){    
    let oldUser = {...this.state.userData};    
    this.onChangeUserLogin(oldUser, onSucessGetUser);    
  }
  
  
  componentDidMount(){    
    this.onAuthChanged = firebase.monitoreStateChanged(this.onChangeUserLogin);
  }

  
  componentWillUnmount(){
    this.onAuthChanged &&  this.onAuthChanged();
    this.onAuthChanged = undefined;
  }

  

  render() {
    if (this.state.firebaseState !== 0 ) {
      return (
        <div>
          <div id="app-main-content">
            <div id="main-content-client">
              <BrowserRouter>                                
                <Route render={(props) =>  <Header userData={this.state.userData}  locationpath={props.location.pathname} /> } ></Route>            
                <Switch>
                  <Route exact path="/"  component={Home}  />              
                  <Route exact path="/login"  component={Login} />
                  <Route exact path="/register"  component={Register} />                  
                  <BusinessChoose exact path="/businesschoose"  userData={this.state.userData} onSelectBusiness={this.onSelectBusiness} />
                  <ProtectedRoute exact path="/tasks"  component={Tasks} userData={this.state.userData} />
                  <ProtectedRoute exact path="/tasks/:id"  component={ TaskEdit} userData={this.state.userData} />
                  <ProtectedRoute exact path="/newtask"   component={ TaskEdit} userData={this.state.userData} />
                  <ProtectedRoute exact path="/resources"  component={Resources} userData={this.state.userData} />
                  <ProtectedRoute exact path="/resources/:id"  component={  ResourceEdit} userData={this.state.userData} />
                  <ProtectedRoute exact path="/newresource"  component={ ResourceEdit} userData={this.state.userData} />                  
                  <Route path="*"  component={NotFound} />
                </Switch>                    
              </BrowserRouter>                    
            </div>
          </div>
        <Footer/>            
        </div>        
      );
    } else {
        return (        
          <div>
            <strong>Carregando</strong>
          </div>
        );        
    }          
  }  
}

export default App;

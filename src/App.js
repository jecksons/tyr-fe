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


class App extends Component {

  constructor (props){
    super(props);
    //this.onAuthChanged = thids;
    this.onChangeUserLogin = this.onChangeUserLogin.bind(this);
  }

  state = {
    firebaseState: 0,
    userData: {
      name: '',
      email: '',
      uid: '',
      isLogged: false
    }    
  };

  onChangeUserLogin(user){
    let userData = {
      name: '',
      email: '',
      uid: '',
      isLogged: false
    }
    let firebaseState = this.state.firebaseState;

    if (user) {
      if (user.uid !== ''){
        userData.email = user.email;
        userData.name = user.displayName;
        userData.uid = user.uid;
        userData.isLogged = true;          
      }
    }                
    firebaseState++;
    this.setState({firebaseState, userData});  
  }
  
  
  componentDidMount(){    
    this.onAuthChanged = firebase.monitoreStateChanged(this.onChangeUserLogin);
  }

  
  componentWillUnmount(){
    this.onAuthChanged &&  this.onAuthChanged();
    this.onAuthChanged = undefined;
  }

  render() {
    console.log(document.location.pathname);

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
                  <Route exact path="/tasks"  component={Tasks} />
                  <Route exact path="/tasks/:id"  component={ (this.state.userData && this.state.userData.isLogged) ? TaskEdit : Login} />
                  <Route exact path="/newtask"   component={ (this.state.userData && this.state.userData.isLogged) ? TaskEdit : Login} />
                  <Route exact path="/resources"  component={Resources} />
                  <Route exact path="/resources/:id"  component={ (this.state.userData && this.state.userData.isLogged) ? ResourceEdit : Login} />
                  <Route exact path="/newresource"  component={ (this.state.userData && this.state.userData.isLogged) ? ResourceEdit : Login} />
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

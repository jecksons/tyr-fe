import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import app_logo from  "../../img/logo.png";
import './header.css';
import plus_icon from "../../img/plus.png";
import {FiLogOut, FiLogIn, FiMenu} from 'react-icons/fi';
import firebase from '../../../services/firebase';
import  '../../../App.js';


class Header extends Component {


    constructor (props){
        super(props);
        this.handleLogoff = this.handleLogoff.bind(this);        
        this.renderEndLinks = this.renderEndLinks.bind(this);
        this.renderNavMain = this.renderNavMain.bind(this);
        this.renderDivMenuHidden = this.renderDivMenuHidden.bind(this);
        this.toggleShowHiddenMenu = this.toggleShowHiddenMenu.bind(this);
        this.state = {
            showHiddenMenu: false,
            locationShowingMenu: ''
        };
    }

    toggleShowHiddenMenu() {     
        const showingNow = (this.state.showHiddenMenu && this.props.locationpath === this.state.locationShowingMenu);
        let newState = {
            showHiddenMenu:  (showingNow === false),
            locationShowingMenu: this.props.locationpath
        };

        this.setState(
            newState
        );
    }

    

    handleLogoff(){
        firebase.logout();
        this.props.history.push('/login');
    }

    renderEndLinks(withText) {
        return (
            <div>
                <Link  to="/newtask"  id="new-task">
                    {withText === true ? 'New Task' : null}
                    <img src={plus_icon} alt="add-task"></img>
                </Link>                                                                                     
                {
                    this.props.userData.isLogged ? 
                    (
                        <Link to="#"  id="logoff" onClick={this.handleLogoff}>
                            {withText === true ? 'Logoff' : null}                            
                            <FiLogOut></FiLogOut>
                        </Link> 
                    ) : 
                    (
                        <Link  to="/login"  id="login">
                            {withText === true ? 'Login' : null}                            
                            <FiLogIn size={20} ></FiLogIn>
                        </Link> 
                    )
                }      
            </div>
        )
    }


    renderDivMenuHidden(){
        return (
            <div id="menu-hidden" 
                className={
                        (this.state.showHiddenMenu && this.props.locationpath === this.state.locationShowingMenu) ? 
                        'show' : 
                        ''} >
                {this.renderNavMain()}
            </div>
        );

    }

    renderNavMain(){
        return (
            <nav className="nav-menu">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/schedule">Schedule</Link></li>
                    <li><Link to="/tasks">Tasks</Link></li>
                    <li><Link to="/resources">Resources</Link></li>
                </ul>
            </nav>
        );                       
    }





    render(){
        return (
            <div>
                <header id={this.props.locationpath === '/' ? 'header-main-home' : 'header-main' }  >
                    <section id="header-section" >                        
                        <div id="menu">                                                   
                            <button id="btn-menu" 
                                onClick={(e) => {
                                        e.preventDefault(); 
                                        this.toggleShowHiddenMenu();
                                    } 
                                }>
                                <FiMenu size={20} >
                                </FiMenu>
                            </button>
                            <Link to="/">
                                <img src={app_logo} alt="logo" className="logo"/> 
                            </Link>                            
                            {this.renderNavMain()}
                        </div>
                        <div id="menu-end"  className="menu-end-class">
                            {this.props.userData.isLogged && (<span>Hi, {this.props.userData.name}!</span>)}
                            {this.renderEndLinks(true)}                                              
                        </div>
                        <div id="menu-end-small" className="menu-end-class">
                            {this.props.userData.isLogged && (<span>Hi, {this.props.userData.name}!</span>)}
                            {this.renderEndLinks(false)}                                              
                        </div>
                    </section>                    
                </header>
                {this.renderDivMenuHidden()}
            </div>
        );
    }
}

export default withRouter(Header);
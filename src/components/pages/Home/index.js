import React, {Component} from 'react';
import './home.css';
import {withRouter} from 'react-router-dom';


class Home extends Component {

    constructor(props) {
        super(props);
        this.getCard = this.getCard.bind(this);
        this.onClickTasks = this.onClickTasks.bind(this);
        this.onClickResources = this.onClickResources.bind(this);
        this.onClickAvailability = this.onClickAvailability.bind(this);
    }


    getCard(title, onClickView) {

        return (
            <article className="main-card"> 
                    <strong id="title">{title}</strong>
                    <hr/>
                    <p>There are 15 tasks for today</p>
                    <p>3 tasks uncompleted yesterday</p>
                    <p>10 tasks solving pending</p>
                    <button className="button-default" onClick={onClickView}> View</button>
            </article>
        )
    }

    onClickTasks(){
        this.props.history.push('/tasks');
    }

    onClickResources(){
        
    }

    onClickAvailability(){
        
    }

    render(){
        return (
            <div id="home">
                <div id="background">
                    
                </div>
                <div id="cards-view">
                    {this.getCard('Tasks', this.onClickTasks)}
                    {this.getCard('Resources', this.onClickResources)}
                    {this.getCard('Availability', this.onClickAvailability)}
                </div>                
            </div>            
        );
    }
}

export default withRouter(Home) ;
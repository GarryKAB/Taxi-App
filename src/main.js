import React, {Component} from 'react';
import {View, Text, Button} from 'react-native';
import createStore from "./store/createStore";
import AppContainer from "./AppContainer";

export default class Root extends Component {
    renderApp () {
        const initialState = window.__INITIAL_STATE__;
        const store = createStore(initialState);

        return (
            <AppContainer store={store}/>
        );
    }
    
    render (){
        return (this.renderApp());
    }
}

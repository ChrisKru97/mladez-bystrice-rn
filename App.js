import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {Events, Discussion, Library, Recordings, Account, Settings} from './containers';
// import Account from './containers/Account';
// import Recordings from './containers/Recordings';
// import Discussion from './containers/Discussion';
// import Library from './containers/Library';
// import Events from './containers/Events';
// import Settings from './containers/Settings';

const NavigationTab = createBottomTabNavigator({
    Akce: Events,
    Diskuze: Discussion,
    Knihovna: Library,
    'Nahrávky': Recordings,
    'Účet': Account,
    'Nastavení': Settings,
})

class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

export default createTabNavigator(NavigationTab);
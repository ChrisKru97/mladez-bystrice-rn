import React from 'react';
import {createBottomTabNavigator, createAppContainer} from 'react-navigation';
import {Icon} from 'react-native-elements';
import {Events, Discussion, Library, Recordings, Account, Settings} from './containers/index';

const NavigationTab = createBottomTabNavigator(
    {
        Akce: Events,
        Diskuze: Discussion,
        Knihovna: Library,
        'Účet': Account,
        'Nahrávky': Recordings,
        'Nastavení': Settings,
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                const {routeName} = navigation.state;
                let iconName;
                switch(routeName){
                    case 'Akce': iconName='md-calendar';break;
                    case 'Diskuze': iconName='ios-chatboxes';break;
                    case 'Knihovna': iconName='md-book';break;
                    case 'Nahrávky': iconName='ios-recording';break;
                    case 'Účet': iconName='md-person';break;
                    case 'Nastavení': iconName='ios-settings';break;
                }
                return (<Icon name={iconName} type='ionicon'/>)
            },
        }),
        tabBarOptions: {
            activeTintColor: 'blue',
            inactiveTintColor: 'gray',
        },
    })

//TODO add notifications
export default (createAppContainer(NavigationTab));
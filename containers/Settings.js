import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styles} from '../config';

class Settings extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Nastaveni
                </Text>
            </View>
        );
    }
}

export default Settings;
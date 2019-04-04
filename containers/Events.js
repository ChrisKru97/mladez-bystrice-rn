import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styles} from '../config';

class Events extends Component {
    state = {
        data: null,
    }

    componentDidMount = () => {
        fetch('https://arcane-temple-75559.herokuapp.com/getdata').then(response => response.json()).then(response => {
            this.setState({
                data: JSON.stringify(response),
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>
                    {this.state.data}
                </Text>
            </View>
        );
    }
}

export default Events;
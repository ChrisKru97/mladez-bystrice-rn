import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styles} from '../config';

class Library extends Component {
    state = {
        data: null,
    }

    componentDidMount = () => {
        fetch('https://arcane-temple-75559.herokuapp.com/getbook').then(response => response.json()).then(response => {
            this.setState({
                data: JSON.stringify(response),
            })
        })
    }

    changeBook = (id, booked) => {
        fetch('https://arcane-temple-75559.herokuapp.com/alterbook', {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                booked: booked,
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

export default Library;
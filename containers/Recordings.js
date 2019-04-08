import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {connect} from 'react-redux';
import {styles} from '../config';

class Recordings extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    {this.props.logged?'Nahravky':'Prihlas se'}
                </Text>
            </View>
        );
    }
}

export default connect(state=>state.login)(Recordings);
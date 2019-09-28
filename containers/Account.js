import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native';
import {Button, Input, Icon, Text} from 'react-native-elements';
import {setToken, setUsername, login, logout} from '../actions';
import {connect} from 'react-redux';
import {styles} from '../config';

class Account extends Component {
    state = {
        username: '',
        password: '',
        message: null,
    }

    login = () => {
        fetch('https://arcane-temple-75559.herokuapp.com/login',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username:this.state.username,
                    password: this.state.password,
                })
            }).then(response => response.json()).then(response => {
            if (response.hasOwnProperty('jwt')) {
                this.props.login();
                this.props.setUsername(response.user.username);
                this.props.setToken(response.jwt);
                AsyncStorage.setItem('token', response.jwt);
                AsyncStorage.setItem('username', response.user.username);
            } else {
                this.setState({
                    message: {
                        good: false,
                        text: 'Špatné údaje',
                    }
                })
            }
        }).catch(err => {
            this.setState({
                message: {
                    good: false,
                    text: 'Špatné údaje'
                }
            })
        })
    }

    logout = () => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('username');
        this.setState({
            username: '',
            password: '',
        }, () => {
            this.props.logout();
        });
    }

    render() {
        const {message, username, password} = this.state;
        const messageView = message ? (
            <Text style={{color: message.good ? 'green' : 'red'}}>{message.text}</Text>
        ) : null;
        return this.props.logged ?
            (<View style={styles.container}>
                {messageView}
                <Icon name='account-circle' size={75}/>
                <Text h3>{this.props.username}</Text>
                <Button title='Odhlásit' onPress={this.logout}/>
            </View>) :
            (<View style={styles.container}>
                {messageView}
                <Input value={username} placeholder='Jméno' autoCorrect={false} onChangeText={(event) => {
                    this.setState( {
                        username: event,
                    });
                }}/>
                <Input value={password} placeholder='Heslo' secureTextEntry onChangeText={(event) => {
                    this.setState({
                        password: event,
                    })
                }}/>
                <Button title='Přihlásit' onPress={this.login}/>
            </View>);
    }
}

export default connect(state => state.login,
    (dispatch) => {
        return {
            setUsername: event => dispatch(setUsername(event)),
            setToken: event => dispatch(setToken(event)),
            login: event => dispatch(login()),
            logout: event => dispatch(logout()),
        }
    })(Account);
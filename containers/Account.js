import React, {Component} from 'react';
import {View, AsyncStorage} from 'react-native';
import {Button, Input, Icon} from 'react-native-elements';
import {setToken, setUsername, login, logout} from '../actions';
import {connect} from 'react-redux';
import {sha256} from 'js-sha256';
import {styles} from '../config';

const token = 'BFB70F91B2D7124A7C78A1632C863F2CEC9C24D038DDD118D0D77B2BB4A4BEFA'

class Account extends Component {
    state = {
        // username: '',
        password: '',
    }

    login = () => {
        // fetch('url',
        //     {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             username: this.state.username,
        //             password: this.state.password,
        //         })
        //     }).then(response => response.json()).then(response => {
        //     if (response.logged) {
        if(sha256(this.state.password).toUpperCase()===token) {
            this.props.login();
            // this.props.setUsername(this.state.userngame);
            this.props.setToken(token);
            AsyncStorage.setItem('token',token);

        }
        //     } else {
        //         this.setState({
        //             message: 'Špatné údaje',
        //         })
        //     }
        //
        // })
    }

    logout = () => {
        this.setState({
            username: '',
            password: '',
        }, () => {
            this.props.logout();
        });
    }

    render() {
        return this.props.logged ?
            (<View style={styles.container}>
                <Icon name='account-circle' size={75}/>
                {/*<Text h3>{this.props.username}</Text>*/}
                <Button title='Odhlásit' onPress={this.logout}/>
            </View>) :
            (<View style={styles.container}>
                {/*<Input value={this.state.username} placeholder='Jméno' autoCorrect={false} onChangeText={(event) => {*/}
                    {/*this.setState({*/}
                        {/*username: event,*/}
                    {/*});*/}
                {/*}}/>*/}
                <Input value={this.state.password} placeholder='Heslo' secureTextEntry onChangeText={(event) => {
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
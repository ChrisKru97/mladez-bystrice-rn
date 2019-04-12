import React, {Component} from 'react';
import {AsyncStorage, FlatList, View} from 'react-native';
import {styles} from '../config';
import {Button, Text, Card, Header, Input} from "react-native-elements";
import Modal from "react-native-modal";
import {connect} from 'react-redux';

class Discussion extends Component {
    state = {
        data: null,
        modal: false,
        message: '',
        resMessage: null,
        author: this.props.username,
    }

    componentDidMount = () => {
        AsyncStorage.getItem('messages').then(cache => {
            if (cache && !this.state.data) {
                this.setState({
                    data: JSON.parse(cache),
                })
            }
        })
        fetch('https://arcane-temple-75559.herokuapp.com/getmessages').then(response => response.json()).then(response => {
            let sorted = response.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
            this.setState({
                data: sorted,
            }, () => {
                AsyncStorage.setItem('messages', JSON.stringify(sorted));
            })
        }).catch(err => {
            console.error(err);
            this.setState({
                message: {
                    good: false,
                    text: 'Něco se nepovedlo'
                }
            })
        })
    }

    addMessage = () => {
        fetch('https://arcane-temple-75559.herokuapp.com/addmessages',
            {
                method: 'POST',
                body: {
                    sender: this.state.author,
                    message: this.state.message,
                }
            }).then(response => response.json()).then(response => {
            if (response.ok) {
                this.setState({
                    message: {
                        good: true,
                        text: 'Změny uloženy',
                    }
                })
            } else {
                console.error(response);
                this.setState({
                    message: {
                        good: false,
                        text: 'Něco se nepovedlo'
                    }
                })
            }
        }).catch(err => {
            console.error(err);
            this.setState({
                message: {
                    good: false,
                    text: 'Něco se nepovedlo'
                }
            })
        })
    }

    closeModal = () => {
        this.setState({
            modal: false,
            message: '',
            author: this.props.username,
            resMessage: null,
        })
    }

    render() {
        const {modal, resMessage, message} = this.state;
        const messageView = resMessage ? (
            <Text style={{color: resMessage.bad ? 'red' : 'green'}}>{resMessage.text}</Text>
        ) : null;
        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.modal} swipeDirection='down' awoidKeyboard={true}
                       onBackButtonPress={this.closeModal}
                       onSwipeComplete={this.closeModal}>
                    <View style={{
                        justifyContent: 'space-evenly',
                        backgroundColor: '#fff',
                        padding: 20,
                        height: '75%'
                    }}>
                        {messageView}
                        <Input style={{margin: 5}} multiline placeholder='Zpráva' value={this.state.message}
                               autoCorrect={false}
                               onChangeText={event => {
                                   this.setState({message: event});
                               }}/>
                        {this.props.logged ? null :
                            (<Input style={{margin: 5}} multiline placeholder='Autor' value={this.state.author}
                                    autoCorrect={false}
                                    onChangeText={event => {
                                        this.setState({author: event});
                                    }}/>)
                        }
                        <Button title='Přidej' raised onPress={this.addMessage}/>
                    </View>
                </Modal>
                <Header
                    leftComponent={null}
                    centerComponent={null}
                    rightComponent={<Button title={'Přidat'} onPress={() => {
                        this.setState({
                            modal: true,
                        })
                    }}/>}
                />
                {messageView}
                <FlatList data={this.state.data}
                          keyExtractor={item => item.id.toString()}
                          renderItem={({item}) => {
                              const date = new Date(item.date);
                              return (
                                  <Card title={item.sender}>
                                      <Text
                                          style={{fontWeight: 'bold'}}>{`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</Text>
                                      <Text>{item.message}</Text>
                                  </Card>
                              );
                          }}
                />
            </View>
        );
    }
}

export default connect(state => state.login)(Discussion);
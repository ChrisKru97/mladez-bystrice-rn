import React, {Component} from 'react';
import {View, FlatList, AsyncStorage, DatePickerAndroid, Modal} from 'react-native';
import {Button, Card, CheckBox, Header, Input, Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {styles} from '../config';

class Library extends Component {
    state = {
        data: null,
        modal: false,
        error: '',
        title: '',
        description: '',
    }

    componentDidMount = () => {
        AsyncStorage.getItem('library').then(cache => {
            if (cache && !this.state.data) {
                this.setState({
                    data: JSON.parse(cache),
                })
            }
        })
        fetch('https://arcane-temple-75559.herokuapp.com/getbook').then(response => response.json()).then(response => {
            this.setState({
                data: response,
            }, () => {
                AsyncStorage.setItem('library', JSON.stringify(response));
            })
        })
    }

    changeBook = (id, booked) => {
        fetch('https://arcane-temple-75559.herokuapp.com/alterbook', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                id: id,
                booked: booked,
                hash: this.props.token,
            })
        }).then((res) => {
            this.setState({
                error: JSON.stringify(res),
            })
            // if (res.ok) {
            //     this.setState({
            //         data: this.state.data.map(entry => {
            //             return {...entry, booked: entry.id === id ? entry.booked : booked};
            //         }),
            //         error: JSON.stringify(res.json()),
            //     })
            // } else {
            //     this.setState({
            //         error: JSON.stringify(res.json()),
            //     })
            // }
        })
    }

    addBook = () => {
        fetch('https://arcane-temple-75559.herokuapp.com/alterbook',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                    title: this.state.title,
                    description: this.state.description,
                    hash: this.props.token,
                })
            }).then(res => {
            this.setState({
                error: JSON.stringify(res),
                title: '',
                description: '',
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Modal visible={this.state.modal} transparent={true} animationType='slide'>
                    <View style={styles.modal}>
                        <View style={{
                            width: '75%',
                            height: '75%',
                            justifyContent: 'space-evenly',
                            backgroundColor: '#fff',
                            padding: 20
                        }}>
                            <Input style={{margin: 5}} placeholder='Název knihy?' value={this.state.title}
                                   autoCorrect={false}
                                   onChangeText={event => {
                                       this.setState({title: event});
                                   }}/>
                            <Input style={{margin: 5}} multiline placeholder='Popis' value={this.state.description}
                                   autoCorrect={false}
                                   onChangeText={event => {
                                       this.setState({description: event});
                                   }}/>
                            <View
                                style={{flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'center'}}>
                                <Button title='Zruš' raised onPress={() => {
                                    this.setState({
                                        modal: false,
                                        title: '',
                                        description: '',
                                    })
                                }}/>
                                <Button title='Přidej' raised onPress={this.addBook}/>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Header
                    leftComponent={null}
                    centerComponent={null}
                    rightComponent={this.props.logged ? (<Button title={'Přidat'} onPress={() => {
                        this.setState({
                            modal: true,
                        })
                    }}/>) : null}
                />
                <Text>{this.state.error}</Text>
                <FlatList data={this.state.data}
                          keyExtractor={item => item.id}
                          renderItem={({item}) => {
                              return (
                                  <Card title={item.title}>
                                      <Text>{item.description}</Text>
                                      <CheckBox
                                          checked={item.booked}
                                          onPress={() => {
                                              this.changeBook(item.id, item.booked);
                                          }}
                                      />
                                  </Card>
                              )
                          }}/>
            </View>
        );
    }
}

export default connect(state => state.login)(Library);
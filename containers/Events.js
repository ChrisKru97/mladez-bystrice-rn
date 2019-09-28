import React, {Component} from 'react';
import {FlatList, View, Switch} from 'react-native';
import {Card, Text, Input, Header, Button, ButtonGroup} from 'react-native-elements';
import {AsyncStorage, DatePickerAndroid} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import {styles} from '../config';
import {login, setToken, setUsername} from "../actions";

class Events extends Component {
    state = {
        all: null,
        upcoming: null,
        passed: null,
        selectedButton: 0,
        modal: false,
        title: '',
        description: '',
        date: null,
        message: null,
        anonym: false,
    }

    componentDidMount = () => {
        AsyncStorage.getItem('token').then(cache => {
            if (cache) {
                this.props.login();
                this.props.setToken(cache);
            }
        })
        AsyncStorage.getItem('username').then(cache => {
            if (cache) {
                this.props.setUsername(cache);
            }
        })
        AsyncStorage.getItem('allEvents').then(cache => {
            if (cache && !this.state.all) {
                this.setState({
                    all: JSON.parse(cache),
                })
            }
        })
        AsyncStorage.getItem('upcomingEvents').then(cache => {
            if (cache && !this.state.upcoming) {
                this.setState({
                    upcoming: JSON.parse(cache),
                })
            }
        })
        AsyncStorage.getItem('passedEvents').then(cache => {
            if (cache && !this.state.passed) {
                this.setState({
                    passed: JSON.parse(cache),
                })
            }
        })
        fetch('https://arcane-temple-75559.herokuapp.com/getdata').then(response => response.json()).then(response => {
            const upcoming = response.filter(event => {
                return Date.now() < Date.parse(event.date)
            });
            const passed = response.filter(event => {
                return Date.now() > Date.parse(event.date)
            });
            this.setState({
                all: response,
                upcoming: upcoming,
                passed: passed,
            }, () => {
                AsyncStorage.setItem('allEvents', JSON.stringify(response));
                AsyncStorage.setItem('upcomingEvents', JSON.stringify(upcoming));
                AsyncStorage.setItem('passedEvents', JSON.stringify(passed));
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

    addEvent = () => {
        fetch('https://arcane-temple-75559.herokuapp.com/adddata',
            {
                method: 'POST',
                headers: new Headers({'Authorization': 'Basic ' + this.props.token}),
                body: {
                    topic: this.state.topic,
                    description: this.state.description,
                    date: this.state.date,
                    show: !this.state.anonym
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
            title: '',
            description: '',
            date: null,
            message: null,
            anonym: false,
        })
    }

    deleteEvent = (id) => {
        fetch('https://arcane-temple-75559.herokuapp.com/deletedata',
            {
                method: 'POST',
                headers: new Headers({'Authorization': 'Basic ' + this.props.token}),
                body: {
                    id: id
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


    render() {
        const {message, modal, title, description, date, selectedButton, upcoming, passed, all} = this.state;
        const messageView = message ? (
            <Text style={{color: message.bad ? 'red' : 'green'}}>{message.text}</Text>
        ) : null;
        return (
            <View style={styles.container}>
                <Modal isVisible={modal} swipeDirection='down' awoidKeyboard={true}
                       onBackButtonPress={this.closeModal}
                       onSwipeComplete={this.closeModal}>
                    <View style={{
                        justifyContent: 'space-evenly',
                        backgroundColor: '#fff',
                        padding: 20,
                        height: '75%'
                    }}>
                        {messageView}
                        <Input style={{margin: 5}} placeholder='O co jde?' value={title}
                               autoCorrect={false}
                               onChangeText={event => {
                                   this.setState({title: event});
                               }}/>
                        <Input style={{margin: 5}} multiline placeholder='Popis' value={description}
                               autoCorrect={false}
                               onChangeText={event => {
                                   this.setState({description: event});
                               }}/>
                        <Button title={'Vyber datum' + (date ? ' (Vybráno)' : '')} raised
                                onPress={async () => {
                                    try {
                                        const {action, year, month, day} = await DatePickerAndroid.open({
                                            minDate: Date.now(),
                                            date: Date.now(),
                                            mode: 'calendar,'
                                        });
                                        if (action !== DatePickerAndroid.dismissedAction) {
                                            this.setState({
                                                date: new Date(year, month, day),
                                            });
                                        }
                                    } catch ({code, message}) {
                                        console.error('Nelze zvolit', message);
                                    }
                                }}/>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                            <Text>Anonymně?</Text><Switch value={this.state.anonym} onValueChange={(e) => {
                            this.setState({anonym: e})
                        }}/>
                        </View>
                        <Button title='Přidej' raised onPress={this.addEvent}/>
                    </View>
                </Modal>
                <Header
                    leftComponent={null}
                    centerComponent={(
                        <ButtonGroup
                            onPress={(index) => {
                                this.setState({
                                    selectedButton: index,
                                })
                            }}
                            selectedIndex={selectedButton}
                            buttons={['Nové', 'Všechny', 'Minulé']}
                        />
                    )}
                    rightComponent={this.props.logged ? (<Button title={'Přidat'} onPress={() => {
                        this.setState({
                            modal: true,
                        })
                    }}/>) : null}
                />
                {messageView}
                <FlatList
                    data={selectedButton === 0 ? upcoming : selectedButton === 2 ? passed : all}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => {
                        const date = new Date(item.date);
                        return (
                            <Card title={
                                item.author === this.props.username ? (
                                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                                        <Text h4>{item.title}</Text>
                                        <Button title='Smazat' onPress={() => {
                                            this.deleteEvent(item.id)
                                        }}/>
                                    </View>
                                ) : <Text h4>{item.title}</Text>
                            }>
                                <Text
                                    style={{fontWeight: 'bold'}}>{date.toLocaleString('cs-CZ', {timeZone: 'UTC'})}</Text>
                                <Text>{item.description}</Text>
                                {item.show ? (
                                    <Text style={{fontWeight: 'bold'}}>{item.author}</Text>
                                ) : null}
                            </Card>
                        );
                    }}
                />
            </View>
        );
    }
}

export default connect(state => state.login,
    (dispatch) => {
        return {
            setToken: event => dispatch(setToken(event)),
            setUsername: event => dispatch(setUsername(event)),
            login: event => dispatch(login()),
        }
    })(Events);
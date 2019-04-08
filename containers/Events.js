import React, {Component} from 'react';
import {FlatList, View, Modal} from 'react-native';
import {Card, Text, Input, Header, Button, ButtonGroup} from 'react-native-elements';
import {AsyncStorage, DatePickerAndroid} from 'react-native';
import {connect} from 'react-redux';
import {styles} from '../config';
import {login, setToken} from "../actions";

class Events extends Component {
    state = {
        all: null,
        upcoming: null,
        passed: null,
        selectedButton: 0,
        modal: false,
        title: '',
        description: '',
        author: '',
        date: null,
    }

    componentDidMount = () => {
        AsyncStorage.getItem('token').then(cache => {
            if (cache) {
                this.props.login();
                this.props.setToken(cache);
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
        })
    }

    addEvent = () => {

    }

    render() {
        return (
            <View style={styles.container}>
                <Modal visible={this.state.modal} transparent={true} animationType='slide'>
                    <View style={styles.modal}>
                        <View style={{width: '75%', height: '75%', justifyContent: 'space-evenly', backgroundColor: '#fff', padding: 20}}>
                            <Input style={{margin: 5}} placeholder='O co jde?' value={this.state.title}
                                   autoCorrect={false}
                                   onChangeText={event => {
                                       this.setState({title: event});
                                   }}/>
                            <Input style={{margin: 5}} multiline placeholder='Popis' value={this.state.description}
                                   autoCorrect={false}
                                   onChangeText={event => {
                                       this.setState({description: event});
                                   }}/>
                            <Input style={{margin: 5}} placeholder='Autor' value={this.state.author} autoCorrect={false}
                                   onChangeText={event => {
                                       this.setState({author: event});
                                   }}/>
                                   <Button title={'Vyber datum' + (this.state.date?' (Vybráno)':'')} raised onPress={async ()=>{
                                       try {
                                           const {action, year, month, day} = await DatePickerAndroid.open({
                                               minDate: Date.now(),
                                               date: Date.now(),
                                               mode: 'calendar,'
                                           });
                                           if (action !== DatePickerAndroid.dismissedAction) {
                                               this.setState({
                                                   date: new Date(year,month,day),
                                               });
                                           }
                                       } catch ({code, message}) {
                                           console.error('Nelze zvolit', message);
                                       }
                                   }}/>
                            <View style={{flexDirection: 'row', justifyContent:'space-evenly', alignContent: 'center'}}>
                                <Button title='Zruš' raised onPress={() => {
                                    this.setState({
                                        modal: false,
                                        title: '',
                                        description: '',
                                        author: '',
                                        date: null,
                                    })
                                }}/>
                                <Button title='Přidej' raised onPress={this.addEvent}/>
                            </View>
                        </View>
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
                            selectedIndex={this.state.selectedButton}
                            buttons={['Nové', 'Všechny', 'Minulé']}
                        />
                    )}
                    rightComponent={this.props.logged ? (<Button title={'Přidat'} onPress={() => {
                        this.setState({
                            modal: true,
                        })
                    }}/>) : null}
                />
                <FlatList
                    data={this.state.selectedButton === 0 ? this.state.upcoming : this.state.selectedButton === 2 ? this.state.passed : this.state.all}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => {
                        const date = new Date(item.date);
                        return (
                            <Card title={item.title}>
                                <Text
                                    style={{fontWeight: 'bold'}}>{`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</Text>
                                <Text>{item.description}</Text>
                                <Text style={{fontWeight: 'bold'}}>{item.author}</Text>
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
            login: event => dispatch(login()),
        }
    })(Events);
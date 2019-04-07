import React, {Component} from 'react';
import {FlatList, View} from 'react-native';
import {Card, Text, Header, Button, ButtonGroup} from 'react-native-elements';
import {AsyncStorage} from 'react-native';
import {connect} from 'react-redux';
import {styles} from '../config';

class Events extends Component {
    state = {
        all: null,
        upcoming: null,
        passed: null,
        selectedButton: 0,
        modal: false,
    }

    componentDidMount = () => {
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

    render() {
        return (
            <View style={styles.container}>
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
                                <Text style={{fontWeight: 'bold'}}>{`${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`}</Text>
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

export default connect(state => state.login)(Events);
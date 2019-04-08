import React, {Component} from 'react';
import {View, FlatList, AsyncStorage} from 'react-native';
import {Button, Card, CheckBox, Header, Text} from 'react-native-elements';
import {connect} from 'react-redux';
import {styles} from '../config';

class Library extends Component {
    state = {
        data: null,
        modal: false,
        error: '',
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

    render() {
        return (
            <View style={styles.container}>
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
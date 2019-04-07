import React, {Component} from 'react';
import {AsyncStorage, FlatList, StyleSheet, Text, View} from 'react-native';
import {styles} from '../config';
import {Button, ButtonGroup, Card, Header} from "react-native-elements";

class Discussion extends Component {
    state = {
        data: null,
        modal: false,
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
        let sorted=response.sort((a,b)=> Date.parse(b.date) - Date.parse(a.date))
            this.setState({
                data: sorted,
            }, () => {
                AsyncStorage.setItem('messages', JSON.stringify(sorted));
            })
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    leftComponent={null}
                    centerComponent={null}
                    rightComponent={<Button title={'Přidat'} onPress={() => {
                        this.setState({
                            modal: true,
                        })
                    }}/>}
                />
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

export default Discussion;
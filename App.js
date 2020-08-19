import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Hoshi} from 'react-native-textinput-effects';
import AsyncStorage from '@react-native-community/async-storage';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';

let data = [];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodo: '',
      openModal: false,
      index: -1,
      text: '',
      editMode: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('@todoData', JSON.stringify(data));
    } catch (e) {}
  };
  getData = async () => {
    try {
      const value = JSON.parse(await AsyncStorage.getItem('@todoData'));
      if (value !== null) {
        data = value;
        this.setState({});
      }
    } catch (e) {}
  };

  addNewTodo = () => {
    data.push({
      todo: this.state.newTodo,
      check: false,
    });
    this.setState({newTodo: ''});
    this.storeData();
    console.warn('Todo Has Been Added');
  };
  todoData;
  edit = (text) => {
    this.setState({newTodo: this.state.text, editMode: true, openModal: false});
  };

  onclickedit = (text) => {
    data[this.state.index].todo = this.state.newTodo;
    this.storeData();
    this.setState({editMode: false, newTodo: ''});
    console.warn('Todo Has Been Edited');
  };

  delete = (index) => {
    data.splice(index, 1);
    this.setState({openModal: false});
    this.storeData();
    console.warn('Todo Has Been Deleted');
  };
  check = (index) => {
    data[index].check = !data[index].check;
    this.setState({});
    this.storeData();
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" style={styles.statusbar} />

        <View style={styles.Header}>
          <Text style={styles.textHeader}>TO DO LIST</Text>
        </View>
        <Text style={styles.title}>Welcome, What Are U Doing Today ?</Text>
        <Hoshi
          label={'Input & Edit In Here'}
          // this is used as active border color
          borderColor={'#cddc39'}
          // active border height
          borderHeight={1}
          inputPadding={20}
          style={{marginBottom: 10}}
          // this is used to set backgroundColor of label mask.
          // please pass the backgroundColor of your TextInput container.
          backgroundColor={'#F9F7F6'}
          value={this.state.newTodo}
          onChangeText={(text) => this.setState({newTodo: text})}
          onSubmitEditing={() =>
            this.state.editMode ? this.onclickedit() : this.addNewTodo()
          }
        />
        <Text style={styles.title}>Your List</Text>

        <FlatList
          data={data}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.touchFlatList}
              onLongPress={() =>
                this.setState({
                  openModal: true,
                  index: index,
                  text: item.todo,
                })
              }>
              <Icon
                name={item.check ? 'check-square' : 'square'}
                size={30}
                color="#cddc39"
                style={{marginHorizontal: 10}}
                onPress={() => this.check(index)}
              />
              <View style={styles.list}>
                <Text style={{marginLeft: 10}}>{item.todo}</Text>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  marginHorizontal: 5,
                  justifyContent: 'center',
                  paddingTop: 5,
                }}>
                * longpress in here to action
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.todo}
          style={styles.FlatList}
        />

        <Text style={styles.textNote}>
          * CheckBox marks the todo that has been done !
        </Text>

        <Modal isVisible={this.state.openModal}>
          <View style={styles.Modal}>
            <TouchableOpacity
              style={styles.touchModEdit}
              onPress={() => this.edit(this.state.text)}>
              <Text style={styles.textModEdit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchModDelete}>
              <Text
                style={styles.textModDelete}
                onPress={() => this.delete(this.state.index)}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchModClose}>
              <Text
                style={styles.textModClose}
                onPress={() => this.setState({openModal: false})}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#cddc39',
    marginLeft: 23,
  },
  statusbar: {
    backgroundColor: '#afb42b',
  },
  Header: {
    backgroundColor: '#cddc39',
    paddingVertical: 15,
    marginBottom: 15,
  },
  textHeader: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  touchFlatList: {
    marginHorizontal: 20,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 15,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    elevation: 1,
    flexDirection: 'row',
  },
  FlatList: {flex: 1, backgroundColor: '#f5f5f5', marginTop: 10},
  list: {
    flex: 1,
    justifyContent: 'center',
  },
  textNote: {marginLeft: 10, fontSize: 12},
  Modal: {backgroundColor: 'white', padding: 10, borderRadius: 5},
  touchModEdit: {backgroundColor: '#afb42b', paddingVertical: 10},
  textModEdit: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  touchModDelete: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    marginVertical: 5,
  },
  textModDelete: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  touchModClose: {backgroundColor: '#9E9E9E', paddingVertical: 10},
  textModClose: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

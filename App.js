/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert
} from 'react-native';
import axiosInstance from './utils/axios';

const Item = ({itemData: {name, location, description}}) => (
  <View
    style={{
      backgroundColor: '#fff',
      marginBottom: 10,
      height: 100,
      width: '100%',
      borderRadius: 4,
      padding: 10,
      justifyContent: 'center',
      flexDirection: 'row',
    }}>
    <Image
      style={{
        width: 80,
        height: 80,
      }}
      source={require('./assets/images/image.png')}
    />
    <View style={{flex: 1, marginLeft: 10}}>
      <Text style={{fontSize: 16, fontWeight: 'bold'}}>{name}</Text>
      <Text style={{fontSize: 12, fontStyle: 'italic'}}>
        Lokasi: {location}
      </Text>
      <Text style={{fontSize: 12}}>{description?.slice(0, 80)}...</Text>
    </View>
  </View>
);

const ModalForm = ({modalVisible, setModalVisible, onDismiss}) => {
  const [payload, setPayload] = useState({});

  const saveAsset = async () => {
    try {
      if (!payload.name || !payload.location || !payload.description || !payload.category) {
        Alert.alert('Form tidak boleh kosong');
        return 
      }
      await axiosInstance.post('/assets', payload);
      setModalVisible(!modalVisible);
      onDismiss()
    } catch (error) {
      console.log(error);
    };
  };

  const onCancel = () => {
    setModalVisible(!modalVisible);
  }

  return (
    <Modal
      animationType="fade"
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Tambah Aset Baru</Text>
          <View style={{width: '100%', alignItems: 'flex-start'}}>
            <Text>Nama Aset</Text>
            <TextInput
              style={styles.input}
              onChangeText={name => setPayload(prev => ({...prev, name}))}
            />
            <Text>Kategori</Text>
            <TextInput
              style={styles.input}
              onChangeText={category =>
                setPayload(prev => ({...prev, category}))
              }
            />
            <Text>Lokasi</Text>
            <TextInput
              style={styles.input}
              onChangeText={location =>
                setPayload(prev => ({...prev, location}))
              }
            />
            <Text>Deskripsi</Text>
            <TextInput
              style={styles.input}
              onChangeText={description =>
                setPayload(prev => ({...prev, description}))
              }
            />
            <TouchableOpacity
              style={{
                backgroundColor: 'blue',
                color: '#fff',
                padding: 10,
                borderRadius: 5,
                width: '100%',
                marginBottom: 4
              }}
              onPress={saveAsset}>
              <Text
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Simpan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                color: '#fff',
                padding: 10,
                borderRadius: 5,
                width: '100%',
                borderWidth: 1,
                borderColor: '#ddd',
              }}
              onPress={onCancel}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Batal
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [modalVisible, setModalVisible] = useState(false);
  const [assets, setAssets] = useState([]);

  const renderItem = (item) => {
    return <Item itemData={item} key={item.id} />;
  };

  const getAssets = async () => {
    try {
      const assetsResponse = await axiosInstance.get('/assets');
      setAssets(assetsResponse);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Asset Tracking</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={require('./assets/images/plus.png')}
            style={{
              height: 24,
              width: 24,
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{padding: 20, height: '90%'}}>
        {assets.map(renderItem)}
      </ScrollView>

      <ModalForm
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onDismiss={getAssets}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },

  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  modalView: {
    width: '90%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
});

export default App;

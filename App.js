import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  PermissionsAndroid,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Dimensions
} from 'react-native'
import { launchCamera } from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;

const App = () => {
  const [imageUrl, setImageUrl] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const requestCameraPermission = async (options) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "App Camera Permission",
            message: "App needs access to your camera ",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          launchCamera(options, res => { handleImagePicker(res) })
        } else {
          Alert.alert('', 'Permission required!');
        }
      } else {
        launchCamera(options, res => { handleImagePicker(res) })
      }
    } catch (err) {
      console.warn(err);
    }
  };



  const startCamera = (input) => {
    const options = {
      title: 'Take Picture',
      customButtons: [],
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
      allowsEditing: false,
      noData: true,
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }
    if (input === 'launchCamera') {
      requestCameraPermission(options)
    }
  }


  const handleImagePicker = (res) => {
    if (res.errorMessage) {
      Alert.alert('Error', `${res.errorMessage}`, [{ text: 'OK' }], {
        cancelable: true,
      })
    }
    else if (res?.assets && res.assets[0] && res.assets[0].uri) {
      setImageUrl([res.assets[0].uri, ...imageUrl])
    }
  }


  const imageOnPress = (url) => {
    setModalImage(url)
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.mainView}>
        <View style={styles.imageView}>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                startCamera('launchCamera')
              }}>
              <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
          {imageUrl.length > 0 &&
            <>
              <FlatList
                data={imageUrl}
                horizontal={true}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => {
                    imageOnPress(item)
                  }}>
                    <Image style={styles.image} source={{ uri: item }} />
                  </TouchableOpacity>
                )}
              />
              <Text style={styles.infoText}> Tap on image for full view </Text>
              <TouchableOpacity onPress={() => {
                setImageUrl([])
              }}>
                <Text style={styles.clearText}>Clear Gallery</Text>
              </TouchableOpacity>
            </>
          }
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.modalMain}>
            <View style={styles.modalView}>
              <Pressable
                style={styles.crossView}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.cross}>X</Text>
              </Pressable>
              <Image style={styles.modalImage} source={{ uri: modalImage }} />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1
  },
  buttonView: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#40c4ff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  imageView: {
    marginVertical: 20,
    alignItems: 'center'
  },
  image: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 20,
  },
  modalMain: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
  },
  modalView: {
    paddingVertical: 40,
  },
  crossView: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cross: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'right',
  },
  modalImage: {
    width: windowWidth - 40,
    height: windowWidth - 40,
    alignSelf: 'center'
  },
  clearText: {
    textDecorationLine: 'underline'
  }

})

export default App;

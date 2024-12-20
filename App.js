import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [image, setImage] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  async function pickImageAsync() {
    requestPermission();
    
    if (!permission.granted) {
      Alert.alert('Permission denied', 'Application needs camera permission to work properly');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled)
        setImage(result.assets[0].uri);
    } catch (error) {
      Alert.alert("Pick image", "Error at picking an image");
    }
  }

  async function shareImageAsync() {
    if (!image)
      return;

    if (!await Sharing.isAvailableAsync())
      return;

    await Sharing.shareAsync(image);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image &&
        <Pressable style={styles.actionButton} onPress={shareImageAsync}>
          <Text style={styles.actionButtonText}>Share Image</Text>
        </Pressable>
      }
      <Pressable style={styles.actionButton} onPress={pickImageAsync}>
        <Text style={styles.actionButtonText}>Take a Picture</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'cadetblue',
    flexDirection: 'row',
    marginTop: 12,
    padding: 8,
    width: 150,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: 10,
    width: 150,
    height: 150,
  },
});

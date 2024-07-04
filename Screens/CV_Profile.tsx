import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';

const CVProfile = () => {

    interface FileState {
        name: string | null;
        uri: string | null;
        type: string | null;
    }      
    const [file, setFile] = useState<FileState>({
        name: null,
        uri: null,
        type: null
      });
//   const [file, setFile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({
    avtUri: '',
    name: '',
    email: '',
    birthDate: '',
    phone: '',
    address: '',
    introduction: '',
});

  useEffect(() => {
    const fetchProfile = async () => {
      const profileDoc:any = await firestore().collection('tblUserInfo').doc('Mobz1ng5EQTZZuYc5id2').get();
      if (profileDoc.exists) {
        setUser(profileDoc.data());
      }
    };
    fetchProfile();
  }, []);

  const pickAndUploadDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx],
      });
  
      if (result.length > 0) {
        const { name, uri, type } = result[0];
        if (name && uri && type) {
          await firestore().collection('cv').add({
            name,
            uri,
            type,
          });
          console.log('File uploaded successfully');
        } else {
          console.error('Invalid file data:', result[0]);
        }
      }
    } catch (error) {
      console.error('Error picking or uploading document:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await firestore().collection('profiles').doc('user123').set({
        name: user.name,
        email: user.email,
        avatar: user.avtUri,
        bio: user.introduction,
      });
      setModalVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={user.avtUri ? { uri: user.avtUri } : require('../asset/default.png')} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileRole}>{user.introduction}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={pickAndUploadDocument}>
        <Text style={styles.uploadButtonText}>Upload CV</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.fileContainer}>
          <Text style={styles.fileName}>{file.name}</Text>
          <Text style={styles.fileType}>{file.type}</Text>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Your Profile</Text>
            <ScrollView>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={user.name}
                onChangeText={(name) => setUser({ ...user, name })}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={user.email}
                onChangeText={(email) => setUser({ ...user, email })}
              />
              <TextInput
                style={styles.input}
                placeholder="Avatar URL"
                value={user.avtUri}
                onChangeText={(avtUri) => setUser({ ...user, avtUri })}
              />
              <TextInput
                style={styles.input}
                placeholder="Bio"
                value={user.introduction}
                onChangeText={(introduction) => setUser({ ...user, introduction })}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleProfileUpdate}>
                  <Text style={styles.uploadButtonText}>Save Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.uploadButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 24,
    },
    profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    profileRole: {
      fontSize: 16,
      color: '#666',
    },
    profileExperience: {
      fontSize: 14,
      color: '#999',
    },
    profileBio: {
      fontSize: 14,
      color: '#666',
    },
    editButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 14,
    },
    uploadButton: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 16,
    },
    uploadButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 8,
      width: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 12,
      marginVertical: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    fileContainer: {
      marginVertical: 16,
      padding: 12,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
    },
    fileName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    fileType: {
      fontSize: 14,
      color: '#666',
    },
  });
  export default CVProfile;
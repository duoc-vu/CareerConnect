import React, { useState } from 'react';
import { Button, Image, PermissionsAndroid, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const ImagePicker = () => {
    const [img,setImg] = useState('');

    const handleCheckIMG = async () => {
        try {
            const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
            if(checkPermission === PermissionsAndroid.RESULTS.GRANTED){
                // console.log('ok')
                //mo cam
                //const result:any = await launchCamera({mediaType:'photo' ,cameraType:'back'});
                //mo thu vien
                const result:any = await launchImageLibrary({mediaType:'photo'});
                setImg(result.assets[0].uri);
            }else
            console.log('khong co quyen');
        } catch (error) {
            console.log(error);
        }
    }
    
    return(
        <View>
            <Button title='Chọn ảnh' onPress={() => handleCheckIMG()}/>
            {img!='' ? <Image source={{uri:img}} style={{width:100,height:100}}/> :''}
            
        </View>
    )
}

export default ImagePicker;
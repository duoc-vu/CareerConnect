import React from 'react';
import { Text, View } from 'react-native';

const Home = ({route}:any) => {

    const { userId } = route.params;
    console.log(userId);
    return(
        <View>
            <Text>Xin chào {userId}</Text>
        </View>
    )
}

export default Home;
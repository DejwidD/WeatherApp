import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import { AddNewLocationScreen } from '../screens/addNewLocationScreen/AddNewLocationScreen';
import { SettingsSceen } from '../screens/settingsSceen/SettingsScreen';
import { RootStackParamList } from '../Types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStack(): JSX.Element {
    return (
        <Stack.Navigator initialRouteName='Home' screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name='Home' component={HomeScreen} />
            <Stack.Screen name='AddNewLocation' component={AddNewLocationScreen} />
            <Stack.Screen name='Settings' component={SettingsSceen} />
        </Stack.Navigator>
    );
};
export default AppStack;

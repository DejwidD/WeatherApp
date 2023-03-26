import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Routes from './src/navigation/Routes';
import WeatherContextProvider from './src/navigation/WeatherContextProvider';
import { Dimensions } from 'react-native';
import { Colors } from './src/assets/Colors';
import SettingsContextProvider from './src/navigation/SettingsContextProvider';
import LanguageContextProvider from './src/navigation/LanguageContextProvider';

let { height, width } = Dimensions.get('window');

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <LanguageContextProvider>
        <SettingsContextProvider>
          <WeatherContextProvider>
            <Routes />
          </WeatherContextProvider>
        </SettingsContextProvider>
      </LanguageContextProvider>
    </NavigationContainer>
  );
};
export default App;

EStyleSheet.build({
  $width: width,
  $height: height,
  $rem: width < 340 ? 13 : 16,
  $textColor: Colors.textColor,
  $blueGradientLight: Colors.blueGradientLight,
  $blueGradientDark: Colors.blueGradientDark,
  $blueTextColor: Colors.blueTextColor,
  $grey: Colors.grey,
  $semiBlack: Colors.semiBlack,
  $regular: 'Poppins-Regular',
  $semiBold: 'Poppins-SemiBold',
  $bold: 'Poppins-Bold',
  $medium: 'Poppins-Medium',
  $thin: 'Poppins-Thin',
});
import React from 'react'
import { Image, Pressable, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../assets/Colors';
import { useLanguageContext } from '../../../navigation/LanguageContextProvider';
import { CurrentWeatherData, OneHour } from '../../../Types';
import { Utils } from '../../../Utils';
import { PageIndicator } from './PageIndicator';

type MainWeatherSmallIconsAndDataProps = {
  data: number;
  iconPath: any;
  unit: string;
  description: string;
  marginBottom: number;
};

type FlexAnimation = {
  flexDirection: any
  imageSize: number;
  marginRight: number;
  marginLeft: number;
  textShadowRadius: number;
};

type WeatherProps = {
  currentWeatherData: CurrentWeatherData;
  city: string;
  hourWeather: OneHour;
  dayName: string | null;
  dayMonthAfterChange: string | null;
  flexAnimation: FlexAnimation;
  index: number;
  weatherLength: number;
  navigation: any;
};

const MainWeatherSmallIconsAndData = ({ data, iconPath, unit, description, marginBottom }: MainWeatherSmallIconsAndDataProps): JSX.Element => {
  return (
    <View style={[styles.smallIconBox, { marginBottom: marginBottom }]}>
      <Image style={styles.windIcon} source={iconPath} />
      <View>
        <Text style={styles.windSpeed}>{data} {unit}</Text>
        <Text style={styles.windSpeed} >{description}</Text>
      </View>
    </View>
  );
};

export const Weather = ({ currentWeatherData, city, hourWeather, dayName, dayMonthAfterChange, index, weatherLength, flexAnimation, navigation }: WeatherProps): JSX.Element => {
  const { wind, pressure, chanceRain, humidity, description } = useLanguageContext();
  const probabilityOfRain = Math.round(hourWeather.pop * 100);
  const humidityValue = currentWeatherData.humidity;
  const descripitionWeather = Utils.capitalizeFirstLetter(description[currentWeatherData.weather[0].id]);
  const temp = Utils.calculateWeather(currentWeatherData.temp);
  const { windUnit, windValue } = Utils.calculateWind(currentWeatherData.wind_speed);
  const { pressureUnit, pressureValue } = Utils.calculatePressure(currentWeatherData.pressure);
  const imagePath = Utils.getImagePath(currentWeatherData.weather[0].icon);

  return (
    <View style={styles.weatherBox}>
      <LinearGradient colors={[Colors.blueGradientLight, Colors.blueGradientDark]} style={styles.linearGradient}>
        <View style={styles.cityHeaderBox}>
          <Pressable onPress={() => { navigation.navigate('AddNewLocation') }} >
            <Image style={styles.plusIcon} source={require('../../../assets/icons/akar-icons_plus.png')} />
          </Pressable>
          <View >
            <Text style={[styles.city, { textShadowRadius: flexAnimation.textShadowRadius }]} >{city}</Text>
          </View>
          <Pressable onPress={() => { navigation.navigate('Settings') }}>
            <Image style={styles.plusIcon} source={require('../../../assets/icons/carbon_overflow-menu-vertical.png')} />
          </Pressable>
        </View>
        <View >
          <PageIndicator activeIndex={index} length={weatherLength} />
        </View>
        <View style={{ flexDirection: flexAnimation.flexDirection, justifyContent: 'space-between', marginRight: flexAnimation.marginRight, marginLeft: flexAnimation.marginLeft, }}>
          <View style={styles.mainWeatherIconBox}>
            <Image resizeMode='contain' style={[styles.mainWeatherIcon, { height: flexAnimation.imageSize, width: flexAnimation.imageSize }]} source={imagePath} />
          </View>
          <View style={styles.dayAndTempBox}>
            <View style={styles.dayNameBox}>
              <Text style={styles.dayName}>{dayName}</Text>
              <View style={styles.rectangle} />
              <Text style={styles.dayName}>{dayMonthAfterChange}</Text>
            </View>
            <View style={styles.tempAndDescriBox}>
              <View style={styles.tempBox}>
                <Text style={styles.temp}>{temp}</Text>
                <Text style={styles.tempCircle}>°</Text>
              </View>
              <Text style={styles.weatherDescription}>{descripitionWeather}</Text>
            </View>
          </View>
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.smallIconMainBox} >
          <View style={styles.smallIconLeftBox}>
            <MainWeatherSmallIconsAndData data={windValue} iconPath={require('../../../assets/icons/carbon_location-current.png')} description={wind} unit={windUnit} marginBottom={8} />
            <MainWeatherSmallIconsAndData data={pressureValue} iconPath={require('../../../assets/icons/fluent_temperature-24-regular.png')} description={pressure} unit={pressureUnit} marginBottom={16} />
          </View>
          <View style={styles.smallIconRigthBox}>
            <MainWeatherSmallIconsAndData data={probabilityOfRain} iconPath={require('../../../assets/icons/fluent_weather-rain-24-regular.png')} description={chanceRain} unit={'%'} marginBottom={8} />
            <MainWeatherSmallIconsAndData data={humidityValue} iconPath={require('../../../assets/icons/ion_water-outline.png')} description={`${humidity} ${humidityValue}%`} unit={'%'} marginBottom={16} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = EStyleSheet.create({
  city: {
    color: '$textColor',
    fontSize: '1.25rem',
    fontFamily: '$semiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  icon: {
    color: '$textColor'
  },
  linearGradient: {
    borderRadius: 30
  },
  cityHeaderBox: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 0,
    justifyContent: 'space-between'
  },
  plusIcon: {
    width: 32,
    height: 32
  },
  mainWeatherIconBox: {
    alignItems: 'center',
  },
  mainWeatherIcon: {
    height: 200, width: 200,
  },
  weatherBox: {
    margin: 16
  },
  dayAndTempBox: {
    flexDirection: 'column',
    flexShrink: 1
    //marginRight: 40
  },
  dayNameBox: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayName: {
    color: '$textColor',
    fontFamily: '$regular',
    fontSize: '1.2rem',
  }, rectangle: {
    width: 2,
    height: 19,
    backgroundColor: 'white',
    marginHorizontal: 11,
  },
  tempAndDescriBox: {
    alignItems: 'center',
    flexShrink: 1
  },
  tempBox: {
    flexDirection: 'row'
  },
  temp: {
    color: '$textColor',
    fontFamily: '$semiBold',
    fontSize: '4rem',
    includeFontPadding: false,
  },
  tempCircle: {
    //zmienic na bardziej odpowiednie kółko 
    color: '$textColor',
    fontFamily: '$semiBold',
    fontSize: '2rem',
  },
  weatherDescription: {
    color: '$textColor',
    fontFamily: '$regular',
    fontSize: '1rem',
    marginBottom: 16,
    flexWrap: 'wrap',
    flexShrink: 1
  },
  lineStyle: {
    borderBottomColor: '$textColor',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    marginHorizontal: 16
  },
  smallIconMainBox: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  smallIconLeftBox: {
    justifyContent: 'flex-start',
    marginLeft: 38,
  },
  smallIconRigthBox: {
    justifyContent: 'flex-end',
    marginRight: 38
  },
  smallIconBox: {
    flexDirection: 'row', marginTop: 16
  },
  windIcon: {
    width: 32,
    height: 32,
    marginRight: 4
  },
  windSpeed: {
    color: '$textColor',
    fontFamily: '$regular',
    fontSize: '0.75rem',
  },
});


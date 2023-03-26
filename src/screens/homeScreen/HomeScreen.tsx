import React, { useEffect, useRef, useState } from 'react'
import { Image, Pressable, Text, ScrollView, Platform, UIManager, LayoutAnimation, View, AppState, useWindowDimensions, Button, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeatherContext } from '../../navigation/WeatherContextProvider';
import { CurrentWeatherData, HomeNavigationProps, OneHour, WeatherContextType } from '../../Types';
import { ForeCast7Day } from './components/ForeCast7Day';
import { ForeCastTodayWeather } from './components/ForeCastTodayWeather';
import { Weather } from './components/Weather';
import { Utils } from '../../Utils';
import { useIsFocused } from '@react-navigation/native';
import { useLanguageContext } from '../../navigation/LanguageContextProvider';
import { WeatherLocationNotGranted } from './components/WeatherLocationNotGranted';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HomeScreen({ navigation }: HomeNavigationProps): JSX.Element {
  const { cityAndCountry, weather, permissionsGranted, locationProviderAvailable, removeFew, cityRemoved } = useWeatherContext() as WeatherContextType;
  const { foreCast7Days, pleaseWait } = useLanguageContext();
  const [flexAnimation, setFlexAnimation] = useState({ flexDirection: 'column', imageSize: 200, marginRight: 0, marginLeft: 0, textShadowRadius: 4 });
  const [index, setIndex] = useState<number>(0);
  const { dayName, dayMonth } = Utils.getDayNameAndMonth(weather[index]?.current.dt, weather[index]?.timezone_offset);
  const timeZone = Utils.calculateTimeZone(index);
  const scrollYRef = useRef(0);
  const { width } = useWindowDimensions();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (weather.length - 1 < index) {
      toNextPage();
      changePage({ 'x': 0, 'y': 0 })
    }
  }, [isFocused]);

  const toNextPage = (): void => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  function changePage(offset: { x: number; y: number; }): void {
    if (offset) {
      const page = Math.round(offset.x / width);

      if (index != page) {
        setIndex(page);
      }
    }
  };

  function handlePageChange(e: NativeSyntheticEvent<NativeScrollEvent>): void {
    const offset = e.nativeEvent.contentOffset;
    changePage(offset);
  };

  function changeLayout(): void {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (flexAnimation.flexDirection == 'column') {
      setFlexAnimation({ flexDirection: 'row', imageSize: 0.25 * width, marginRight: 26, marginLeft: 13, textShadowRadius: 0 });
    } else {
      setFlexAnimation({ flexDirection: 'column', imageSize: 0.52 * width, marginRight: 0, marginLeft: 0, textShadowRadius: 4 });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, }}>
      {weather[0] && cityAndCountry[0] ? <ScrollView scrollEventThrottle={40} nestedScrollEnabled={true} onScroll={(event) => {
        const currentYPosition = event.nativeEvent.contentOffset.y;
        const oldPosition = scrollYRef.current;

        if (currentYPosition > oldPosition && flexAnimation.flexDirection === 'column') {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setFlexAnimation({ flexDirection: 'row', imageSize: 0.32 * width, marginRight: 26, marginLeft: 13, textShadowRadius: 0 });
        }

        if (currentYPosition < oldPosition && flexAnimation.flexDirection === 'row') {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setFlexAnimation({ flexDirection: 'column', imageSize: 0.52 * width, marginRight: 0, marginLeft: 0, textShadowRadius: 4 });
        }
      }}>

        < ScrollView ref={scrollViewRef} pagingEnabled={true} onMomentumScrollEnd={(e) => handlePageChange(e)} showsHorizontalScrollIndicator={false} style={{ flex: 1 }} horizontal>

          {weather.map((singleWeather: { lat: React.Key | null | undefined; current: CurrentWeatherData; hourly: OneHour[]; }, index: number) => {
            return (
              <View key={singleWeather.lat} style={{ width: width }}>
                <Weather
                  currentWeatherData={singleWeather.current}
                  index={index}
                  weatherLength={weather.length}
                  hourWeather={singleWeather.hourly[0]}
                  dayName={dayName} dayMonthAfterChange={dayMonth}
                  city={cityAndCountry[index]?.city}
                  flexAnimation={flexAnimation}
                  navigation={navigation}
                />
              </View>
            );
          }
          )}
        </ScrollView>
        {weather[index] && cityAndCountry && dayName &&
          < ForeCastTodayWeather dayName={dayName} dayMonthAfterChange={dayMonth} hourlyWeather={weather[index].hourly} timeZone={timeZone} />
        }
        {flexAnimation.flexDirection === 'column' && weather[index] && cityAndCountry ?
          <Pressable style={styles.foreCastFor7DaysTextBox} onPress={changeLayout} >
            <Text style={styles.foreCastFor7DaysText} > {foreCast7Days} </Text>
            <Image style={styles.foreCastArrowDown} source={require('../../assets/icons/eva_arrow-ios-downward-outline.png')} />
          </Pressable>
          : null
        }
        {weather[index] && cityAndCountry &&
          <ForeCast7Day dailyWeather={weather[index].daily} width={width} timeZone={timeZone} />
        }
      </ScrollView> :
        (permissionsGranted.aproximate === 'granted' || permissionsGranted.aproximate === 'waiting') && locationProviderAvailable === true ?
          cityRemoved === true ? <WeatherLocationNotGranted cityRemoved={cityRemoved} locationProviderAvailable={locationProviderAvailable} navigation={navigation} /> :
            <View style={styles.permissionsDeniedBox}>
              <Text style={styles.text}>{pleaseWait}</Text>
            </View>
          : <WeatherLocationNotGranted cityRemoved={cityRemoved} locationProviderAvailable={locationProviderAvailable} navigation={navigation} />
      }
    </SafeAreaView >
  );
};
const styles = EStyleSheet.create({
  safeAreaBox: {
    flex: 1,
  },
  permissionsDeniedBox: {
    marginTop: 32,
    alignItems: 'center',
  },
  text: {
    fontSize: '1rem',
    fontFamily: '$medium',
    color: '$blueTextColor',

  },
  permissionsText: {
    fontSize: '1rem',
    fontFamily: '$medium',
    color: '$textColor'

  },
  permissionsButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '$blueTextColor',
    borderRadius: 30
  },
  foreCastFor7DaysTextBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  foreCastFor7DaysText: {
    fontSize: '1rem',
    fontFamily: '$medium',
    color: '$blueTextColor',
  },
  foreCastArrowDown: {
    height: 24,
    width: 24,
  },
});
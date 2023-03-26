import React from 'react'
import { FlatList, Image, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useLanguageContext } from '../../../navigation/LanguageContextProvider';
import { OneHour } from '../../../Types';
import { Utils } from '../../../Utils';

type HourlyWeatherProps = {
  hour: number;
  probability: number;
  temp: number;
  feelsLike: number;
  timeZone: number;
  nowHour: number;
};

type ForeCastTodayWeatherProps = {
  dayName: string | null;
  dayMonthAfterChange: string | null;
  hourlyWeather: OneHour[];
  timeZone: number;
};

const HourlyWeather: React.FC<HourlyWeatherProps> = ({ hour, probability, temp, feelsLike, timeZone, nowHour }): JSX.Element => {
  const { now, rain } = useLanguageContext();
  const date = new Date((hour + timeZone) * 1000);
  let foreCastHour = date.getUTCHours();
  const probRain = Math.round(probability * 100);
  const iconPath = Utils.calculateIconBasedOnProbOfRain(probRain);
  const roundTemp = Utils.calculateWeather(temp);
  const roundFeelsLike = Utils.calculateWeather(feelsLike);

  return (
    <View style={styles.oneHourBox} >
      {foreCastHour === nowHour ? <Text style={styles.hourlyTime}>{now}</Text> : <Text style={styles.hourlyTime}>{foreCastHour}:00</Text>}
      <Image style={styles.rainHour} source={iconPath} />
      <Text style={styles.tempHour}>{roundFeelsLike}° / {roundTemp}°</Text>
      <View style={styles.probabilityHourBox}>
        <Text style={styles.probabilityHour}>{probRain}% {rain}</Text>
      </View>
    </View>
  );
};

const renderHourlyWeather = (item: OneHour, timeZone: number, nowHour: number): JSX.Element => {
  return (
    <HourlyWeather timeZone={timeZone} nowHour={nowHour} hour={item.dt} probability={item.pop} temp={item.temp} feelsLike={item.feels_like} />
  );
}

export const ForeCastTodayWeather: React.FC<ForeCastTodayWeatherProps> = ({ dayName, dayMonthAfterChange, hourlyWeather, timeZone }): JSX.Element => {
  //Liczba przewidywanych godzin można zmienic od 1 do 23.
  //Teoretycznie mogłaby to być opcja dla użytkownika.
  //Zeby zmieniac dynamicznie trzeba zamienic w setState inaczej może być crash apki.
  if (hourlyWeather.length > 10) {
    hourlyWeather.length = 10;
  }

  const secondsNow = Math.round(Date.now() / 1000);
  const now = new Date((secondsNow + timeZone) * 1000);
  let nowHour = now.getUTCHours();

  return (
    <View style={styles.foreCastTodayBox}>
      <View style={styles.foreCastDayAndMonthBox}>
        <Text style={styles.foreCastTodayDay} >{dayName}</Text>
        <View style={styles.rectangle}></View>
        <Text style={styles.foreCastTodayDay}>{dayMonthAfterChange}</Text>
      </View>
      <View style={styles.flatListBox}>
        <FlatList horizontal={true} data={hourlyWeather} renderItem={({ item }) => renderHourlyWeather(item, timeZone, nowHour)} />
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  foreCastTodayBox: {
    backgroundColor: '$blueTextColor',
  },
  foreCastDayAndMonthBox: {
    marginTop: 9,
    marginLeft: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  foreCastTodayDay: {
    fontSize: '1rem',
    color: '$textColor',
    fontFamily: '$semiBold',
  },
  flatListBox: {
    margineft: 16
  },
  hourlyTime: {
    fontSize: '1rem',
    fontFamily: '$medium',
    color: '$textColor',
    marginLeft: 18, marginBottom: 9,
  },
  oneHourBox: {
    marginRight: 16
  },
  rainHour: {
    width: 24,
    height: 24,
    marginLeft: 24,

  },
  tempHour: {
    fontSize: '0.75rem',
    fontFamily: '$regular',
    color: '$textColor',
    marginLeft: 14,
    marginVertical: 4
  },
  probabilityHourBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  probabilityHour: {
    fontSize: '0.75rem',
    fontFamily: '$regular',
    color: '$textColor',
    marginLeft: 12,
  },
  rectangle: {
    width: 2,
    height: 19,
    backgroundColor: 'white',
    marginHorizontal: 11,
  },
});
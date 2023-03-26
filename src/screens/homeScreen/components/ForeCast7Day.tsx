import React from 'react'
import { FlatList, Image, ListRenderItemInfo, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useLanguageContext } from '../../../navigation/LanguageContextProvider';
import { OneDay as OneDayType } from '../../../Types';
import { Utils } from '../../../Utils';

type Forecast7DayProps = {
    dailyWeather: OneDayType[];
    width: number;
    timeZone: number;
};

type OneDayProps = {
    time: number;
    probOfRain: number;
    feelsLikeTemp: number;
    temp: number;
    width: number;
    timeZone: number;
};

const OneDay: React.FC<OneDayProps> = ({ time, probOfRain, feelsLikeTemp, temp, width, timeZone }): JSX.Element => {
    const roundedProbOfRain = Math.round(probOfRain * 100);
    const iconPath = Utils.calculateIconBasedOnProbOfRain(roundedProbOfRain);
    const { rain } = useLanguageContext();
    const roundedFeelsLikeTemp = Utils.calculateWeather(feelsLikeTemp);
    const roundedTemp = Utils.calculateWeather(temp);
    const dayName = Utils.getDayName(time, timeZone);

    return (
        <View style={{ width: width, }}>
            <View style={styles.oneDayBox}>
                <View style={{ flex: 1 / 3 }}>
                    <Text style={styles.oneDayShortDayName}>{dayName}</Text>
                </View>
                <View style={styles.iconAndProbBox}>
                    <Image style={styles.rainHour} source={iconPath} />
                    <Text style={styles.oneDayProbAndTemp}>{roundedProbOfRain}% {rain}</Text>
                </View>
                <View style={styles.feelsLikeTempAndTempBox}>
                    <Text style={styles.oneDayProbAndTemp}>{roundedFeelsLikeTemp}°/{roundedTemp}°</Text>
                </View>
            </View>
        </View >
    );
};

const render7days = ({ item }: ListRenderItemInfo<OneDayType>, width: number, timeZone: number): JSX.Element => {
    return (
        <OneDay time={item.dt} width={width} timeZone={timeZone} feelsLikeTemp={item.feels_like.day} temp={item.temp.day} probOfRain={item.pop} />
    );
};

export const ForeCast7Day: React.FC<Forecast7DayProps> = ({ dailyWeather, width, timeZone }): JSX.Element => {
    const { foreCast7Days } = useLanguageContext();

    if (dailyWeather.length > 7) {
        dailyWeather.length = 7;
    }

    return (
        <View style={[styles.forecast7DayBackgroundColor]}>
            <Text style={styles.forecast7DayText}>{foreCast7Days}</Text>
            <ScrollView scrollEnabled={false} nestedScrollEnabled={true} horizontal={true}>
                <FlatList scrollEnabled={false} data={dailyWeather} renderItem={(item) => render7days(item, width, timeZone)} />
            </ScrollView>
        </View>
    );
};

const styles = EStyleSheet.create({
    forecast7DayBackgroundColor: {
        backgroundColor: '$blueTextColor',
        marginTop: 16,
    },
    forecast7DayText: {
        fontSize: '1rem',
        fontFamily: '$medium',
        color: '$textColor',
        marginTop: 16,
        marginLeft: 16,
    },
    oneDayBox: {
        marginHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    oneDayShortDayName: {
        fontSize: '1rem',
        fontFamily: '$medium',
        color: '$textColor',
    },
    iconAndProbBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1 / 3
    },
    oneDayProbAndTemp: {
        fontSize: '0.75rem',
        fontFamily: '$regular',
        color: '$textColor',
        marginLeft: 8
    }, feelsLikeTempAndTempBox: {
        alignItems: 'flex-end',
        flex: 1 / 5
    },
    rainHour: {
        width: 24,
        height: 24,
    },
});
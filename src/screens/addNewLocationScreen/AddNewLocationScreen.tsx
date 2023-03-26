
import React, { useState } from 'react';
import { Image, Text, View, FlatList, TextInput, Pressable, ListRenderItemInfo } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Api } from '../../api/Api';
import { Colors } from '../../assets/Colors';
import { Header } from '../../components/Header';
import { useLanguageContext } from '../../navigation/LanguageContextProvider';
import { useWeatherContext } from '../../navigation/WeatherContextProvider';
import { CurrentWeatherData, RecivedCities, WeatherContextType, WeatherInside } from '../../Types';
import { Utils } from '../../Utils';

type SavedCityProps = {
    temp: number;
    feelsLike: number;
    weather: WeatherInside;
    longitude: number;
    latitude: number;
    city: string;
    country: string;
    isFromCurrentLocation: boolean;
    removeFromAsyncStorage: (longitude: number, latitude: number) => Promise<void>;
};

type RenderSavedCityProps = {
    item: ListRenderItemInfo<{
        city: string;
        country: string;
        isFromCurrentLocation: boolean;
        current: CurrentWeatherData;
        timezone_offset: number;
        lon: number;
        lat: number;
    }>;
    removeFromAsyncStorage: { (longitude: number, latitude: number): Promise<void>; }
};

type ItemCityProps = {
    item: {
        name: string;
        country: string;
        state: string;
        lat: number;
        lon: number;
    };
};

type CityProps = {
    city: string;
    country: string;
    state: string;
    latitude: number;
    longitude: number;
    setRecivedCities: React.Dispatch<React.SetStateAction<RecivedCities[] | []>>;
};

export const AddNewLocationScreen = (): JSX.Element => {
    const [searchCity, setSearchCity] = useState<string | undefined>();
    const [recivedCities, setRecivedCities] = useState<RecivedCities[] | []>([]);
    const { weather, cityAndCountry, removeFromAsyncStorage } = useWeatherContext() as WeatherContextType;
    const { manageLocation, searchYourCity } = useLanguageContext();

    let savedCities = weather!.map((oneWeather, index) =>
        ({ ...oneWeather, ...cityAndCountry![index] })
    );

    if (savedCities.length > cityAndCountry!.length) {
        savedCities.length = cityAndCountry!.length;
    }

    async function getRecivedCities(): Promise<void> {
        const recivedData = await Api.getCoordinatesBasedOnCity(searchCity) as RecivedCities[];

        if (recivedData) {
            setRecivedCities(recivedData);
        }
    };

    return (
        <SafeAreaView style={styles.safeAreaBox}>
            <LinearGradient colors={[Colors.blueGradientLight, Colors.blueGradientDark]} style={styles.linearGradient}>
                <View style={styles.mainBox}>
                    <Header textHeader={manageLocation} />
                    <View style={styles.searchYourCityInputBox}>
                        <Image style={styles.searchIcon} source={require('../../assets/icons/akar-icons_search.png')} />
                        <TextInput value={searchCity} style={styles.searchYourCityInput} onChangeText={text => setSearchCity(text)} onSubmitEditing={() => getRecivedCities()} placeholderTextColor='#828282' placeholder={searchYourCity} />
                    </View>
                    <View style={styles.FlatListsBox}>
                        {recivedCities.length > 0 && searchCity &&
                            <View style={styles.flatListRecivedCitiesBox}>
                                <FlatList
                                    style={styles.flatListRecivedCities}
                                    data={recivedCities}
                                    renderItem={(item) => renderCities(item, setRecivedCities)}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        }
                        <View style={styles.flatListSavedCitiesBox}>
                            <FlatList
                                style={styles.flatListSavedCities}
                                data={savedCities}
                                renderItem={(item) => renderSavedCities(item, removeFromAsyncStorage)}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView >
    );
};

const renderCities = ({ item }: ItemCityProps, setRecivedCities: React.Dispatch<React.SetStateAction<RecivedCities[] | []>>): JSX.Element => {
    return (
        <City city={item.name} country={item.country} state={item.state} longitude={item.lon} latitude={item.lat} setRecivedCities={setRecivedCities} />
    );
};

const City = ({ city, country, state, latitude, longitude, setRecivedCities }: CityProps): JSX.Element => {
    const { addToLocation } = useWeatherContext() as WeatherContextType;
    return (
        <View style={styles.cityBox}>
            <Pressable onPress={() => {
                addToLocation(longitude, latitude, city, country);
                setRecivedCities([]);
            }} >
                <View style={styles.recivedCityBox}>
                    <View>
                        <Text style={styles.nameCountry}>{city}, {country}</Text>
                        <Text style={styles.state}>{state}</Text>
                    </View>
                    <Image style={styles.plusIcon} source={require('../../assets/icons/akar-icons_plus_black.png')} />
                </View>
            </Pressable>
        </View>
    );
};

const renderSavedCities = ({ item }: RenderSavedCityProps['item'], removeFromAsyncStorage: RenderSavedCityProps['removeFromAsyncStorage']): JSX.Element => {
    return (
        <SavedCity temp={item?.current.temp} feelsLike={item?.current.feels_like} city={item.city} country={item.country} weather={item?.current.weather[0]} longitude={item?.lon} latitude={item?.lat} removeFromAsyncStorage={removeFromAsyncStorage} isFromCurrentLocation={item.isFromCurrentLocation} />
    );
};

const SavedCity = ({ city, temp, feelsLike, weather, longitude, latitude, removeFromAsyncStorage, isFromCurrentLocation }: SavedCityProps): JSX.Element => {
    const { description } = useLanguageContext();
    const roundedTemp = Utils.calculateWeather(temp);
    const roundedFeelsLike = Utils.calculateWeather(feelsLike);
    const descripitionWeather = Utils.capitalizeFirstLetter(description[weather.id]);
    const iconPath = Utils.getImagePath(weather?.icon);

    return (
        <View style={styles.savedCityBox}>
            <View style={styles.rowDirectionSpaceBetween}>
                <View style={styles.cityTempBox}>
                    <View style={styles.cityLocationPinBox}>
                        <Text style={styles.city}>{city}</Text>
                        {isFromCurrentLocation ? <Image style={styles.locationPin} source={require('../../assets/icons/ph_map-pin.png')} /> : null}
                    </View>
                    <Text style={styles.tempText}>{roundedFeelsLike}°/{roundedTemp}°</Text>
                </View>
                <View >
                    {isFromCurrentLocation ? <View style={styles.marginTop} /> : <Pressable onPress={() => removeFromAsyncStorage(longitude, latitude)} style={styles.closeBox}>
                        <Image style={styles.close} source={require('../../assets/icons/Close.png')} />
                    </Pressable>}
                    <View style={styles.iconDescriptionBox}>
                        <Image style={styles.weatherIcon} source={iconPath} />
                        <Text style={styles.descriptionText}>{descripitionWeather}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = EStyleSheet.create({
    safeAreaBox: {
        flex: 1,
        flexGrow: 1,
    },
    mainBox: {
        margin: 16,
        flex: 1
    },
    linearGradient: {
        borderRadius: 30,
        margin: 16,
        flex: 1,
        flexGrow: 1,
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 37
    },
    imgBox: {
        flex: 1 / 2
    },
    backArrowIcon: {
        height: 32,
        width: 32
    },
    manageLocationText: {
        fontSize: '1rem',
        fontFamily: '$semiBold',
        color: '$textColor'
    },
    searchYourCityInputBox: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        alignItems: 'center',
        borderRadius: 16,
    },
    searchIcon: {
        height: 16,
        width: 16,
        marginLeft: 16
    },
    searchYourCityInput: {
        borderRadius: 16,
        fontSize: '0.75rem',
        padding: 9,
        width: '80%',
        color: '$semiBlack'
    },
    FlatListsBox: {
        flex: 1,
    },
    flatListRecivedCitiesBox: {
        flex: 1.5,
    },
    flatListRecivedCities: {
        backgroundColor: '#F2F2F2',
        marginTop: 2,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.8,
        shadowRadius: 9.11,
        borderRadius: 16,
        elevation: 14,
    },
    flatListSavedCitiesBox: {
        flex: 1
    },
    flatListSavedCities: {
        marginTop: 16,
    },
    cityBox: {
        marginLeft: 16,
        marginTop: 16,
        marginBottom: 5
    },
    recivedCityBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 16
    },
    nameCountry: {
        fontSize: '1rem',
        fontFamily: '$medium',
        color: '$semiBlack',
    },
    state: {
        fontSize: '0.875rem',
        fontFamily: '$regular',
        color: '$semiBlack'
    },
    plusIcon: {
        width: 32,
        height: 32
    },
    lineStyle: {
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginRight: 16
    },
    savedCityBox: {
        backgroundColor: '$textColor',
        marginTop: 16,
        borderRadius: 16
    },
    rowDirectionSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cityTempBox: {
        marginTop: 4,
        marginLeft: 16,
        justifyContent: 'center'
    },
    cityLocationPinBox: {
        flexDirection: 'row'
    },
    locationPin: {
        height: 16,
        width: 16,
    },
    city: {
        fontSize: '1rem',
        fontFamily: '$medium',
        color: '$semiBlack',
        lineHeight: 19.2
    },
    tempText: {
        fontSize: '0.75rem',
        fontFamily: '$regular',
        color: '$grey'
    },
    marginTop: {
        marginTop: 16
    },
    iconDescriptionBox: {
        alignItems: 'center',
        marginBottom: 16,
        marginRight: 16
    },
    descriptionText: {
        fontSize: '0.75rem',
        fontFamily: '$regular',
        color: '$grey'
    },
    weatherIcon: {
        height: 32,
        width: 32,
    },
    closeBox: {
        alignItems: 'flex-end',
        marginTop: 4,
        marginRight: 4
    },
    close: {
        height: 24,
        width: 24,
    }
});

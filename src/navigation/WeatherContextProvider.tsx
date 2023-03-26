import React, { Component } from 'react';
import { Api } from '../api/Api';
import { CityAndCountry, LocationProps, PermissionGranted, Weather, WeatherContextType } from '../Types';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, openSettings, check } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Utils } from '../Utils';

interface WeatherContextProviderProps {
  children: React.ReactNode;
};

interface WeatherContextProviderState {
  cityAndCountry: CityAndCountry[];
  weather: Weather[];
  location: LocationProps[];
  permissionsGranted: PermissionGranted;
  locationProviderAvailable: boolean;
  cityRemoved: boolean;
};

export const WeatherContext = React.createContext<WeatherContextType | null>(null);

export default class WeatherContextProvider extends Component<WeatherContextProviderProps, WeatherContextProviderState> {
  state = {
    cityAndCountry: [] as CityAndCountry[],
    weather: [] as Weather[],
    location: [] as LocationProps[],
    permissionsGranted: { precise: 'waiting', aproximate: 'waiting' },
    locationProviderAvailable: true,
    cityRemoved: false,
  };

  getLocation = async (): Promise<PermissionGranted> => {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    if (result === 'granted') {
      this.getGeolocation();
    }

    this.setState({ permissionsGranted: { precise: result, aproximate: result } });
    return { precise: result, aproximate: result };
  };

  getGeolocation = async (): Promise<void> => {
    Geolocation.getCurrentPosition(
      (position) => {
        //setState na górze kodu, aby odrazu włączył się ekran ładowania
        this.setState({ locationProviderAvailable: true });
        this.setState({ cityRemoved: false });
        const temporaryLocation = { longitude: position.coords.longitude, latitude: position.coords.latitude, isFromCurrentLocation: true };

        this.getCityAndCountry(temporaryLocation);
        this.getWeather(temporaryLocation);
      },
      (error) => {
        if (error.code === 2 || error.code === 3) {
          this.setState({ locationProviderAvailable: false })
        }

        console.log('geolocation', error.code, error.message);
      },
      { enableHighAccuracy: this.state.permissionsGranted.precise === 'granted' ? true : false, timeout: 5000, maximumAge: 32000 }
    );
  };

  getCityAndCountry = async (location: LocationProps | null,): Promise<void> => {
    const cityCountry = await Api.getCityAndCountry(location);

    if (cityCountry) {
      if (this.state.cityAndCountry.some(e => e.city === cityCountry.city && e.country === cityCountry.country)) {
        return;
      }

      this.storeLocationData(location!.longitude, location!.latitude);
      this.storeCityAndCountry(cityCountry.city, cityCountry.country);
    }
  };

  getSavedWeather = async (location: LocationProps[]): Promise<void> => {
    for (let i = 0; i < location.length; i++) {
      const temporaryWeather = await Api.getWeather(location[i]);

      if (temporaryWeather) {
        this.setState(prevState => ({ weather: [...prevState.weather, temporaryWeather] }));
      }
    }
  };

  getSavedLocationAndCityData = async (): Promise<void> => {
    try {
      //this.removeFew();
      const jsonValue = await AsyncStorage.multiGet(['location', 'city']);
      const parsedLocation = jsonValue[0][1] !== null ? JSON.parse(jsonValue[0][1]) : [];
      const parsedCity = jsonValue[1][1] !== null ? JSON.parse(jsonValue[1][1]) : [];
      if (parsedLocation.length > 0) {
        this.setState({ location: parsedLocation, cityAndCountry: parsedCity });
        this.getSavedWeather(parsedLocation);
      } else {
        this.checkPermissions();
      }
    } catch (e) {
      console.log(e);
      this.checkPermissions();
    }
  };

  getWeather = async (location: LocationProps | null): Promise<void> => {
    if (location?.latitude && location?.longitude) {
      const temporaryWeather = await Api.getWeather(location);

      if (temporaryWeather) {
        let weather = [temporaryWeather, ...this.state.weather]

        if (weather.length >= Utils.savedCitiesLimit) {
          weather.length = Utils.savedCitiesLimit;
        }

        this.setState({ weather });
      }
    }
  };


  addToLocation: WeatherContextType['addToLocation'] = (longitude, latitude, name, country): void => {
    if (this.state.location.some(e => e.latitude === latitude && e.longitude === longitude)) {
      return;
    }

    this.setState({ cityRemoved: false });

    this.storeLocationData(longitude, latitude);
    this.storeCityAndCountry(name, country);

    this.getWeather({ longitude: longitude, latitude: latitude, isFromCurrentLocation: false });
  };

  //Tutaj mam dwie bardzo podobne metody, ale używane czasami osobno dlatego je zostawiłem.
  //Mógłbym zamienić ją w jedną, ale wtedy warunkowo podawałoby się tablice i nie wiem, czy to dobra praktyka.
  storeLocationData = async (longitude: number, latitude: number): Promise<void> => {
    let location = [...this.state.location];
    location = [{ longitude: longitude, latitude: latitude, isFromCurrentLocation: false }, ...location];

    if (location.length >= Utils.savedCitiesLimit) {
      location.length = Utils.savedCitiesLimit;
    }

    this.setState({ location });

    try {
      const jsonValue = JSON.stringify(location);
      await AsyncStorage.setItem('location', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  storeCityAndCountry = async (city: string, country: string,): Promise<void> => {
    let cityAndCountry = [...this.state.cityAndCountry];
    cityAndCountry = [{ city, country, isFromCurrentLocation: false }, ...cityAndCountry,];

    if (cityAndCountry.length >= Utils.savedCitiesLimit) {
      cityAndCountry.length = Utils.savedCitiesLimit;
    }

    this.setState({ cityAndCountry });

    try {
      const jsonValue = JSON.stringify(cityAndCountry);
      await AsyncStorage.setItem('city', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  removeFromAsyncStorage = async (longitude: number, latitude: number): Promise<void> => {
    let index = this.state.weather.findIndex(l => l.lon == longitude && l.lat == latitude);

    let storeCityAndCountry = [...this.state.cityAndCountry];
    storeCityAndCountry.splice(index, 1);

    let storeLocationArray = [...this.state.location];
    storeLocationArray.splice(index, 1);

    this.setState((prevState) => ({
      location: storeLocationArray,
      cityAndCountry: storeCityAndCountry,
      weather: [...prevState.weather.slice(0, index), ...prevState.weather.slice(index + 1)],
      cityRemoved: true,
    }));

    const jsonValueLocation = JSON.stringify(storeLocationArray);
    const jsonValueCity = JSON.stringify(storeCityAndCountry);

    try {
      await AsyncStorage.multiSet([['location', jsonValueLocation], ['city', jsonValueCity]]);
    } catch (e) {
      console.log(e);
    }
    console.log('Done.');
  };

  removeFew = async (): Promise<void> => {
    const keys = ['city', 'location', 'units'];

    try {
      await AsyncStorage.multiRemove(keys)
      console.log('Done');
    } catch (e) {
      console.log(e);
    }
  };

  openSettings = async (): Promise<void> => {
    openSettings().catch(() => console.warn('cannot open settings'));
  };

  checkPermissions = async (): Promise<PermissionGranted> => {
    if (Platform.OS === 'ios') {
      const results = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

      switch (results) {
        case 'unavailable':
          //dodac wypisanie, że nie można udostępnic
          this.setState({ permissionsGranted: { precise: 'unavailable', aproximate: 'unavailable' } });

        case 'denied':
          const permissions = await this.getLocation();
          return permissions;

        case 'limited':
          const permissionss = await this.getLocation();
          return permissionss;

        case 'granted':
          this.setState({ permissionsGranted: { precise: 'granted', aproximate: 'granted' } });
          this.getLocation();

        case 'blocked':
          this.setState({ permissionsGranted: { precise: 'blocked', aproximate: 'blocked' } });

        default:
          break;
      }

      return { precise: results, aproximate: results };
    } else {
      const precise = await PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]
      );
      if (precise['android.permission.ACCESS_COARSE_LOCATION'] === 'granted') {
        this.getGeolocation();
      }

      this.setState({ permissionsGranted: { precise: precise['android.permission.ACCESS_COARSE_LOCATION'], aproximate: precise['android.permission.ACCESS_COARSE_LOCATION'] } });

      return { precise: precise['android.permission.ACCESS_FINE_LOCATION'], aproximate: precise['android.permission.ACCESS_COARSE_LOCATION'] };
    }
  };

  render() {
    const { children } = this.props;
    return (
      <WeatherContext.Provider value={{ removeFew: this.removeFew, locationProviderAvailable: this.state.locationProviderAvailable, location: this.state.location, cityAndCountry: this.state.cityAndCountry, weather: this.state.weather, cityRemoved: this.state.cityRemoved, getCityAndCountry: this.getCityAndCountry, getWeather: this.getWeather, permissionsGranted: this.state.permissionsGranted, getSavedWeather: this.getSavedWeather, getLocation: this.getLocation, addToLocation: this.addToLocation, openSettings: this.openSettings, checkPermissions: this.checkPermissions, getSavedLocationAndCityData: this.getSavedLocationAndCityData, removeFromAsyncStorage: this.removeFromAsyncStorage }}>
        {children}
      </WeatherContext.Provider>
    );
  };
};

export const useWeatherContext = () => React.useContext(WeatherContext);

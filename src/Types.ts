import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type LocationProps = {
  longitude: number;
  latitude: number;
  isFromCurrentLocation: boolean;
};

export type WeatherInside = {
  description: string;
  icon: string;
  id: number;
  main: string;
};

export type OneHour = {
  dt: number;
  feels_like: number;
  pop: number;
  temp: number;
  weather: WeatherInside[]
  timeZone: number;
  nowHour: number;
};

export type CurrentWeatherData = {
  dt: number;
  temp: number;
  feels_like: number;
  weather: WeatherInside[];
  humidity: number;
  pressure: number;
  wind_speed: number;
};

export type OneDay = {
  dt: number;
  feels_like: {
    day: number
  };
  temp: {
    day: number
  }
  pop: number
};

export type Weather = {
  lon: number;
  lat: number;
  current: CurrentWeatherData;
  hourly: OneHour[];
  daily: OneDay[];
  timezone_offset: number;
};


export type CityAndCountry = {
  city: string;
  country: string;
  isFromCurrentLocation: boolean;
};

export type PermissionGranted = { precise: string, aproximate: string }

export interface WeatherContextType {
  cityAndCountry: CityAndCountry[];
  weather: Weather[];
  getWeather: (location: { longitude: number, latitude: number, isFromCurrentLocation: boolean } | null) => void;
  getCityAndCountry: (location: { longitude: number, latitude: number, isFromCurrentLocation: boolean } | null) => Promise<void>;
  location: LocationProps[] | null;
  locationProviderAvailable: boolean;
  cityRemoved: boolean;
  removeFew: () => Promise<void>;
  getSavedWeather: (location: LocationProps[]) => Promise<void>;
  getLocation: () => Promise<PermissionGranted>;
  addToLocation: (longitude: number, latitude: number, name: string, country: string) => void;
  permissionsGranted: PermissionGranted;
  openSettings: () => Promise<void>;
  checkPermissions: () => Promise<PermissionGranted>;
  getSavedLocationAndCityData: () => Promise<void>;
  removeFromAsyncStorage: (longitude: number, latitude: number) => Promise<void>;
};

export interface RecivedCities {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
};

export type SettingsContext = {
  tempUnit: string;
  windUnit: string;
  pressureUnit: string;
  setUnit: (unitName: string, unitValue: string) => void;
  getUnitsFromAsync: () => void;
};

export type RootStackParamList = {
  Home: undefined;
  AddNewLocation: undefined;
  Settings: undefined;
};

export type AddNewLocationNavigationProps = NativeStackScreenProps<RootStackParamList, 'AddNewLocation'>;
export type HomeNavigationProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type SettingsNavigationProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;
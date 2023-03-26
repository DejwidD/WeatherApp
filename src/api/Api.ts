import ReactNativeBlobUtil from 'react-native-blob-util';
import { CityAndCountry, LocationProps, RecivedCities, Weather } from '../Types';

export class Api {
    static getWeather = async (location: LocationProps | null): Promise<Weather | null> => {
        const latitude = location?.latitude;
        const longitude = location?.longitude;
        if (latitude && longitude) {
            try {
                const response = await ReactNativeBlobUtil.fetch('GET', `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,alerts&units=metric&appid=2d400f47102f5bf61db24e8c2d93a575`);
                let status = response.info().status;

                if (status == 200) {
                    const newData: Weather = JSON.parse(response.data);
                    return newData;
                }

                console.log('Nastąpił błąd');
            } catch (error) {
                console.error(error);
            }
        }

        return null;
    };

    static getCityAndCountry = async (location: LocationProps | null): Promise<CityAndCountry | null> => {
        const latitude = location?.latitude;
        const longitude = location?.longitude;

        if (latitude && longitude) {
            try {
                const response = await ReactNativeBlobUtil.fetch('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=pl&appid=2d400f47102f5bf61db24e8c2d93a575`);
                let status = response.info().status;

                if (status == 200) {
                    const dataForCountryCity = JSON.parse(response.data);
                    const cityAndCountry: CityAndCountry = {
                        city: dataForCountryCity.name,
                        country: dataForCountryCity?.sys.country,
                        isFromCurrentLocation: true
                    };

                    return cityAndCountry;
                }

                console.log('Nastąpił błąd');
            } catch (error) {
                console.error(error);
            }
        }

        return null;
    };

    static getCoordinatesBasedOnCity = async (searchcity: string | undefined): Promise<RecivedCities[] | null> => {
        if (searchcity) {
            try {
                const response = await ReactNativeBlobUtil.fetch('GET', `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchcity)}&limit=5&appid=2d400f47102f5bf61db24e8c2d93a575`);
                let status = response.info().status;

                if (status == 200) {
                    const recivedCities: RecivedCities[] = JSON.parse(response.data)
                    //Usuwam cały obiekt więc nie ważne jaki ma typ
                    //Moglbym zostawic polską i angielską nazwę i wyświetlać w zależności od języka
                    recivedCities.forEach((object: { [x: string]: any; }) => {
                        delete object['local_names'];
                    });
                    return recivedCities;
                }

                console.log('Nastąpił błąd');
            } catch (error) {
                console.error(error);
            }
        }

        return null;
    };
};

import { useLanguageContext } from './navigation/LanguageContextProvider';
import { useSettingsContext } from './navigation/SettingsContextProvider';
import { useWeatherContext } from './navigation/WeatherContextProvider';
import { SettingsContext, WeatherContextType } from './Types';
import moment from 'moment';
import 'moment/locale/pl';

export class Utils {

    static savedCitiesLimit: number = 5;

    static calculateIconBasedOnProbOfRain(probOfRain: number) {
        if (probOfRain > 50) {
            return require('./assets/icons/fluent_weather-rain-24-regular.png');
        }

        if (probOfRain < 50 && probOfRain > 25) {
            return require('./assets/icons/fluent_weather-partly-cloudy-day-24-regular.png');
        }

        return require('./assets/icons/fluent_weather-sunny-24-regular.png');
    };

    static getImagePath(icon: string) {
        switch (icon) {
            case '01d':
                return require('./assets/icons/bigweathericons/01d.png');

            case '02d':
                return require('./assets/icons/bigweathericons/02d.png');

            case '03d':
                return require('./assets/icons/bigweathericons/03d.png');

            case '04d':
                return require('./assets/icons/bigweathericons/04d.png');

            case '09d':
                return require('./assets/icons/bigweathericons/09d.png');

            case '10d':
                return require('./assets/icons/bigweathericons/10d.png');

            case '11d':
                return require('./assets/icons/bigweathericons/11d.png');

            case '13d':
                return require('./assets/icons/bigweathericons/13d.png');

            case '50d':
                return require('./assets/icons/bigweathericons/50d.png');

            case '01n':
                return require('./assets/icons/bigweathericons/01n.png');

            case '02n':
                return require('./assets/icons/bigweathericons/02n.png');

            case '03n':
                return require('./assets/icons/bigweathericons/03n.png');

            case '04n':
                return require('./assets/icons/bigweathericons/04n.png');

            case '09n':
                return require('./assets/icons/bigweathericons/09n.png');

            case '10n':
                return require('./assets/icons/bigweathericons/10n.png');

            case '11n':
                return require('./assets/icons/bigweathericons/11n.png');

            case '13n':
                return require('./assets/icons/bigweathericons/13n.png');

            case '50n':
                return require('./assets/icons/bigweathericons/50n.png');

            default:
                break;
        }
    };

    static capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    static getDayName(timeInSec: number, timezoneInSec: number): String {
        const { selectedLanguage } = useLanguageContext();
        moment.locale(selectedLanguage);
        const dateMoment = moment.unix(timeInSec + timezoneInSec);
        const dayName = this.capitalizeFirstLetter(dateMoment.format('ddd'));
        return dayName;
    };

    static getDayNameAndMonth(timeInSec: number, timezoneInSec: number): { dayName: string, dayMonth: string } {
        const { selectedLanguage } = useLanguageContext();
        moment.locale(selectedLanguage);
        const dateMoment = moment.unix(timeInSec + timezoneInSec);
        const dayName = this.capitalizeFirstLetter(dateMoment.format('dddd'));
        const dayMonth = dateMoment.format('MMM DD');
        return { dayName, dayMonth };
    };

    static calculateTimeZone(index: number): number {
        const { weather } = useWeatherContext() as WeatherContextType;
        let timeZone = weather[index]?.timezone_offset;
        timeZone === undefined ? timeZone = 0 : timeZone;
        return timeZone;
    };

    static calculateWeather(temp: number): number {
        const { tempUnit } = useSettingsContext() as SettingsContext;
        return tempUnit === '°C' ? Math.round(temp) : Math.round((temp * 1.8) + 32);
    };

    static calculateWind(wind: number): { windUnit: string; windValue: number; } {
        const { windUnit } = useSettingsContext() as SettingsContext;

        if (windUnit === 'km/h') {
            return { windUnit: windUnit, windValue: Math.round(wind * 36) / 10 };
        }

        if (windUnit === 'm/s') {
            return { windUnit: windUnit, windValue: Math.round(wind * 10) / 10 };
        }

        if (windUnit === 'mil/h') {
            return { windUnit: windUnit, windValue: Math.round(wind * 22.36936) / 10 };
        }

        return { windUnit: windUnit, windValue: Math.round(wind * 19.438445) / 10 };
    };

    static calculatePressure(pressure: number): { pressureUnit: string; pressureValue: number; } {
        const { pressureUnit } = useSettingsContext() as SettingsContext;

        if (pressureUnit === 'mbar') {
            return { pressureUnit: pressureUnit, pressureValue: pressure };
        }

        if (pressureUnit === 'atm') {
            return { pressureUnit: pressureUnit, pressureValue: Math.round(pressure * 0.00986923267) / 10 };
        }

        if (pressureUnit === 'mmHg') {
            return { pressureUnit: pressureUnit, pressureValue: Math.round(pressure * 0.75006) };
        }

        if (pressureUnit === 'inHg') {
            return { pressureUnit: pressureUnit, pressureValue: Math.round(pressure * 0.2953) / 10 };
        }

        return { pressureUnit: pressureUnit, pressureValue: pressure };
    };
};
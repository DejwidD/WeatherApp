import React, { Component } from 'react';
import en from '../lang/en.json'
import pl from '../lang/pl.json'
import * as RNLocalize from 'react-native-localize';

interface LanguageContextProviderProps {
    children: React.ReactNode;
};

type LanguageContext = {
    locationNotShared: string;
    retrylocation: string;
    pleaseWait: string;
    foreCast7Days: string;
    now: string;
    rain: string;
    chanceRain: string;
    humidity: string;
    wind: string;
    pressure: string;
    manageLocation: string;
    searchYourCity: string;
    settings: string;
    unit: string;
    temperatureUnit: string;
    windSpeedUnit: string;
    atmosphericUnit: string;
    extra: string;
    about: string;
    pricacyPolicy: string;
    cityRemovedAnnouncementPart1: string;
    cityRemovedAnnouncementPart2: string;
    locationProviderAvailableAnnouncementPart1: string;
    locationProviderAvailableAnnouncementPart2: string;
    locationRightsNotProvidedAnnouncementPart1: string;
    locationRightsNotProvidedAnnouncementPart2: string;
    addNewLocation: string;
    getLocation: string;
    weCannotDownloadLocalization: string;
    locationRightsNotProvided: string;
    openSettingsText: string;
    cancel: string;
    description: { [key: string]: string };
    getPhoneLanguage: () => void;
    selectedLanguage: string;
};

interface LanguageContextProviderState {
    selectedLanguage: string;
};

const languageObj = {
    'en': en,
    'pl': pl
}
export const LanguageContext = React.createContext<LanguageContext>({} as LanguageContext);

export default class LanguageContextProvider extends Component<LanguageContextProviderProps, LanguageContextProviderState> {
    state = {
        selectedLanguage: 'en'
    };

    getPhoneLanguage = () => {
        const currentLanguage = RNLocalize.findBestAvailableLanguage(Object.keys(languageObj));
        this.setState({ selectedLanguage: currentLanguage?.languageTag || 'en' });
    };

    render() {
        const { children } = this.props;
        return (
            <LanguageContext.Provider value={{ ...languageObj[this.state.selectedLanguage as 'en' | 'pl'], selectedLanguage: this.state.selectedLanguage, getPhoneLanguage: this.getPhoneLanguage }}>
                {children}
            </LanguageContext.Provider>
        );
    };
};

export const useLanguageContext = () => React.useContext(LanguageContext);


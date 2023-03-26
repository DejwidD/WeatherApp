import React, { useEffect, useState } from 'react';
import AppStack from './AppStack';
import { useWeatherContext } from './WeatherContextProvider';
import { SettingsContext, WeatherContextType, } from '../Types';
import { useSettingsContext } from './SettingsContextProvider';
import { useLanguageContext } from './LanguageContextProvider';

export default function Routes(): JSX.Element {
  const { getSavedLocationAndCityData } = useWeatherContext() as WeatherContextType;
  const { getPhoneLanguage } = useLanguageContext();
  const { getUnitsFromAsync } = useSettingsContext() as SettingsContext;
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (initialLoading === true) {
      getPhoneLanguage();
      getUnitsFromAsync();
      getSavedLocationAndCityData();
      setInitialLoading(false);
    }

  }, []);

  return <AppStack />
}




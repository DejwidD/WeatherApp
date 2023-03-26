import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsContext as SettingsContextType } from '../Types';

interface SettingsContextProviderProps {
    children: React.ReactNode;
};

interface SettingsContextProviderState {
    tempUnit: string,
    windUnit: string,
    pressureUnit: string,
    [x: string]: string;
};

type Units = {
    tempUnit: string;
    windUnit: string;
    pressureUnit: string;
};

export const SettingsContext = React.createContext<SettingsContextType | null>(null);

export default class SettingsContextProvider extends Component<SettingsContextProviderProps, SettingsContextProviderState> {
    state = {
        tempUnit: '°C',
        windUnit: 'km/h',
        pressureUnit: 'mbar',
    };

    setUnit = (unitName: string, unitValue: string): void => {
        this.saveUnitsInAsync({ ...this.state, [unitName]: unitValue });
        this.setState({ [unitName]: unitValue });
    };

    saveUnitsInAsync = async (units: Units): Promise<void> => {
        try {
            const jsonValue = JSON.stringify(units);
            await AsyncStorage.setItem('units', jsonValue);
        } catch (e) {
            console.log(e);
        }
    };

    getUnitsFromAsync = async (): Promise<void> => {
        try {
            const jsonValue = await AsyncStorage.getItem('units');
            jsonValue != null ? this.setState(JSON.parse(jsonValue)) : null;
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        const { children } = this.props;
        return (
            <SettingsContext.Provider value={{ tempUnit: this.state.tempUnit, windUnit: this.state.windUnit, pressureUnit: this.state.pressureUnit, setUnit: this.setUnit, getUnitsFromAsync: this.getUnitsFromAsync }}>
                {children}
            </SettingsContext.Provider>
        );
    };
};

export const useSettingsContext = () => React.useContext(SettingsContext);


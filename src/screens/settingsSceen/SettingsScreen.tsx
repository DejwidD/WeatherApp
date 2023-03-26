import React from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../assets/Colors';
import ModalDropdown from 'react-native-modal-dropdown';
import { useSettingsContext } from '../../navigation/SettingsContextProvider';
import { useLanguageContext } from '../../navigation/LanguageContextProvider';
import { SettingsContext, } from '../../Types';
import { Header } from '../../components/Header';

export const SettingsSceen = (): JSX.Element => {
    const { windUnit, tempUnit, pressureUnit, setUnit, } = useSettingsContext() as SettingsContext;
    const { windSpeedUnit, temperatureUnit, atmosphericUnit, unit, settings, extra, about, pricacyPolicy } = useLanguageContext();
    const windOptions = ['km/h', 'mil/h', 'm/s', 'kn'];
    const tempOptions = ['°C', '°F'];
    const atmOptions = ['mbar', 'atm', 'mmHg', 'inHg', 'hPa'];

    return (
        <SafeAreaView style={styles.flex}>
            <LinearGradient colors={[Colors.blueGradientLight, Colors.blueGradientDark]} style={styles.linearGradient}>
                <View style={styles.mainBox}>
                    <Header textHeader={settings} />
                    <Text style={styles.unitText}>{unit}</Text>
                    <View style={styles.mainUnitBox}>
                        <View style={styles.singleUnitBox}>
                            <Text style={styles.singleUnitDescription}>{temperatureUnit}</Text>
                            <ModalDropdown
                                defaultValue={tempUnit}
                                textStyle={[styles.pickedItemStyle, { paddingLeft: 30, paddingRight: 5, }]}
                                dropdownTextHighlightStyle={styles.itemStyle}
                                dropdownTextStyle={styles.itemStyle}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={[{ height: tempOptions.length * 50 }, styles.dropDownStyle]}
                                options={tempOptions}
                                onSelect={(idx: string, value: string) => setUnit('tempUnit', value)}
                                renderSeparator={() => (<View></View>)}
                            />
                        </View>
                        <View style={styles.singleUnitBox}>
                            <Text style={styles.singleUnitDescription}>{windSpeedUnit}</Text>
                            <ModalDropdown
                                defaultValue={windUnit}
                                textStyle={styles.pickedItemStyle}
                                dropdownTextHighlightStyle={styles.itemStyle}
                                dropdownTextStyle={styles.itemStyle}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={[{ height: windOptions.length * 50 }, styles.dropDownStyle]}
                                onSelect={(idx: string, value: string) => setUnit('windUnit', value)}
                                options={windOptions}
                                renderSeparator={() => (<View></View>)}
                            />
                        </View>
                        <View style={styles.singleUnitBox}>
                            <Text style={styles.singleUnitDescription}>{atmosphericUnit}</Text>
                            <ModalDropdown
                                defaultValue={pressureUnit}
                                textStyle={styles.pickedItemStyle}
                                dropdownTextHighlightStyle={styles.itemStyle}
                                dropdownTextStyle={styles.itemStyle}
                                showsVerticalScrollIndicator={false}
                                dropdownStyle={[{ height: atmOptions.length * 50 }, styles.dropDownStyle]}
                                options={atmOptions}
                                onSelect={(idx: string, value: string) => setUnit('pressureUnit', value)}
                                renderSeparator={() => (<View></View>)}
                            />
                        </View>
                        <View style={styles.lineStyle} />
                        <Text style={styles.unitText}>{extra}</Text>
                        <View style={styles.aboutBox}>
                            <Text style={styles.singleUnitDescription}>{about}</Text>
                        </View>
                        <Text style={styles.singleUnitDescription}>{pricacyPolicy}</Text>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView >
    );
};

const styles = EStyleSheet.create({
    flex: {
        flex: 1,
    },
    mainBox: {
        margin: 16,
    },
    linearGradient: {
        borderRadius: 30,
        margin: 16,
        flex: 1,
    },
    headerBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backArrowIcon: {
        height: 32,
        width: 32
    },
    imgBox: {
        flex: 1 / 2
    },
    manageLocationText: {
        fontSize: '1rem',
        fontFamily: '$semiBold',
        color: '$textColor'
    },
    unitText: {
        fontSize: '0.75rem',
        fontFamily: '$medium',
        color: '$textColor'
    },
    mainUnitBox: {
        marginTop: 16,
    },
    singleUnitBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        marginBottom: 14
    },
    singleUnitDescription: {
        fontSize: '1rem',
        fontFamily: '$regular',
        color: '$textColor',
    },
    itemStyle: {
        fontSize: '1rem',
        fontFamily: '$regular',
        color: '$semiBlack'

    },
    pickedItemStyle: {
        fontSize: '0.875rem',
        fontFamily: '$regular',
        color: '$textColor',
        paddingLeft: 16

    },
    picker: {
        height: 30,
        width: 100,
        color: '$textColor',
        fontFamily: '$regular',

    },
    dropDownStyle: {
        width: 150, padding: 16, paddingVertical: 8, borderRadius: 16
    },
    lineStyle: {
        borderBottomColor: '$textColor',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        marginTop: 40,
        marginBottom: 24,
    },
    aboutBox: {
        marginTop: 22,
        marginBottom: 28
    },
});

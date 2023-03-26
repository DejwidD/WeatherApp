import React from 'react'
import { Alert, Image, Platform, Pressable, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../../assets/Colors';
import { useLanguageContext } from '../../../navigation/LanguageContextProvider';
import { useWeatherContext } from '../../../navigation/WeatherContextProvider';
import { WeatherContextType } from '../../../Types';

type WeatherLocationNotGrantedProps = {
  navigation: any;
  locationProviderAvailable: boolean;
  cityRemoved: boolean;
};

type AnnouncementProps = {
  announcementPart1: string;
  announcementPart2: string;
}

const Announcement = ({ announcementPart1, announcementPart2 }: AnnouncementProps) => (
  <View style={styles.announcementTextBox} >
    <Text style={styles.city} >{announcementPart1}</Text>
    <Text style={styles.city} >{announcementPart2}</Text>
  </View>

);

export const WeatherLocationNotGranted = ({ navigation, locationProviderAvailable, cityRemoved }: WeatherLocationNotGrantedProps) => {
  const { addNewLocation, getLocation, cityRemovedAnnouncementPart1, cityRemovedAnnouncementPart2, locationProviderAvailableAnnouncementPart1, locationProviderAvailableAnnouncementPart2, locationRightsNotProvidedAnnouncementPart2, locationRightsNotProvidedAnnouncementPart1 } = useLanguageContext();
  const { checkPermissions, permissionsGranted, openSettings } = useWeatherContext() as WeatherContextType;
  const { cancel, weCannotDownloadLocalization, locationRightsNotProvided, openSettingsText } = useLanguageContext();

  function showAlert() {
    Alert.alert(
      weCannotDownloadLocalization,
      locationRightsNotProvided,
      [
        {
          text: cancel,
          style: 'cancel',
        }, {
          text: openSettingsText,
          onPress: () => openSettings(),
          style: 'default',
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  async function handleGetLocation(): Promise<void> {
    const permissionCheck: string = Platform.OS === 'ios' ? 'blocked' : 'never_ask_again';

    if (permissionsGranted.aproximate === permissionCheck && permissionsGranted.precise === permissionCheck) {
      const permissionStatus = await checkPermissions();

      if (permissionStatus.precise === permissionCheck) {
        showAlert();
      }

      return;
    }
    //poprawiłem trochę bo dwa razy się checkPermissions wykonwywał
    checkPermissions();
  };




  return (
    <View style={styles.weatherBox}>
      <LinearGradient colors={[Colors.blueGradientLight, Colors.blueGradientDark]} style={styles.linearGradient}>
        <View style={styles.cityHeaderBox}>
          <Pressable onPress={() => { navigation.navigate('AddNewLocation') }} >
            <Image style={styles.plusIcon} source={require('../../../assets/icons/akar-icons_plus.png')} />
          </Pressable>
          <View >
            <Text style={styles.city} > </Text>
          </View>
          <Pressable onPress={() => { navigation.navigate('Settings') }}>
            <Image style={styles.plusIcon} source={require('../../../assets/icons/carbon_overflow-menu-vertical.png')} />
          </Pressable>
        </View>
        {locationProviderAvailable === true ?
          cityRemoved === true ?
            <Announcement announcementPart1={cityRemovedAnnouncementPart1} announcementPart2={cityRemovedAnnouncementPart2} />
            : <Announcement announcementPart1={locationRightsNotProvidedAnnouncementPart1} announcementPart2={locationRightsNotProvidedAnnouncementPart2} />
          : <Announcement announcementPart1={locationProviderAvailableAnnouncementPart1} announcementPart2={locationProviderAvailableAnnouncementPart2} />
        }
        <View style={styles.addNewLocationButtonBox}>
          <Pressable onPress={() => { navigation.navigate('AddNewLocation') }} style={styles.pressable}>
            <Text style={styles.foreCastFor7DaysText}>{addNewLocation}</Text>
            <Image style={styles.bluePlusIcon} source={require('../../../assets/icons/akar-icons_plus_blue.png')} />
          </Pressable>
        </View>
        < View style={styles.getocationButtonBox}>
          <Pressable onPress={() => { handleGetLocation(); }} style={styles.pressable}>
            <Text style={styles.foreCastFor7DaysText}>{getLocation}</Text>
            <Image style={styles.pinIcon} source={require('../../../assets/icons/ph_map-pin_blue.png')} />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = EStyleSheet.create({
  city: {
    color: '$textColor',
    fontSize: '1.25rem',
    fontFamily: '$semiBold',
  },
  icon: {
    color: '$textColor'
  },
  linearGradient: {
    borderRadius: 30,
    flex: 1
  },
  cityHeaderBox: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between'
  },
  plusIcon: {
    width: 32,
    height: 32
  },
  pinIcon: {
    marginLeft: 5,
    width: 32,
    height: 32
  },
  bluePlusIcon: {
    marginLeft: 5,
    width: 40,
    height: 40
  },
  weatherBox: {
    margin: 16,
    flex: 1
  },
  foreCastFor7DaysText: {
    fontSize: '1rem',
    fontFamily: '$medium',
    color: '$blueTextColor',
  },
  addNewLocationButtonBox: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  getocationButtonBox: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  announcementTextBox: {
    marginHorizontal: 16,
    alignItems: 'center'
  },
  pressable: {
    backgroundColor: '$textColor',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
  },
});


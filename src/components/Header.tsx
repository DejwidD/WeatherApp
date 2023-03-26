import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, Pressable, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

export const Header = ({ textHeader }: { textHeader: string }) => {
    const navigation = useNavigation();
    return (
        <Pressable style={styles.headerBox} onPress={() => navigation.goBack()}>
            <View style={styles.imgBox}>
                <Image style={styles.backArrowIcon} source={require('../assets/icons/bi_arrow-left-short.png')} />
            </View>
            <Text style={styles.manageLocationText}>{textHeader}</Text>
        </Pressable>
    );
};

const styles = EStyleSheet.create({
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
    }
});
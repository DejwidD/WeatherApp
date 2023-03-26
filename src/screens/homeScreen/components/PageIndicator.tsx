import React from 'react'
import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

export const PageIndicator = ({ activeIndex, length }: { activeIndex: number, length: number }): JSX.Element => {
    //Przeczytałem, że po 'new Array' nie można iterować,dlatego się nie wyświetlały kropki
    return (
        <View style={style.dotContainer}>
            {[...Array(length)].map((item, index) => {
                if (length !== 1) {
                    return (
                        <View
                            key={index}
                            style={[index == activeIndex ? [style.dot, { backgroundColor: '#FFF' }] : style.dot,]}>
                        </View>);
                }
            })}
        </View>
    );
};

const style = EStyleSheet.create({
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        zIndex: 8,
        elevation: 8,
        alignSelf: 'center',
        marginBottom: 16
    },
    dot: {
        height: 8,
        width: 8,
        marginHorizontal: 2,
        marginVertical: 2,
        backgroundColor: 'rgba(0,0,0,0)',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'white',
        position: 'relative',
        zIndex: 8,
        elevation: 8,
    },
})
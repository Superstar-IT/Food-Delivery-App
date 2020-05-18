import { Dimensions, Platform } from "react-native";

export function isIphoneX() {
    const dim = Dimensions.get('window');

    return (
        // This has to be iOS
        Platform.OS === 'ios' &&

        // Check either, iPhone X or XR
        (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
    );
}

function isIPhoneXSize(dim: any) {
    return dim.height == 812 || dim.width == 812;
}

function isIPhoneXrSize(dim: any) {
    return dim.height == 896 || dim.width == 896;
}

export const toPrice = (price: string | number) => Number(price).toFixed(2)
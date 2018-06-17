import React, { Component } from 'react';
import {
    Dimensions,
    LayoutAnimation,
    Text,
    View,
    StatusBar,
    StyleSheet,
    Vibration
} from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';

// Replce the IP with the web server IP
const WEB_SERVER_URL = "http://192.168.0.107:8080/web/qr";

export default class App extends Component {
    state = {
        hasCameraPermission: null,
        lastScannedUrl: null,
    };

    componentDidMount() {
        this._requestCameraPermission();
    }

    _requestCameraPermission = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === 'granted',
        });
    };

    _handleBarCodeRead = result => {
        Vibration.vibrate();
        LayoutAnimation.spring();
        this._requestLogin(data=result.data);


    };

    _requestLogin(data='')
    {


                fetch(
                     WEB_SERVER_URL,
                    {
                        method: 'POST',
                        headers: {

                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: data

                    }).then(function (response) {
                        return response.json.message;
                    }).catch(function (error) {
                    // console.log(error);
                    return {ok: false, msg: error};
                });

    }

    render() {
        return (
            <View style={styles.container}>

                {this.state.hasCameraPermission === null
                    ? <Text>Requesting for camera permission</Text>
                    : this.state.hasCameraPermission === false
                        ? <Text style={{ color: '#fff' }}>
                            Camera permission is not granted
                        </Text>
                        : <BarCodeScanner
                            onBarCodeRead={this._handleBarCodeRead}
                            style={{
                                height: Dimensions.get('window').height,
                                width: Dimensions.get('window').width,
                            }}
                        />}



                <StatusBar hidden />
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
        flexDirection: 'row',
    },

});

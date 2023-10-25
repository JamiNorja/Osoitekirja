import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Keyboard, StatusBar } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function MapScreen({ route, navigation }) {

    const { address } = route.params;

    const initial = {
        latitude: 60.200692,
        longitude: 24.934302,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.221
    }

    const [region, setRegion] = useState(initial);
    const [fullAddress, setFullAddress] = useState('');

    useEffect(() => { fetchCoordinates(address); }, []);

    const fetchCoordinates = async (address) => {
        const KEY = process.env.KEY;
        const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const location = data.results[0].locations[0];
            console.log(location);

            const { lat, lng } = location.latLng;
            setRegion({ ...region, latitude: lat, longitude: lng });
            setFullAddress(`${location.street} ${location.adminArea6} ${location.adminArea5}`);
        } catch (error) {
            console.log('API call failed. Did you provide a valid API key?', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
            >
                <Marker coordinate={region} title={fullAddress} />
            </MapView>
            <Button title="Save location" onPress={() => {
                navigation.navigate('My Places', { fullAddress: fullAddress.trim() });
            }} />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    search: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
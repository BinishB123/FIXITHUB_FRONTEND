interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
    accuracy: number;
}

function getCurrentLocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;
                    resolve({ latitude, longitude, accuracy });
                },
                (error) => {
                    console.log(error);
                    
                    reject(error);
                },
                {
                    enableHighAccuracy: true, // Request a more accurate position
                    timeout: 10000,           // Maximum time allowed to retrieve the location
                    maximumAge: 0             // Avoid returning a cached position
                }
            );
        } else {
            
            
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}


export default getCurrentLocation

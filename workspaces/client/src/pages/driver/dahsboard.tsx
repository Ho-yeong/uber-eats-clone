import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-2xl">🛵</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({ lat: 0, lng: 0 });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      //좌표로 주소 찾기
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng) },
        (result, status) => {
          console.log(status, result);
        },
      );
    }
    //eslint-disable-next-line
  }, [driverCoords.lat, driverCoords.lng]);

  const onApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    setMap(map);
    setMaps(maps);
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  const onGetRouteClick = () => {
    if (map) {
      const directionService = new google.maps.DirectionsService();
      const directionRenderer = new google.maps.DirectionsRenderer();
      directionRenderer.setMap(map);
      directionService.route(
        {
          origin: {
            location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
          },
          destination: {
            location: new google.maps.LatLng(driverCoords.lat + 0.1, driverCoords.lng + 0.001),
          },
          // 한국에서는 길찾기 지원 안됨
          travelMode: google.maps.TravelMode.DRIVING,
        },
        result => {
          directionRenderer.setDirections(result);
        },
      );
    }
  };

  return (
    <div>
      <div className="overflow-hidden" style={{ width: '100%', height: '50vh' }}>
        <GoogleMapReact
          defaultCenter={{ lat: 35.15, lng: 128.0666 }}
          defaultZoom={16}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onApiLoaded}
          bootstrapURLKeys={{ key: 'AIzaSyBtwl0J5CkyERhsLM02AjgDWg5UhGmAa2U' }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <button onClick={onGetRouteClick}>Get</button>
    </div>
  );
};

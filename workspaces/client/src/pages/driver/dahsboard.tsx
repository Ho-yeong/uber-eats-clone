import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import gql from 'graphql-tag';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { useMutation, useSubscription } from '@apollo/client';
import { cookedOrders } from '../../__generated__/cookedOrders';
import { useHistory } from 'react-router-dom';
import { takeOrder, takeOrderVariables } from '../../__generated__/takeOrder';

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const TAKE_ORDER = gql`
  mutation takeOrder($input: TakeOrderInput!) {
    takeOrder(input: $input) {
      ok
      error
    }
  }
`;

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
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
  };

  const makeRoute = () => {
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
            location: new google.maps.LatLng(driverCoords.lat + 0.01, driverCoords.lng + 0.001),
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

  const { data: cookedOrdersData } = useSubscription<cookedOrders>(COOKED_ORDERS_SUBSCRIPTION);

  useEffect(() => {
    if (cookedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
    //eslint-disable-next-line
  }, [cookedOrdersData]);

  const history = useHistory();
  const onCompleted = (data: takeOrder) => {
    if (data.takeOrder.ok) {
      history.push(`/order/${cookedOrdersData?.cookedOrders.id}`);
    }
  };

  const [takeOrderMutation, { loading }] = useMutation<takeOrder, takeOrderVariables>(TAKE_ORDER, {
    onCompleted,
  });

  const triggerMutation = (orderId: number) => {
    if (!loading) {
      takeOrderMutation({
        variables: {
          input: {
            id: orderId,
          },
        },
      });
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
      <div className="max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrders.restaurant ? (
          <>
            <h1 className="text-center text-3xl font-medium">New Cooked Order</h1>
            <h4 className="text-center text-2xl my-3 font-medium">
              Pick it up Soon! @ {cookedOrdersData.cookedOrders.restaurant.name}
            </h4>
            <button
              onClick={() => triggerMutation(cookedOrdersData.cookedOrders.id)}
              className="btn w-full mt-5 block text-center"
            >
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No Orders yet...</h1>
        )}
      </div>
    </div>
  );
};

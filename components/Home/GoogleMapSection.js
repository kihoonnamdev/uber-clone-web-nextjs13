import React, { useContext, useEffect, useState } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  MarkerF,
  OverlayView,
  OverlayViewF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { SourceContext } from "@/context/SourceContext";
import { DestinationContext } from "@/context/DestinationContext";

function GoogleMapSection() {
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    height: window.innerWidth * 0.45,
  });
  //   const containerStyle = {
  //     width: "100%",
  //     height: window.innerWidth * 0.6,
  //   };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setContainerStyle({ width: "100%", height: window.innerWidth * 0.45 });
    }
  }, []);

  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);

  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [directionRoutePoints, setDirectionRoutePoints] = useState([]);

  useEffect(() => {
    if (source?.length != [] && map) {
      map.panTo({
        lat: source.lat,
        lng: source.lng,
      });
      setCenter({
        lat: source.lat,
        lng: source.lng,
      });
    }

    //if (source.length != [] && destination.length != []) {
    if (source.length != 0 && destination.length != 0) {
      directionRoute();
    }
  }, [source]);

  useEffect(() => {
    if (destination?.length != [] && map) {
      setCenter({
        lat: destination.lat,
        lng: destination.lng,
      });
    }

    //if (source.length != [] && destination.length != []) {
    if (source.length != 0 && destination.length != 0) {
      directionRoute();
    }
  }, [destination]);

  const directionRoute = () => {
    // DirectionsRenderer 인스턴스 생성
    //var directionsRenderer = new google.maps.DirectionsRenderer();

    // 지도에 DirectionsRenderer 설정
    //directionsRenderer.setMap(map);

    const DirectionsService = new google.maps.DirectionsService();
    console.log("DIE");
    DirectionsService.route(
      {
        origin: { lat: source.lat, lng: source.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result);
          //directionsRenderer.setDirections(result);
          setDirectionRoutePoints(result);
        } else {
          console.error("Error");
          setDirectionRoutePoints([]);
        }
      }
    );
  };

  //   useEffect(() => {
  //     if (directionRoutePoints) {
  //       // DirectionsRenderer가 올바르게 렌더링되도록 하기 위한 로직을 추가합니다.
  //       setMap(map);
  //     }
  //   }, [directionRoutePoints]);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{ mapId: "9f4b478a260cc20f" }}
    >
      {source.length != [] ? (
        <MarkerF
          position={{ lat: source.lat, lng: source.lng }}
          icon={{
            url: "/source.png",
            scaledSize: {
              width: 20,
              height: 20,
            },
          }}
        >
          <OverlayViewF
            position={{ lat: source.lat, lng: source.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 bg-white font-bold inline-block">
              <p className="text-black text-[18px]">{source.label}</p>
            </div>
          </OverlayViewF>
        </MarkerF>
      ) : null}

      {destination.length != [] ? (
        <MarkerF
          position={{ lat: destination.lat, lng: destination.lng }}
          icon={{
            url: "/dest.png",
            scaledSize: {
              width: 20,
              height: 20,
            },
          }}
        >
          <OverlayViewF
            position={{ lat: destination.lat, lng: destination.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="p-2 bg-white font-bold inline-block">
              <p className="text-black text-[18px]">{destination.label}</p>
            </div>
          </OverlayViewF>
        </MarkerF>
      ) : null}

      {directionRoutePoints &&
        Array.isArray(directionRoutePoints.routes) &&
        directionRoutePoints.routes.length > 0 && (
          <DirectionsRenderer
            directions={directionRoutePoints}
            options={{
              polylineOptions: {
                strokeColor: "#000",
                strokeWeight: 5,
              },
              suppressMarkers: true,
            }}
          />
        )}
    </GoogleMap>
  );
}

export default GoogleMapSection;

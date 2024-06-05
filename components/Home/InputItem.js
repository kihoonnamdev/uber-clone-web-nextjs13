"use client";
import { DestinationContext } from "@/context/DestinationContext";
import { SourceContext } from "@/context/SourceContext";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function InputItem({ type }) {
  const [value, setValue] = useState(null);
  const [placeholder, setPlaceholder] = useState(null);
  const { source, setSource } = useContext(SourceContext);
  const { destination, setDestination } = useContext(DestinationContext);

  useEffect(() => {
    type == "source"
      ? setPlaceholder("Pickup Location")
      : setPlaceholder("Dropoff Location");
  }, []);

  const getLatAndLng = (place, type) => {
    //console.log(place, type);

    const placeId = place.value.place_id;
    const service = new google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails({ placeId }, (place, status) => {
      if (status === "OK" && place.geometry && place.geometry.location) {
        console.log(place.geometry.location.lng());
        if (type == "source") {
          setSource({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.formatted_address,
            label: place.name,
          });
        } else {
          setDestination({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            name: place.formatted_address,
            label: place.name,
          });
        }
      }
    });
  };

  return (
    <div className="bg-slate-200 p-3 rounded mt-3 flex items-center gap-4">
      <Image
        src={type == "source" ? "/source.png" : "/dest.png"}
        width={15}
        height={15}
      ></Image>
      {/* <input
        type="text"
        placeholder={type == "source" ? "Pickup Location" : "DropOff Location"}
        className="bg-transparent w-full outline-none"
      /> */}
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: (place) => {
            getLatAndLng(place, type);
            setValue(place, type);
          },
          placeholder: "Pickup Location",
          isClearable: true,
          className: "w-full",
          components: {
            DropdownIndicator: false,
          },
          styles: {
            control: (provided) => ({
              ...provided,
              backgroundColor: "#00ffff00",
              border: "none",
            }),
          },
        }}
      />
    </div>
  );
}

export default InputItem;

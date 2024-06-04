"use client";
import Image from "next/image";
import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function InputItem({ type }) {
  const [value, setValue] = useState(null);
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
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
        selectProps={{
          value,
          onChange: setValue,
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

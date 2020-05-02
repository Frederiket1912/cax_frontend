import React, { useState } from "react";
import { SearchHotelsURL } from "./Settings";
import apiFetchFacade from "./apiFetchFacade";

function HotelPage() {
  const [hotelSearch, setHotelSearch] = useState("");
  const [hotels, setHotels] = useState();

  const handleSearch = () => {
    const body = {
      checkIn: "2020-01-08",
      checkOut: "2020-01-15",
      adults1: "1",
    };
    const url = SearchHotelsURL;
    apiFetchFacade()
      .getApiFetch2(body, url)
      .then((data) => {
        setHotels({ ...data });
      });
  };

  console.log(hotels);

  function handleSearchChange(e) {
    setHotelSearch(e.target.value);
  }

  return (
    <div>
      <div className="header">
        <h2>Hotels</h2>
      </div>
      <div className="searchbar">
        <>
          <label htmlFor="search">Search hotels by name :</label>&nbsp;
          <input type="text" onChange={handleSearchChange}></input>
        </>
      </div>
      <div className="outerdiv">
        <div className="hotelpicture">
          <img
            src="https://pix6.agoda.net/hotelImages/124/1246280/1246280_16061017110043391702.jpg?s=1024x768"
            alt=""
            height="150"
            width="150"
          ></img>
        </div>
        <div className="hotelname">
          <p>Name : {hotelSearch}</p>
        </div>
        <div className="hotelstars">
          <p>Hotel Rating: 7.5</p>
        </div>
      </div>
      <button onClick={handleSearch}> Search Hotels</button>
    </div>
  );
}

export default HotelPage;

import React, { useState } from "react";
import { SearchHotelsURL } from "./Settings";
import apiFetchFacade from "./apiFetchFacade";
// import "./font-awesome.min.css";
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStroopwafel } from "@fortawesome/free-solid-svg-icons";
//library.add(faStroopwafel);
//import ReactStars from "react-stars";
// import RatingComponent from "react-rating-component";
import Rating from "react-rating";

function HotelPage() {
  const [hotelSearch, setHotelSearch] = useState("Hotel1");
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
      <div className="header2">
        <h2>Hotels</h2>
      </div>
      <div className="searchbar">
        <>
          <label htmlFor="search">Search hotels by name :</label>&nbsp;
          <input type="text" onChange={handleSearchChange}></input>
        </>
      </div>
      <div className="outerdiv">
        <div class="col-lg-4 col-md-6">
          <div class="container">
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
            <Rating
              emptySymbol="fa fa-star-o"
              fullSymbol="fa fa-star"
              fractions={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelPage;

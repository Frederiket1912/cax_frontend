import React, { useState, useEffect } from "react";
import { SearchHotelsURL } from "./settings";
//import apiFetchFacade from "./apiFetchFacade";
import Rating from "react-rating";

function HotelPage({ apiFetchFacade }) {
  const [hotelSearch, setHotelSearch] = useState("Hotel1");
  const [hotels, setHotels] = useState("");

  /*const handleSearch = () => {
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
  };*/

  useEffect(() => {
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
  }, [apiFetchFacade]);

  console.log(hotels);

  function handleSearchChange(e) {
    setHotelSearch(e.target.value);
  }

  function Table(props) {
    if (
      props === undefined ||
      props === null ||
      props.data === undefined ||
      props.data.body.searchResults.results === undefined
    )
      return <></>;
    return (
      <div className="outerdiv">
        {props.data.body.searchResults.results.map((place) =>
          DisplayHotel(place)
        )}
      </div>
    );
  }

  function DisplayHotel(place) {
    return (
      <div className="col-lg-4 col-md-6" key={place.id}>
        <div className="container">
          <div className="hotelpicture">
            <img
              className="smallhotelpicture"
              src={place.thumbnailUrl}
              alt=""
              height="150"
              width="150"
            ></img>
          </div>
          <div className="hotelname">
            <p>Name : {place.name}</p>
          </div>
          <div className="hotelstars">
            <Rating
              emptySymbol={<img src="star-empty.png" className="icon" alt="" />}
              fullSymbol={<img src="star-full.png" className="icon" alt="" />}
              initialRating={place.starRating}
              readonly
            />
          </div>
        </div>
      </div>
    );
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
      <Table data={hotels.data} />
    </div>
  );
}
//<button onClick={handleSearch}> Search Hotels</button>
export default HotelPage;

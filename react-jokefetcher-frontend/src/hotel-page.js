import React, { useCallback, useState, useEffect, useContext } from "react";
import { SearchHotelsURL } from "./settings";
//import apiFetchFacade from "./apiFetchFacade";
import Rating from "react-rating";
import { dateFormatter } from "./date-helper";
import DatePicker from "react-datepicker";
import { CartContext } from "./cart-context";

function HotelPage({ apiFetchFacade }) {
  const [hotels, setHotels] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const [startFormatDate, setStartFormatDate] = useState(
    dateFormatter(startDate)
  );
  const [endFormatDate, setEndFormatDate] = useState(dateFormatter(endDate));
  const [peopleCount, setPeopleCount] = useState(1);

  const incrementCount = () => {
    setPeopleCount(peopleCount + 1);
    return peopleCount;
  };

  const decrementCount = () => {
    if (peopleCount === 1) return peopleCount;
    setPeopleCount(peopleCount - 1);
    return peopleCount;
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartFormatDate(dateFormatter(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndFormatDate(dateFormatter(date));
  };

  const handleSearch = useCallback(() => {
    const body = {
      checkIn: startFormatDate,
      checkOut: endFormatDate,
      adults1: peopleCount,
    };
    const url = SearchHotelsURL;
    apiFetchFacade()
      .getApiFetch2(body, url)
      .then((data) => {
        setHotels({ ...data });
        console.log(data);
      });
  });

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
          DisplayHotel(
            place,
            props.startFormatDate,
            props.endFormatDate,
            props.peopleCount
          )
        )}
      </div>
    );
  }

  function DisplayHotel(place, startFormatDate, endFormatDate, peopleCount) {
    const { cart, setCart } = useContext(CartContext);
    const addToCart = useCallback(
      (place) => {
        console.log("PLACE", place);
        let newCart = [];

        newCart = newCart.concat(cart);
        newCart.push({
          service: "hotel",
          name: place.name,
          dateIn: startFormatDate,
          dateOut: endFormatDate,
          price:
            parseInt(place.ratePlan.price.current.substring(1)) * peopleCount,
          adults: peopleCount,
        });
        setCart(newCart);
      },
      [cart]
    );
    const buttonClick = () => {
      if (window.confirm("Are you sure you wish to book this hotel?")) {
        addToCart(place, startFormatDate, endFormatDate, peopleCount);
      }
    };
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
            <p>
              Name : {place.name} - Price:&nbsp;{place.ratePlan.price.current}
            </p>
          </div>
          <div className="hotelstars">
            <Rating
              emptySymbol={<img src="star-empty.png" className="icon" alt="" />}
              fullSymbol={<img src="star-full.png" className="icon" alt="" />}
              initialRating={place.starRating}
              readonly
            />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={buttonClick}>Book Hotel</button>
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
      <div className="div2">
        <div className="date1">
          Check in date:&nbsp;
          <DatePicker
            minDate={new Date()}
            selected={startDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date) => handleStartDateChange(date)}
          />
        </div>
        <div className="date2">
          Check out date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <DatePicker
            minDate={new Date()}
            selected={endDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date) => handleEndDateChange(date)}
          />
        </div>
      </div>
      <div className="counter">
        Number of people : &nbsp;
        <button onClick={decrementCount}>-</button>
        &nbsp;{peopleCount}&nbsp;
        <button onClick={incrementCount}>+</button>
      </div>
      <div className="flightbutton">
        <button onClick={handleSearch}> Search Hotels</button>
      </div>
      <Table
        startFormatDate={startFormatDate}
        endFormatDate={endFormatDate}
        peopleCount={peopleCount}
        data={hotels.data}
      />
    </div>
  );
}
export default HotelPage;

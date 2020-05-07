import DatePicker from "react-datepicker";
import React, { useState, useCallback, useContext } from "react";
import { SearchFlightsURL } from "./settings";
import { dateFormatter } from "./date-helper";
import apiFetchFacade from "./apiFetchFacade";
import { CartContext } from "./cart-context";

function FlightPage() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const [startFormatDate, setStartFormatDate] = useState(
    dateFormatter(startDate)
  );
  const [endFormatDate, setEndFormatDate] = useState(dateFormatter(endDate));

  const [fromAirport, setFromAirport] = useState("lond");
  const [toAirport, setToAirport] = useState("pari");

  const [peopleCount, setPeopleCount] = useState(1);

  const [flights, setFlights] = useState();
  const [carriers, setCarriers] = useState();
  const [places, setPlaces] = useState();
  const [quotes, setQuotes] = useState();

  const incrementCount = () => {
    setPeopleCount(peopleCount + 1);
    return peopleCount;
  };

  const decrementCount = () => {
    if (peopleCount === 1) return peopleCount;
    setPeopleCount(peopleCount - 1);
    return peopleCount;
  };

  const handleSearch = useCallback(() => {
    const body = {
      destinationplace: toAirport,
      originplace: fromAirport,
      outbounddate: startFormatDate,
      inbounddate: endFormatDate,
    };

    const url = SearchFlightsURL;
    apiFetchFacade()
      .getApiFetch2(body, url)
      .then((data) => {
        setFlights({ ...data });
        setCarriers({ ...data.Carriers });
        setPlaces({ ...data.Places });
        setQuotes({ ...data.Quotes });
        console.log(data);
        console.log(carriers);
        //console.log(places);
        //console.log(quotes);
      });
  });

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartFormatDate(dateFormatter(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndFormatDate(dateFormatter(date));
  };

  const divStyle = {
    display: "flex",
  };

  return (
    <div>
      <div className="header2">
        <h2>Search for flights</h2>
      </div>
      <div className="div1">
        <div style={divStyle}>
          <div className="flightsfrom">From :</div>
          <div className="select1">
            <select
              value={fromAirport}
              onChange={(e) => setFromAirport(e.currentTarget.value)}
            >
              <option value="lond">London</option>
              <option value="pari">Paris</option>
            </select>
          </div>
        </div>
        <div style={divStyle}>
          <div className="flightsto">&nbsp;&nbsp; To : &nbsp; </div>
          <div className="select2">
            <select
              value={toAirport}
              onChange={(e) => setToAirport(e.currentTarget.value)}
            >
              <option value="pari">Paris</option>
              <option value="lond">London</option>
            </select>
          </div>
        </div>
      </div>
      <div className="div2">
        <div className="date1">
          Departure date:&nbsp;
          <DatePicker
            minDate={new Date()}
            selected={startDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date) => handleStartDateChange(date)}
          />
        </div>
        <div className="date2">
          Return date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
        <button onClick={handleSearch}> Search Flights</button>
      </div>
      <div className="flightData"></div>
      {flights !== undefined &&
        flights !== null &&
        flights.Quotes !== undefined &&
        flights.Quotes.length > 0 &&
        carriers !== undefined &&
        carriers !== null &&
        places !== null &&
        places !== undefined &&
        quotes !== null &&
        quotes !== undefined && (
          <div>
            <table className="flight-table">
              <thead>
                <tr>
                  <th>Inbound Carrier</th>
                  <th>Inbound Flight Portal</th>
                  <th>Direct Flight</th>
                  <th>Outbound Carrier</th>
                  <th>Outbound Flight Portal</th>
                  <th>Price</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {flights.Quotes.map((place) => (
                  <DisplayFlight
                    key={place.QuoteId}
                    place={place}
                    places={places}
                    quotes={quotes}
                    flights={flights}
                    carriers={carriers}
                    startFormatDate={startFormatDate}
                    endFormatDate={endFormatDate}
                    peopleCount={peopleCount}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
}

function DisplayFlight({
  place,
  places,
  quotes,
  flights,
  carriers,
  startFormatDate,
  endFormatDate,
  peopleCount,
}) {
  const { cart, setCart } = useContext(CartContext);
  function FindCarrier(carrierId) {
    if (carriers === undefined && carriers === null) return undefined;
    for (var i = 0; i < Object.keys(carriers).length; i++) {
      if (carriers[i].CarrierId === carrierId) {
        return carriers[i].Name;
      }
    }
  }

  function FindFlightPortal(placeId) {
    if (places === undefined && places === null) return undefined;
    for (var i = 0; i < Object.keys(places).length; i++) {
      if (places[i].PlaceId === placeId) {
        //console.log("Flight Portal Name Match:" + flightPortalMatch[0].Name);
        return places[i].Name;
      }
    }
  }

  const addToCart = useCallback(
    (place, inBountName, outBoundName) => {
      let newCart = [];

      newCart = newCart.concat(cart);
      newCart.push({
        service: "flight",
        name: inBountName + "-" + outBoundName,
        dateIn: startFormatDate,
        dateOut: endFormatDate,
        price: place.MinPrice * peopleCount,
        adults: peopleCount,
      });
      setCart(newCart);
    },
    [cart]
  );

  if (
    flights === undefined &&
    flights === null &&
    quotes === null &&
    quotes === undefined
  )
    return <></>;
  let inBoundName = FindFlightPortal(place.InboundLeg.DestinationId);
  let outBoundName = FindFlightPortal(place.OutboundLeg.DestinationId);

  return (
    <tr key="">
      <td>{FindCarrier(place.InboundLeg.CarrierIds[0])}</td>
      <td>{inBoundName}</td>
      <td>{place.Direct ? "true" : "false"}</td>
      <td>{FindCarrier(place.OutboundLeg.CarrierIds[0])}</td>
      <td>{outBoundName}</td>
      <td>{place.MinPrice}</td>
      <td>
        <button onClick={() => addToCart(place, inBoundName, outBoundName)}>
          Add to cart
        </button>
      </td>
    </tr>
  );
}

export default FlightPage;

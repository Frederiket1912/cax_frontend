import DatePicker from "react-datepicker";
import React, { useState } from "react";
import { SearchFlightsURL } from "./Settings";
import { dateFormatter } from "./date-helper";
import apiFetchFacade from "./apiFetchFacade";

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

  const [flights, SetFlights] = useState();

  const incrementCount = () => {
    setPeopleCount(peopleCount + 1);
    return peopleCount;
  };

  const decrementCount = () => {
    if (peopleCount === 1) return peopleCount;
    setPeopleCount(peopleCount - 1);
    return peopleCount;
  };

  const handleSearch = () => {
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
        SetFlights({ ...data });
        console.log(data);
      });
  };

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
    </div>
  );
}

export default FlightPage;

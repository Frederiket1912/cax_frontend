import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SearchFlightsURL, SearchHotelsURL } from "./Settings";

function App({ apiFetchFacade, authFacade }) {
  let token = localStorage.getItem("jwtToken");

  const [loggedIn, setLoggedIn] = useState(
    token !== undefined && token !== null
  );
  const [role, setRole] = useState("");
  const history = useHistory();

  const logout = () => {
    authFacade.logout();
    setLoggedIn(false);
    updateRoles();
  };
  //Fri May 01 2020 11:15:52 GMT+0200 (Central European Summer Time)
  function dateFormatter(date) {
    let month = date.toString().substring(4, 7);
    const day = date.toString().substring(8, 10);
    const year = date.toString().substring(11, 15);

    switch (month) {
      case "Jan":
        month = "01";
        break;
      case "Feb":
        month = "02";
        break;
      case "Mar":
        month = "03";
        break;
      case "Apr":
        month = "04";
        break;
      case "May":
        month = "05";
        break;
      case "Jun":
        month = "06";
        break;
      case "Jul":
        month = "07";
        break;
      case "Aug":
        month = "08";
        break;
      case "Sep":
        month = "09";
        break;
      case "Oct":
        month = "10";
        break;
      case "Nov":
        month = "11";
        break;
      case "Dec":
        month = "12";
        break;
      default:
        console.log("Something went wrong with reading the month");
    }
    return year + "-" + month + "-" + day;
  }

  const login = (user, pass) => {
    authFacade
      .login(user, pass)
      .then((res) => setLoggedIn(true))
      .then((res) => updateRoles())
      .catch((res) =>
        alert("Status code : " + res.status + " Wrong username or password.")
      );
    history.push("/");
  };

  function updateRoles() {
    token = localStorage.getItem("jwtToken");
    if (token) {
      var decoded = jwt_decode(token);
      setRole(decoded.roles);
    } else {
      setRole(null);
    }
  }

  useEffect(() => {
    token = localStorage.getItem("jwtToken");
    if (token) {
      var decoded = jwt_decode(token);
      setLoggedIn(true);
      setRole(decoded.roles);
    }
  }, []);

  console.log(role);
  return (
    <div className="App">
      <Header loggedIn={loggedIn} role={role} logout={logout} />
      {loggedIn && (
        <Switch>
          <Route exact path="/">
            <Home token={token} />
          </Route>
          {role && role.includes("user") && (
            <Route path="/fetch">
              <ApiFetch apiFetchFacade={apiFetchFacade} />
            </Route>
          )}
          {role && role.includes("admin") && (
            <Route path="/custompage">
              <Custompage />
            </Route>
          )}
          <Route path="/flightpage">
            <Flightpage
              dateFormatter={dateFormatter}
              apiFetchFacade={apiFetchFacade}
            />
          </Route>
          <Route path="/hotelpage">
            <HotelPage apiFetchFacade={apiFetchFacade} />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      )}
      {!loggedIn && (
        <Switch>
          <Route path="/login">
            <LogIn login={login} />
          </Route>
          <Route>
            <Home token={token} />
          </Route>
        </Switch>
      )}
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = (evt) => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value,
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}

function Header({ role, loggedIn, logout }) {
  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>

        {loggedIn ? (
          <>
            {role !== null && role.includes("admin") && (
              <li>
                <NavLink activeClassName="active" to="/custompage">
                  Custom page
                </NavLink>
              </li>
            )}
            {role !== null && role.includes("user") && (
              <li>
                <NavLink activeClassName="active" to="/fetch">
                  Api Fetch
                </NavLink>
              </li>
            )}
            <li>
              <NavLink activeClassName="active" to="/flightpage">
                Flights
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/hotelpage">
                Hotels
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" onClick={logout} to="/login">
                Logout
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink activeClassName="active" to="/login">
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h3>No match for that route</h3>
    </div>
  );
}

function Capatialize(prop) {
  return prop.charAt(0).toUpperCase() + prop.slice(1);
}

function Home(props) {
  const token = props.token;
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (token !== null && token !== undefined) {
      var decoded = jwt_decode(token);
      setUsername(Capatialize(decoded.username));
      setRole(decoded.roles);
    }
  }, [token]);

  return (
    <div>
      {role !== "" && (
        <div>
          <h2>
            Welcome {username} you're logged in with the role: {role}
          </h2>
          <a href="https://github.com/Frederiket1912/ca3_startcode_backend/blob/master/README.md">
            How to use backend and frontend startcode
          </a>
        </div>
      )}
      {role === "" && (
        <div>
          <h2>Welcome. Please log in.</h2>
          <a href="https://github.com/Frederiket1912/ca3_startcode_backend/blob/master/README.md">
            How to use backend and frontend startcode
          </a>
        </div>
      )}
    </div>
  );
}

function Custompage() {
  return (
    <div>
      <h2>Only admins can see this special and important message</h2>
    </div>
  );
}

function Flightpage({ apiFetchFacade, dateFormatter }) {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date().setDate(startDate.getDate() + 7)
  );

  const plus7 = new Date().setDate(startDate.getDate() + 7);
  const [startFormatDate, setStartFormatDate] = useState(
    dateFormatter(startDate)
  );
  const [endFormatDate, setEndFormatDate] = useState();

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
      });
  };

  console.log(flights);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setStartFormatDate(dateFormatter(date));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setEndFormatDate(dateFormatter(date));
  };

  return (
    <div>
      <div className="header">
        <h2>Search for flights</h2>
      </div>
      <div className="div1">
        <div className="flightsfrom">From : &nbsp;</div>
        <div className="select1">
          <select
            value={fromAirport}
            onChange={(e) => setFromAirport(e.currentTarget.value)}
          >
            <option value="lond">London</option>
            <option value="pari">Paris</option>
          </select>
        </div>
        <div className="flightsto">&nbsp;&nbsp; To : &nbsp;</div>
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

function HotelPage({ apiFetchFacade }) {
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

function Table(props) {
  if (
    props === undefined ||
    props === null ||
    props.scanner === undefined ||
    props.scanner.Places === undefined
  )
    return <></>;
  return (
    <table>
      <thead>
        <tr>
          <th>PlaceId</th>
          <th>PlaceName</th>
          <th>CountryId</th>
        </tr>
      </thead>
      <tbody>{props.scanner.Places.map((place) => DisplayPlace(place))}</tbody>
    </table>
  );
}

function DisplayPlace(place) {
  return (
    <tr key={place.PlaceId}>
      <td>{place.PlaceId}</td>
      <td>{place.PlaceName}</td>
      <td>{place.CountryId}</td>
    </tr>
  );
}

function ApiFetch({ apiFetchFacade }) {
  const [ca3fetch, setCa3fetch] = useState([]);

  useEffect(() => {
    apiFetchFacade()
      .getApiFetch()
      .then((data) => {
        setCa3fetch({ ...data });
      });
  }, [apiFetchFacade]);

  return (
    <div>
      <ul>
        <li>Chuck joke : {ca3fetch.chuckJoke}</li>
        <li>Chuck joke url : {ca3fetch.chuckJokeURL}</li>
        <li>Dad joke : {ca3fetch.dadJoke}</li>
        <li>Dad joke url : {ca3fetch.dadJokeURL}</li>
        <li>API Weather URL: {ca3fetch.weatherURL}</li>
        <li>API Weather timezone: {ca3fetch.weatherTimezone}</li>
        <Table scanner={ca3fetch.scanner} />
        <li>
          Dog Message :{" "}
          <img src={ca3fetch.dogDTOMessage} alt={ca3fetch.dogDTOMessage}></img>
        </li>
      </ul>
    </div>
  );
}

export default App;

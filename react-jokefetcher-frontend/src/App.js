import React, { useState, useEffect } from "react";
import "./App.css";
import { Switch, Route, NavLink } from "react-router-dom";
import jwt_decode from "jwt-decode";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App({ apiFetchFacade, authFacade }) {
  let token = localStorage.getItem("jwtToken");

  const [loggedIn, setLoggedIn] = useState(
    token !== undefined && token !== null
  );
  const [role, setRole] = useState("");

  const logout = () => {
    authFacade.logout();
    setLoggedIn(false);
    updateRoles();
  };

  const login = (user, pass) => {
    authFacade
      .login(user, pass)
      .then((res) => setLoggedIn(true))
      .then((res) => updateRoles())
      .catch((res) =>
        alert("Status code : " + res.status + " Wrong username or password.")
      );
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
            <Flightpage />
          </Route>
          <Route path="/hotelpage">
            <HotelPage />
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

function Flightpage() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date().setDate(startDate.getDate() + 7)
  );

  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");

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
            <option value="Paris">Paris</option>
            <option value="London">London</option>
          </select>
        </div>
        <div className="flightsto">&nbsp;&nbsp; To : &nbsp;</div>
        <div className="select2">
          <select
            value={toAirport}
            onChange={(e) => setToAirport(e.currentTarget.value)}
          >
            <option value="Paris">Paris</option>
            <option value="London">London</option>
          </select>
        </div>
      </div>
      <div className="div2">
        <div className="date1">
          Departure date:&nbsp;
          <DatePicker
            minDate={new Date()}
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </div>
        <div className="date2">
          Return date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <DatePicker
            minDate={new Date()}
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </div>
      </div>
      <div className="counter">
        Number of people : &nbsp;
        <button onClick={incrementCount}>+</button>
        &nbsp;{peopleCount}&nbsp;
        <button onClick={decrementCount}>-</button>
      </div>
      <div className="flightbutton">
        <button> Book Flight</button>
      </div>
    </div>
  );
}

function HotelPage() {
  const [hotelSearch, setHotelSearch] = useState("");

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

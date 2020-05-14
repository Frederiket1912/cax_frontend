import React, { useState, useEffect, useContext } from "react";
import { Switch, Route, NavLink, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import "react-datepicker/dist/react-datepicker.css";
import HotelPage from "./hotel-page";
import FlightPage from "./flight-page";
import UserRegistrationPage from "./userregister";
import ShoppingCartPage from "./shopping-cart";
import OrderHistoryPage from "./order-history";
import AdminCreateUsers from "./admincreateuser";
import AdminViewAllOrders from "./allorders";
import AdminCreateDiscountCode from "./admincreatediscountcode";
import User_support_ticket from "./user-support_ticket";
import Support_support_ticket from "./support-support_ticket";
import hotelimg from "./images/hotel.png";
import planeimg from "./images/plane.png";
import { CartContextProvider, CartContext } from "./cart-context";

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

  return (
    <CartContextProvider>
      <div className="App">
        <Header loggedIn={loggedIn} role={role} logout={logout} />

        {loggedIn && role && role.includes("admin") && (
          <Route exact path="/">
            <Home history={history} token={token} />
          </Route>
        )}

        {loggedIn &&
          role &&
          !role.includes("admin") &&
          !role.includes("support") && (
            <Switch>
              <Route exact path="/">
                <Home history={history} token={token} />
              </Route>
              <Route path="/flightpage">
                <FlightPage />
              </Route>
              <Route path="/hotelpage">
                <HotelPage apiFetchFacade={apiFetchFacade} />
              </Route>
              <Route path="/shoppingcart">
                <ShoppingCartPage apiFetchFacade={apiFetchFacade} />
              </Route>
              <Route path="/orderhistory">
                <OrderHistoryPage apiFetchFacade={apiFetchFacade} />
              </Route>
              <Route path="/support">
                <User_support_ticket apiFetchFacade={apiFetchFacade} />
              </Route>
              <Route>
                <NoMatch />
              </Route>
            </Switch>
          )}
        {role && role.includes("admin") && (
          <>
            <Route path="/create">
              <AdminCreateUsers apiFetchFacade={apiFetchFacade} />
            </Route>
            <Route path="/vieworders">
              <AdminViewAllOrders apiFetchFacade={apiFetchFacade} />
            </Route>
            <Route path="/discountcode">
              <AdminCreateDiscountCode apiFetchFacade={apiFetchFacade} />
            </Route>
          </>
        )}
        {role && role.includes("support") && (
          <>
            <Route path="/viewticket">
              <Support_support_ticket apiFetchFacade={apiFetchFacade} />
            </Route>
          </>
        )}
        {!loggedIn && (
          <>
            <Switch>
              <Route exact path="/">
                <Home history={history} token={token} />
              </Route>
              <Route path="/login">
                <LogIn login={login} />
              </Route>
              <Route path="/registration">
                <UserRegistrationPage
                  apiFetchFacade={apiFetchFacade}
                  loginCallback={login}
                />
              </Route>
            </Switch>
          </>
        )}
      </div>
    </CartContextProvider>
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
        {role !== null && role && role.includes("admin") && (
          <>
            <li>
              <NavLink activeClassName="active" to="/create">
                Create users
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/vieworders">
                View Orders
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/discountcode">
                Create Discount Codes
              </NavLink>
            </li>
          </>
        )}
        {role !== null && role && role.includes("support") && (
          <>
            <li>
              <NavLink activeClassName="active" to="/viewticket">
                View tickets
              </NavLink>
            </li>
          </>
        )}

        {loggedIn &&
          role &&
          !role.includes("admin") &&
          !role.includes("support") && (
            <>
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
                <NavLink activeClassName="active" to="/shoppingcart">
                  Shopping Cart
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/orderhistory">
                  Order History
                </NavLink>
              </li>
              <li>
                <NavLink activeClassName="active" to="/support">
                  Support
                </NavLink>
              </li>
            </>
          )}
        {loggedIn && (
          <li>
            <NavLink activeClassName="active" onClick={logout} to="/login">
              Logout
            </NavLink>
          </li>
        )}
        {!loggedIn && (
          <>
            <li>
              <NavLink activeClassName="active" to="/login">
                Login
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/registration">
                Register
              </NavLink>
            </li>
          </>
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
      {role && role.includes("admin") && (
        <div>
          <h2>Admin page</h2>
        </div>
      )}
      {role && role.includes("support") && (
        <div>
          <h2>Support page</h2>
        </div>
      )}
      {role !== "" && !role.includes("admin") && (
        <div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <div className="row">
            <a href="/hotelpage">
              <div className="column">
                <img
                  className="frontpagepicture"
                  src={hotelimg}
                  alt="Hotel"
                ></img>
              </div>
            </a>
            <div className="column">
              <a href="/flightpage">
                <img
                  className="frontpagepicture"
                  src={planeimg}
                  alt="Plane"
                ></img>
              </a>
            </div>
          </div>
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

export default App;

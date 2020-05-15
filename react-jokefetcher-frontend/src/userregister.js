import React, { useState } from "react";
import { UserRegistrationURL } from "./settings";

export default function UserRegistrationPage({
  apiFetchFacade,
  loginCallback,
}) {
  let blankUser = { username: "", password: "" };
  const [user, setUser] = useState({ ...blankUser });
  const [response, setResponse] = useState("");

  let token = localStorage.getItem("jwtToken");
  const [loggedIn, setLoggedIn] = useState(
    token !== undefined && token !== null
  );

  function changeHandler(event) {
    const { id, value } = event.target;
    setUser({ ...user, [id]: value });
  }

  function submitHandler(event) {
    const url = UserRegistrationURL + "/" + user.username + "/" + user.password;
    apiFetchFacade()
      .createUserApi(url)
      .then((data) => {
        //setResponse("ok");
        loginCallback(user.username, user.password);
      })
      .catch((err) => {
        setResponse(err.status);
      });
  }

  return (
    <>
      <h3>Register a new account</h3>
      <p>
        Username:{" "}
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={user.username}
          onChange={(event) => changeHandler(event)}
        />
      </p>
      <p>
        Password:{" "}
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={user.password}
          onChange={(event) => changeHandler(event)}
        />
      </p>
      <button onClick={(event) => submitHandler(event)}>Sign Up</button>
      {response === 400 && (
        <>
          <p>Username already exists</p>
        </>
      )}
      {response === 500 && (
        <>
          <p>Something went wrong, please try again later</p>
        </>
      )}
    </>
  );
}

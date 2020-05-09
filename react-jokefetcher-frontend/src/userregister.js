import React, { useState, useEffect } from "react";
import { UserRegistrationURL } from "./settings";

export default function UserRegistrationPage({ apiFetchFacade }) {
  let blankUser = { username: "", password: "" };
  const [user, setUser] = useState({ ...blankUser });
  const [error, setError] = useState("");
  const [postResponse, setPostResponse] = useState("");

  function changeHandler(event) {
    const { id, value } = event.target;
    setUser({ ...user, [id]: value });
  }

  function submitHandler(event) {
    const url = UserRegistrationURL + "/" + user.username + "/" + user.password;
    apiFetchFacade()
      .createUserApi(url)
      .then((data) => {
        setPostResponse({ ...data });
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
          onChange={changeHandler}
        />
      </p>
      <p>
        Password:{" "}
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={user.password}
          onChange={changeHandler}
        />
      </p>
      <button onClick={submitHandler}>Sign Up</button>
    </>
  );
}

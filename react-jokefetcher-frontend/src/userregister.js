import React, { useState } from "react";
import { UserRegistrationURL } from "./settings";

export default function UserRegistrationPage({ apiFetchFacade }) {
  let blankUser = { username: "", password: "" };
  const [user, setUser] = useState({ ...blankUser });
  const [response, setResponse] = useState("");

  function changeHandler(event) {
    const { id, value } = event.target;
    setUser({ ...user, [id]: value });
  }

  function submitHandler(event) {
    const url = UserRegistrationURL + "/" + user.username + "/" + user.password;
    apiFetchFacade()
      .createUserApi(url)
      .then((data) => {
        setResponse("ok");
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
      {response === "ok" && (
        <>
          <p>Account has been created</p>
        </>
      )}
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

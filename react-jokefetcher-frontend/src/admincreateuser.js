import React, { useCallback, useState, useEffect, useContext } from "react";
import { AdminRegistrationURL } from "./settings";

function AdminCreateUsers({ apiFetchFacade }) {
  let blankUser = { username: "", password: "" };
  const [user, setUser] = useState({ ...blankUser });
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const [postResponse, setPostResponse] = useState("");

  function changeHandler(event) {
    const { id, value } = event.target;
    setUser({ ...user, [id]: value });
  }

  function submitHandler(event) {
    const url =
      AdminRegistrationURL +
      "/" +
      user.username +
      "/" +
      user.password +
      "/" +
      role;
    apiFetchFacade()
      .createUserApi(url)
      .then((data) => {
        setPostResponse({ ...data });
        if (data.error) {
          setError(data.error);
        } else {
          setError("ok");
          setUser(blankUser);
        }
      });
  }
  return (
    <div>
      <h3>Create new user account</h3>
      <p>
        Username:{" "}
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={user.username}
          onChange={changeHandler}
          required
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
      <select value={role} onChange={(e) => setRole(e.currentTarget.value)}>
        <option value="admin">Admin</option>
        <option value="support">Support</option>
      </select>
      <br></br>
      <br></br>
      <button onClick={submitHandler}>Create user</button>
      {error === "ok" && (
        <>
          <p>User has been created</p>
        </>
      )}
      {error !== "ok" && error !== "" && (
        <>
          <p>Username already exists</p>
        </>
      )}
    </div>
  );
}

export default AdminCreateUsers;

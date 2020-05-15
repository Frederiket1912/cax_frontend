import React, { useState } from "react";
import { ChangePWURL } from "./settings";

function PasswordChange({ apiFetchFacade }) {
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    switch (name) {
      case "newPass":
        setNewPass(event.target.value);
        break;
      case "newPass2":
        setNewPass2(event.target.value);
        break;
      default:
        return;
    }
  };

  const handleSubmit = (event) => {
    if (newPass !== newPass2) {
      setErrMsg("The two password entries do not match.");
      return;
    }

    const body = {
      username: localStorage.getItem("username"),
      newPassword: newPass,
    };
    apiFetchFacade()
      .putApiCall(body, ChangePWURL)
      .then((data) => {
        setErrMsg("Password was successfully changed.");
        setNewPass("");
        setNewPass2("");
      })
      .catch((err) => {
        setErrMsg("Something went wrong, please try again later");
        setNewPass("");
        setNewPass2("");
      });
  };

  return (
    <div>
      <h2>Please enter new password twice to change password.</h2>
      New Password :&nbsp;&nbsp;
      <input
        onChange={handleChange}
        type="password"
        name="newPass"
        value={newPass}
        placeholder="Password"
      ></input>{" "}
      <br></br>
      New Password :&nbsp;&nbsp;
      <input
        onChange={handleChange}
        type="password"
        name="newPass2"
        value={newPass2}
        placeholder="Password"
      ></input>
      <br></br>
      <br></br>
      <button onClick={handleSubmit}>Change Password</button>
      <br></br>
      <br></br>
      <p>{errMsg}</p>
    </div>
  );
}

export default PasswordChange;

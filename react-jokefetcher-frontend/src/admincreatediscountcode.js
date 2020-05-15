import React, { useEffect, useState } from "react";
import { GetDiscountCodeURL, CreateDiscountCodeURL } from "./settings";
import { Switch, useRouteMatch, Link, Route } from "react-router-dom";

function CreateDiscountCode({ apiFetchFacade }) {
  const [discountCodes, setDiscountCodes] = useState([]);
  let { path, url } = useRouteMatch();
  const [fetch, setFetch] = useState(true);

  useEffect(() => {
    const url = GetDiscountCodeURL + "/all";
    apiFetchFacade()
      .getApiFetch(url)
      .then((data) => {
        setDiscountCodes(data);
      });
  }, [fetch]);

  function updateFetch() {
    fetch ? setFetch(false) : setFetch(true);
  }

  return (
    <div>
      <ul>
        <li>
          <Link to={`${url}/create`}>Create new discount code</Link>
        </li>
        <li>
          <Link to={`${url}/show`} onClick={updateFetch}>
            Show existing discount codes
          </Link>
        </li>
      </ul>

      <Switch>
        <Route path={`${path}/show`}>
          <DiscountCodeTable discountCodes={discountCodes} />
        </Route>
        <Route path={`${path}/create`}>
          <DiscountCodeCreator apiFetchFacade={apiFetchFacade} />
        </Route>
      </Switch>
    </div>
  );
}

function DiscountCodeCreator({ apiFetchFacade }) {
  const [name, setName] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [code, setCode] = useState("");
  const [response, setResponse] = useState();

  const handleChange = (event) => {
    const name = event.target.name;
    switch (name) {
      case "name":
        setName(event.target.value);
        break;
      case "discountPercentage":
        setDiscountPercentage(event.target.value);
        break;
      case "code":
        setCode(event.target.value);
        break;
      default:
        return;
    }
  };

  function createNewDiscountCode(event) {
    event.preventDefault();
    const body = {
      name: name,
      discountPercentage: discountPercentage,
      code: code,
    };
    apiFetchFacade()
      .getApiFetch2(body, CreateDiscountCodeURL)
      .then((data) => {
        setResponse(200);
      })
      .catch((err) => {
        console.log("ERR STATUS", err.status);
        setResponse(err.status);
      });
  }

  return (
    <div>
      <form>
        Name :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          onChange={handleChange}
          type="text"
          name="name"
          value={name}
          placeholder="Name"
        ></input>{" "}
        <br></br>
        Percentage :
        <input
          onChange={handleChange}
          type="number"
          name="discountPercentage"
          value={discountPercentage}
          placeholder="Discount Percentage"
        ></input>
        <br></br>
        Code :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <input
          onChange={handleChange}
          type="number"
          name="code"
          value={code}
          placeholder="Code"
        ></input>
        <br></br>
        <br></br>
        <button onClick={(event) => createNewDiscountCode(event)}>
          Create new discount code
        </button>
      </form>
      {response === 200 && (
        <>
          <p>New discount code created</p>
        </>
      )}
      {response === 422 && (
        <>
          <p>Discount code with that code already exists</p>
        </>
      )}
      {response === 500 && (
        <>
          <p>Something went wrong, please try again later</p>
        </>
      )}
    </div>
  );
}

function DiscountCodeTable({ discountCodes }) {
  console.log(discountCodes);

  function displayDiscountCodes(discountCode, index) {
    console.log(discountCode);
    return (
      <tr key={index}>
        <td>{discountCode.id}</td>
        <td>{discountCode.name}</td>
        <td>{discountCode.discountPercentage}</td>
        <td>{discountCode.code}</td>
      </tr>
    );
  }

  if (discountCodes === undefined || discountCodes === null) {
    return (
      <div>
        <h3>There are currently no discount codes</h3>
      </div>
    );
  }
  return (
    <div className="outerdiv">
      <div>
        <div className="header2">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Discount Percentage </th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {discountCodes.map((discountCode, index) =>
                displayDiscountCodes(discountCode, index)
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CreateDiscountCode;

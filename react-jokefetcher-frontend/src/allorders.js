import React, { useState, useEffect } from "react";
import { ViewAllOrders } from "./settings";
import { GetOrderHistoryURL } from "./settings";

function AdminViewAllOrders({ apiFetchFacade }) {
  const [orders, setOrders] = useState();
  const [ordersSearch, setOrdersSearch] = useState();
  const [searchUsername, setSearchUsername] = useState("");
  let orderTotal = 0;

  useEffect(() => {
    const url = ViewAllOrders;
    apiFetchFacade()
      .getApiFetch(url)
      .then((data) => {
        setOrders({ ...data });
      });
  }, [apiFetchFacade]);

  function TotalPrice(listItems) {
    if (listItems === undefined && listItems === null) return undefined;
    let total = 0;
    for (var i = 0; i < listItems.length; i++) {
      total = total + listItems[i].price;
    }
    orderTotal = orderTotal + total;
    return total;
  }

  const OrderLine = function ({ order }) {
    if (orders === null || orders === undefined) return <></>;
    return (
      <tr>
        <td>{orders[order].id}</td>
        <td>{orders[order].username}</td>
        <td>{TotalPrice(orders[order].listitems)}</td>
        <td>{orders[order].cancelled ? "Cancelled" : "Active"}</td>
      </tr>
    );
  };

  const OrderLineSearch = function ({ order }) {
    if (ordersSearch === null || ordersSearch === undefined) return <></>;
    return (
      <tr>
        <td>{ordersSearch[order].id}</td>
        <td>{ordersSearch[order].username}</td>
        <td>{TotalPrice(ordersSearch[order].listitems)}</td>
        <td>{ordersSearch[order].cancelled ? "Cancelled" : "Active"}</td>
      </tr>
    );
  };

  function GetTotalSpent(orders) {
    let totalRevenue = 0;
    for (var i = 0; i < Object.keys(orders).length; i++) {
      for (var j = 0; j < Object.keys(orders[i].listitems).length; j++) {
        totalRevenue = totalRevenue + orders[i].listitems[j].price;
      }
    }
    return totalRevenue;
  }

  const onChange = (e) => {
    setSearchUsername(e.currentTarget.value);
  };

  function fetchData() {
    const url = GetOrderHistoryURL;
    apiFetchFacade()
      .getApiFetch(url + "/" + searchUsername)
      .then((data) => {
        setOrdersSearch({ ...data });
      })
      .catch((err) => {
        window.alert("No user by this username exists with an order.");
      });
  }

  function submitHandler() {
    fetchData();
  }

  function DisplayOrders() {
    return (
      <div>
        <div className="header2">
          <table>
            <thead>
              <tr>
                <th>Total revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {GetTotalSpent(orders)}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(orders).map((order, index) => (
                <OrderLine order={order} key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function DisplayOrdersSearch() {
    return (
      <div>
        <div className="header2">
          <table>
            <thead>
              <tr>
                <th>Searched user has spent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {GetTotalSpent(ordersSearch)}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Username</th>
                <th>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ordersSearch).map((order, index) => (
                <OrderLineSearch order={order} key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (searchUsername !== "" && ordersSearch !== undefined)
    return (
      <div>
        <div className="header2">
          <h2>Order History search</h2>
        </div>
        <div className="searchbar">
          <p>
            Username:{" "}
            <input
              type="text"
              placeholder="Insert Username"
              id="username"
              onChange={onChange}
            />
          </p>
          <button onClick={() => submitHandler()}>Search orders</button>
        </div>
        <DisplayOrdersSearch />
      </div>
    );
  else if (orders === null || orders === undefined) return <></>;
  return (
    <div>
      <div className="header2">
        <h2>Order History</h2>
      </div>
      <div className="searchbar">
        <p>
          Username:{" "}
          <input
            type="text"
            placeholder="Insert Username"
            id="username"
            onChange={onChange}
          />
        </p>
        <button onClick={() => submitHandler()}>Search orders</button>
      </div>
      <DisplayOrders />
    </div>
  );
}

export default AdminViewAllOrders;

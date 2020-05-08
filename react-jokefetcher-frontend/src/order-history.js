import React, { useState, useEffect } from "react";
import { GetOrderHistoryURL, CancelOrderURL } from "./settings";

function OrderHistoryPage({ apiFetchFacade }) {
  const [orderHistory, setOrderHistory] = useState();
  const username = localStorage.getItem("username");
  const [cancelledOrder, setCancelledOrder] = useState();

  useEffect(() => {
    const url = GetOrderHistoryURL;
    apiFetchFacade()
      .getApiFetch(url + "/" + username)
      .then((data) => {
        console.log("DATA", data);
        setOrderHistory([...data]);
      });
  }, [apiFetchFacade, cancelledOrder]);

  function OrderHistoryTable({ orderHistory }) {
    if (orderHistory === undefined || orderHistory === null) {
      return (
        <div>
          <h3>You currently do not have any orders.</h3>
        </div>
      );
    }
    return (
      <div className="outerdiv">
        {orderHistory.map((order) => DisplayOrders(order))}
      </div>
    );
  }

  function TotalPrice(listItems) {
    if (listItems === undefined && listItems === null) return undefined;
    let total = 0;
    for (var i = 0; i < Object.keys(listItems).length; i++) {
      total = total + listItems[i].price;
    }
    return total;
  }

  const OrderLine = function ({ listItem }) {
    if (listItem === null || listItem === undefined) return <></>;
    return (
      <tr>
        <td>{listItem.service}</td>
        <td>{listItem.name}</td>
        <td>{listItem.price}</td>
        <td>{listItem.dateIn}</td>
        <td>{listItem.dateOut}</td>
        <td>{listItem.adults}</td>
      </tr>
    );
  };

  function CancelOrder(order) {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const url = CancelOrderURL;
      apiFetchFacade()
        .deleteApiCall(url + "/" + order.id)
        .then((data) => {
          setCancelledOrder({ ...data });
        });
    }
  }

  function DisplayOrders(order) {
    return (
      <div>
        <div className="header2">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Name</th>
                <th>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </th>
                <th>Date1</th>
                <th>Date2</th>
                <th>Adults</th>
              </tr>
            </thead>
            <tbody>
              {order.listitems.map((listItem) => (
                <OrderLine listItem={listItem} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th>{TotalPrice(order.listitems)}</th>
                <tr>{order.cancelled ? "Cancelled" : "Not Cancelled"}</tr>
                {order.cancelled ? (
                  <th></th>
                ) : (
                  <th>
                    <button onClick={() => CancelOrder(order)}>
                      Cancel order
                    </button>
                  </th>
                )}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="header2">
        <h2>Order History</h2>
      </div>
      <OrderHistoryTable orderHistory={orderHistory} />
    </div>
  );
}

export default OrderHistoryPage;

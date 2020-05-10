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
        {orderHistory.map((order, index) => DisplayOrders(order, index))}
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
    for (let i = 0; i < order.listitems.length; i++) {
      let year = order.listitems[i].dateIn.substring(0, 4);
      let month = order.listitems[i].dateIn.substring(5, 7);
      let day = order.listitems[i].dateIn.substring(8);
      let dateIn = new Date();
      dateIn.setFullYear(year);
      dateIn.setMonth(parseInt(month) - 1);
      dateIn.setDate(parseInt(day) - 2);
      let today = new Date();
      if (dateIn.getTime() < today.getTime()) {
        window.alert(
          "Something in this order is set to start in less than two days, or has already started. Order cannot be cancelled."
        );
        return;
      }
    }
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const url = CancelOrderURL;
      apiFetchFacade()
        .deleteApiCall(url + "/" + order.id)
        .then((data) => {
          setCancelledOrder({ ...data });
        });
    }
  }

  function DisplayOrders(order, index) {
    console.log(order);
    return (
      <div key={index}>
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
              {order.listitems.map((listItem, index) => (
                <OrderLine listItem={listItem} key={index} />
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th>{TotalPrice(order.listitems)}</th>
                <th>{order.cancelled ? "Cancelled" : "Not Cancelled"}</th>
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

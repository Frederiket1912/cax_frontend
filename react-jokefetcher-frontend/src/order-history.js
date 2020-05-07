import React, { useState, useEffect } from "react";
import { GetOrderHistoryURL } from "./settings";

function OrderHistoryPage({ apiFetchFacade }) {
  const [orderHistory, setOrderHistory] = useState();

  useEffect(() => {
    const url = GetOrderHistoryURL;
    apiFetchFacade()
      .getApiFetch(url)
      .then((data) => {
        setOrderHistory({ ...data });
      });
  }, [apiFetchFacade]);

  function OrderHistoryTable(props) {
    if (
      props === undefined ||
      props === null ||
      props.orders === undefined ||
      props.orders === null
    )
      return (
        <div>
          <h3>You currently do not have any orders.</h3>
        </div>
      );
    return (
      <div className="outerdiv">
        {orderHistory.map((order) => DisplayOrders(order))}
      </div>
    );
  }

  function DisplayOrders(order) {
    return "";
  }

  return (
    <div>
      <div className="header2">
        <h2>Order History</h2>
      </div>
      <div className="orders">Nothing here yet</div>
      <OrderHistoryTable orderHistory={orderHistory} />
    </div>
  );
}

export default OrderHistoryPage;

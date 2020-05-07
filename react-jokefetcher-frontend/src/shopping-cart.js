import React, { useState, useEffect, useContext } from "react";
import { CreateOrderURL } from "./settings";
import { CartContext } from "./cart-context";

function ShoppingCartPage() {
  const [itemList, setItemList] = useState();
  const [total, setTotal] = useState(0);
  const { cart } = useContext(CartContext);

  function TotalPrice(cart) {
    if (cart === undefined && cart === null) return undefined;
    debugger;
    let total = 0;
    for (var i = 0; i < Object.keys(cart).length; i++) {
      total = total + cart[i].price;
    }
    return total;
  }

  if (cart === null || cart === undefined || cart.length === 0)
    return <h2>Nothing here yet </h2>;
  return (
    <div>
      <div className="header2">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Name</th>
              <th>Price</th>
              <th>Date1</th>
              <th>Date2</th>
              <th>Adults</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((cartItem) => (
              <CartLine cartItem={cartItem} />
            ))}
          </tbody>
          <tr>
            <th>Total</th>
            <th>{TotalPrice(cart)}</th>
          </tr>
        </table>
      </div>
    </div>
  );
}

const CartLine = function ({ cartItem }) {
  if (cartItem === null || cartItem === undefined) return <></>;
  return (
    <tr>
      <td>{cartItem.service}</td>
      <td>{cartItem.name}</td>
      <td>{cartItem.price}</td>
      <td>{cartItem.dateIn}</td>
      <td>{cartItem.dateOut}</td>
      <td>{cartItem.adults}</td>
    </tr>
  );
};

export default ShoppingCartPage;

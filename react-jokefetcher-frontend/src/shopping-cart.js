import React, { useState, useEffect, useContext } from "react";
import { CreateOrderURL } from "./settings";
import { CartContext } from "./cart-context";

function ShoppingCartPage() {
  const [itemList, setItemList] = useState();
  const { cart } = useContext(CartContext);
  if (cart === null || cart === undefined || cart.length === 0)
    return <h2>Nothing here yet </h2>;
  return (
    <div>
      <div className="header2">
        <table>
          <thead>
            <tr>
              <th>Price</th>
              <th>Service</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((cartItem) => (
              <CartLine cartItem={cartItem} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const CartLine = function ({ cartItem }) {
  if (cartItem === null || cartItem === undefined) return <></>;
  return (
    <tr>
      <td>{cartItem.price}</td>
      <td>{cartItem.service}</td>
      <td>{cartItem.name}</td>
    </tr>
  );
};

export default ShoppingCartPage;

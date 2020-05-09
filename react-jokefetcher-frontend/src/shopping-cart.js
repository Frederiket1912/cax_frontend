import React, { useState, useEffect, useContext } from "react";
import { CreateOrderURL } from "./settings";
import { CartContext } from "./cart-context";
import apiFetchFacade from "./apiFetchFacade";

let orderPlaced = false;
function ShoppingCartPage() {
  const [response, setResponse] = useState();
  const [emptyCart] = useState([]);
  //const [orderPlaced, setOrderPlaced] = useState(false);
  //let orderPlaced = false;
  const { cart, setCart } = useContext(CartContext);

  function TotalPrice(cart) {
    if (cart === undefined && cart === null) return undefined;
    let total = 0;
    for (var i = 0; i < Object.keys(cart).length; i++) {
      total = total + cart[i].price;
    }
    return total;
  }

  function ConfirmOrder(cart) {
    const body = {
      username: localStorage.getItem("username"),
      listItems: cart,
    };

    const url = CreateOrderURL;
    apiFetchFacade()
      .getApiFetch2(body, url)
      .then((data) => {
        setResponse({ ...data });
      });
    setCart(emptyCart);
    orderPlaced = true;
  }

  if (orderPlaced === true) return <h2>Order has been placed</h2>;
  else if (cart.length === 0)
    return <h2>There's currently nothing in your shopping cart</h2>;
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
            {cart.map((cartItem, index) => (
              <CartLine cartItem={cartItem} key={index} />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Total</th>
              <th>{TotalPrice(cart)}</th>
            </tr>
          </tfoot>
        </table>
        <button onClick={() => ConfirmOrder(cart)}>Confirm order</button>
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

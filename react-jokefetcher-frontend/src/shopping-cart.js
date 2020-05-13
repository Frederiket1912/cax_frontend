import React, { useState, useContext, useEffect } from "react";
import { CreateOrderURL, GetDiscountCodeURL } from "./settings";
import { CartContext } from "./cart-context";
import apiFetchFacade from "./apiFetchFacade";

let orderPlaced = false;
let showDiscountForm = true;
function ShoppingCartPage() {
  const onUnload = function (e) {
    if (cart.length !== 0) {
      localStorage.setItem("savedshoppingcart", JSON.stringify(cart));
    }
  };
  window.addEventListener("beforeunload", onUnload);

  // eslint-disable-next-line
  const [response, setResponse] = useState();
  const [emptyCart] = useState([]);
  const { cart, setCart } = useContext(CartContext);
  const [id, setId] = useState();
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const [discount, setDiscount] = useState();

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
      discountCode: {
        id: id,
        name: name,
        discountPercentage: discount,
        code: code,
      },
    };

    const url = CreateOrderURL;
    apiFetchFacade()
      .getApiFetch2(body, url)
      .then((data) => {
        setResponse({ ...data });
      });
    setCart(emptyCart);
    orderPlaced = true;
    localStorage.removeItem("savedshoppingcart");
  }

  function updateCartPrice(discount, id, name, code) {
    if (cart.length !== 0) {
      let updatedPrices = cart.map(
        (listItem) =>
          (listItem = {
            adults: listItem.adults,
            dateIn: listItem.dateIn,
            dateOut: listItem.dateOut,
            name: listItem.name,
            price: parseInt(listItem.price - (listItem.price / 100) * discount),
            service: listItem.service,
          })
      );
      setCart(updatedPrices);
      setId(id);
      setName(name);
      setCode(code);
      setDiscount(discount);
    }
  }

  if (orderPlaced === true) return <h2>Order has been placed</h2>;

  function RecoverOrders() {
    let test = JSON.parse(localStorage.getItem("savedshoppingcart"));
    setCart(test);
  }
  if (cart.length === 0 && localStorage.getItem("savedshoppingcart") !== null) {
    RecoverOrders();
  } else if (orderPlaced === true) return <h2>Order has been placed</h2>;
  else if (cart.length === 0)
    return <h2>There's currently nothing in your shopping cart</h2>;
  return (
    <div>
      <div className="header2">
        <DiscountCodeChecker updateCartPrice={updateCartPrice} />
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

function DiscountCodeChecker({ updateCartPrice }) {
  const defaultResponse = {
    id: "",
    name: "",
    discountPercentage: "",
    code: "",
  };

  const [discountCode, setDiscountCode] = useState();
  const [response, setResponse] = useState(defaultResponse);
  const [error, setError] = useState();
  //const [codeIsGood, SetCodeIsGood] = useState();

  const handleChange = (event) => {
    setDiscountCode(event.target.value);
  };

  function applyDiscountCode(event) {
    event.preventDefault();
    apiFetchFacade()
      .getApiFetch(GetDiscountCodeURL + "/" + discountCode)
      .then((data) => {
        setError(200);
        setResponse({ ...data });
        showDiscountForm = false;
      })
      .catch((err) => {
        setError(404);
      });
  }

  useEffect(() => {
    if (response.discountPercentage !== "") {
      updateCartPrice(
        response.discountPercentage,
        response.id,
        response.name,
        response.code
      );
    }
  }, [response]);

  return (
    <div>
      <form onChange={handleChange}>
        {showDiscountForm && (
          <>
            <input
              type="number"
              placeholder="Discount Code"
              id="discountcode"
            ></input>
            <button onClick={(event) => applyDiscountCode(event)}>
              Apply discount code
            </button>
          </>
        )}
        {error === 404 && (
          <>
            <p>Discount code does not exist.</p>
          </>
        )}
        {error === 500 && (
          <>
            <p>Something went wrong, please try again later</p>
          </>
        )}
        {error === 200 && (
          <>
            <p>
              Discount code with {response.name} discount has been added to
              order.
            </p>
          </>
        )}
      </form>
    </div>
  );
}

export default ShoppingCartPage;

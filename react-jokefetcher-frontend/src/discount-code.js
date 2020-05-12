import React, { useState } from "react";
import { GetDiscountCodeURL } from "./settings";
import apiFetchFacade from "./apiFetchFacade";

function DiscountCodeChecker() {
  const [discountCode, setDiscountCode] = useState();
  const [response, setResponse] = useState();
  const [codeIsGood, SetCodeIsGood] = useState();

  const handleChange = (event) => {
    setDiscountCode(event.target.value);
  };

  const applyDiscountCode = () => {
    apiFetchFacade()
      .getApiFetch(GetDiscountCodeURL + "/" + discountCode)
      .then((data) => {
        console.log("DATA", data);
        setResponse({ ...data });
        if (null === data.message) {
          SetCodeIsGood(true);
        } else {
          SetCodeIsGood(false);
        }
      });
  };

  if (codeIsGood === true) {
    return (
      <p>Code with {response.discountPercentage}% discount applied to order.</p>
    );
  }

  if (codeIsGood === false) {
    return (
      <div>
        <form onChange={handleChange}>
          <input
            type="number"
            placeholder="Discount Code"
            id="discountcode"
          ></input>
          <button onClick={applyDiscountCode}>Apply discount code</button>
          <p>{response.message}</p>
        </form>
      </div>
    );
  }

  return (
    <div>
      <form onChange={handleChange}>
        <input
          type="number"
          placeholder="Discount Code"
          id="discountcode"
        ></input>
        <button onClick={applyDiscountCode}>Apply discount code</button>
      </form>
    </div>
  );
}

export default DiscountCodeChecker;

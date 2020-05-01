import facade from "./authFacade";
import { TestFetchURL } from "./Settings";

function apiFetchFacade() {
  function handleHttpErrors(res) {
    if (!res.ok) {
      return Promise.reject({ status: res.status, fullError: res.json() });
    }
    return res.json();
  }

  const getApiFetch = () => {
    const options = facade.makeOptions("GET", true);
    return fetch(TestFetchURL, options).then(handleHttpErrors);
  };

  const getApiFetch2 = (Body, url) => {
    const options = facade.makeOptions("POST", true, Body);
    return fetch(url, options).then(handleHttpErrors);
  };

  return {
    getApiFetch,
    getApiFetch2,
  };
}

export default apiFetchFacade;

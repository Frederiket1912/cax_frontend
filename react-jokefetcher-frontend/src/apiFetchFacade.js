import facade from "./authFacade";

function apiFetchFacade() {
  function handleHttpErrors(res) {
    if (!res.ok) {
      return Promise.reject({ status: res.status, fullError: res.json() });
    }
    return res.json();
  }

  const getApiFetch = (url) => {
    const options = facade.makeOptions("GET", true);
    return fetch(url, options).then(handleHttpErrors);
  };

  const getApiFetch2 = (Body, url) => {
    const options = facade.makeOptions("POST", true, Body);
    return fetch(url, options).then(handleHttpErrors);
  };

  const getApiFetch3 = (url) => {
    const options = facade.makeOptions("POST", true);
    return fetch(url, options).then(handleHttpErrors);
  };

  return {
    getApiFetch,
    getApiFetch2,
    getApiFetch3,
  };
}

export default apiFetchFacade;

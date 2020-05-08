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

  const deleteApiCall = (url) => {
    const options = facade.makeOptions("DELETE", true);
    return fetch(url, options).then(handleHttpErrors);
  };

  return {
    getApiFetch,
    getApiFetch2,
    deleteApiCall,
  };
}

export default apiFetchFacade;

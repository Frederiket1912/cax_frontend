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

  return {
    getApiFetch,
  };
}

export default apiFetchFacade;

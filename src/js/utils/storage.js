const set = (name, value) => {
  window.localStorage.setItem(name, value);
};

const get = (name) => window.localStorage.getItem(name);

const del = () => {
  window.localStorage.clear();
};

export default { set, get, del };

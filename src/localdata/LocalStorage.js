import React, {useRef} from "react";

const LocalStorage = {
    get: (username) => {
      const data = localStorage.getItem(username);
      return data ? JSON.parse(data) : null;
    },
    set: (username, data) => {
      localStorage.setItem(username, JSON.stringify(data));
    }
  };
  
  export default LocalStorage;
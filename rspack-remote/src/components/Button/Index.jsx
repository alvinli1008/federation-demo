import React from "react";

import "./Button.css";

export default function Button({ children }) {

  return (
    <button className="rp-button">{children}</button>
  );
}


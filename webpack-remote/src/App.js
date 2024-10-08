import React from "react";
import "./App.css";

import Button from "./components/Button";
import Input from "./components/Input";

const App = () => (
  <div>
    <React.Suspense fallback={<div>Loading the header</div>}>
    </React.Suspense>
    <h1 className="">Webpack Remote</h1>

    <Input />

    <Button>Webpack remote Button</Button>
  </div>
);

export default App;

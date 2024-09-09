import React from "react";

import Button from "./Button";
import Input from "./components/Input";

const App = () => (
  <div>
    <React.Suspense fallback={<div>Loading the header</div>}>
    </React.Suspense>
    <h1>Webpack Remote</h1>

    <Input />

    <Button />
  </div>
);

export default App;

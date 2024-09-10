import React from "react";
import "./App.css";

import Input from 'webpack_remote/Input';

const App = () => (
  <div>
    <React.Suspense fallback={<div>Loading the header</div>}>
    </React.Suspense>
    <h1 className="text-[red]">Webpack Remote</h1>

    <Input />
  </div>
);

export default App;

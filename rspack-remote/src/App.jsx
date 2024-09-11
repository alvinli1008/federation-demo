import React from "react";
import { useState } from "react";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div className="App">
			<p className="read-the-docs">
				Click on the Rspack and React logos to learn moreqw
			</p>
		</div>
	);
}

export default App;

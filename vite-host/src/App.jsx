import { useState } from 'react'
import './App.css'

// import Input from 'webpack_remote/Input'
import Button from 'rspack_remote/Button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* <Input  /> */}

      <Button>btn</Button>
    </>
  )
}

export default App

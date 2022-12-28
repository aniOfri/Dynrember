import { useState } from 'react'
import './App.css'
import Create from './Create'

function App() {
  const [page, setPage] = useState(0);


  let jsx;
  switch(page){
    case 0:
      jsx = (
        <div>
          <div>
            <h1>Dynrember - The Game</h1>
          </div>
          <div className="buttons">
            <button onClick={() => setPage(1)}>
              Create Session
            </button>
          </div>
        </div>
      )
      break;
    case 1:
      jsx = (
        <Create setPage={setPage}></Create>
      )
      break;
  }
  console.log(page);

  return (
    <div className="App">
      {jsx}
    </div>
  )
}

export default App

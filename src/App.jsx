import { useState } from 'react'
import './App.css'
import Create from './Create'
import Game from './Game'

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
            </button><br></br>
            <button onClick={() => setPage(2)}>
              Start Session
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
    case 2:
      jsx = (
        <Game setPage={setPage}></Game>
      )
      break;
  }

  return (
    <div className="App">
      {jsx}
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import Create from './Create'
import Game from './Game'
import Editor from './Editor'

function App() {
  const [page, setPage] = useState(0);


  let jsx;
  switch(page){
    case 0:
      jsx = (
        <div>
          <div>
            <h1>דינרמבר - משחק זכרון</h1>
          </div>
          <div className="buttons">
            <button onClick={() => setPage(1)}>
              צור קובץ
            </button><br></br>
            <button onClick={() => setPage(3)}>
              ערוך קובץ
            </button><br></br>
            <button onClick={() => setPage(2)}>
              התחל משחק
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
    case 3:
      jsx = (
        <Editor setPage={setPage}></Editor>
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

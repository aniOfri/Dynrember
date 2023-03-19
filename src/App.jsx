import { useState } from 'react'
import './App.css'
import Create from './Create'
import Game from './Game'
import Back from './Back'
import Editor from './Editor'

function App() {
  const [page, setPage] = useState(0);


  let jsx;
  let backButton = (
    <Back setPage={setPage}/>)
  switch(page){
    case 0:
      jsx = (
        <div>
          <div>
            <h1 className='title'>דינרמבר - משחק זכרון</h1>
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
      jsx = (<div>
        <Back setPage={setPage}/>
        <Create/>
      </div>
      )
      break;
    case 2:
      jsx = (
        <div>
        <Back setPage={setPage}/>
        <Game/>
      </div>
      )
      break;
    case 3:
      jsx = (
        <div>
        <Back setPage={setPage}/>
        <Editor/>
      </div>
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

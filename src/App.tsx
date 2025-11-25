import { useState } from 'react'
import { BookList, BookPlayer } from './components'
import './css/index.css'

function App() {

  const [activeBookKey, setActiveBookKey] = useState('')

  return (
    <>
      <div className="fixed z-0 inset-0 overflow-hidden">

        <img src="/logo.png" className="w-64 h-64" />
        <h1>蒙学文吟</h1>

        <BookList onChange={setActiveBookKey} />

        {activeBookKey && <BookPlayer bookKey={activeBookKey} />}
      </div>
    </>
  )
}

export default App

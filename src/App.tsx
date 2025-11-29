import { useState } from 'react'
import { BookList, BookPlayer } from './components'
import type { IBookEntry } from './type'
import './css/index.css'

function App() {

  const [activeBookEntry, setActiveBookEntry] = useState<IBookEntry | null>(null)

  return (
    <>
      <div className="fixed z-0 inset-0 overflow-hidden">

        <div className="mx-auto max-w-6xl">

          <div className="flex items-center py-4">
            <img src="/assets/logo.png" className="w-12 h-12" />
            <p className="ml-2 text-2xl font-bold font-song">蒙学文吟</p>
          </div>

          <div className="mt-8">
            <BookList onChange={setActiveBookEntry} />
          </div>
        </div>

        {activeBookEntry && (
          <BookPlayer
            bookEntry={activeBookEntry}
            onBack={() => setActiveBookEntry(null)}
          />
        )}
      </div>
    </>
  )
}

export default App

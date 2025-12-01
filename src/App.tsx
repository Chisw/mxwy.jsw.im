import {
  BookList,
  BookPlayer,
  Footer,
  Header,
  Reciter,
} from './components'
import './css/index.css'

export default function App() {

  return (
    <>
      <div className="fixed z-0 inset-0 overflow-y-auto">
        <Header />
        <Reciter />
        <BookList />
        <Footer />
      </div>

      <BookPlayer />
    </>
  )
}

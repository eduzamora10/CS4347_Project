import './App.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Login } from './Pages/login'
import { Home } from './Pages/home'
import { Book_L } from './Pages/Book_L'
import { Book_M } from './Pages/Book_M'
import { Checkout } from './Pages/checkout'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App

import React from 'react'
import './App.css'
import HomeSection from './page/Home'
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom'
function App() {


  return (

<Router>
  <Routes>
    <Route path="/" element={
      <HomeSection/>
    }/>
  </Routes>
</Router>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router , Routes ,Route } from 'react-router-dom'
import M3MNavbar from './common-component/Navbar'
import Home from './page/Home1'

function App(){
return(

  <Router>
    <Routes>
      <Route path="/" element={
        <div>
   
        <Home/>
        </div>
      }/>
    </Routes>
  </Router>
)

}

export default App
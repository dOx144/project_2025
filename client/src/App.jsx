import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './page/Home'
import Nopage from './page/Nopage'
import Login from './page/Login'
import Register from './page/Register'
import ItemDetail from './page/ItemDetail'
import AdminPanel from './page/AdminPanel'
import UserProfile from './page/UserProfile'
import UserCart from './page/UserCart'

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route index path='/' element={<Home/>} />
        <Route path='/OAH/admin-panel' element = {<AdminPanel/>}/>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/user/:id' element={<UserProfile/>} />
        <Route path='/user/cart' element={<UserCart/>} />
        <Route path='/item/:id' element= { <ItemDetail/>}/>
        <Route path='*' element={<Nopage/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App

import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Join from './pages/join';
import Login from './pages/login';
import Home from './pages/home';
import List from './pages/list';
import Detail from './pages/detail';
import { Route, BrowserRouter, Routes  } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/join" element={<Join/>}></Route>
        <Route path="/list" element={<List/>}></Route>
        <Route path="/detail" element={<Detail/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

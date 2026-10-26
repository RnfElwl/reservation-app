import { useEffect, useState } from 'react';
import { reissueAccessToken } from './components/api/axiosApi';
import './App.css';
import './styles/components/header.css'
import Header from './components/header';
import Join from './pages/join';
import Login from './pages/login';
import Home from './pages/home';
import List from './pages/list';
import Detail from './pages/detail';
import { Route, BrowserRouter, Routes  } from 'react-router-dom';
import RES_CREATE from './pages/reservation_create';

function App() {
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    reissueAccessToken().then(
      () => { if (active) setAuthStatus('ready'); },
      (error) => {
        if (active) {
          setAuthStatus(error.response?.status === 401 ? 'ready' : 'error');
        }
      }
    );
    return () => { active = false; };
  }, []);

  if (authStatus === 'loading') {
    return <div role="status">로그인 상태 확인 중...</div>;
  }
  if (authStatus === 'error') {
    return <div role="alert">
      <p>로그인 상태를 확인하지 못했습니다.</p>
      <button onClick={() => window.location.reload()}>다시 시도</button>
    </div>;
  }

  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/join" element={<Join/>}></Route>
        <Route path="/list" element={<List/>}></Route>
        <Route path="/detail" element={<Detail/>}></Route>
        <Route path="/res_create" element={<RES_CREATE/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

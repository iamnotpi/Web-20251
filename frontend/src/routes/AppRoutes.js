import { Routes, Route, Navigate } from 'react-router-dom';
import Notfound from '../pages/Notfound/Notfound';
import Home from '../pages/Home/Home';
import Login from '../pages/Login/Login';
import Account from '../pages/Account/Account';

const AppRoutes = (props) => {
    return(
        <>
        <Routes>
            <Route path="/404" element={<Notfound/>} />
            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/account" element={<Account/>}/>
        </Routes>
        </>
    )
}

export default AppRoutes;
import { Routes, Route, Navigate } from 'react-router-dom';
import Notfound from '../pages/Notfound/Notfound';
import Home from '../pages/Home/Home';

const AppRoutes = (props) => {
    return(
        <>
        <Routes>
            <Route path="/404" element={<Notfound/>} />
            <Route path="*" element={<Navigate to="/404" />} />
            <Route path="/" element={<Home/>}/>
        </Routes>
        </>
    )
}

export default AppRoutes;
import { useNavigate } from "react-router-dom";

const Notfound = () => {
    const navigate = useNavigate();
    const handleBackHome = () => {
        navigate('/');
    }
    return(
        <div className="container mx-auto py-5 px-5">
            <h1>404</h1>        
            <h6>Xin lỗi, trang bạn tìm không tồn tại.</h6>
            <div>
                <button className="btn" onClick={handleBackHome}><i class="fa fa-angle-left" style={{color: 'rgb(30, 66, 149)'}}> Quay lại Trang chủ</i></button>
            </div>
        </div>
    )
}
export default Notfound;
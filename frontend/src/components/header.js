import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, clearAccessToken, useAccessToken } from "./api/axiosApi";

const Header = () => {
    const accessToken = useAccessToken();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const [error, setError] = useState("");
    const logoutHandle = async () => {
        setLoggingOut(true);
        setError("");
        // 진행 중인 재발급 응답도 무효화합니다.
        clearAccessToken();
        try {
            await api.delete("/logout");
            navigate("/");
        } catch {
            setError("로그아웃 요청에 실패했습니다. 다시 시도해주세요.");
        } finally {
            setLoggingOut(false);
        }
    };
    return (
        <header>
            <nav className="header_nav">
                <ul><li><Link to="/list">예약하기</Link></li></ul>
                <ul>
                    {accessToken || error || loggingOut ? (
                        <li><button onClick={logoutHandle} disabled={loggingOut}>
                            {loggingOut ? "로그아웃 중..." : "로그아웃"}
                        </button></li>
                    ) : (
                        <>
                            <li><Link to="/login">로그인</Link></li>
                            <li><Link to="/join">회원가입</Link></li>
                        </>
                    )}
                </ul>
            </nav>
            {error && <p role="alert">{error}</p>}
        </header>
    );
};
export default Header;

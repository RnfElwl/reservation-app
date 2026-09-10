const Header = () =>{
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/list">예약하기</Link></li>
                </ul>
                <ul>
                    <li><Link to="/login">로그인</Link></li>
                    <li><Link to="/join">회원가입</Link></li>
                    <li><Link >로그아웃</Link></li>
                </ul>
                    
            </nav>
        </header>
    )
}

export default Header;
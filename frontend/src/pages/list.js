import { Link } from "react-router-dom";
import RES_CREATE from "./reservation_create";

const List = () =>{
    return (
        <div>

            <Link to="/res_create">
                예약 만들기
            </Link>
        </div>
    )
}

export default List;

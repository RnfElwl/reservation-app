import { useState } from "react";

const Detail = () =>{
    const [serDay, setSerDay] = useState();
    const [serSit, setSerSit] = useState();
    return (
        <div>
            <div className="reser_detail">

                <div>예약하기</div>
            </div>
            <div className="reser_modal">
                <div className="select_day">
                    <input type="date"></input>

                </div>
                <div className="select_sit">
                    <input type="checkbox" ></input>

                </div>
            </div>
        </div>
    )
}

export default Detail;

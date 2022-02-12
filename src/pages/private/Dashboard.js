import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFeedBack } from "../../context/FeedBackContext";
import { mainPermissions } from "../../util/MenuLinks";

const Dashboard = () => {

    return (
        <div style={{ background: 'red' }}>
            <button onClick={() => {
            }}>
                mostrar toast
            </button>
        </div>
    )
}

export default Dashboard;
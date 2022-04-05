import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFeedBack } from "../../context/FeedBackContext";
import { useTheme } from "../../context/ThemeContext";
import { dezThemeSet } from "../../context/ThemeDemo";
import { mainPermissions } from "../../util/MenuLinks";

const Dashboard = () => {

    const { chnageSidebarColor, colors, changePrimaryColor, setDemoTheme } = useTheme();

    console.log(dezThemeSet);

    return (
        <div>
            <div>
                {dezThemeSet.map((theme, i) => {
                    return (
                        <button className="btn btn-primary" onClick={() => { setDemoTheme(i, 'ltr') }}>
                            Seleccione el Tema {i + 1}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Dashboard;
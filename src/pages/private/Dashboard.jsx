import { useState } from "react";



const Dashboard = () => {

    const [filters, setFilters] = useState({
        name: ''
    });

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        });
    }

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard;
import { useParams } from "react-router-dom"
import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";

const CostCenterManagement = () => {

    const { id } = useParams();

    const [currentCostCenter, setCurrentCostCenter] = useState(null);

    const [{ data: costCenterPlansResponse, loading: loadingCostCenterPlans }, getCostCenterPlans] = useAxios({ url: `my-account/cost-centers/${id}/plans` }, { useCache: false });

    useEffect(() => {
        if (costCenterPlansResponse) {
            setCurrentCostCenter(costCenterPlansResponse?.data);
        }
    }, [costCenterPlansResponse]);

    return (
        <div>
            <h1>Gestionar {currentCostCenter ? `- ${currentCostCenter?.name}` : ''}</h1>

        </div>
    )
}

export default CostCenterManagement
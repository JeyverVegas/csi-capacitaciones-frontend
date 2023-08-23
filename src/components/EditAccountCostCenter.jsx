import clsx from "clsx";
import useAxios from "../hooks/useAxios";
import { useEffect, useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";


const EditAccountCostCenter = ({ costCenterId, account, planningProccessId }) => {

    const [hasError, setHasError] = useState(false);

    const [{ loading }, updatePlanAccouts] = useAxios({ url: '/cost-centers/plan-accounts/update-by-code', method: 'PUT' }, { useCache: false, manual: true })



    const handleChange = async (e) => {
        setHasError(false);
        try {
            updatePlanAccouts({
                data: {
                    costCenterId,
                    accountCode: account?.code,
                    planningProccessId,
                    value: e.target.value
                }
            });
        } catch (error) {
            setHasError(true);
        }
    }

    return (
        <td>
            <div className="d-flex align-items-center">
                <input

                    type="number"
                    placeholder="Monto..."
                    className={clsx(["p-1"], {
                        'border border-danger': hasError
                    })}
                    style={{ border: 'none', borderRadius: '10px' }}
                    onChange={handleChange}
                />
                {
                    loading &&
                    <div className="spinner" style={{ height: 15, width: 15, marginLeft: 5 }}>
                        <div className="double-bounce1 bg-primary"></div>
                        <div className="double-bounce2 bg-primary"></div>
                    </div>
                }
                {
                    !loading && hasError ?
                        <AiFillExclamationCircle className="text-danger" />
                        :
                        null
                }
            </div>
        </td>
    )
}

export default EditAccountCostCenter;
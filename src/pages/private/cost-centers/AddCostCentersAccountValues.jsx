import { useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import useAccountClassifications from "../../../hooks/useAccountClassifications";
import usePaginatedResourceWithAppend from "../../../hooks/usePaginatedResourceWithAppend";
import { Table } from "react-bootstrap";
import EditAccountCostCenter from "../../../components/EditAccountCostCenter";

const AddCostCentersAccountValues = () => {

    const [filters, setFilters] = useState({
        planningProccessId: '',
        accountClassificationId: '',
        forYear: true,
        perPage: 200,
        name: ''
    });

    const [{ data: response, loading }, getCostCenters] = useAxios({ url: `/cost-centers`, params: filters }, { useCache: false, manual: true });

    const [{ data: accounts, loading: loadingAccounts }, getAccounts] = useAxios({ url: `/accounts`, params: filters }, { useCache: false, manual: true });

    const { loadMore, results: planningProcesses, loading: loadingplanningProcesses, canLoadMore, reset } = usePaginatedResourceWithAppend(`/planning-processes`);

    const [{ accountClassifications }, getAccountClassifications] = useAccountClassifications();

    useEffect(() => {
        if (filters?.planningProccessId && filters?.accountClassificationId) {
            getAccounts({
                params: {
                    ...filters,
                    name: '',
                    perPage: 1000
                },
            });

            getCostCenters({
                params: {
                    ...filters
                },
            });
        }
    }, [filters])

    const handleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <div className="card p-4">
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label htmlFor="">Año de la planificación</label>
                    <select onChange={handleChange} className="form-control" name="planningProccessId" value={filters?.planningProccessId}>
                        <option value="" disabled>Seleccione una opción</option>
                        {
                            planningProcesses?.map((value, i) => {
                                return (
                                    <option key={i} value={value?.id}>{value?.forYear}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="">Clasificación de cuenta</label>
                    <select onChange={handleChange} className="form-control" name="accountClassificationId" value={filters?.accountClassificationId}>
                        <option value="" disabled>Seleccione una opción</option>
                        {
                            accountClassifications?.map((value, i) => {
                                return (
                                    <option key={i} value={value?.id}>{value?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col-md-12">
                    <div className="form-group mb-4">
                        <input
                            className="form-control"
                            type="text"
                            name="name"
                            onChange={handleChange}
                            value={filters?.name}
                            placeholder="Buscar por nombre del centro de costo"
                        />
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>
                                    N°
                                </th>
                                <th>
                                    Centro de costo
                                </th>
                                {
                                    accounts?.data?.map((account, i) => {
                                        return (
                                            <th key={i}>
                                                {account?.code}
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>

                            {
                                loading || loadingAccounts ?
                                    <tr>
                                        <td colSpan={15}>
                                            <div className="spinner">
                                                <div className="double-bounce1 bg-primary"></div>
                                                <div className="double-bounce2 bg-primary"></div>
                                            </div>
                                        </td>
                                    </tr>
                                    :
                                    response?.data?.map((costCenter, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    {i + 1}
                                                </td>
                                                <td>
                                                    {costCenter?.name}
                                                </td>
                                                {
                                                    accounts?.data?.map((account, i2) => {
                                                        return (
                                                            <EditAccountCostCenter
                                                                key={i2}
                                                                costCenterId={costCenter?.id}
                                                                account={account}
                                                                planningProccessId={filters?.planningProccessId}
                                                            />

                                                        )
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AddCostCentersAccountValues;
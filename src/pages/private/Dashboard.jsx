import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../../components/DateFormatter";
import { generateArray } from "../../util/Utilities";



const Dashboard = () => {

    const [filters, setFilters] = useState({
        search: ''
    });

    const [{ data, loading }, getDashboard] = useAxios({ url: `/dashboard`, params: filters }, { useCache: false });

    const [currentPowerBis, setCurrentPowerBis] = useState([]);

    useEffect(() => {
        if (data) {
            setCurrentPowerBis(oldData => [...oldData, ...data]);
        }
    }, [data])

    const handleChange = (e) => {
        setCurrentPowerBis([]);
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value
            }
        });
    }

    return (
        <div className="px-3">

            <div className="text-end">
                <input
                    value={filters?.search}
                    placeholder="Buscar..."
                    name="search"
                    type="text"
                    className="form-control"
                    style={{ marginLeft: 'auto', width: "30%" }}
                    onChange={handleChange}
                />
                <p className="text-primary">
                    Resultados: {currentPowerBis?.length}
                </p>
            </div>

            <div className="row">
                {
                    currentPowerBis?.length === 0 && !loading ?
                        <div className="col-md-12">
                            <h3 className="text-center">
                                No se encontrarón resultados.
                            </h3>
                        </div>
                        :
                        currentPowerBis?.map((powerBi, i) => {
                            return (
                                <div className="col-sm-6 col-md-4 col-lg-3 p-3" key={i}>
                                    <div className="card animate__animated animate__fadeIn p-3 m-0">
                                        <a target="_blank" href={`/powerbi/detalle/${powerBi?.id}`}>
                                            <img style={{ width: '100%', height: 200, borderRadius: 20 }} src={powerBi?.image_path} alt={powerBi?.title} />
                                        </a>
                                        <h4 className="mt-3">
                                            <a target="_blank" href={`/powerbi/detalle/${powerBi?.id}`}>
                                                {powerBi?.title}
                                            </a>
                                        </h4>
                                        <div>
                                            Fecha de creación:
                                            <b style={{ marginLeft: 5 }}>
                                                <DateFormatter value={powerBi?.created_at} dateFormat="d/M/yyyy" />
                                            </b>
                                        </div>
                                        <small className="text-primary">
                                            {powerBi?.zone?.name}
                                        </small>
                                    </div>
                                </div>
                            )
                        })
                }
                {
                    loading &&
                    generateArray(12, 1).map((item, i) => {
                        return (
                            <div className="col-sm-6 col-md-4 col-lg-3 p-3">
                                <div className="animate__animated animate__fadeIn  card m-0 p-3">
                                    <div className="skeletor" style={{ height: 200, borderRadius: 20 }}></div>
                                    <h4 className="skeletor mt-3" style={{ height: 19, borderRadius: 20 }}></h4>
                                    <div className="skeletor" style={{ height: 22 }}></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


        </div>
    )
}

export default Dashboard;
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../../components/DateFormatter";
import { generateArray } from "../../util/Utilities";
import useZones from "../../hooks/useZones";
import PowerBiCard from "../../components/Powerbi/PowerBiCard";
import { MdGridOn } from "react-icons/md";
import { FaList } from "react-icons/fa";
import useAreas from "../../hooks/useAreas";






const Dashboard = () => {

    const [filters, setFilters] = useState({
        search: '',
        zoneId: '',
        areaId: ''
    });

    const [show, setShow] = useState('list');

    const [{ data, loading }, getDashboard] = useAxios({ url: `/dashboard`, params: filters }, { useCache: false });

    const [{ zones, loading: zonesLoading }, getZones] = useZones({ params: { perPage: 50 } }, { useCache: false });

    const [{ areas, loading: areasLoading }, getAreas] = useAreas({ params: { perPage: 50 } }, { useCache: false });

    const [currentPowerBis, setCurrentPowerBis] = useState([]);

    useEffect(() => {
        if (data) {
            setCurrentPowerBis(oldData => [...oldData, ...data]);
        }
    }, [data])

    const handleChange = (e) => {
        console.log(e);
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

            <div className="row align-items-center justify-content-end">
                <div className="col-md-3 form-group mb-3">
                    <select value={filters?.areaId} onChange={handleChange} name="areaId" className="form-control">
                        <option value="">Seleccione una area...</option>
                        {
                            areas?.map((area, i) => {
                                return (
                                    <option value={area?.id} key={i}>{area?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col-md-3 form-group mb-3">
                    <select value={filters?.zoneId} onChange={handleChange} name="zoneId" className="form-control">
                        <option value="">Seleccione una zona...</option>
                        {
                            zones?.map((zone, i) => {
                                return (
                                    <option value={zone?.id} key={i}>{zone?.name}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col-md-3 form-group mb-3">
                    <input
                        value={filters?.search}
                        placeholder="Buscar..."
                        name="search"
                        type="text"
                        className="form-control mb-0 border border-primary"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-2 mb-3 text-end text-primary d-flex justify-content-between align-items-center">
                    <button type="button" title="Cambiar vista" className="btn btn-primary mr-5" onClick={(e) => {
                        setShow((prevValue) => {
                            return prevValue === 'list' ? 'grid' : 'list'
                        })
                    }}>
                        {
                            show === 'list' ?
                                <MdGridOn />
                                :
                                <FaList />
                        }
                    </button>
                    <span>
                        Resultados: {currentPowerBis?.length}
                    </span>
                </div>
            </div>

            {
                currentPowerBis?.length === 0 && !loading ?
                    <div className="col-md-12 mt-5">
                        <h3 className="text-center">
                            No se encontrarón resultados.
                        </h3>
                    </div>
                    :
                    null
            }
            {
                show === 'grid' &&
                <div className="row">
                    {
                        currentPowerBis?.map((powerBi, i) => {
                            return <PowerBiCard key={i} powerBi={powerBi} />
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
            }


            {
                show === 'list' &&
                <div style={{ overflowX: 'auto' }} className="table-responsible">
                    <table className="table" cellSpacing={100}>
                        <tbody>
                            {
                                currentPowerBis?.map((powerBi, i) => {
                                    return (
                                        <tr className="card animate__animated  animate__fadeInLeft mb-3" key={i}>
                                            <td>
                                                <img style={{ width: 80, borderRadius: '10px' }} src={powerBi?.image_path} alt="" />
                                            </td>
                                            <td>
                                                <label className="text-primary">
                                                    Nombre:
                                                </label>
                                                <p className="m-0">
                                                    {powerBi?.title}
                                                </p>
                                            </td>
                                            <td>
                                                <label className="text-primary">
                                                    Zona:
                                                </label>
                                                <p className="m-0">
                                                    {powerBi?.zone?.name}
                                                </p>
                                            </td>
                                            <td>
                                                <p className={`btn btn-xs btn-${powerBi?.status?.variant_color}`}>{powerBi?.status?.name}</p>
                                            </td>
                                            <td>
                                                <label className="text-primary d-block">
                                                    Fecha de creación:
                                                </label>
                                                <b style={{ marginLeft: 5 }}>
                                                    <DateFormatter value={powerBi?.created_at} dateFormat="dd/M/yyyy hh:mm:ss aaaa" />
                                                </b>
                                            </td>
                                            <td>
                                                <label className="text-primary">
                                                    Acciones
                                                </label>
                                                {
                                                    powerBi?.status?.id === 3 ?
                                                        <button type="button" disabled className="btn btn-xs btn-block btn-primary">
                                                            No disponible
                                                        </button>
                                                        :
                                                        <a href={`/powerbi/detalle/${powerBi?.id}`} className="btn btn-xs btn-block btn-primary">
                                                            Ver detalles
                                                        </a>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                loading &&
                                generateArray(12, 1).map((item, i) => {
                                    return (
                                        <tr>
                                            <div className="animate__animated animate__fadeIn card m-0 p-3">
                                                <div className="skeletor" style={{ height: 80, borderRadius: 20 }}></div>
                                            </div>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>

            }


        </div>
    )
}

export default Dashboard;
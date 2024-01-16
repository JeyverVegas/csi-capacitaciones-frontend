import DateFormatter from "../DateFormatter";

const PowerBiList = ({ powerBi }) => {
    return (
        <div className="col-sm-12 col-md-12 col-lg-12 p-3">
            <div className="card animate__animated animate__fadeIn m-0 p-3 position-relative row align-items-start justify-content-between">
                {
                    powerBi?.status?.id === 3 ?
                        <img className="col-2" style={{ borderRadius: 20 }} src={powerBi?.image_path} alt={powerBi?.title} />
                        :
                        <a className="col-2" target="_blank" href={`/powerbi/detalle/${powerBi?.id}`}>
                            <img style={{ maxWidth: '100%', borderRadius: 20 }} src={powerBi?.image_path} alt={powerBi?.title} />
                        </a>
                }
                <p className="mt-3 col-2">
                    {
                        powerBi?.status?.id === 3 ?
                            <>
                                <label className="text-primary d-block m-0">
                                    Nombre
                                </label>
                                <span className="m-0">
                                    {powerBi?.title}
                                </span>
                            </>
                            :
                            <>
                                <label className="text-primary d-block m-0">
                                    Nombre
                                </label>
                                <a className="m-0" target="_blank" href={`/powerbi/detalle/${powerBi?.id}`}>
                                    {powerBi?.title}
                                </a>
                            </>

                    }
                </p>
                <div className="mt-3 col-2">
                    <label className="text-primary d-block">
                        Estatus
                    </label>
                    <p className={`btn btn-xs btn-${powerBi?.status?.variant_color}`}>{powerBi?.status?.name}</p>
                </div>
                <div className="mt-3 d-none d-md-block col-2">
                    <label className="text-primary d-block">
                        Fecha de creación:
                    </label>
                    <b style={{ marginLeft: 5 }}>
                        <DateFormatter value={powerBi?.created_at} dateFormat="d/M/yyyy" />
                    </b>
                </div>
                <div className="mt-3 col-2">
                    <label className="text-primary d-block">
                        Zona
                    </label>
                    {powerBi?.zone?.name}
                </div>
                <div className="mt-3 col-2">
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

                </div>

            </div>
        </div>
    )
}

export default PowerBiList;
import DateFormatter from "../DateFormatter";

const PowerBiCard = ({ powerBi }) => {
    return (
        <div className="col-sm-6 col-md-4 col-lg-3 p-3">
            <div className="card animate__animated animate__fadeInUp p-3 m-0 position-relative">
                <p
                    className={`btn btn-xs btn-${powerBi?.status?.variant_color}`}
                    style={{ position: 'absolute', right: 25, top: 25 }}
                >
                    {powerBi?.status?.name}
                </p>
                {
                    powerBi?.status?.id === 3 ?
                        <img style={{ width: '100%', height: 200, borderRadius: 20 }} src={powerBi?.image_path} alt={powerBi?.title} />
                        :
                        <a target="_blank" href={`/powerbi/detalle/${powerBi?.id}`}>
                            <img style={{ width: '100%', height: 200, borderRadius: 20 }} src={powerBi?.image_path} alt={powerBi?.title} />
                        </a>
                }
                <h4 className="mt-3">
                    {
                        powerBi?.status?.id === 3 ?
                            <span>
                                {powerBi?.title}
                            </span>
                            :
                            <a target="_blank" href={`/powerbi/detalle/${powerBi?.id}`}>
                                {powerBi?.title}
                            </a>
                    }
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
                <div className="text-center mt-2">
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

export default PowerBiCard;
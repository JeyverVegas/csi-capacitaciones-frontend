import Loader from "./Loader";

const DetailsCard = ({ loading, value, icon, title, gradient = 'gradient-1' }) => {
    return (
        <div className={`${gradient} card card-bx`}>
            <div className="card-body d-flex align-items-center">
                <div className="me-auto text-white">
                    <h2 className="text-white">
                        {loading ?
                            <Loader
                                color='#ffffff'
                                size={4}
                            />
                            :
                            value
                        }
                    </h2>
                    <span className="fs-18">{title || ''}</span>
                </div>
                <i className={`${icon} text-white`} style={{ fontSize: 40 }}></i>
            </div>
        </div>
    )
}

export default DetailsCard;
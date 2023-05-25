import { useEffect, useState } from "react";
import SystemInfo from "../../util/SystemInfo";
import { BsQrCodeScan } from "react-icons/bs";
import handleChange from "../../util/handleChange";
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../../components/DateFormatter";
import imgUrl from "../../util/imgUrl";
import { Modal } from "react-bootstrap";
import { QrScanner } from "@yudiel/react-qr-scanner";

const Consult = () => {

    const [documentNumber, setDocumentNumber] = useState('');

    const [{ data, loading }, consultWorker] = useAxios({ url: `consult-worker`, method: 'POST' }, { useCache: false, manual: true });

    const [showQrCodeScanner, setShowQrCodeScanner] = useState(false);

    const [workerAccreditations, setWorkerAccreditations] = useState([]);

    useEffect(() => {
        if (data) {
            setWorkerAccreditations(data?.data);
        }
    }, [data])

    const handleScan = (documentNumber) => {
        setShowQrCodeScanner(false);

        consultWorker({
            data: {
                documentNumber
            }
        });
    }

    const handleSubmit = (e) => {
        e?.preventDefault?.();

        if (!documentNumber) return alert('El rut es obligatorio.');

        consultWorker({
            data: {
                documentNumber
            }
        });
    }

    return (
        <div className="container">
            <div>
                <div className="text-center">
                    <img src={SystemInfo?.logo} alt="" />
                    <br /><br /><br /><br />
                    <h3 className="text-center">Bienvenido</h3>
                    <h5 className="text-center">Ingrese el rut para consultar las acreditaciones del trabajador</h5>
                </div>
                <br />
                <br />
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label htmlFor="">Ingrese el rut del trabajador</label>
                        <input
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            value={documentNumber}
                            type="text"
                            className="form-control"
                            placeholder="Ingrese el rut"
                        />
                        <BsQrCodeScan
                            onClick={() => setShowQrCodeScanner(true)}
                            style={{ position: 'absolute', right: 16, top: 34, fontSize: 23, cursor: 'pointer' }}
                        />
                    </div>
                    <br />
                    <div className="text-center">
                        <button className="btn btn-primary">
                            Enviar
                        </button>
                    </div>
                </form>
            </div>

            {/* <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result?.text);
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                style={{ width: '100%' }}
            /> */}


            <div className="mt-5">
                {
                    loading ?
                        <div className="text-center">
                            <h3 className="text-primary">Consultando trabajador</h3>
                            <p>Por favor espere</p>
                        </div>
                        :
                        workerAccreditations?.length > 0 ?
                            <div>
                                <div className="text-center">
                                    <img src={imgUrl(workerAccreditations?.[0]?.user?.imagePath)} alt="" style={{ height: 70, width: 70, borderRadius: '100%' }} />
                                    <br />
                                    <br />
                                    <h4 className="text-center">
                                        {workerAccreditations?.[0]?.user?.name}
                                    </h4>
                                </div>

                                <br />

                                <div className="row">
                                    {
                                        workerAccreditations?.map((accreditation, i) => {
                                            return (
                                                <div className="col-sm-6 col-md-6 col-lg-4 col-xl-3" key={i}>
                                                    <div className="p-2">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                ✔️ {accreditation?.costCenter?.name}
                                                            </div>
                                                            <div className="card-body">
                                                                <b>Acreditado el:</b> <DateFormatter value={accreditation?.createdAt} dateFormat="dd/MM/yyyy" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <div className="text-center">
                                No se han encontrado resultados. Por favor consulte otra vez.
                            </div>

                }
            </div>
            <Modal show={showQrCodeScanner} onHide={() => setShowQrCodeScanner(false)} size="lg">
                <Modal.Body>
                    <QrScanner
                        onDecode={(result) => handleScan(result)}
                        onError={(error) => console.log(error?.message)}
                    />
                </Modal.Body>
            </Modal>
        </div >
    )
}

export default Consult;
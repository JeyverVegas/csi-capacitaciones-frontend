import credentialFront from "../../../assets/images/acreditacion-front.png";
import credentialBack from "../../../assets/images/acreditacion-back.png";
import { useAuth } from "../../../context/AuthContext";
import imgUrl from "../../../util/imgUrl";
import QRCode from "react-qr-code";
import ReactToPrint from "react-to-print";
import { useRef } from "react";

const AccountCredential = () => {

    const { user } = useAuth();

    var credentialBackComponentRef = useRef();

    var credentialFrontComponentRef = useRef();


    return (
        <div>
            <div className="row">

                <div className="col-md-6">
                    <h3 className="text-center">Credencial frontal</h3>
                    <div
                        ref={el => (credentialFrontComponentRef = el)}
                        style={{ backgroundImage: `url(${credentialFront})`, backgroundSize: '100% 100%', height: 400, width: 270, margin: 'auto', position: 'relative' }}
                    >
                        <img src={imgUrl(user?.imagePath)} alt="" style={{ height: 85, width: 91, position: 'absolute', top: 93, left: 90 }} />
                        <p style={{ fontSize: 12, fontWeight: 'bold', color: 'white', top: 259, left: 70, position: 'absolute' }}>{user?.name}</p>
                        <p style={{ fontSize: 12, fontWeight: 'bold', color: 'white', top: 286, left: 51, position: 'absolute' }}>{user?.documentNumber}</p>
                        <p style={{ fontSize: 12, fontWeight: 'bold', color: 'white', top: 311, left: 104, position: 'absolute' }}>{user?.costCenter?.name}</p>
                    </div>
                    <br />
                    <div className="text-center">
                        <ReactToPrint
                            trigger={() => {
                                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                // to the root node of the returned component as it will be overwritten.
                                return <a href="#" className="btn btn-primary">¡Imprimir!</a>;
                            }}
                            content={() => credentialFrontComponentRef}
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <h3 className="text-center">Credencial trasera</h3>
                    <div
                        ref={el => (credentialBackComponentRef = el)}
                        style={{ backgroundImage: `url(${credentialBack})`, backgroundSize: '100% 100%', height: 400, width: 270, margin: 'auto', display: 'flex' }}
                    >
                        <div className="mx-auto" style={{ marginTop: 100 }}>
                            <QRCode
                                value={user?.id}
                                style={{ height: "auto", maxWidth: 100, width: 100 }}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="text-center">
                        <ReactToPrint
                            trigger={() => {
                                // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                                // to the root node of the returned component as it will be overwritten.
                                return <a href="#" className="btn btn-primary">¡Imprimir!</a>;
                            }}
                            content={() => credentialBackComponentRef}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountCredential;
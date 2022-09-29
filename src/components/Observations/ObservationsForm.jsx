import { useEffect } from "react";
import { useState } from "react"
import useAxios from "../../hooks/useAxios";
import DateFormatter from "../DateFormatter";
import profile from '../../images/profile.png';

const ObservationsForm = ({ defaultObservations, orderId }) => {

    const [currentObservations, setCurrentObservations] = useState([]);

    const [observationText, setObservationText] = useState('');

    const [{ data: observationData, loading: observationLoading }, createObservation] = useAxios({ url: `observations`, method: 'POST' }, { useCache: false, manual: true });

    useEffect(() => {
        if (observationData) {
            setCurrentObservations((oldObservations) => {
                return [observationData?.data, ...oldObservations]
            });
            setObservationText('');
        }
    }, [observationData])

    useEffect(() => {
        if (defaultObservations?.length > 0) {
            setCurrentObservations((oldObservations) => {
                return [...defaultObservations, ...oldObservations]
            });
        }
    }, [defaultObservations]);

    const handleObservation = (e) => {
        e?.preventDefault?.();

        if (!observationText) return alert('El texto es obligatorio.');

        createObservation({
            data: {
                content: observationText,
                orderId: orderId
            }
        });
    }

    return (
        <div>
            <h3>Chat de Observaciones:</h3>
            <ul>
                {
                    currentObservations?.length > 0 ?
                        currentObservations?.map((observation, i) => {
                            return (
                                <li key={i} className="border-bottom my-2">
                                    <div>
                                        <img
                                            className="rounded"
                                            style={{ width: 40, height: 40 }}
                                            src={observation?.user?.image_path || profile}
                                        />
                                        <b className="mx-3">{observation?.user?.name}</b>
                                    </div>
                                    <br />
                                    {observation?.content}  <b>(<DateFormatter value={observation?.createdAt} dateFormat='dd-MM-yyyy hh:mm:ss' />)</b>
                                </li>
                            )
                        })
                        :
                        <li>
                            <h5 className="text-center">
                                No hay Observaciones.
                            </h5>
                        </li>
                }
            </ul>
            <br />
            <br />
            <form className="row" onSubmit={handleObservation}>
                <div className="col-md-10">
                    <input
                        onChange={(e) => setObservationText(e.target.value)}
                        value={observationText}
                        type="text"
                        className="form-control"
                        placeholder="Ecriba una observación"
                    />
                </div>
                <div className="col-md-2">
                    <button disabled={observationLoading} type="submit" className="btn btn-primary">
                        {
                            observationLoading ?
                                'Enviando'
                                :
                                'Enviar'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ObservationsForm;
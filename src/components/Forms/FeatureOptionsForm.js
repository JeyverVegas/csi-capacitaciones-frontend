import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFeedBack } from "../../context/FeedBackContext";
import useAxios from "../../hooks/useAxios";
import { mainPermissions } from "../../util/MenuLinks";
import NewOptionRow from "./NewOptionRow";

const FeatureOptionsForm = ({ initialOptions, featureId }) => {

    const { permissions } = useAuth();

    const { setLoading } = useFeedBack();

    const [options, setOptions] = useState([]);

    const [saveAll, setSaveAll] = useState(false);

    const [featuresOpsToSave, setFeaturesOpsToSave] = useState([]);

    const [saveAllMessage, setSaveAllMessage] = useState('');

    const [{ data: saveData, loading: saveLoading }, saveOption] = useAxios({}, { manual: true, useCache: false });

    useEffect(() => {
        if (saveAllMessage) {
            setTimeout(() => {
                setSaveAllMessage('');
            }, 3000)
        }
    }, [saveAllMessage])

    useEffect(() => {
        if (featuresOpsToSave.length === options.length && options.length > 0) {
            handleSaveAll();
        }
    }, [featuresOpsToSave])

    useEffect(() => {
        if (initialOptions) {
            setOptions((oldOptions) => {
                return [...initialOptions, ...oldOptions]
            })
        }
    }, [initialOptions])

    const handleAddNewOption = () => {
        setOptions((oldOptions) => {
            return [...oldOptions, { name: '', }]
        })
    }

    const handleDeleteOption = (index) => {
        setOptions(options.filter((product, i) => i !== index));
    }

    const handleSaveAll = async () => {
        setLoading({ show: true, message: 'Guardando' });
        var savedData = [];
        for (let index = 0; index < featuresOpsToSave.length; index++) {
            const data = featuresOpsToSave[index];
            const { id, createdAt, ...rest } = data;
            var successData = await saveOption({ url: `/product-feature-option${data?.id ? `/${data?.id}` : ''}`, method: data?.id ? 'PUT' : 'POST', data: rest });
            savedData.push(successData.data.data);
        }

        setLoading({ show: false, message: '' });
        setSaveAll(false);
        setFeaturesOpsToSave([]);
        setOptions(savedData)
        setSaveAllMessage('Se Han guardado los Cambios.');
    }

    const dispatchSaveAll = (data) => {
        setFeaturesOpsToSave((oldFeatureOpsToSave) => {
            return [...oldFeatureOpsToSave, data];
        });
    }

    if (!featureId || !permissions?.includes(mainPermissions?.productFeaturesOptions[0])) {
        return null;
    }

    return (
        <div className="animate__animated animate__fadeInRight">
            <h4>Valores de la caracteristica</h4>
            <div className="row">
                {
                    options?.map((option, i) => {
                        return (
                            <NewOptionRow
                                key={i}
                                defaultDataOption={option}
                                featureId={featureId}
                                index={i}
                                onDelete={handleDeleteOption}
                                executeSave={saveAll}
                                onSaveAll={dispatchSaveAll}
                            />

                        )
                    })
                }
            </div>
            {
                saveAllMessage &&
                <div className="text-right animate__animated animate__fadeInRight my-2">
                    {saveAllMessage}
                </div>
            }
            <div className="mb-3 d-flex justify-content-end">
                {
                    permissions?.includes(mainPermissions?.productFeaturesOptions[1]) &&
                    <div>
                        {
                            options?.length > 0 &&
                            <button onClick={() => { setSaveAll((oldSaveAll) => !oldSaveAll) }} type="button" className="btn btn-primary mx-2">
                                Guardar todos
                            </button>
                        }
                        <button onClick={handleAddNewOption} type="button" className="btn btn-primary mx-2">
                            Añadir Valor
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default FeatureOptionsForm;
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mainPermissions } from "../../util/MenuLinks";
import NewOptionRow from "./NewOptionRow";

const FeatureOptionsForm = ({ initialOptions, featureId }) => {

    const { permissions } = useAuth();

    const [options, setOptions] = useState([]);

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

    if (!featureId || !permissions?.includes(mainPermissions?.productFeaturesOptions[0])) {
        return null;
    }

    return (
        <div>
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
                            />

                        )
                    })
                }
            </div>
            <div className="mb-3 d-flex justify-content-end">
                {
                    permissions?.includes(mainPermissions?.productFeaturesOptions[1]) &&
                    <button onClick={handleAddNewOption} type="button" className="btn btn-primary mx-2">
                        Añadir Valor
                    </button>
                }
            </div>
        </div>
    )
}

export default FeatureOptionsForm;
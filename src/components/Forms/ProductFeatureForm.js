import { useEffect, useState } from "react";
import useFeatures from "../../hooks/useFeatures";
import CustomSelect from "../CustomSelect";
import { MultiSelect } from "react-multi-select-component";
import useAxios from "../../hooks/useAxios";
import ReactTooltip from "react-tooltip";
import swal from "sweetalert";

const ProductFeatureForm = ({
    feature,
    productVersionId,
    index,
    selectedFeaturesIds,
    onSelectFeature,
    onDelete
}) => {

    const [{ data: saveData, loading: saveLoading }, saveFeaturesOptions] = useAxios({ url: `/product-versions/${productVersionId}/product-features`, method: 'PUT' }, { manual: true, useCache: false });

    const [{ features, total, numberOfPages, size, error, loading: loadingFeatures }, getFeatures] = useFeatures();

    const [filters, setFilters] = useState({ name: '', exceptIds: [] });

    const [selectedFeaturesOptions, setSelectedFeaturesOptions] = useState([]);

    const [featureOptions, setFeatureOptions] = useState([]);

    const [selectedFeature, setSelectedFeature] = useState(null);

    const [alert, setAlert] = useState({ show: false, message: '' });

    useEffect(() => {
        if (alert.show) {
            setTimeout(() => {
                setAlert({ show: false, message: '' });
            }, 3000)
        }
    }, [alert])

    useEffect(() => {
        if (saveData) {
            setAlert({ show: true, message: 'Los cambios han sido guardados.' });
        }
    }, [saveData])

    useEffect(() => {
        getFeatures({
            params: {
                ...filters,
                exceptIds: filters.exceptIds.join(',')
            }
        });
    }, [filters]);

    useEffect(() => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                exceptIds: selectedFeaturesIds?.filter(id => id != selectedFeature?.id)
            }
        })
    }, [selectedFeaturesIds, selectedFeature])

    useEffect(() => {
        if (selectedFeature) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    name: selectedFeature?.name
                }
            });

            if (!selectedFeature?.featureId) {
                setSelectedFeaturesOptions([]);
            }

            if (selectedFeature?.options?.length > 0 && !selectedFeature?.featureId) {
                setFeatureOptions(selectedFeature?.options?.map((option, i) => {
                    return {
                        label: option?.name,
                        value: option?.id
                    }
                }))
            } else {
                setFeatureOptions([]);
            }
        }
    }, [selectedFeature]);

    useEffect(() => {
        if (features?.length > 0 && selectedFeature?.featureId) {
            setFeatureOptions(features[0]?.options?.map((option, i) => {
                return {
                    label: option?.name,
                    value: option?.id
                }
            }))
        }
    }, [features])

    useEffect(() => {
        if (feature) {
            setSelectedFeature((oldData) => {
                return {
                    ...oldData,
                    ...feature
                }
            });
            if (feature?.options?.length > 0) {
                setSelectedFeaturesOptions(feature?.options?.map((featureOption) => { return { label: featureOption?.name, value: featureOption?.id } }))
            }
        }
    }, [feature]);

    const handleFeature = (feature) => {
        onSelectFeature?.(feature, selectedFeature);
        setSelectedFeature(feature);
    }

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (selectedFeaturesOptions?.length === 0) {
            alert('debes seleccionar al menos una opción');
            return;
        }

        console.log();

        saveFeaturesOptions({
            data: {
                productFeatureOptionIds: selectedFeaturesOptions?.map((feature) => feature?.value),
                productFeatureOptionIdsForDetaching: featureOptions?.filter((option) => !selectedFeaturesOptions?.map((selectedOption) => selectedOption?.value).includes(option?.value)).map(option => option?.value)
            }
        });
    }

    const handleDeleteAll = () => {
        swal({
            title: "¿Estás Seguro?",
            text: "¿Deseas eliminar esta característica?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((wantDelete) => {
            if (wantDelete) {
                saveFeaturesOptions({
                    data: {
                        productFeatureOptionIds: [],
                        productFeatureOptionIdsForDetaching: featureOptions?.map(option => option?.value)
                    }
                }).then(() => {
                    onDelete?.(index);
                });
            }
        });
    }

    return (
        <div className="mb-3">
            <form className="row align-items-end" onSubmit={handleSubmit}>
                <div className="col-md-3">
                    <div>Caracteristica</div>
                    {
                        selectedFeature &&
                        <strong>{selectedFeature?.name}</strong>
                    }
                    <CustomSelect
                        options={features}
                        optionLabel="name"
                        inputPlaceholder="Escribe el nombre..."
                        isLoading={loadingFeatures}
                        onSelectValue={handleFeature}
                        handleInputChange={(e) => { setFilters((oldFilters) => { return { ...oldFilters, name: e.target.value } }) }}
                        inputValue={filters?.name}
                    />
                </div>
                <div className="col-md-3">
                    <div>Valor</div>

                    {
                        !selectedFeature?.name ?
                            <span style={{ color: 'red' }}>Seleccione una característica primero.</span>
                            :
                            selectedFeature?.options?.length === 0 ?
                                <span style={{ color: 'red' }}>Está característica no tiene valores...</span>
                                :
                                selectedFeaturesOptions?.length === 0 ?
                                    <span style={{ color: 'red' }}>Seleccione una opción...</span>
                                    :
                                    <strong>{selectedFeaturesOptions?.map((option) => option.label).join(', ')}</strong>
                    }
                    <MultiSelect
                        className="bg-custom-multiselect"
                        disabled={!selectedFeature || featureOptions?.length < 1}
                        options={featureOptions}
                        value={selectedFeaturesOptions}
                        onChange={setSelectedFeaturesOptions}
                        labelledBy="Select"
                    />
                </div>
                <div className="col-md-3">
                    <button disabled={saveLoading} onClick={handleDeleteAll} type="button" data-tip="Eliminar" className="btn btn-danger mx-1">
                        {
                            saveLoading ?
                                'Cargando...'
                                :
                                <i className="flaticon-381-trash-2" />
                        }
                    </button>
                    <button disabled={saveLoading} type="submit" data-tip="Guardar" className="btn btn-success">
                        {
                            saveLoading ?
                                'Cargando...'
                                :
                                <i className="flaticon-008-check" />
                        }
                    </button>
                    <ReactTooltip />
                </div>
            </form>
            {
                alert?.show &&
                <span>{alert?.message}</span>
            }
        </div>
    )
}

export default ProductFeatureForm;
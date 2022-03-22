import { useEffect, useState } from "react";
import ProductFeatureForm from "./ProductFeatureForm";

const ProductVersionsFeaturesContainer = ({ defaultFeatures, productVersionId, show }) => {

    const [features, setFeatures] = useState([]);

    const [selectedFeaturesIds, setSelectedFeaturesIds] = useState([]);


    useEffect(() => {
        if (defaultFeatures && defaultFeatures?.length > 0) {
            setFeatures((oldFeatures) => {
                return [...oldFeatures, ...defaultFeatures]
            });
            setSelectedFeaturesIds(defaultFeatures?.map((feature) => feature?.featureId));
        }
    }, [defaultFeatures]);

    if (!show) {
        return null;
    }

    const handleAddFeature = () => {
        setFeatures((oldFeatures) => {
            return [...oldFeatures, { productFeatureOptionId: '' }]
        })
    }

    const handleDeleteProductVersionFeature = (index) => {
        setFeatures(features?.filter((feature, i) => i !== index));
    }

    const handleFeature = (feature, oldFeature) => {
        if (oldFeature) {
            setSelectedFeaturesIds((oldSelectedFeaturesIds) => {
                return [...oldSelectedFeaturesIds?.filter(id => id != oldFeature?.id)]
            });
        }

        setSelectedFeaturesIds((oldSlectedFeaturesIds) => {
            return [...oldSlectedFeaturesIds, feature?.id]
        })
        console.log(feature);
    }

    return (
        <div className="animate__animated animate__fadeInRight border-bottom pb-4">
            {
                features?.map((feature, i) => {
                    return (
                        <ProductFeatureForm
                            selectedFeaturesIds={selectedFeaturesIds}
                            onSelectFeature={handleFeature}
                            key={i}
                            feature={feature}
                            productVersionId={productVersionId}
                            index={i}
                            onDelete={handleDeleteProductVersionFeature}
                        />
                    )
                })
            }
            <button onClick={handleAddFeature} className="btn btn-primary btn-sm">
                Añadir Caracteristica
            </button>
        </div>
    )
}

export default ProductVersionsFeaturesContainer;
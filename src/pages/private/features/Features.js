import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeaturesColumns from "../../../components/CustomTable/Columns/FeaturesColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useAuth } from "../../../context/AuthContext";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useFeatures from "../../../hooks/useFeatures";
import { mainPermissions } from "../../../util/MenuLinks";

const Features = () => {

    const { permissions } = useAuth();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1
    })

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ features, total, numberOfPages, size, error: featuresError, loading: featuresLoading }, getFeatures] = useFeatures({ params: { ...filters } }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteFeature] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getFeatures();
    }, [])

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Características'
        })
    }, [deleteLoading])

    useEffect(() => {
        if (deleteError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al eliminar.',
                show: true
            });
        }

        if (featuresError) {
            setCustomAlert({
                title: 'error',
                severity: 'danger',
                message: 'Ha ocurrido un error al obtener las características.',
                show: true
            });
        }
    }, [deleteError, featuresError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(features?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteFeature({ url: `/features/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'La característica ha sido eliminada exitosamente.',
                show: true
            });
            getFeatures();
        })
    }

    const handleSelectALL = () => {
        setSelectAll((oldSelectAll) => !oldSelectAll);
    }

    const handleSelectValue = (selectedValue) => {
        const value = selectedValues?.includes(Number(selectedValue?.id));
        if (value) {
            const newValues = selectedValues?.filter(n => n !== Number(selectedValue?.id));
            setSelectedValues(newValues);
        } else {
            setSelectedValues((oldSelectedValues) => [...oldSelectedValues, Number(selectedValue?.id)])
        }
    }

    const handlePageChange = (page) => {
        if (page < 11 && page > 0) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: page
                }
            })
        }
    }

    const handleDeleteSelected = () => {
        deleteFeature({ url: `/features/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Las características han sido eliminadas exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getFeatures();
        });
    }

    return (
        <div>
            {
                permissions?.includes?.(mainPermissions?.features[1]) ?
                    <div className="my-4 justify-content-end d-flex">
                        <Link to={"/caracteristicas/crear"} className="btn btn-primary">
                            Crear Característica
                        </Link>
                    </div>
                    :
                    null
            }
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                selectAll={selectAll}
                loading={featuresLoading}
                title={'Características'}
                entity="features"
                updatePath={"/características"}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={features}
                currentPage={filters.page}
                collumns={FeaturesColumns}
                changePage={handlePageChange}
            />
        </div>
    )
}
export default Features;
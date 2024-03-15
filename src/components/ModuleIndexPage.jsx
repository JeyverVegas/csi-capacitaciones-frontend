import { useEffect, useState } from "react";
import { useFeedBack } from "../context/FeedBackContext";
import useAxios from "../hooks/useAxios";
import CustomTable from "./CustomTable/CustomTable";

const ModuleIndexPage = ({ endPoint, title, Columns, FiltersComponent, path, defaultFilters, ModuleActionsComponent, GlobalActionsComponent }) => {

    const { setCustomAlert, setLoading, setCurrentTitle } = useFeedBack();

    const [filters, setFilters] = useState({ page: 1, ...defaultFilters });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ data, loading }, getRecords] = useAxios({ url: endPoint, params: filters }, { useCache: false });

    const [{ error: deleteError, loading: deleteLoading }, deleteRecord] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    /* useEffect(() => {
        setCurrentTitle({
            subTitle: 'Listar',
            title: `${title}`
        });
    }, [title]) */

    useEffect(() => {
        setLoading?.({
            show: deleteLoading,
            message: 'Eliminando Registros'
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
    }, [deleteError])

    useEffect(() => {
        if (selectAll) {
            setSelectedValues(data?.data?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteRecord({ url: `${endPoint}/${value?.id}` }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'El registros ha sido eliminado exitosamente.',
                show: true
            });
            getRecords();
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
        if (data?.meta?.last_page >= page && page > 0) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: page
                }
            })
        }
    }

    const handleDeleteSelected = () => {
        deleteRecord({ url: `${endPoint}/multiple`, data: { ids: selectedValues } }).then((data) => {
            setCustomAlert({
                title: '¡Operación Exitosa!',
                severity: 'success',
                message: 'Los registros han sido eliminados exitosamente.',
                show: true
            })
            setSelectedValues([]);
            getRecords();
        });
    }

    return (
        <div>
            {
                ModuleActionsComponent &&
                <>
                    <ModuleActionsComponent path={path} />
                    <br />
                </>
            }
            {
                FiltersComponent &&
                <>
                    <FiltersComponent setFilters={setFilters} filters={filters} />
                    <br />
                </>
            }
            <CustomTable
                GlobalActionsComponent={GlobalActionsComponent ? <GlobalActionsComponent getRecords={getRecords} endPoint={endPoint} selectedValues={selectedValues} /> : null}
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={title}
                entity={title}
                updatePath={path}
                updateOptionString={'Editar'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={data?.meta?.last_page}
                total={data?.meta?.total}
                values={data?.data}
                currentPage={filters?.page}
                collumns={Columns}
                changePage={handlePageChange}
                filters={filters}
                excelUrl={`${endPoint}/export/excel`}
                perPage={filters?.perPage}
                onPerPageChange={(e) => setFilters((oldFilters) => {
                    return {
                        ...oldFilters,
                        [e.target.name]: e.target.value
                    }
                })}
            />
        </div>
    )
}

export default ModuleIndexPage;
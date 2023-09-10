import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CostCenterColumns from "../../../components/CustomTable/Columns/CostCenterColumns";
import CustomTable from "../../../components/CustomTable/CustomTable";
import { useFeedBack } from "../../../context/FeedBackContext";
import useAxios from "../../../hooks/useAxios";
import useCostCenters from "../../../hooks/useCostCenters";
import { Dropdown } from "react-bootstrap";

const CostCenters = () => {

    const entity = {
        name: 'Centros de costos',
        url: 'cost-centers',
        frontendUrl: '/centros-de-costos',
        camelName: 'costCenters',
    };

    const { setCustomAlert, setLoading } = useFeedBack();

    const [filters, setFilters] = useState({
        page: 1,
        name: '',
        search: ''
    });

    const [selectedValues, setSelectedValues] = useState([]);

    const [selectAll, setSelectAll] = useState(false);

    const [{ [entity.camelName]: records, total, numberOfPages, loading }, getRecords] = useCostCenters({ params: { ...filters }, options: { useCache: false } });

    const [{ error: deleteError, loading: deleteLoading }, deleteRecord] = useAxios({ method: 'DELETE' }, { manual: true, useCache: false });

    useEffect(() => {
        getRecords();
    }, [])

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
            setSelectedValues(records?.map?.((value) => value?.id))
        } else {
            setSelectedValues([])
        }
    }, [selectAll])

    const handleDelete = (value) => {
        deleteRecord({ url: `${entity.url}/${value?.id}` }).then((data) => {
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
        if (page < 11 && page > 0) {
            setFilters((oldFilters) => {
                return {
                    ...oldFilters,
                    page: page
                }
            })
        }
    }

    const handleChangeFilters = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
                page: 1
            }
        });
    }

    const handleDeleteSelected = () => {
        deleteRecord({ url: `${entity.url}/multiple`, data: { ids: selectedValues } }).then((data) => {
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
            <div className="my-4 justify-content-end d-flex">
                {
                    <>
                        <Dropdown className="mx-2">
                            <Dropdown.Toggle variant="success">
                                Importar
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={`${entity.frontendUrl}/importar-responsables`}>
                                    Importar responsables
                                </Dropdown.Item>
                                <Dropdown.Item href={`${entity.frontendUrl}/importar-montos-de-cuentas`}>
                                    Importar montos de cuentas
                                </Dropdown.Item>
                                <Dropdown.Item href={`${entity.frontendUrl}/importar-dotacion`}>
                                    Importar dotación por contrato
                                </Dropdown.Item>
                                <Dropdown.Item href={`${entity.frontendUrl}/importar-ingresos-uf`}>
                                    Importar ingresos UF
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary">
                                Opciones
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item href={`${entity.frontendUrl}/cargar-remuneraciones`}>
                                    Ingresar montos por clasificación de cuentas
                                </Dropdown.Item>
                                <Dropdown.Item href={`${entity.frontendUrl}/agregar-ingresos-us`}>
                                    Ingresar montos UF
                                </Dropdown.Item>
                                <Dropdown.Item href={`${entity.frontendUrl}/agregar-dotacion`}>
                                    Asignar dotación a los {entity.name}
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                }
            </div>
            <br />
            <div className="card p-4">
                <label htmlFor="" className="text-primary">
                    Buscar Por:
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={filters?.search}
                    name="search"
                    onChange={handleChangeFilters}
                    placeholder="Id, Nombre, Responsable General..."
                />
            </div>
            <br />
            <CustomTable
                onDeleteSelected={handleDeleteSelected}
                onSelectValue={handleSelectValue}
                onSelectAll={handleSelectALL}
                loading={loading}
                selectAll={selectAll}
                title={entity?.name}
                entity={entity.url}
                updatePath={entity.frontendUrl}
                updateOptionString={'Editar'}
                onDelete={handleDelete}
                selectedValues={selectedValues}
                pages={numberOfPages}
                total={total}
                values={records}
                currentPage={filters?.page}
                collumns={CostCenterColumns}
                changePage={handlePageChange}
                filters={filters}
                excelUrl={`${entity.url}/export/excel`}
            />
        </div>
    )
}

export default CostCenters;
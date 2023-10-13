import { useFeedBack } from "../../context/FeedBackContext";
import ActionDropdown from "../ActionDropdown";
import CustomTableBodyCollumn from "./CustomTableBodyCollumn";
import CustomTableBodyRow from "./CustomTableBodyRow";
import CustomTableHeadColumn from "./CustomTableHeadColumn";
import swal from "sweetalert";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useTheme } from "../../context/ThemeContext";

const CustomTable = ({
    title,
    values = [],
    total = 0,
    pages,
    onDeleteSelected,
    currentPage,
    collumns,
    updatePath,
    selectedValues,
    onDelete,
    onSelectAll,
    selectAll,
    onSelectValue,
    changePage,
    loading,
    updateParamAccesor = 'id',
    withoutGlobalActions,
    variant = 'card',
    hideSelectAll,
    entity,
    updateOptionString,
    excelUrl,
    filters,
    excelName,
    perPage = 10,
    onPerPageChange,
    recordNameProp = 'name'
}) => {

    const { setCustomAlertDialog } = useFeedBack();

    const { darkMode } = useTheme();

    const [currentFilters, setCurrentFilters] = useState('');

    const [{ data: excelData, loading: excelLoading }, getExcel] = useAxios({ url: excelUrl, method: 'GET', responseType: 'blob', params: { ...filters } }, { manual: true, useCache: false });

    useEffect(() => {
        if (excelData) {
            const excelBlobUrl = URL.createObjectURL(excelData);
            const aToDownload = document.getElementById('downloadLink');
            aToDownload.href = excelBlobUrl;
            aToDownload?.click();
            window.URL.revokeObjectURL(excelBlobUrl);
        }
    }, [excelData])

    useEffect(() => {
        if (filters) {
            const { page, ...rest } = filters;
            setCurrentFilters(rest);
        }
    }, [filters])

    const handleDeleteSelected = () => {
        swal({
            title: "¿Estas Seguro(a)?",
            text: "¿Quieres eliminar todos los registros seleccionados?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                onDeleteSelected?.();
            } else {

            }
        })
    }

    const handleDelete = (value) => {
        swal({
            title: "¿Estas Seguro(a)?",
            text: `¿Quieres eliminar el registro ${value?.[recordNameProp]}?`,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                onDelete?.(value);
            } else {

            }
        })
    }

    return (
        <div className="col-12">
            <div style={{ background: 'transparent' }} className={clsx({
                'card': variant === 'card',
            })}>

                <div className={clsx(["d-flex align-items-center"], {
                    "card-header": variant === 'card'
                })}>
                    {
                        title &&
                        <h4 className="card-title" style={{ color: darkMode ? 'white' : '' }}>{title}</h4>
                    }
                    {
                        excelUrl &&
                        <button onClick={() => {
                            getExcel({ params: { ...currentFilters } });
                        }} disabled={excelLoading} className="btn btn-success btn-sm">
                            {
                                excelLoading ?
                                    'Loading...'
                                    :
                                    'Descargar Excel'
                            }
                        </button>
                    }
                    {
                        !withoutGlobalActions &&
                        <div>
                            <h5 style={{ color: darkMode ? 'white' : '' }}>Acciones globales:</h5>
                            {
                                selectedValues?.length > 0 ?
                                    <ActionDropdown entity={entity} withOutUpdate onDelete={handleDeleteSelected} />
                                    :
                                    <span>Debes seleccionar al menos un registro.</span>
                            }
                        </div>
                    }
                </div>
                <div className={clsx({
                    "card-body": variant === 'card'
                })}>
                    <div className="w-100 table-responsive">
                        <div id="patientTable_basic_table" className="dataTables_wrapper">
                            <table
                                id="example5"
                                className="display dataTable no-footer w-100 text-center"
                                style={{ minWidth: 845 }}
                                role="grid"
                                aria-describedby="example5_info"
                            >
                                <thead>
                                    <tr role="row">
                                        {
                                            collumns?.map(({ Label, filter }, i) => {
                                                return (
                                                    <CustomTableHeadColumn style={{ color: darkMode ? 'white' : '' }} key={i}>
                                                        <div className="custom-checkbox">
                                                            {
                                                                <Label style={{ color: darkMode ? 'white' : '' }} checked={selectAll} onChange={() => { onSelectAll?.() }} />
                                                            }
                                                            {filter ?
                                                                <input></input>
                                                                :
                                                                null
                                                            }
                                                        </div>
                                                    </CustomTableHeadColumn>
                                                )
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        loading ?
                                            <CustomTableBodyRow>
                                                <td className="text-center" colSpan={collumns?.length}>
                                                    <h3>Cargando...</h3>
                                                </td>
                                            </CustomTableBodyRow>
                                            :
                                            values?.length > 0 ?
                                                values?.map((value, i) => {
                                                    return (
                                                        <CustomTableBodyRow key={i}>
                                                            {
                                                                collumns?.map(({ Component, accessor }, i2) => {
                                                                    return (
                                                                        <CustomTableBodyCollumn style={{ color: darkMode ? 'white' : '' }} key={i2}>
                                                                            {
                                                                                Component ?
                                                                                    <Component
                                                                                        updateOptionString={updateOptionString}
                                                                                        entity={entity}
                                                                                        id={value?.id}
                                                                                        updatePath={updatePath}
                                                                                        positionName={value?.position?.name}
                                                                                        userStatus={value?.userStatus}
                                                                                        serviceName={value?.service?.name}
                                                                                        roleName={value?.role?.displayText}
                                                                                        nameValue={value?.name}
                                                                                        date={value?.createdAt}
                                                                                        imgValue={value?.imgPath}
                                                                                        parentCategory={value?.parentCategory}
                                                                                        provider={value?.provider}
                                                                                        categoryName={value?.category?.name}
                                                                                        documentNumberValue={value?.documentNumber}
                                                                                        roleDisplayText={value?.displayText}
                                                                                        onChange={() => { onSelectValue?.(value) }}
                                                                                        onDelete={() => { handleDelete?.(value) }}
                                                                                        checked={selectedValues?.includes(value?.id)}
                                                                                        optionsCount={value?.options?.length}
                                                                                        updateParamAccesor={updateParamAccesor}
                                                                                        value={value}
                                                                                        style={{ color: darkMode ? 'white' : '' }}
                                                                                    />
                                                                                    :
                                                                                    accessor ?
                                                                                        value[accessor]
                                                                                        :
                                                                                        null
                                                                            }
                                                                        </CustomTableBodyCollumn>
                                                                    );
                                                                })
                                                            }
                                                        </CustomTableBodyRow>
                                                    )
                                                })
                                                :
                                                <CustomTableBodyRow>
                                                    <td className="text-center" colSpan={collumns?.length}>
                                                        <h3>No hay registros</h3>
                                                    </td>
                                                </CustomTableBodyRow>
                                    }
                                </tbody>
                            </table>

                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="dataTables_info" style={{ color: darkMode ? 'white' : '' }}>
                                    Total de registros: {total}
                                </div>
                                <div
                                    className="dataTables_paginate"
                                    style={{ maxWidth: '70%', display: 'flex' }}
                                >
                                    <button
                                        className="paginate_button previous disabled btn-sm border-none"
                                        style={{ border: 'none !important' }}
                                        onClick={() =>
                                            currentPage > 1 && changePage?.(currentPage - 1)
                                        }
                                    >
                                        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                                        Anterior
                                    </button>
                                    <span className="p-1 custom-horizontal-scrollbar scrollbar-primary" style={{ maxWidth: '54%', display: 'flex', overflowX: 'auto', background: darkMode ? 'transparent' : '' }}>
                                        {Array.from(Array(pages).keys()).map((number, i) => (
                                            <div
                                                key={i}
                                                className={`${currentPage === (i + 1) ? "current bg-primary text-white" : ""}`}
                                                onClick={() => { changePage?.(1 + number) }}
                                                style={{
                                                    marginRight: '10px',
                                                    padding: '10px 15px',
                                                    borderRadius: '10px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {1 + number}
                                            </div>
                                        ))}
                                    </span>
                                    <button
                                        className="paginate_button next disabled btn-sm"
                                        style={{ border: 'none !important' }}
                                        onClick={() =>
                                            currentPage < pages &&
                                            changePage?.(currentPage + 1)
                                        }
                                    >
                                        Siguiente
                                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <div>
                                    <div className="d-flex align-items-center">
                                        <span style={{ marginRight: 10 }}>Mostrar:</span>
                                        <select
                                            name="perPage"
                                            onChange={(e) => onPerPageChange?.(e)}
                                            value={perPage}
                                            className="form-control"
                                        >
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="200">200</option>
                                        </select>
                                        <span style={{ marginLeft: 5 }}>Registros</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default CustomTable;

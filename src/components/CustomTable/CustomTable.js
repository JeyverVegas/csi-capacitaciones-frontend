import { useFeedBack } from "../../context/FeedBackContext";
import ActionDropdown from "../ActionDropdown";
import CustomTableBodyCollumn from "./CustomTableBodyCollumn";
import CustomTableBodyRow from "./CustomTableBodyRow";
import CustomTableHeadColumn from "./CustomTableHeadColumn";
import swal from "sweetalert";
import clsx from "clsx";

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
    updateOptionString
}) => {

    const { setCustomAlertDialog } = useFeedBack();

    const handleDeleteSelected = () => {
        swal({
            title: "¿are you sure?",
            text: "¿You want to delete all selected records?",
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
            title: "¿are you sure?",
            text: `¿You want to delete ${value?.name} record?`,
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
            <div className={clsx({
                'card': variant === 'card',
            })}>

                <div className={clsx(["d-flex align-items-center"], {
                    "card-header": variant === 'card'
                })}>
                    {
                        title &&
                        <h4 className="card-title">{title}</h4>
                    }
                    {
                        !withoutGlobalActions &&
                        <div>
                            <h5>Global Acción:</h5>
                            {
                                selectedValues?.length > 0 ?
                                    <ActionDropdown entity={entity} withOutUpdate onDelete={handleDeleteSelected} />
                                    :
                                    <span>you must select at least one record</span>
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
                                                    <CustomTableHeadColumn key={i}>
                                                        <div className="custom-checkbox">
                                                            {
                                                                <Label checked={selectAll} onChange={() => { onSelectAll?.() }} />
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
                                                                        <CustomTableBodyCollumn key={i2}>
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

                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                <div className="dataTables_info">
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
                                    <span className="p-1 custom-horizontal-scrollbar scrollbar-primary" style={{ maxWidth: '54%', display: 'flex', overflowX: 'auto' }}>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default CustomTable;

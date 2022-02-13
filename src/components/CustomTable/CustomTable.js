import { Dropdown } from "react-bootstrap";
import ActionDropdown from "../ActionDropdown";
import CustomTableBodyCollumn from "./CustomTableBodyCollumn";
import CustomTableBodyRow from "./CustomTableBodyRow";
import CustomTableHeadColumn from "./CustomTableHeadColumn";

const CustomTable = ({ title, values = [], total = 0, pages, currentPage, collumns, updatePath, selectedValues, onDelete, onSelectAll, selectAll, onSelectValue, changePage }) => {
    return (
        <div className="col-12">
            <div className="card">
                <div className="card-header d-flex align-items-center">
                    <h4 className="card-title">{title}</h4>
                    <div>
                        <h5>Acciones Globales:</h5>
                        {
                            selectedValues?.length > 0 ?
                                <ActionDropdown withOutUpdate />
                                :
                                <span>debe seleccionar al menos un registro</span>
                        }
                    </div>
                </div>
                <div className="card-body">
                    <div className="w-100 table-responsive">
                        <div id="patientTable_basic_table" className="dataTables_wrapper">
                            <table
                                id="example5"
                                className="display dataTable no-footer w-100"
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
                                                                                id={value?.id}
                                                                                updatePath={updatePath}
                                                                                onChange={() => { onSelectValue?.(value) }}
                                                                                onDelete={() => { onDelete?.(value) }}
                                                                                checked={selectedValues?.includes(value?.id)}
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
                                    }
                                </tbody>
                            </table>

                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                <div className="dataTables_info">
                                    Mostrando del {`${currentPage - 1}1 al ${currentPage - 1}${values?.length}`} de {currentPage > 1 ? total : `${currentPage - 1}${total}`}
                                </div>
                                <div
                                    className="dataTables_paginate paging_simple_numbers"
                                    id="example5_paginate"
                                >
                                    <button
                                        className="paginate_button previous disabled"
                                        to="/table-datatable-basic"
                                        onClick={() =>
                                            currentPage > 0 && changePage?.(currentPage - 1)
                                        }
                                    >
                                        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
                                    </button>
                                    <span>
                                        {Array.from(Array(pages).keys()).map((number, i) => (
                                            <button
                                                key={i}
                                                className={`paginate_button  ${currentPage === (i + 1) ? "current" : ""
                                                    } `}
                                                onClick={() => { changePage?.(1 + number) }}
                                            >
                                                {1 + number}
                                            </button>
                                        ))}
                                    </span>
                                    <button
                                        className="paginate_button next"
                                        to="/table-datatable-basic"
                                        onClick={() =>
                                            currentPage < pages &&
                                            changePage?.(currentPage + 1)
                                        }
                                    >
                                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomTable;

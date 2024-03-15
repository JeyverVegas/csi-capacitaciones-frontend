const PowerBiViewsFilters = ({ filters, setFilters }) => {

    const hadleChange = (e) => {
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                [e.target.name]: e.target.value,
                page: 1
            }
        });
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-4 p-3">
                    <div className="form-group">
                        <div className="card p-3">
                            <label className="form-label">Id</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Id"
                                value={filters?.id}
                                onChange={hadleChange}
                                name="id"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-4 p-3">
                    <div className="form-group">
                        <div className="card p-3">
                            <label className="form-label">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre del usuario..."
                                value={filters?.userName}
                                onChange={hadleChange}
                                name="userName"
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-4 p-3">
                    <div className="form-group">
                        <div className="card p-3">
                            <label className="form-label">Power Bi</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre del power bi..."
                                value={filters?.powerbiTitle}
                                onChange={hadleChange}
                                name="powerbiTitle"
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 p-3">
                    <div className="card row p-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Desde</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={filters?.start}
                                    onChange={hadleChange}
                                    name="start"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="form-label">Hasta</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={filters?.end}
                                    onChange={hadleChange}
                                    name="end"
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PowerBiViewsFilters;
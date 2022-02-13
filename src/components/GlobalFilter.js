const GlobalFilter = ({ filter, setFilter }) => {
    return (
        <div>
            Search : {' '}
            <input className="ml-2 input-search form-control"
                value={filter || ''} onChange={e => setFilter(e.target.value)} style={{ width: "20%" }}
            />
        </div>
    )
}

export default GlobalFilter;
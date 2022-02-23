import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomSelect from "../../../components/CustomSelect";
import ImgUploadInput from "../../../components/ImgUploadInput";
import { useTheme } from "../../../context/ThemeContext";
import useProviders from "../../../hooks/useProviders";

const ProductsCreate = () => {
    
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        name: '',
        page: 1
    });

    const { openMenuToggle, customMenuToggle, sideBarStyle } = useTheme();
    
    const [{ providers, total, numberOfPages, size, error, loading }, getProviders] = useProviders({options: {manual: true, useCache: false}});

    useEffect(() => {
        getProviders({params: {
            ...filters
        }});
    }, [filters])

    useEffect(() => {
        customMenuToggle(true);        
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault?.();
    }

    const handleProvider = (provider) => {        
        setFilters((oldFilters) => {
            return {
                ...oldFilters,
                name: provider?.name
            }
        })
    }

    return (
        <div>
            <div className="card">                
                <div className="card-body">
                    <div className="basic-form">
                        <form onSubmit={handleSubmit}>
                            <div className="row mb-5">
                            <div className="form-group mb-3 col-md-8">
                                    <div className="mb-4">
                                        <label> 
                                            <h5>
                                                Nombre del Producto
                                            </h5>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Nombre"
                                            name="name"
                                            autoFocus                                        
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label>                                            
                                            Referencia                                            
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Referencia"
                                            name="name"                                        
                                        />
                                    </div>
                                    <div>
                                        <label>                                            
                                            Proveedor                                            
                                        </label>
                                        <CustomSelect 
                                        options={providers} 
                                        optionLabel="name" 
                                        isLoading={loading} 
                                        onSelectValue={handleProvider}
                                        handleInputChange={(e) => {setFilters((oldFilters) => {return {...oldFilters, name: e.target.value}})}}
                                        inputValue={filters?.name}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-3 col-md-4">
                                    <label>
                                        <h5>
                                           Imagen Base del Producto
                                        </h5>
                                    </label>
                                    <ImgUploadInput description="imagen del producto" name="image" style={{ width: '65%' }} />
                                </div>
                            </div>
                            <div className="mb-3 d-flex justify-content-end">
                                <Link to={`#`} onClick={() => { navigate(-1) }} className="btn btn-danger mx-2">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn btn-primary mx-2">                                    
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProductsCreate;
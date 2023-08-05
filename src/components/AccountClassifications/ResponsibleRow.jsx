import { Image } from "react-bootstrap";
import useAxios from "../../hooks/useAxios";

const ResponsibleRow = ({ index, responsible, onDelete, costCenterId }) => {

    const [{ loading: deleteLoading }, deleteResponsible] = useAxios({ url: `/cost-centers/${costCenterId}/responsibles/${responsible?.id}`, method: 'DELETE' }, { useCache: false, manual: true });

    const handleDeleteResponsible = async () => {
        try {
            const deleteResponse = await deleteResponsible();

            onDelete?.();

        } catch (error) {
            alert('Ha ocurrido un error al eliminar el responsable');
        }
    }

    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                <Image style={{ height: 50, width: 50, marginRight: 5 }} src={responsible?.user?.imagePath} roundedCircle />
                {responsible?.user?.name || '--'}
            </td>
            <td>{responsible?.user?.documentNumber || '--'}</td>
            <td>{responsible?.user?.phoneNumber || '--'}</td>
            <td>{responsible?.user?.email || '--'}</td>
            <td>{responsible?.type === 'WRITER' ? 'Editor' : 'Lector'}</td>
            <td>
                <button disabled={deleteLoading} onClick={handleDeleteResponsible} className="btn btn-danger btn-xs">
                    {
                        deleteLoading ?
                            <div className="spinner">
                                <div className="double-bounce1 bg-light"></div>
                                <div className="double-bounce2 bg-light"></div>
                            </div>
                            :
                            'Eliminar'
                    }
                </button>
            </td>
        </tr>
    )
}

export default ResponsibleRow
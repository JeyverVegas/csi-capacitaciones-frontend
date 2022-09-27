import useAxios from "../hooks/useAxios";
import { mainPermissions } from "../util/MenuLinks"
import swal from "sweetalert";
import { useFeedBack } from "../context/FeedBackContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DeleteButton = ({ entity, recordId, redirectUrl }) => {

    const { permissions } = useAuth();

    const navigate = useNavigate();

    const { setCustomAlert, setLoading } = useFeedBack();

    const [{ loading: deleteLoading }, deleteRecord] = useAxios({ url: `/${entity}/${recordId}`, method: 'DELETE' }, { useCache: false, manual: true });

    const handleDelete = () => {
        swal({
            title: "¿Estás Seguro?",
            text: "Esta acción es irreversible",
            icon: "warning",
            buttons: true,
        }).then((willDelete) => {
            if (willDelete) {
                deleteRecord().then(() => {
                    setCustomAlert({
                        message: 'El registro se ha eliminado exitosamente.',
                        show: true,
                        severity: 'success'
                    });
                    navigate(redirectUrl);
                });
            } else {

            }
        });
    }

    if (permissions?.includes(mainPermissions?.[entity]?.[3])) {
        return (
            <button disabled={deleteLoading} onClick={handleDelete} className="btn btn-block btn-danger">
                {
                    deleteLoading ? 'Cargando' : 'Eliminar'
                }
            </button>
        )
    }

    return null
}


export default DeleteButton;
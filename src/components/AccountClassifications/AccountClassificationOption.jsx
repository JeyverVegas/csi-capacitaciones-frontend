import { useEffect, useState } from "react";
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
import { FaWpforms } from "react-icons/fa";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import useAxios from "../../hooks/useAxios";
import ResponsiblesModal from "./ResponsiblesModal";
import AccountsModal from "./AccountsModal";
import AddResponsiblesModal from "./AddResponsiblesModal";
import swal from "sweetalert";


const AccountClassificationOption = ({ accountClassification, defaultValues = [], costCenterId }) => {

    const [showAccounts, setShowAccounts] = useState(false);

    const [showResponsibles, setShowResponsibles] = useState(false);

    const [showAddResponsible, setShowAddResponsible] = useState(false);

    const [checked, setChecked] = useState(false);

    const [{ data, loading }, toggleAccountClassification] = useAxios({ url: `/cost-centers/account-classifications/toggle`, method: 'PUT' }, { manual: true, useCache: false });

    useEffect(() => {
        if (defaultValues.includes(accountClassification?.id)) setChecked(true);
    }, [defaultValues])

    const handleChange = async (e) => {

        try {

            if (!e.target.checked) {
                const wantDelete = await swal({
                    title: "¿Estás Seguro?",
                    text: "Esto eliminara todos los responsables y tendras que volver a asignarlos luego.",
                    icon: "warning",
                    buttons: true,
                });

                if (!wantDelete) return;
            }

            await toggleAccountClassification({
                data: {
                    costCenterId,
                    accountClassificationId: accountClassification?.id
                }
            });

            setChecked((old) => !old);

        } catch (error) {
            alert('Ha ocurrido un error');
        }
    }

    return (
        <li className="d-flex align-items-center py-2 justify-content-between" style={{ borderBottom: '1px solid' }}>
            <label
                className="d-flex align-items-center cursor-pointer"
            >
                <input
                    onChange={handleChange}
                    checked={checked}
                    type="checkbox"
                    style={{ borderRadius: '100%', height: 20, width: 20, marginRight: 5 }}
                />
                <span>
                    {accountClassification?.name}
                </span>
            </label>
            <div>
                {
                    checked &&
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-outline-primary"
                            style={{ marginRight: 10 }}
                            onClick={() => setShowAddResponsible(oldValue => !oldValue)}
                            title="Asignar responsable"
                        >
                            <BsFillPersonPlusFill />
                        </button>
                        <button className="btn btn-outline-primary" style={{ marginRight: 10 }} onClick={() => setShowResponsibles(oldValue => !oldValue)} title="Ver responsables">
                            <HiUserGroup />
                        </button>
                        <button className="btn btn-outline-primary" onClick={() => setShowAccounts(oldValue => !oldValue)} title="Ver cuentas">
                            <FaWpforms />
                        </button>
                    </div>
                }
            </div>
            <ResponsiblesModal
                costCenterId={costCenterId}
                accountClassification={accountClassification}
                show={showResponsibles}
                onClose={() => setShowResponsibles(oldValue => !oldValue)}
            />

            <AddResponsiblesModal
                costCenterId={costCenterId}
                accountClassification={accountClassification}
                show={showAddResponsible}
                onClose={() => setShowAddResponsible(oldValue => !oldValue)}
            />


            <AccountsModal
                costCenterId={costCenterId}
                accountClassification={accountClassification}
                show={showAccounts}
                onClose={() => setShowAccounts(oldValue => !oldValue)}
            />
        </li>
    )
}

export default AccountClassificationOption;
import fileDownload from "js-file-download";
import useAxios from "../hooks/useAxios";
import { useAuth } from "../context/AuthContext";

const PlanningProcessHistoryLi = ({ planningProcess }) => {

    const { user } = useAuth();

    const [{ loading: loadingPlanExport }, exportPlanExcel] = useAxios({ url: `/my-account/planning-processes/${planningProcess?.id}/excel`, responseType: 'blob' }, { useCache: false, manual: true })

    const [{ loading: loadingPlanKpiExport }, exportPlanKpiExcel] = useAxios({ url: `/my-account/planning-processes/${planningProcess?.id}/kpi/excel`, responseType: 'blob' }, { useCache: false, manual: true })

    const handleExport = async (e) => {
        try {
            const exportPlanExcelResponse = await exportPlanExcel();

            fileDownload(exportPlanExcelResponse?.data, `Planificación de gastos (Resumen) - ${user?.name} - ${planningProcess?.for_year}.xlsx`);

        } catch (error) {
            alert('Ha ocurrido un error al descargar el excel.');
        }
    }

    const handleExportKpi = async (e) => {
        try {
            const exportPlanKpiExcelResponse = await exportPlanKpiExcel();

            fileDownload(exportPlanKpiExcelResponse?.data, `Planificación de gastos (KPI) - ${user?.name} - ${planningProcess?.for_year}.xlsx`);

        } catch (error) {
            alert('Ha ocurrido un error al descargar el excel.');
        }
    }

    return (
        <li className="mb-3">
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    {planningProcess?.for_year}
                </div>
                <div>
                    <button disabled={loadingPlanKpiExport} onClick={handleExportKpi} className="btn btn-success btn-xs mx-2">
                        {
                            loadingPlanKpiExport ?
                                'Cargando...'
                                :
                                'Descargar KPI'
                        }
                    </button>
                    <button disabled={loadingPlanExport} onClick={handleExport} className="btn btn-success btn-xs mx-2">
                        {
                            loadingPlanExport ?
                                'Cargando...'
                                :
                                'Descargar Resumen'
                        }
                    </button>
                </div>
            </div>
        </li>
    )
}

export default PlanningProcessHistoryLi
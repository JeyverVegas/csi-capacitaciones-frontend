import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";

const ProgressComponent = ({ value }) => {

    const [tasksInfo, setTaskInfo] = useState({
        completeTasks: 0,
        inCompleteTasks: 0,
        total: 0,
        percent: 0
    });

    useEffect(() => {
        if (value?.steps?.length > 0) {
            var completeTasks = 0;
            var inCompleteTasks = 0;
            value?.steps?.forEach((step, i) => {
                step?.activities?.forEach((activity, i) => {
                    if (activity?.checked) {
                        completeTasks = completeTasks + 1;
                    } else {
                        inCompleteTasks = inCompleteTasks + 1;
                    };
                });
            });

            var total = inCompleteTasks + completeTasks;

            var percent = (completeTasks / total) * 100;

            setTaskInfo({
                inCompleteTasks,
                completeTasks,
                total,
                percent: percent?.toFixed(2)
            });
        }
    }, [value]);

    return (
        <div className="text-center">
            <p>Progreso {tasksInfo?.percent ?? 0}%</p>
            <ProgressBar
                now={tasksInfo?.percent}
                variant={'primary'}
            />
        </div>
    )
}

export default ProgressComponent;
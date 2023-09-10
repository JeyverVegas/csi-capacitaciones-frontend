import { useEffect } from "react";
import { useFeedBack } from "../../context/FeedBackContext";
import LoadingComponent from "./LoadingComponent";
import { ToastContainer, toast } from "react-toastify";

const FeedbackComponents = () => {

    const { customLoading, customToast, setCustomToast } = useFeedBack();

    useEffect(() => {
        if (customToast.show) {
            showToast(customToast);
        }
    }, [customToast]);

    const showToast = (toastData) => {
        const defaultOpts = {
            onClose: setCustomToast({ message: '', severity: '', show: false, position: '' }),
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        }

        switch (toastData.severity) {
            case 'success':
                toast.success(toastData.message, {
                    ...defaultOpts,
                    position: toastData?.position
                });
                break;
            case 'warning':
                toast.warn(toastData.message, {
                    ...defaultOpts,
                    position: toastData?.position
                });
                break;
            case 'primary':
                toast(toastData.message, {
                    ...defaultOpts,
                    position: toastData?.position
                });
                break;
            case 'danger':
                toast.error(toastData.message, {
                    ...defaultOpts,
                    position: toastData?.position
                });
                break;
        }
    };

    return (
        <>
            <LoadingComponent message={customLoading?.message} secondMessage={customLoading?.secondMessage} show={customLoading?.show} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default FeedbackComponents;
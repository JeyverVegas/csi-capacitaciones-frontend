import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

const ExportButtons = ({ order }) => {

    const [{ data: generateFileData }, generateFile] = useAxios({ responseType: 'blob' }, { useCache: false, manual: true });

    useEffect(() => {
        if (generateFileData) {
            handleBlobResponse(generateFileData);
        }
    }, [generateFileData])

    const handleGenerate = (fileType) => {
        generateFile({ url: `orders/${order?.id}/${fileType}` });
    }

    const handleBlobResponse = (blobResponse) => {
        const fileBlobUrl = URL.createObjectURL(blobResponse);
        const aToDownload = document.getElementById('downloadLink');
        aToDownload.href = fileBlobUrl;
        aToDownload.download = `pedido-${order?.id}`;
        aToDownload?.click();
        window.URL.revokeObjectURL(fileBlobUrl);
    }

    return (
        <div>
            <a id="downloadLink" download={`pedido-${order?.id}`} style={{ display: 'none' }}></a>
            <h4>Exportar a:</h4>
            <button onClick={() => handleGenerate('excel')} className="btn btn-success mx-2">
                EXCEL
            </button>
            <button onClick={() => handleGenerate('pdf')} className="btn btn-danger mx-2">
                PDF
            </button>
        </div>
    )
}

export default ExportButtons;
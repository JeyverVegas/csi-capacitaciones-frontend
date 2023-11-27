import { useParams } from "react-router-dom";
import useAxios from "../../../hooks/useAxios";
import { useEffect, useState } from "react";
import SystemInfo from "../../../util/SystemInfo";

const PowerBiDetail = () => {

    const { id } = useParams();

    const [title, setTitle] = useState("");

    const [{ data: data, loading: loading }, getPowerBi] = useAxios({ url: `/power-bi/${id}/detail` }, { useCache: false });

    useEffect(() => {

        if (data) {
            setTitle(document.querySelector('title').textContent);
            document.querySelector('title').textContent = `${data?.data?.title} | ${SystemInfo?.name}`;
        } else {
            if (title) {
                document.querySelector('title').textContent = title;
            } else {
                document.querySelector('title').textContent = SystemInfo?.name;
            }
        }

    }, [data])

    return (
        <div>
            <h2 className="mb-5 text-primary">
                {data?.data?.title}
            </h2>
            <iframe style={{ width: '100%', minHeight: '100vh' }} src={data?.data?.url} frameborder="0" />
        </div>
    )
}
export default PowerBiDetail;
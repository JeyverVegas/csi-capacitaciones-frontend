import SystemInfo from "../util/SystemInfo";

const ImageAndName = ({ nameValue, imgValue }) => {
    let haveImage = false;
    if (imgValue !== '/storage/') haveImage = true;
    return (
        <div className="text-center d-flex align-items-center">
            {
                haveImage ?
                    <img
                        src={`${SystemInfo?.host}${imgValue}`}
                        className="rounded-lg"
                        width="36"
                        height={"36"}
                        alt="profile-image"
                    />
                    :
                    null
            }
            <span className="w-space-no mx-1">{nameValue ? nameValue : ''}</span>
        </div>
    )
}

export default ImageAndName;
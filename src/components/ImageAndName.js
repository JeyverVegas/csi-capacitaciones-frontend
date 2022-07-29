import SystemInfo from "../util/SystemInfo";

const ImageAndName = ({ nameValue, imgValue, value }) => {
    let haveImage = false;
    if (imgValue !== '/storage/') haveImage = true;
    return (
        <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            {
                haveImage ?
                    <img
                        src={`${SystemInfo?.host}${value?.imagePath ? value?.imagePath : imgValue}`}
                        style={{ borderRadius: '100%' }}
                        width="36"
                        height={"36"}
                        alt="profile-image"
                    />
                    :
                    null
            }
            <span style={{ margin: '0px 10px' }}>{nameValue ? nameValue : ''}</span>
        </div>
    )
}

export default ImageAndName;
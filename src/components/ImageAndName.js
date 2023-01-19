import imgUrl from "../util/imgUrl";

const ImageAndName = ({ nameValue, imgValue, value }) => {
    return (
        <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <img
                src={imgUrl(value?.imagePath)}
                style={{ borderRadius: '100%' }}
                width="36"
                height={"36"}
                alt="profile-image"
            />
            <span style={{ margin: '0px 10px' }}>{nameValue ? nameValue : ''}</span>
        </div>
    )
}

export default ImageAndName;
const ImageAndName = ({ nameValue, imgValue }) => {
    console.log(imgValue);
    return (
        <div className="text-center d-flex align-items-center">
            <img
                src={imgValue}
                className="rounded-lg"
                width="36"
                height={"36"}
                alt="profile-image"
            />
            <span className="w-space-no mx-1">{nameValue ? nameValue : ''}</span>
        </div>
    )
}

export default ImageAndName;
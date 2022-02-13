const ImageAndName = ({ nameValue, imgValue }) => {
    return (
        <div className="text-center d-flex align-items-center">
            <img
                src={imgValue ? imgValue : `https://api.tubeneficiosi.com/uploads/users/1639515450584-905483204.jpg`}
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
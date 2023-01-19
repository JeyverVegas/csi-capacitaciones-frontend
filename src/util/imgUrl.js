import notImageFound from "../images/not-image.jpg";

export default (path, defaultPath = null) => {
    if (!path) {
        if (!defaultPath) {
            return notImageFound;
        }
        return defaultPath;
    }

    return path;
}
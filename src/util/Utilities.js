export const cutString = (string, length, start, decorator) => {
    return string?.length > length ? `${string?.slice(start || 0, length)}${decorator}` : string;
}
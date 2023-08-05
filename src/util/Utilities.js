export const cutString = (string, length, start, decorator) => {
    return string?.length > length ? `${string?.slice(start || 0, length)}${decorator}` : string;
}


export const dateFine = (date) => {
    const newDateSplited = date?.split('T');

    const day = newDateSplited?.[0];

    const hour = newDateSplited?.[1].split('.')?.[0];

    return `${day} ${hour}`;
}


export const generateArray = (numberOfItems = 1, startAt = 0) => {
    const arrayOfNumbers = [...Array(numberOfItems + startAt).keys()];

    return arrayOfNumbers.slice(startAt);
}
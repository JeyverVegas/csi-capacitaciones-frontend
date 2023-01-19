const env = (varName) => {
    return process.env[`REACT_APP_${varName}`];
}

export default env;
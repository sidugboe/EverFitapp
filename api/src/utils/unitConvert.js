const mToFt = 3.28084;
const kgToLbs = 2.20462;

const convertToLbs = kg => {
    return kg * kgToLbs;
};

const convertToKg = lbs => {
    return lbs / kgToLbs;
};

const convertToM = ft => {
    return ft / mToFt;
};

const convertToFt = m => {
    return m * mToFt;
};

module.exports = {
    convertToM,
    convertToFt,
    convertToKg,
    convertToLbs,
};


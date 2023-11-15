/**
 * helper function for feed - sorts by most recent first
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
const compare = (b, a) => {
    const d1 = new Date(a.date);
    const d2 = new Date(b.date);

    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
};

module.exports = compare;
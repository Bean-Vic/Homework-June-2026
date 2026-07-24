/**
 * @param {string[]} strs
 * @return {string[][]}
 */
const groupAnagrams = function(strs) {
    const map = strs.reduce((acc, s) => {
        const key = s.split('').sort().join('');
        (acc[key] ||= []).push(s);
        return acc;
    }, {});

    return Object.values(map);
};
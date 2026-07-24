/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
const merge = function(intervals) {
    if (intervals.length === 0) return [];

    intervals.sort((a, b) => a[0] - b[0]);
    
    let s = intervals[0][0];
    let p = intervals[0][1];
    const arr = [];
    
    for (let j = 1; j < intervals.length; j++) {
        if (intervals[j][0] <= p) {
            p = Math.max(p, intervals[j][1]);
        } else {
            arr.push([s, p]);
            s = intervals[j][0];
            p = intervals[j][1];
        }
    }

    arr.push([s, p]);
    return arr;
};
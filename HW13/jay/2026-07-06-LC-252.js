/**
 * @param {number[][]} intervals
 * @return {boolean}
 */
var canAttendMeetings = function(intervals) {
    intervals.sort((a, b) => a[0] - b[0]);

    let prevEnd = -Infinity;

    for (const [curStart, curEnd] of intervals) {
        if (curStart < prevEnd) {
            return false;
        }
        prevEnd = curEnd;
    }

    return true;   
};
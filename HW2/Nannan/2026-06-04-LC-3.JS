// 3. Longest substring without repeating characters

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // 边界处理
    if (s.length === 0) return 0;

    const window = new Set();   // 记录窗口里有哪些字符
    let left = 0;               // 左指针
    let longest = 0;            // 答案

    // 右指针从左到右扫
    for (let right = 0; right < s.length; right++) {
        // 当前要加入的字符
        const ch = s[right];

        // 如果窗口里已经有这个字符，不断从左边缩小窗口
        while (window.has(ch)) {
            window.delete(s[left]);
            left++;
        }

        // 加入当前字符
        window.add(ch);

        // 更新最长长度（窗口长度 = right - left + 1）
        longest = Math.max(longest, right - left + 1);
    }

    return longest;
};

// 时间 O(n)  空间 O(min(n, k))


// sliding window template
// function slidingWindow(s) {
//     let left = 0;
//     let answer = 0;
//     // 用合适的数据结构记录窗口状态
//     // - 字符种类问题用 Map 或 Set
//     // - 数值和问题用 number
//     const window = new Map();   // 或 new Set()

//     for (let right = 0; right < s.length; right++) {
//         // 1. 把 s[right] 加入窗口
//         // （根据题目，可能要先判断/计数）

//         // 2. 窗口不合法时，从左边缩
//         while (/* 窗口不合法的条件 */) {
//             // 把 s[left] 移出窗口
//             left++;
//         }

//         // 3. 更新答案（此时窗口合法）
//         answer = Math.max(answer, right - left + 1);
//     }

//     return answer;
// }

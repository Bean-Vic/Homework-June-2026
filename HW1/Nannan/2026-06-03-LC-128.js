// 128. Longest Consecutive Sequence

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    // ========== 1. 边界处理 ==========
    // 判断数组为空：用 .length === 0
    // 也可以写 if (!nums || nums.length === 0)
    if (nums.length === 0) return 0;

    // ========== 2. 创建 Set ==========
    // new Set(数组) 可以直接把数组转成 Set，自动去重
    const numSet = new Set(nums);

    // ========== 3. 声明变量 ==========
    // const: 常量，不能重新赋值（但对象/数组内容可以改）
    // let:   变量，可以重新赋值
    // var:   旧语法，基本不用了
    let longest = 0;

    // ========== 4. 遍历 Set ==========
    // for...of 用于遍历可迭代对象（Set, Array, Map, String）
    // for...in  是遍历对象的 key，不要用在数组/Set 上！容易出 bug
    for (const num of numSet) {

        // ========== 5. Set 的常用方法 ==========
        // numSet.has(x)    检查是否存在，返回 true/false  —— O(1)
        // numSet.add(x)    添加元素
        // numSet.delete(x) 删除元素
        // numSet.size      元素个数（注意是属性，不是方法，没有括号！）

        // 取反用 ! ，相当于 Python 的 not
        if (!numSet.has(num - 1)) {
            let current = num;
            let currentLength = 1;

            // while 循环语法和其他语言一样
            while (numSet.has(current + 1)) {
                current += 1;        // 也可以写 current++
                currentLength += 1;
            }

            // ========== 6. 取最大值 ==========
            // Math.max(a, b) 返回较大值
            // Math.min(a, b) 返回较小值
            // 注意：Math.max(...arr) 才能对数组取最大值（要用扩展运算符）
            longest = Math.max(longest, currentLength);
        }
    }

    return longest;
}

// O(n)/O(n)

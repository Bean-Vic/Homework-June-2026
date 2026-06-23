/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */

function rev(head) {
    let pre = null;
    let cur = head;
    
    while (cur !== null) {
        let nxt = cur.next;
        cur.next = pre;
        pre = cur;
        cur = nxt;
    }

    if (head !== null) {
        head.next = null;
    }
    
    return pre;
}

var reorderList = function(head) {
    if (head === null || head.next === null || head.next.next === null) return;
        
    let fast = head, slow = head;
    while (fast !== null && fast.next !== null) {
        fast = fast.next.next;
        slow = slow.next;
    }

    let tail = rev(slow.next);
    slow.next = null;
    
    let tempi, tempj;
    while (tail !== null && head !== null) {
        tempi = head.next;
        tempj = tail.next;
        
        head.next = tail;
        tail.next = tempi;
        
        head = tempi;
        tail = tempj;
    }
};

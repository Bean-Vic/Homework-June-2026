/**
 * LeetCode 23. Merge k Sorted Lists
 *
 * Time:  O(N log k), where N is the total number of nodes
 * Space: O(k), for the min-heap
 */

class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

class MinHeap {
    private heap: ListNode[] = [];

    size(): number {
        return this.heap.length;
    }

    push(node: ListNode): void {
        this.heap.push(node);
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): ListNode | null {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop()!;

        const minNode = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.bubbleDown(0);

        return minNode;
    }

    private bubbleUp(index: number): void {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);

            if (this.heap[parent].val <= this.heap[index].val) break;

            [this.heap[parent], this.heap[index]] = [this.heap[index], this.heap[parent]];
            index = parent;
        }
    }

    private bubbleDown(index: number): void {
        const n = this.heap.length;

        while (true) {
            let smallest = index;
            const left = index * 2 + 1;
            const right = index * 2 + 2;

            if (left < n && this.heap[left].val < this.heap[smallest].val) {
                smallest = left;
            }

            if (right < n && this.heap[right].val < this.heap[smallest].val) {
                smallest = right;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const heap = new MinHeap();

    for (const head of lists) {
        if (head !== null) {
            heap.push(head);
        }
    }

    const dummy = new ListNode(0);
    let current = dummy;

    while (heap.size() > 0) {
        const smallest = heap.pop()!;
        current.next = smallest;
        current = current.next;

        if (smallest.next !== null) {
            heap.push(smallest.next);
        }
    }

    return dummy.next;
}

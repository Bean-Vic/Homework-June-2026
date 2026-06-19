function reorderList(head) {
  if (head === null || head.next === null) {
    return;
  }

  let slow = head;
  let fast = head;

  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  let second = slow.next;
  slow.next = null;
  let previous = null;

  while (second !== null) {
    const nextNode = second.next;
    second.next = previous;
    previous = second;
    second = nextNode;
  }

  let first = head;
  second = previous;

  while (second !== null) {
    const firstNext = first.next;
    const secondNext = second.next;

    first.next = second;
    second.next = firstNext;

    first = firstNext;
    second = secondNext;
  }
}

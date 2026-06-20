function mergeKLists(lists) {
  if (lists.length === 0) {
    return null;
  }

  function mergeTwoLists(list1, list2) {
    const dummy = new ListNode(0);
    let current = dummy;

    while (list1 !== null && list2 !== null) {
      if (list1.val <= list2.val) {
        current.next = list1;
        list1 = list1.next;
      } else {
        current.next = list2;
        list2 = list2.next;
      }

      current = current.next;
    }

    current.next = list1 !== null ? list1 : list2;

    return dummy.next;
  }

  while (lists.length > 1) {
    const mergedLists = [];

    for (let i = 0; i < lists.length; i += 2) {
      const list1 = lists[i];
      const list2 = i + 1 < lists.length ? lists[i + 1] : null;
      mergedLists.push(mergeTwoLists(list1, list2));
    }

    lists = mergedLists;
  }

  return lists[0];
}

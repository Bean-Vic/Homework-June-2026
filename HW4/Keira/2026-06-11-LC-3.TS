function lengthOfLongestSubstring(s: string): number {
    const lastSeen = new Map<string, number>();
    let left = 0;
    let longest = 0;

    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        const previousIndex = lastSeen.get(char);

        if (previousIndex !== undefined && previousIndex >= left) {
            left = previousIndex + 1;
        }

        lastSeen.set(char, right);
        longest = Math.max(longest, right - left + 1);
    }

    return longest;
}

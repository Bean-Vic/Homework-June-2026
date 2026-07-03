


/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */

/*
feeling it's better if i remember method of Map().
.get().
.get().push().
.has().
.set(node1,[]).
*/
var validTree = function(n, edges) {
    if (edges.length !== n - 1) {
        return false;
    }

    let hashmap = new Map();
    // no defaultdict() in js.

    for (let i = 0; i < n; i++) {
        hashmap.set(i, []);
        // set() is a statement, thus append with `;`.
    }

    for (const [node1, node2] of edges) {
    // js has no `in`. /
    // use `of`.
        hashmap.get(node1).push(node2);
        hashmap.get(node2).push(node1);
        // .get().push() is a statement, thus append with `;`.
    }
    
    let seen = new Set();
    // have to use new. /
    // java all over again.

    function dfs(node,par) {
        if (seen.has(node)){
            return false;
        }
        seen.add(node);
        for (const nodeNext of hashmap.get(node)) {
            if (nodeNext === par){
                continue;
            }
            if (!dfs(nodeNext,node)){
                return false;
            }
        }
        return true;
    };

    return dfs(0,-1) && seen.size===n;

};
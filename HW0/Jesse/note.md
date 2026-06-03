
1. git fetch vs git pull:
    git fetch downloads changes from the remote repository without modifying my local branch, while git pull downloads changes and immediately merges or rebases them into my current branch.
    
2. git merge vs git rebase:
    git merge combines branches while keeping the original commit history, while git rebase moves my commits on top of another branch to create a cleaner linear history; merge is safer for shared branches, but rebase makes history easier to read.
    
3. How to resolve merge conflicts:
    I resolve merge conflicts by opening the conflicted files, choosing or combining the correct changes, removing conflict markers, then staging the files and completing the merge or rebase.
    
4. Purpose of gitignore:
    .gitignore tells Git which files or folders should not be tracked, such as build files, logs, dependencies, or local environment files.
    
5. Undo a pushed commit:
    If a commit has already been pushed, I usually use git revert to create a new commit that safely reverses the changes without rewriting shared history.
    
6. Common Git commands:
    Common Git commands include git init, git clone, git status, git add, git commit, git branch, git checkout or git switch, git fetch, git pull, git push, git merge, git rebase, git log, and git revert.
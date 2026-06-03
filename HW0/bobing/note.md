1. What is the difference between `git fetch` and `git pull`?
   1. `git fetch` downloads the latest changes from remote, but does **not** change my local branch.
   2. `git pull` \= `git fetch` \+ `git merge` (or rebase). It updates my local branch immediately.

2. What is the difference between `git merge` and `git rebase`? Pros and Cons?
   1. `git merge` combines two branches and keeps the original branch history by creating a merge commit.
      1. Pros: Safe, Easy to understand, Good for team collaboration
      2. Cons: History can become messy
   2. `git rebase` rewrites commit history by replaying commits on top of another branch to create a cleaner linear history.
      1. Pros: Cleaner commit history, Easier to read
      2. Cons: Rewrites history, Dangerous on shared branches

3. How do you resolve merge conflicts in Git?
   1. Pull or merge the branch.
   2. Git shows conflicted files.
   3. Open the files and manually fix conflicts.
   4. Remove conflict markers:
   5. Stage the files
   6. Complete the merge
   
4. What is the purpose of `.gitignore`?
   1. `.gitignore` tells Git which files or folders should not be tracked.
      1. `node_modules`
      2. build files
      3. `.env`
      4. logs

5. How do you undo a commit that has already been pushed?
   1. Usually I use: git revert \<commit-id\>
   2. It creates a new commit that reverses the old commit safely.

6. Can you give me some common Git commands?
   1. `git clone` copy repo
   2. `git status` check status of the current branch
   3. `git commit` \-m "message" commit changes and add messages
   4. `git push` push to remote
   5. `git fetch` get branches from remote
   6. `git merge` merge feature branches to the main branch
   7. `git checkout` switch between branches
   8. `git add .`
   9. `git pull`
   10. `git rebase`
   11. `git log`
   12. `git stash`
   13. `git reset`
   14. `git revert`

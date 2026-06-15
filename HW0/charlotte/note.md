# HW0 Notes

## 1. What is the difference between git fetch and git pull?

`git fetch` only downloads the latest changes from the remote repository, but it does not change my local code.

`git pull` downloads the latest changes and merges them into my current branch. So `git pull` is basically `git fetch` plus merge.

## 2. What is the difference between git merge and git rebase? Pro and Cons?

`git merge` combines another branch into my current branch and keeps the branch history. It is safe and easy to understand, but the history can become messy if there are many merge commits.

`git rebase` moves my commits on top of another branch. It makes the history cleaner, but it can be risky if the branch has already been pushed and shared with other people.

## 3. How do you resolve merge conflicts in Git?

First, I open the conflicted files and check the parts marked by Git. Then I decide which code to keep, or combine both changes if needed.

After fixing the file, I save it, run the project if necessary, then use `git add` and commit the resolved changes.

## 4. What is the purpose of .gitignore?

`.gitignore` tells Git which files should not be tracked.

For example, we usually ignore `node_modules`, `.DS_Store`, build files, and local editor settings, because they are not part of the real source code.

## 5. How do you undo a commit that has already been pushed?

If the commit has already been pushed, the safer way is to use `git revert`.

`git revert` creates a new commit that cancels the old commit. It does not rewrite shared history, so it is safer when working with a team.

## 6. Can you give me some common git commands?

Some common Git commands are:

- `git status`: check current file changes
- `git add`: stage files
- `git commit`: save changes locally
- `git push`: upload local commits to GitHub
- `git pull`: get and merge remote changes
- `git branch`: check or create branches
- `git checkout`: switch branches
- `git log`: check commit history

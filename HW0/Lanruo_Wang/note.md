# 问答练习

## 1. What is the difference between git fetch and git pull?

`git fetch` downloads the latest changes from the remote repository, but it does not change my local working branch automatically.

`git pull` does two steps: it fetches the latest changes and then merges them into my current branch.

So I usually use `git fetch` when I want to check remote updates first, and I use `git pull` when I am ready to update my local branch directly.

---

## 2. What is the difference between git merge and git rebase? Pro and Cons?

`git merge` combines another branch into the current branch and keeps the original commit history. It may create a merge commit.

The advantage of merge is that it is safe and preserves the real project history. The disadvantage is that the history can become messy if there are many merge commits.

`git rebase` moves my commits on top of another branch, so the history looks cleaner and more linear.

The advantage of rebase is a cleaner commit history. The disadvantage is that it rewrites commit history, so I should avoid rebasing shared branches that other people are already using.

---

## 3. How do you resolve merge conflicts in Git?

When there is a merge conflict, I first run `git status` to see which files have conflicts.

Then I open the conflicted files, check the conflict markers, and decide which changes should be kept.

After editing the files, I save them, run `git add`, and then complete the merge with `git commit`.

If I am not sure about the correct change, I will communicate with the team before committing.

---

## 4. What is the purpose of .gitignore?

`.gitignore` tells Git which files or folders should not be tracked.

For example, we usually ignore files like `node_modules`, `.DS_Store`, log files, environment files, and build output folders.

This helps keep the repository clean and avoids pushing unnecessary or sensitive files to GitHub.

---

## 5. How do you undo a commit that has already been pushed?

If the commit has already been pushed to a shared remote branch, the safer way is to use `git revert`.

`git revert` creates a new commit that reverses the previous commit, without changing the existing commit history.

For example, I can run `git revert <commit-id>` and then push the new revert commit.

I should avoid using `git reset --hard` on a shared branch because it rewrites history and may affect other teammates.

---

## 6. Can you give me some common git commands?

`git status` checks the current working tree status.

`git add` stages files for commit.

`git commit -m "message"` creates a new commit.

`git push` uploads local commits to the remote repository.

`git pull` gets the latest remote changes and merges them into the current branch.

`git branch` shows local branches.

`git checkout -b branch-name` creates and switches to a new branch.

`git merge branch-name` merges another branch into the current branch.

`git log` checks commit history.

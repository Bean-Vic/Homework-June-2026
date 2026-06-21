# Interview Questions on Git

## 1. What is the difference between `git fetch` and `git pull`?

 `git fetch` and `git pull` are both used for the local repository to get updates from a remote repository. The difference is that, with `git fetch`, Git downloads the latest commits of the remote repository, and updates my remote-tracking branches, like `origin/main`. It does not affect my current local branch or working files.

 But on the other hand, `git pull` does more. It not only fetches the updates just like what `git fetch` does, it also integrates those updates into my current working branch by using a `merge` by default, or a `rebase`.

## 2. What is the difference between `git merge` and `git rebase`? Pro and Cons?

 Both `git merge` and `git rebase` are used to integrate changes of two branches. With `git merge`, Git creates a new commit that combines the changes from both branches, and this new commit points to the tip of both branches as its parents.

 With `git rebase`, Git takes the commits from one branch and replays them on top of the target branch. The adventage of `git rebase` is that it produces a linear history, which looks cleaner. But `git rebase` rewrites the commit history, since the old commits are replaced by new commits with new parents. In this case, if there are people whose work was based on those old commits, they may run into complications when syncing their work with the rebased branch. In comparison, `git merge` is safer for collaboration because it preserves the existing commits and the branch history.

## 3. How do you resolve merge conflicts in Git?

 When running into a merge conflict, the Source Control panel in VS Code will show me the files with confliction. I will use the merge editor to compare the current change and the incoming change, and decide which one to keep, or to keep both, or to come up with a new combined solution. I will make sure all the conflict markers are gone; and I will review and test the affected files. Then I can go ahead to stage these files and complete the merge.

## 4. What is the purpose of `.gitignore`?

 `.gitignore` is used to tell Git which files or folders should be ignored in the version control. For example, there will be files like the environment variable, or there will be folders containing dependency of the franework you are using, and you should not upload them to GitHub, and it is not necessary to track the changes in these files so you can add them to `.gitignore` so that they will not be added to commits.

## 5. How do you undo a commit that has already been pushed?

 I will use `git revert` to create a new commit that undoes the changes introduced by that commit. It will bring the files to the status as if that unwanted commit had not happened, and I can go on and base my work on this newly created revert commit.

## 6. Can you give me some common git commands?

 I'll start with...

- `git clone`, this is the starting point of working on a GitHub project locally.
- `git init`, this is the command to initialize the git source control in your local project folder.
- `git add`, is used to pick the files whose changes you want to include in the commit; and `git commit`, is to create a snapshot of the file status.
- `git switch` to switch between different branched.
- `git push` to update the remote branch with commits in local branch, and `git pull` is the other way around.

...just to name a few.

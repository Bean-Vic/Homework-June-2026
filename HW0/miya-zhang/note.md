## 1. What is the difference between git fetch and git pull?

git fetch only gets the latest changes from the remote repository, but it does not change my local branch.
git pull gets the latest changes and also updates my current branch.
So I usually use git fetch when I want to check the changes first. I use git pull when I want to update my local branch directly. That is the main difference for me.

## 2. What is the difference between git merge and git rebase? Pros and Cons?

git merge combines another branch into my current branch. It keeps the real history, but sometimes the commit history can look a little messy. git rebase moves my commits on top of another branch. It makes the history cleaner and easier to read. But rebase rewrites history, so I need to be careful, especially if the branch is already shared with other people.
In my daily work, I prefer merge for team branches, and rebase for my own local branch.

## 3. How do you resolve merge conflicts in Git?

First, I run git status to check which files have conflicts. Then I open the conflicted files and look for the conflict markers. I compare my changes and the other branch changes. After that, I decide what to keep, remove the conflict markers, and save the file. Then I run git add and git commit. If I am doing rebase, I run git rebase --continue. Finally, I usually run the project or tests to make sure everything still works.

## 4. What is the purpose of .gitignore?

.gitignore tells Git which files or folders should not be tracked. For example, I usually ignore files like node_modules, .env, log files, or local setting files. This helps keep the repository clean. It also helps avoid pushing private information, like passwords or API keys. So .gitignore is useful for keeping the project safe and clean.

## 5. How do you undo a commit that has already been pushed?

If the commit has already been pushed, I usually use git revert.
git revert creates a new commit to undo the old commit. It is safer because it does not rewrite the history.
I know git reset and force push can also remove a commit, but I would be careful with that because it may affect other teammates. In a team project, I prefer to use git revert.

## 6. Can you give me some common git commands?

Yes. Some common Git commands I use are git status, git add, git commit, git push, and git pull.
I usually use git status to check what changed, then use git add and git commit to save my work. After that, I use git push to upload my changes to GitHub. If I need the latest code from others, I use git pull.
I also use git branch and git checkout when I need to work on different branches. These are the commands I use most often.


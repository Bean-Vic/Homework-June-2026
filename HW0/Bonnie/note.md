1. What is the difference between git fetch and git pull?
git fetch: it updates remote tracking branches
git pull: it's equality to git fetch + git merge and also merges the changes into my current branch, so it may change the working branch directly

2. What is the difference between git merge and git rebase? Pro and Cons?

Merge preserves the original branch history, while rebase rewrites history to make commits look linear. I usually use rebase for my local feature branch, and merge for shared branches to avoid rewriting others’ history

3. How do you resolve merge conflicts in Git?
Use'git status'to identify conflicted files. 
Then I open the files, compare both versions, manually keep the correct code, remove conflict markers, test the project, 
then run git add and either commit or continue the rebase.

4. What is the purpose of .gitignore?
.gitignore prevents unnecessary files from being committed, such as dependencies, build outputs, environment variables, logs, and IDE files.

5. How do you undo a commit that has already been pushed?
use git revert
because it creates a new commit to undo the changes without rewriting shared history. I avoid reset --hard and force push unless the team agrees.

6. Can you give me some common git commands
git pull
git commit
git rebase
git checkout branchname
git diff

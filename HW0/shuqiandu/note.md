1. What is the difference between git fetch and git pull?
   git fetch: Downloads remote updates but does not modify your working directory. It is safe.
   git pull: Downloads remote updates and merges them into your current branch(git fetch + git merge).

2. What is the difference between git merge and git rebase? Pro and Cons?
   git merge: combines branches by creating a new merge commit.
   pros: keeps complete history, not destructive.
   cons: creates a messy and cluttered history graph.
   git rebase: moves the branch commits on top of the target branch, rewriting history.
   pros: keeps a linear and clean project history.
   cons: rewrites history, dangerous on shared branches, hard to resolve complex conflicts.

3. How do you resolve merge conflicts in Git?
4. run git status to locate conflict files;
5. open files and delete conflict markers;
6. choose which code to keep then save the files;
7. run git add to stage the resolved files;
8. run git commit to complete the merge.

9. What is the purpose of .gitignore?
   specifies intentionally untracked files that Git should ignore(node_modules, .env, build logs).

10. How do you undo a commit that has already been pushed?
    safe way(recommend): Run git revert <commit-hash>. This creates a new commit that undoes the changes without altering past history.
    destructive way: run git reset --hard <commit-hash> followed by git push origin <branch> --force. This deletes history permanently and disrupts teammates.

11. Can you give me some common git commands?
    git init: initialize a local git repository.
    git clone url: copies a remote
    git init: Initializes a local Git repository.
    git clone <url>: Copies a remote repository to your local machine.
    git status: Shows the state of the working directory and staging area.
    git add <file>: Adds file changes to the staging area.
    git commit -m "msg": Saves staged changes into a local snapshot.
    git push origin <branch>: Uploads local branch commits to a remote repository.
    git log --oneline: Displays a simplified history of commits.

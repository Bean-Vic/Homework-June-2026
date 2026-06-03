
```
What is the difference between git fetch and git pull?
Hu:
git fetch pulls changes from remote, updates o/main at local.
git pull does `git fetch & git merge` sequentially.

What is the difference between git merge and git rebase? Pro and Cons?
Hu: 
git merge creates a new commit pointing to existing commits from two seperate branch.
git rebase merge the commit from second brnach back into the commit from first branch.
git merge allows merge two branches, while at the same time allowing you to preserve the branches.
git rebase merge two branches into one to create a cleaner new linear path, but destroys existing branchs.

How do you resolve merge conflicts in Git?
Hu:
in order to resolve merge conflicts, you do git fetch, so that your local o/main is in sync with remote main. 

What is the purpose of .gitignore?
you include your api key in .gitingore so you don't create security leakage.

How do you undo a commit that has already been pushed?     
to unod a commit, you do git branch -f commit1, to backtrack to commit1 from commit2/

Can you give me some common git commands?
git branch
git checkout
git init
git clone
```
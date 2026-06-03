1. What is the difference between git fetch and git pull?

So both git fetch and git pull are used to get updates from the remote repository, but they work differently.
git fetch only downloads the new commits from the remote. It updates your remote-tracking branches, like origin/main, so you can see what other people have pushed. But it doesn't touch your current working branch at all — your local code stays exactly the same.
git pull is basically git fetch plus git merge. It downloads the new commits AND immediately merges them into your current branch. So your working branch gets updated in one step.
The trade-off is really about control versus convenience. I usually prefer fetch first, especially when I'm working on something important, because it lets me see what changed before deciding how to integrate it — I can review the diff, or choose between merge and rebase. pull is more convenient for quick syncing, like when I start my day and just want to get the latest from the team, but it can sometimes create unexpected merge commits or conflicts you weren't ready for.
So in short — fetch is safer and more controlled, pull is faster but less cautious.

2. What is the difference between git merge and git rebase? Pro and Cons?

So both merge and rebase are used to integrate changes from one branch into another, but they do it in very different ways.
Merge takes the two branches and combines them with a new "merge commit." It preserves the full history — you can see exactly when the branches diverged and when they came back together. The downside is your git log can get pretty messy with merge commits everywhere.
Rebase is different — it takes your commits and replays them on top of another branch, basically rewriting history to make it look linear. The result is a much cleaner, straight-line history.
So the trade-offs are:
Merge is safe and preserves history, but the log gets messy.
Rebase gives you a clean linear history, but you're rewriting commits, which means you should never rebase commits that have already been pushed and shared with others — that's the golden rule. It'll mess up everyone else's history.
My rule of thumb is — I use rebase locally to clean up my own feature branch before pushing, and I use merge when I'm integrating into a shared branch like main. That way I get clean history on my side, and safe integration on the team side.


3. How do you resolve merge conflicts in Git?

So a merge conflict happens when Git can't figure out how to combine two changes automatically — usually when two branches modified the same line in the same file. Git stops and asks you to decide. My process is pretty standard:
First, I run git status to see which files have conflicts. Then I open each file — Git inserts <<<<<<< and >>>>>>> markers showing both versions. I edit the file to keep what I want, git add to mark it resolved, and finish with git commit for a merge, or git rebase --continue for a rebase.If things get really messy, I can always back out with git merge --abort or git rebase --abort — that resets everything to before the conflict. It's a lifesaver.In practice, I usually use VS Code's merge editor instead of editing markers by hand. And to avoid conflicts in the first place, I try to pull frequently and keep commits small.

4. What is the purpose of .gitignore?

So .gitignore is a file that tells Git which files to ignore — they won't be tracked or committed.
I use it for stuff that shouldn't be in the repo, like node_modules/ (too big, can be reinstalled), .env files (they have secrets), build outputs like dist/, and IDE or OS files like .vscode/ or .DS_Store.
One gotcha — if a file is already tracked, adding it to .gitignore won't untrack it. You have to run git rm --cached <file> first.

5. How do you undo a commit that has already been pushed?

So it depends on whether the branch is shared with others or just my own.
For a shared branch like main, I use git revert. It creates a new commit that reverses the changes of the old one, so the bad commit is effectively undone, but history stays intact. It's safe because nobody else's history gets broken.
git revert <commit-hash>
git push
For my own private branch, where I know nobody else has pulled it, I can use git reset to actually remove the commit, then force-push.
git reset --hard HEAD~1
git push --force-with-lease
One thing I always use is --force-with-lease instead of plain --force. It checks that the remote is still in the state I expect — so if a teammate pushed something in the meantime, it'll refuse to push and protect their work. Plain --force would just overwrite everything blindly.
So my rule of thumb is — default to revert for anything shared, and only use reset + force-push when I'm sure I'm the only one on that branch.

6. Can you give me some common git commands?

Sure, I'll group them by what I actually use them for day to day.
For checking status, I use git status and git log constantly — usually git log --oneline --graph to see the branch structure at a glance.
For making changes, the basics: git add to stage, git commit -m to commit. I also use git commit --amend a lot when I forget to add a file or want to fix a typo in the last commit message.
For branching, git checkout -b to create and switch in one step, git merge to integrate, and git branch -d to clean up. I'm also getting used to the newer git switch and git restore, which Git introduced to split up what checkout used to do — it's clearer.
For remote work, git clone, git fetch, git pull, and git push. When pushing a new branch for the first time, I use git push -u origin <branch> to set the upstream.
For undoing things, it depends on the situation — git restore for unstaged changes, git reset to undo a local commit, and git revert when I need to undo a commit that's already been pushed to a shared branch.
And for switching tasks mid-work, git stash is a lifesaver — lets me save uncommitted changes, switch branches to do something else, then git stash pop to come back to it.
Those are the ones I reach for daily. More advanced stuff like cherry-pick or rebase -i I use when needed, but not every day.

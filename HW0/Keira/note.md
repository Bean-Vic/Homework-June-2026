# Git Interview Notes

## `git fetch` vs `git pull`

`git fetch` downloads the latest changes from the remote repository and updates remote-tracking branches like `origin/main`. It does **not** change the current local branch.

`git pull` is basically `git fetch` + `git merge` by default. It downloads remote changes and integrates them into the current local branch.

**In short:** `fetch` lets you inspect remote changes first; `pull` applies them immediately.

## `git merge` vs `git rebase`

Both combine changes from different branches.

`git merge` combines branches by creating a merge commit. It preserves the real branch history, including where branches split and merged.

**Pros:** safe for shared branches; preserves full history.  
**Cons:** history can become messy with many merge commits.

`git rebase` moves your local commits on top of another branch, often the latest `main`. It creates a cleaner linear history.

**Pros:** cleaner history; easier to read.  
**Cons:** rewrites commit history, so it can be risky on shared branches.

**Rule:** use `merge` for shared branches; use `rebase` to clean up your own local feature branch.

## Resolving Merge Conflicts

When Git reports conflicts:

1. Open the conflicted files.
2. Find conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`.
3. Decide which changes to keep, or combine both.
4. Remove the conflict markers.
5. Test the code.
6. Run `git add`.
7. Finish with `git commit` or `git rebase --continue`.

The key is to understand the conflict, not blindly accept one side.

## Purpose of `.gitignore`

`.gitignore` tells Git which files or folders not to track.

Common examples:

```gitignore
node_modules/
.env
.DS_Store
dist/
```

It is used for generated files, dependencies, logs, local config files, and sensitive files like passwords or API keys.

## Undoing a Pushed Commit

For a commit that has already been pushed, the safest option is:

```bash
git revert <commit-hash>
```

`git revert` creates a new commit that undoes the old commit. This is safer than rewriting history.

`git reset` plus force push can remove commits, but it is risky on shared branches.

## Common Git Commands

| Command | Meaning |
|---|---|
| `git status` | Show current branch and file changes |
| `git add` | Stage changes |
| `git commit` | Save staged changes |
| `git log` | Show commit history |
| `git diff` | Show file differences |
| `git clone` | Copy a remote repo locally |
| `git fetch` | Download remote updates |
| `git pull` | Fetch and merge/rebase |
| `git push` | Upload local commits |
| `git branch` | List/create/delete branches |
| `git checkout` / `git switch` | Change branches |
| `git merge` | Merge another branch into current branch |
| `git rebase` | Replay commits on top of another branch |
| `git revert` | Undo a commit with a new commit |
| `git reset` | Move branch pointer / unstage changes |
| `git stash` | Temporarily save uncommitted changes |

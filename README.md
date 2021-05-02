# git-sync-js

JS implementation for [Git-Sync](https://github.com/simonthum/git-sync), a handy script that backup your notes in a git repo to the remote git services.

Used by [TiddlyGit-Desktop](https://github.com/tiddly-gittly/TiddlyGit-Desktop), refactor out to be a npm package.

## Major Functions

There are three major functions: `initGit, clone, commitAndSync```, but you may import other helper functions and Error types, and GitStep types:

```ts
import {
  initGit,
  clone,
  commitAndSync,
  AssumeSyncError,
  CantSyncGitNotInitializedError,
  CantSyncInSpecialGitStateAutoFixFailed,
  getModifiedFileList,
  getRemoteUrl,
  GitPullPushError,
  GitStep,
  ILoggerContext,
  ModifiedFileList,
  SyncParameterMissingError,
  SyncScriptIsInDeadLoopError,
} from 'git-sync-js';
```

You can see [TiddlyGit Desktop's usage](https://github.com/tiddly-gittly/TiddlyGit-Desktop/blob/c2d4fad4e103125616eab0dd85f20d0658d70417/src/services/git/index.ts) for full example.

### initGit

```ts
try {
  await initGit({
    dir: wikiFolderPath,
    remoteUrl,
    syncImmediately: isSyncedWiki,
    userInfo: { ...defaultGitInfo, ...userInfo },
    logger: {
      log: (message: string, context: ILoggerContext): unknown => logger.info(message, { callerFunction: 'initWikiGit', ...context }),
      warn: (message: string, context: ILoggerContext): unknown => logger.warn(message, { callerFunction: 'initWikiGit', ...context }),
      info: (message: GitStep, context: ILoggerContext): void => {
        logger.notice(this.translateMessage(message), { handler: WikiChannel.syncProgress, callerFunction: 'initWikiGit', ...context });
      },
    },
  });
} catch (error) {
  this.translateErrorMessage(error);
}
```

### commitAndSync

```ts
try {
  await commitAndSync({
    dir: wikiFolderPath,
    remoteUrl,
    userInfo: { ...defaultGitInfo, ...userInfo },
    logger: {
      log: (message: string, context: ILoggerContext): unknown => logger.info(message, { callerFunction: 'commitAndSync', ...context }),
      warn: (message: string, context: ILoggerContext): unknown => logger.warn(message, { callerFunction: 'commitAndSync', ...context }),
      info: (message: GitStep, context: ILoggerContext): void => {
        logger.notice(this.translateMessage(message), { handler: WikiChannel.syncProgress, callerFunction: 'commitAndSync', ...context });
      },
    },
  });
} catch (error) {
  this.translateErrorMessage(error);
}
```

### clone

```ts
try {
  await clone({
    dir: repoFolderPath,
    remoteUrl,
    userInfo: { ...defaultGitInfo, ...userInfo },
    logger: {
      log: (message: string, context: ILoggerContext): unknown => logger.info(message, { callerFunction: 'clone', ...context }),
      warn: (message: string, context: ILoggerContext): unknown => logger.warn(message, { callerFunction: 'clone', ...context }),
      info: (message: GitStep, context: ILoggerContext): void => {
        logger.notice(this.translateMessage(message), { handler: WikiChannel.syncProgress, callerFunction: 'clone', ...context });
      },
    },
  });
} catch (error) {
  this.translateErrorMessage(error);
}
```

## Inspect helpers

### getModifiedFileList

### getRemoteUrl

### getRemoteRepoName

### haveLocalChanges

### getDefaultBranchName

### getSyncState

### assumeSync

### getGitRepositoryState

### getGitDirectory

## Sync helpers

### commitFiles

### continueRebase

## Steps

These are git sync steps enum, that will log to logger when steps happened. You can write switch case on them in your custom logger, and translate them into user readable info.

```shell
StartGitInitialization
PrepareCloneOnlineWiki
GitRepositoryConfigurationFinished
StartConfiguringGithubRemoteRepository
StartBackupToGitRemote
PrepareSync
HaveThingsToCommit
AddingFiles
AddComplete
CommitComplete
PreparingUserInfo
FetchingData
NoNeedToSync
LocalAheadStartUpload
CheckingLocalSyncState
CheckingLocalGitRepoSanity
LocalStateBehindSync
LocalStateDivergeRebase
RebaseResultChecking
RebaseConflictNeedsResolve
RebaseSucceed
GitPushFailed
GitMergeFailed
SyncFailedAlgorithmWrong
PerformLastCheckBeforeSynchronizationFinish
SynchronizationFinish
StartFetchingFromGithubRemote
CantSyncInSpecialGitStateAutoFixSucceed
```

## Errors

These are the errors throw on git sync gets into fatal situations. You can try catch on major functions to get these errors, and `instanceof` these error to translate their message for user to read and report.

```shell
AssumeSyncError
SyncParameterMissingError
GitPullPushError
CantSyncGitNotInitializedError
SyncScriptIsInDeadLoopError
CantSyncInSpecialGitStateAutoFixFailed
```

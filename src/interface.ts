export interface IGitUserInfos extends IGitUserInfosWithoutToken {
  /** Github Login: token */
  accessToken: string;
}

export interface IGitUserInfosWithoutToken {
  /** Git commit message email */
  email: string;
  /** Github Login: username , this is also used to filter user's repo when searching repo */
  gitUserName: string;
}

/** custom logger to report progress on each step
 * we don't use logger to report error, we throw errors.
 */
export interface ILogger {
  /** used to report progress for human user to read */
  info: (message: GitStep, context: ILoggerContext) => unknown;
  /** used to report debug logs */
  log: (message: string, context: ILoggerContext) => unknown;
  /** used to report failed optional progress */
  warn: (message: string, context: ILoggerContext) => unknown;
}
/** context to tell logger which function we are in */
export interface ILoggerContext {
  functionName: string;
  step: GitStep;
  dir?: string;
  remoteUrl?: string;
}

export enum GitStep {
  StartGitInitialization = 'StartGitInitialization',
  PrepareCloneOnlineWiki = 'PrepareCloneOnlineWiki',
  GitRepositoryConfigurationFinished = 'GitRepositoryConfigurationFinished',
  StartConfiguringGithubRemoteRepository = 'StartConfiguringGithubRemoteRepository',
  StartBackupToGitRemote = 'StartBackupToGitRemote',
  PrepareSync = 'PrepareSync',
  HaveThingsToCommit = 'HaveThingsToCommit',
  CommitComplete = 'CommitComplete',
  PreparingUserInfo = 'PreparingUserInfo',
  FetchingData = 'FetchingData',
  NoNeedToSync = 'NoNeedToSync',
  LocalAheadStartUpload = 'LocalAheadStartUpload',
  LocalStateBehindSync = 'LocalStateBehindSync',
  LocalStateDivergeRebase = 'LocalStateDivergeRebase',
  RebaseResultChecking = 'RebaseResultChecking',
  RebaseConflictNeedsResolve = 'RebaseConflictNeedsResolve',
  RebaseSucceed = 'RebaseSucceed',
  GitPushFailed = 'GitPushFailed',
  GitMergeFailed = 'GitMergeFailed',
  /** this means our algorithm have some problems */
  SyncFailedAlgorithmWrong = 'SyncFailedAlgorithmWrong',
  PerformLastCheckBeforeSynchronizationFinish = 'PerformLastCheckBeforeSynchronizationFinish',
  SynchronizationFinish = 'SynchronizationFinish',
  StartFetchingFromGithubRemote = 'StartFetchingFromGithubRemote',
}

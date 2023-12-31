import { GitProcess } from 'dugite';
import { credentialOff, credentialOn } from './credential';
import { defaultGitInfo as defaultDefaultGitInfo } from './defaultGitInfo';
import { CantForcePullError, SyncParameterMissingError } from './errors';
import { getDefaultBranchName, getRemoteName } from './inspect';
import { GitStep, IGitUserInfos, ILogger } from './interface';
import { fetchRemote } from './sync';

export interface IForcePullOptions {
  /** Optional fallback of userInfo. If some info is missing in userInfo, will use defaultGitInfo instead. */
  defaultGitInfo?: typeof defaultDefaultGitInfo;
  /** wiki folder path, can be relative */
  dir: string;
  logger?: ILogger;
  /** the storage service url we are sync to, for example your github repo url
   * When empty, and commitOnly===true, it means we just want commit, without sync
   */
  remoteUrl?: string;
  /** user info used in the commit message
   * When empty, and commitOnly===true, it means we just want commit, without sync
   */
  userInfo?: IGitUserInfos;
}

/**
 * Ignore all local changes, force reset local to remote.
 * This is usually used in readonly blog, that will fetch content from a remote repo. And you can push content to the remote repo, let the blog update.
 */
export async function forcePull(options: IForcePullOptions) {
  const { dir, logger, defaultGitInfo = defaultDefaultGitInfo, userInfo, remoteUrl } = options;
  const { gitUserName, branch } = userInfo ?? defaultGitInfo;
  const { accessToken } = userInfo ?? {};
  const defaultBranchName = (await getDefaultBranchName(dir)) ?? branch;
  const remoteName = await getRemoteName(dir, branch);

  if (accessToken === '' || accessToken === undefined) {
    throw new SyncParameterMissingError('accessToken');
  }
  if (remoteUrl === '' || remoteUrl === undefined) {
    throw new SyncParameterMissingError('remoteUrl');
  }

  const logProgress = (step: GitStep): unknown =>
    logger?.info(step, {
      functionName: 'forcePull',
      step,
      dir,
      remoteUrl,
      branch: defaultBranchName,
    });
  const logDebug = (message: string, step: GitStep): unknown =>
    logger?.debug(message, {
      functionName: 'forcePull',
      step,
      dir,
      remoteUrl,
      branch: defaultBranchName,
    });

  logProgress(GitStep.StartForcePull);
  logDebug(`Successfully Running git init for force pull in dir ${dir}`, GitStep.StartForcePull);
  logProgress(GitStep.StartConfiguringGithubRemoteRepository);
  await credentialOn(dir, remoteUrl, gitUserName, accessToken, remoteName);
  try {
    logProgress(GitStep.StartFetchingFromGithubRemote);
    await fetchRemote(dir, defaultGitInfo.remote, defaultGitInfo.branch);
    logProgress(GitStep.StartResettingLocalToRemote);
    await hardResetLocalToRemote(dir, branch, remoteName);
    logProgress(GitStep.FinishForcePull);
  } catch (error) {
    if (error instanceof CantForcePullError) {
      throw error;
    } else {
      throw new CantForcePullError(`${(error as Error).message} ${(error as Error).stack ?? ''}`);
    }
  } finally {
    await credentialOff(dir, remoteName, remoteUrl);
  }
}

/**
 * Internal method used by forcePull, does the `reset --hard`.
 */
export async function hardResetLocalToRemote(dir: string, branch: string, remoteName: string) {
  const { exitCode, stderr } = await GitProcess.exec(['reset', '--hard', `${remoteName}/${branch}`], dir);
  if (exitCode !== 0) {
    throw new CantForcePullError(`${remoteName}/${branch} ${stderr}`);
  }
}

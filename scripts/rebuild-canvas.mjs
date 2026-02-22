import { execSync } from 'child_process';

// yarn が npm のサブプロセスに渡す独自の npm_config_* 環境変数を除去する。
// これらは yarn 固有の設定で npm には不明なため、そのまま渡すと警告が出る。
const env = { ...process.env };
delete env.npm_config_argv;
delete env.npm_config_version_git_tag;
delete env.npm_config_version_commit_hooks;
delete env.npm_config_version_git_message;
delete env.npm_config_version_tag_prefix;

execSync('npm rebuild canvas', { stdio: 'inherit', env });

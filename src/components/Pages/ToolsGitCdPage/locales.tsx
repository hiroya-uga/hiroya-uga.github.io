import { Lang } from '@/types/lang';

export const FzfExternalLink = () => (
  <a href="https://github.com/junegunn/fzf" className="dark:text-[#85b4ff]">
    fzf
  </a>
);

const platformCommands = {
  macOS: {
    language: 'sh',
    quickInstallCommand: 'curl -fsSL https://github.com/hiroya-uga/git-cd/releases/latest/download/install.sh | bash',
    cloneInstallCommand: 'git clone https://github.com/hiroya-uga/git-cd.git ~/.git-cd\n~/.git-cd/install.sh',
    optionsExampleCommand: 'git cd ~/projects --depth 3 --cache',
    configExampleCommand: 'git config --global git-cd.root ~/works',
  },
  Windows: {
    language: 'powershell',
    quickInstallCommand:
      'Invoke-RestMethod https://github.com/hiroya-uga/git-cd/releases/latest/download/install.ps1 | Invoke-Expression',
    cloneInstallCommand:
      'git clone https://github.com/hiroya-uga/git-cd.git "$env:USERPROFILE\\.git-cd"\n& "$env:USERPROFILE\\.git-cd\\install.ps1"',
    optionsExampleCommand: 'git cd $HOME/projects --depth 3 --cache',
    configExampleCommand: String.raw`git config --global git-cd.root "$env:USERPROFILE\works"`,
  },
} as const;

export const gitCdLocales = {
  ja: {
    introText: (
      <>
        <code>git cd</code>{' '}
        コマンドでコンピューター内のローカルリポジトリを検索し、選択したリポジトリのディレクトリに移動できます。複数プロジェクトを横断する開発者のための
        CLI 拡張です。
      </>
    ),
    whySection: 'なぜ git cd が必要か',
    whyTexts: [
      '複数のリポジトリを管理していると、cd コマンドでの移動はフルパスを覚えて入力する必要があり、tab 補完も深いネストや似た名前のリポジトリでは思い通りに機能しません。',
      'git cd はローカルにあるすべてのリポジトリを自動で検索し、目的のリポジトリへ即座に移動できます。fzf がインストール済みであればインクリメンタルサーチが使え、未インストールでも番号選択で動作します。',
    ],
    comparisonSection: '従来の方法との比較',
    comparisonMethodLabel: '方法',
    comparisonNoteLabel: '特徴',
    comparisonItems: [
      { method: 'cd + tab 補完', note: 'リポジトリのフルパスを覚えていないと使いにくい' },
      { method: 'find + cd', note: 'コマンドが長く、都度入力するのが煩雑' },
      { method: 'fzf + find', note: 'カスタム設定が必要で、git との統合がない' },
      {
        method: 'git cd（本ツール）',
        note: 'git サブコマンドとして統合済み、追加設定不要ですぐに使えます',
        highlight: true,
      },
    ],
    targetSection: 'こんな方におすすめ',
    targetItems: [
      '複数のリポジトリを日常的に横断して開発している',
      '複数の独立したリポジトリを管理している（モノレポの場合は --nested オプションで内部のリポジトリも検索対象にできる）',
      'ターミナル中心の開発スタイルで、プロジェクト切り替えを効率化したい',
    ],
    installSection: 'Getting Started',
    installDescription: 'git clone版と、クイックインストール版があります。',
    restartNotice: 'インストール後は、必ずターミナルを再起動してください。',
    quickInstallTitle: 'クイックインストール版',
    cloneInstallTitle: 'git clone版（推奨）',
    setupStepsSection: 'インストーラーが実行する内容',
    commandsSection: '使い方',
    optionsExampleTitle: '使用例',
    configSection: '設定',
    configExampleTitle: '設定例',
    configNotes: [
      'デフォルトの検索起点を git の設定で指定できます。',
      '引数でパスを渡した場合はその値が優先されます。',
    ],
    basicCommandsCode:
      'git cd            # ホームディレクトリ配下のリポジトリを検索\ngit cd ~/projects # 指定したディレクトリを起点に検索',
    commandGroups: {
      options: {
        label: 'オプション',
        features: [
          { cmd: '--depth <n>', desc: 'ディレクトリの探索深度を制限する（デフォルト: 5）' },
          {
            cmd: '--nested',
            desc: 'ネストしたリポジトリも一覧に含める（デフォルトでは除外）',
          },
          {
            cmd: '--cache',
            desc: '前回のキャッシュをそのまま使用して高速起動する',
          },
          { cmd: '-h, --help', desc: 'ヘルプを表示' },
        ],
      },
    },
    fzfNote: (
      <>
        <FzfExternalLink />
        （ファジーファインダーCLI）がインストール済みの場合はキーワードで絞り込みながら選択でき、未インストールの場合は番号付きリストから選択します。
      </>
    ),
    platforms: {
      macOS: {
        ...platformCommands.macOS,
        steps: [
          <>
            <code>~/.local/bin/git-cd</code> にコマンドを配置
            <span className="block text-xs">
              （クローン版はシンボリックリンク、クイックインストール版は直接ダウンロード）
            </span>
          </>,
          <>
            <code>~/.local/bin</code> を <code>PATH</code> に追加
            <span className="block text-xs">（未登録の場合のみ）</span>
          </>,
          <>
            <code>~/.zshrc</code>（または <code>~/.bashrc</code>）にシェル関数を追記
          </>,
        ],
      },
      Windows: {
        ...platformCommands.Windows,
        steps: [
          <>
            <code>git-cd.ps1</code> と <code>git-cd.cmd</code> を <code>{'$env:USERPROFILE\\bin\\'}</code> に配置
            <span className="text-xs">（クローン版はコピー、クイックインストール版は直接ダウンロード）</span>
          </>,
          <>
            <code>$PROFILE</code> にシェル関数を追記
          </>,
        ],
      },
    },
  },
  en: {
    introText: (
      <>
        The <code>git cd</code> command searches local repositories on your computer and moves you to the selected
        repository directory. A CLI extension for developers working across multiple projects.
      </>
    ),
    whySection: 'Why git cd?',
    whyTexts: [
      'When managing multiple repositories, navigating with cd requires remembering and typing full paths. Tab completion also struggles with deeply nested directories or similarly-named projects.',
      'git cd automatically scans all local repositories and lets you jump to any of them instantly. With fzf installed, you get incremental fuzzy search; without it, a numbered list is shown instead.',
    ],
    comparisonSection: 'How it compares',
    comparisonMethodLabel: 'Method',
    comparisonNoteLabel: 'Notes',
    comparisonItems: [
      { method: 'cd + tab completion', note: 'Requires knowing and typing the full repository path' },
      { method: 'find + cd', note: 'Verbose command, tedious to repeat daily' },
      { method: 'fzf + find', note: 'Needs custom setup and configuration, no git integration' },
      {
        method: 'git cd (this tool)',
        note: 'Works as a git subcommand out of the box, no extra setup needed',
        highlight: true,
      },
    ],
    targetSection: "Who it's for",
    targetItems: [
      'Developers who work across multiple repositories daily',
      'Those managing multiple independent repositories (monorepo users can include nested repos with --nested)',
      'Terminal-first developers who want faster project switching',
    ],
    installSection: 'Getting Started',
    installDescription: 'You can choose either the git clone version or the quick install version.',
    restartNotice: 'After installation, restart your terminal.',
    quickInstallTitle: 'Quick install',
    cloneInstallTitle: 'git clone (recommended)',
    setupStepsSection: 'What the installer does',
    commandsSection: 'Usage',
    optionsExampleTitle: 'Example',
    configSection: 'Configuration',
    configExampleTitle: 'Configuration example',
    configNotes: [
      "You can set a default search root in git's global config. If you pass a path as an argument, that path takes precedence.",
    ],
    basicCommandsCode:
      'git cd            # Search repositories under your home directory\ngit cd ~/projects # Search from a specific directory',
    commandGroups: {
      options: {
        label: 'Options',
        features: [
          { cmd: '--depth <n>', desc: 'Limit directory traversal depth (default: 5)' },
          {
            cmd: '--nested',
            desc: 'Include nested repositories in the list (excluded by default)',
          },
          {
            cmd: '--cache',
            desc: 'Use the cached list as-is for faster startup (skips the fresh search)',
          },
          { cmd: '-h, --help', desc: 'Show help message' },
        ],
      },
    },
    fzfNote: (
      <>
        If <FzfExternalLink /> (a fuzzy finder CLI) is installed, you can filter and select repositories by typing
        keywords. Otherwise, a numbered list is shown.
      </>
    ),
    platforms: {
      macOS: {
        ...platformCommands.macOS,
        steps: [
          <>
            Places <code>git-cd</code> at <code>~/.local/bin/git-cd</code>
            <span className="block text-xs">
              (clone install: symlink to the cloned script; curl install: downloads directly)
            </span>
          </>,
          <>
            Adds <code>~/.local/bin</code> to <code>PATH</code> in <code>~/.zshrc</code> (or <code>~/.bashrc</code>)
            <span className="block text-xs">(only if not already present)</span>
          </>,
          <>
            Appends a shell function to <code>~/.zshrc</code> (or <code>~/.bashrc</code>)
          </>,
        ],
      },
      Windows: {
        ...platformCommands.Windows,
        steps: [
          <>
            Places <code>git-cd.ps1</code> and <code>git-cd.cmd</code> at <code>{'$env:USERPROFILE\\bin\\'}</code>
            <span className="text-xs"> (clone install: copies the scripts; quick install: downloads directly)</span>
          </>,
          <>
            Appends a shell function to <code>$PROFILE</code>
          </>,
        ],
      },
    },
  },
} satisfies Record<Lang, unknown>;

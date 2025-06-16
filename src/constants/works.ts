export const JOB_ROLE = {
  FRONT_END_ENGINEER: 'front-end-engineer',
  BACK_END_ENGINEER: 'back-end-engineer',
  DEVELOPER: 'developer',
  DESIGNER: 'designer',
  PLANNER: 'planner',
  DIRECTOR: 'director',
  WRITER: 'writer',
  RESEARCHER: 'researcher',
  ANALYST: 'analyst',
  OTHER: 'other',
} as const;
type JobRoleKey = keyof typeof JOB_ROLE;

export type JobRole = (typeof JOB_ROLE)[JobRoleKey];
export const JOB_ROLES_JA = {
  [JOB_ROLE.FRONT_END_ENGINEER]: 'フロントエンドエンジニア',
  [JOB_ROLE.BACK_END_ENGINEER]: 'バックエンドエンジニア',
  [JOB_ROLE.DEVELOPER]: '開発者',
  [JOB_ROLE.DESIGNER]: 'デザイナー',
  [JOB_ROLE.PLANNER]: 'プランナー',
  [JOB_ROLE.DIRECTOR]: 'ディレクター',
  [JOB_ROLE.WRITER]: 'ライター',
  [JOB_ROLE.RESEARCHER]: 'リサーチャー',
  [JOB_ROLE.ANALYST]: 'アナリスト',
  [JOB_ROLE.OTHER]: 'その他',
} as const;

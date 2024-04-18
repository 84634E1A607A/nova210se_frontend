export function parseDisplayName({ nickname, userName }: Params) {
  return nickname && nickname !== '' ? nickname : userName;
}

interface Params {
  nickname?: string;
  userName: string;
}

import {
  DEFAULT_DAILY_TASKS,
  DEFAULT_ROOM_PARTICIPANTS,
  INITIAL_ROOMS,
  INITIAL_THREADS,
} from '../data/seedData';
import {
  DailyTaskItem,
  DirectThread,
  GameRankEntry,
  RechargeRecord,
  ShareRewardState,
  UidDirectoryEntry,
  UserProfile,
  VoiceRoom,
  WalletTransaction,
} from '../types';
import { calculateVipLevel } from './vip';

export const UID_100001_INITIAL_COINS = 100_000_000_000;
export const UID_100001_INITIAL_DIAMONDS = 100_000;

const KEYS = {
  USER: 'zariya_user_v2',
  USER_100B_MIGRATED: 'zariya_100b_migrated_v1',
  USER_LVL0_MIGRATED: 'zariya_reset_lvl0_v1',
  NEXT_UID: 'zariya_next_uid_v1',
  ROOMS: 'zariya_rooms_v2',
  THREADS: 'zariya_threads_v2',
  FOLLOWED: 'zariya_followed_hosts_v3',
  DAILY_TASKS: 'zariya_daily_tasks_v2',
  SHARE_REWARD: 'zariya_share_reward_v2',
  RECHARGE_HISTORY: 'zariya_recharge_history_v1',
  UID_DIRECTORY: 'zariya_uid_directory_v1',
  WALLET_TX: 'zariya_wallet_tx_v1',
  GAME_RANKING: 'zariya_game_ranking_v1',
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function allocateNewUserUid(): string {
  const currentRaw = localStorage.getItem(KEYS.NEXT_UID);
  const current = currentRaw ? parseInt(currentRaw, 10) : 100006;
  const validNext = Number.isFinite(current) && current >= 100006 ? current : 100006;
  localStorage.setItem(KEYS.NEXT_UID, String(validNext + 1));
  return String(validNext);
}

export function loadUser(): UserProfile | null {
  const parsed = safeParse<Partial<UserProfile> | null>(localStorage.getItem(KEYS.USER), null);
  if (!parsed || !parsed.name) return null;

  const uid = parsed.uid || '100001';
  const isOwner = uid === '100001';
  const alreadyMigrated = localStorage.getItem(KEYS.USER_100B_MIGRATED) === 'true';

  let coins =
    typeof parsed.coins === 'number'
      ? parsed.coins
      : isOwner
        ? UID_100001_INITIAL_COINS
        : 500000;

  if (isOwner && !alreadyMigrated) {
    coins = UID_100001_INITIAL_COINS;
    localStorage.setItem(KEYS.USER_100B_MIGRATED, 'true');
  }

  const diamonds =
    typeof parsed.diamonds === 'number'
      ? parsed.diamonds
      : isOwner
        ? UID_100001_INITIAL_DIAMONDS
        : 0;

  const lvl0Migrated = localStorage.getItem(KEYS.USER_LVL0_MIGRATED) === 'true';
  let level = typeof parsed.level === 'number' ? parsed.level : 0;
  let xp = typeof parsed.xp === 'number' ? parsed.xp : 0;
  let followers = typeof parsed.followers === 'number' ? parsed.followers : 0;
  let following = typeof parsed.following === 'number' ? parsed.following : 0;

  if (!lvl0Migrated) {
    level = 0;
    xp = 0;
    followers = 0;
    following = 0;
    localStorage.setItem(KEYS.USER_LVL0_MIGRATED, 'true');
  }

  const dirEntry = loadUidDirectory().find((e) => e.uid === uid);
  const totalRecharged = Math.max(
    typeof parsed.totalRecharged === 'number' ? parsed.totalRecharged : 0,
    typeof dirEntry?.totalRecharged === 'number' ? dirEntry.totalRecharged : 0
  );
  const vipLevel = calculateVipLevel(totalRecharged, uid);

  return {
    id: parsed.id || `usr-${uid}`,
    uid,
    name: parsed.name,
    avatar: parsed.avatar || 'violet-rose',
    isGuest: false,
    isVip: isOwner || vipLevel >= 1,
    vipLevel,
    totalRecharged,
    email: parsed.email,
    password: parsed.password,
    walletPassword: parsed.walletPassword ?? dirEntry?.walletPassword,
    coins,
    diamonds,
    level,
    xp,
    followers,
    following,
    bio: parsed.bio || 'Dil se awaaz, raat ki mehfil aur behtareen dosti.',
  };
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  localStorage.setItem(KEYS.USER_LVL0_MIGRATED, 'true');
  if (user.uid === '100001') {
    localStorage.setItem(KEYS.USER_100B_MIGRATED, 'true');
  }
}

export function clearUserSession(): void {
  localStorage.removeItem(KEYS.USER);
}

export function loadRooms(): VoiceRoom[] {
  const stored = safeParse<VoiceRoom[] | null>(localStorage.getItem(KEYS.ROOMS), null);
  if (!stored || !Array.isArray(stored)) {
    saveRooms(INITIAL_ROOMS);
    return INITIAL_ROOMS;
  }
  const normalized = stored
    .map((room) =>
      room.hostUid === '100001' || room.hostId === 'usr-100001'
        ? {
            ...room,
            name: 'Zariya Official',
            subtitle: `${room.topic} · Official Live Mehfil`,
          }
        : room
    )
    .sort((a, b) => {
      const aTop = a.hostUid === '100001' || a.hostId === 'usr-100001' ? 1 : 0;
      const bTop = b.hostUid === '100001' || b.hostId === 'usr-100001' ? 1 : 0;
      return bTop - aTop;
    });
  return normalized;
}

export function saveRooms(rooms: VoiceRoom[]): void {
  localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
}

export function loadThreads(): DirectThread[] {
  const stored = safeParse<DirectThread[] | null>(localStorage.getItem(KEYS.THREADS), null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    saveThreads(INITIAL_THREADS);
    return INITIAL_THREADS;
  }
  return stored;
}

export function saveThreads(threads: DirectThread[]): void {
  localStorage.setItem(KEYS.THREADS, JSON.stringify(threads));
}

export function loadFollowedHosts(): string[] {
  return safeParse<string[]>(localStorage.getItem(KEYS.FOLLOWED), []);
}

export function saveFollowedHosts(ids: string[]): void {
  localStorage.setItem(KEYS.FOLLOWED, JSON.stringify(ids));
}

export function loadDailyTasks(): DailyTaskItem[] {
  const stored = safeParse<DailyTaskItem[] | null>(localStorage.getItem(KEYS.DAILY_TASKS), null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    saveDailyTasks(DEFAULT_DAILY_TASKS);
    return DEFAULT_DAILY_TASKS;
  }
  return stored;
}

export function saveDailyTasks(tasks: DailyTaskItem[]): void {
  localStorage.setItem(KEYS.DAILY_TASKS, JSON.stringify(tasks));
}

export function loadShareReward(): ShareRewardState {
  const stored = safeParse<ShareRewardState | null>(localStorage.getItem(KEYS.SHARE_REWARD), null);
  if (!stored) {
    const initial: ShareRewardState = { sharesCount: 0, totalEarned: 0 };
    saveShareReward(initial);
    return initial;
  }
  return stored;
}

export function saveShareReward(state: ShareRewardState): void {
  localStorage.setItem(KEYS.SHARE_REWARD, JSON.stringify(state));
}

export function loadUidDirectory(): UidDirectoryEntry[] {
  const stored = safeParse<UidDirectoryEntry[] | null>(
    localStorage.getItem(KEYS.UID_DIRECTORY),
    null
  );
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    const seeded: UidDirectoryEntry[] = DEFAULT_ROOM_PARTICIPANTS.map((p) => ({
      uid: p.uid,
      name: p.name,
      avatar: p.avatar,
      coins: 500000,
      diamonds: 500,
      password: '1234',
    }));
    saveUidDirectory(seeded);
    return seeded;
  }
  return stored;
}

export function saveUidDirectory(entries: UidDirectoryEntry[]): void {
  localStorage.setItem(KEYS.UID_DIRECTORY, JSON.stringify(entries));
}

export function upsertUidDirectoryAccount(user: UserProfile): void {
  const dir = loadUidDirectory();
  const exists = dir.some((e) => e.uid === user.uid);
  const resolvedTotalRecharged = user.totalRecharged ?? 0;
  const resolvedVipLevel = calculateVipLevel(resolvedTotalRecharged, user.uid);
  const next = exists
    ? dir.map((e) =>
        e.uid === user.uid
          ? {
              ...e,
              name: user.name,
              avatar: user.avatar,
              coins: user.coins,
              diamonds: user.diamonds,
              totalRecharged: Math.max(e.totalRecharged ?? 0, resolvedTotalRecharged),
              vipLevel: calculateVipLevel(
                Math.max(e.totalRecharged ?? 0, resolvedTotalRecharged),
                user.uid
              ),
              password: user.password || e.password || '1234',
              walletPassword: user.walletPassword !== undefined ? user.walletPassword : e.walletPassword,
              email: user.email || e.email,
            }
          : e
      )
    : [
        ...dir,
        {
          uid: user.uid,
          name: user.name,
          avatar: user.avatar,
          coins: user.coins,
          diamonds: user.diamonds,
          totalRecharged: resolvedTotalRecharged,
          vipLevel: resolvedVipLevel,
          password: user.password || '1234',
          walletPassword: user.walletPassword,
          email: user.email,
        },
      ];
  saveUidDirectory(next);
}

export function authenticateWithUidAndPassword(
  uidInput: string,
  passwordInput: string
): { user?: UserProfile; error?: string } {
  const uid = uidInput.trim();
  const pass = passwordInput.trim();
  if (!uid || !pass) {
    return { error: 'Please enter both UID and Password.' };
  }

  const directory = loadUidDirectory();
  const found = directory.find((e) => e.uid === uid);

  if (uid === '100001') {
    const expectedPass = found?.password || '1234';
    if (pass !== expectedPass) {
      return { error: 'Incorrect UID or password.' };
    }
    return {
      user: {
        id: 'usr-100001',
        uid: '100001',
        name: found?.name || 'Zeeshan',
        avatar: found?.avatar || 'violet-rose',
        isGuest: false,
        isVip: true,
        vipLevel: 6,
        totalRecharged: found?.totalRecharged ?? 0,
        password: expectedPass,
        walletPassword: found?.walletPassword,
        coins: found ? found.coins : UID_100001_INITIAL_COINS,
        diamonds: typeof found?.diamonds === 'number' ? found.diamonds : UID_100001_INITIAL_DIAMONDS,
        level: 0,
        xp: 0,
        followers: 0,
        following: 0,
        bio: 'Dil se awaaz, raat ki mehfil aur behtareen dosti.',
      },
    };
  }

  if (found) {
    const expected = found.password || '1234';
    if (pass !== expected) {
      return { error: `Incorrect password for UID ${uid}.` };
    }
    const foundTotalRecharged = found.totalRecharged ?? 0;
    const foundVipLevel = calculateVipLevel(foundTotalRecharged, found.uid);
    return {
      user: {
        id: `usr-${found.uid}`,
        uid: found.uid,
        name: found.name,
        avatar: found.avatar,
        isGuest: false,
        isVip: foundVipLevel >= 1,
        vipLevel: foundVipLevel,
        totalRecharged: foundTotalRecharged,
        email: found.email,
        password: expected,
        walletPassword: found.walletPassword,
        coins: found.coins,
        diamonds: typeof found?.diamonds === 'number' ? found.diamonds : 0,
        level: 0,
        xp: 0,
        followers: 0,
        following: 0,
        bio: 'Zariya Live Voice Party Member',
      },
    };
  }

  // Register new custom UID + Password account cleanly offline
  if (pass.length < 3) {
    return { error: 'Password must be at least 3 characters.' };
  }

  const created: UserProfile = {
    id: `usr-${uid}`,
    uid,
    name: `User ${uid}`,
    avatar: 'indigo-cyan',
    isGuest: false,
    isVip: false,
    vipLevel: 0,
    totalRecharged: 0,
    password: pass,
    coins: 500000,
    diamonds: 0,
    level: 0,
    xp: 0,
    followers: 0,
    following: 0,
    bio: 'Zariya Live Voice Party Member',
  };
  upsertUidDirectoryAccount(created);
  return { user: created };
}

export function loadRechargeRecords(): RechargeRecord[] {
  return safeParse<RechargeRecord[]>(localStorage.getItem(KEYS.RECHARGE_HISTORY), []);
}

export function saveRechargeRecords(records: RechargeRecord[]): void {
  localStorage.setItem(KEYS.RECHARGE_HISTORY, JSON.stringify(records));
}

export function loadWalletTransactions(): WalletTransaction[] {
  return safeParse<WalletTransaction[]>(localStorage.getItem(KEYS.WALLET_TX), []);
}

export function saveWalletTransactions(txs: WalletTransaction[]): void {
  localStorage.setItem(KEYS.WALLET_TX, JSON.stringify(txs));
}

export function loadGameRanking(): GameRankEntry[] {
  return safeParse<GameRankEntry[]>(localStorage.getItem(KEYS.GAME_RANKING), []);
}

export function saveGameRanking(entries: GameRankEntry[]): void {
  localStorage.setItem(KEYS.GAME_RANKING, JSON.stringify(entries));
}

export function formatTimeNow(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

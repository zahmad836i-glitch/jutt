export type RoomCategory = 'All' | 'Music' | 'Gaming' | 'Chatting' | 'Poetry' | 'Funny';

export type ExcludeAllCategory = Exclude<RoomCategory, 'All'>;

export type AppTab = 'home' | 'games' | 'messages' | 'profile';

export interface UserProfile {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  isGuest: boolean;
  isVip?: boolean;
  vipLevel?: number;
  totalRecharged?: number;
  email?: string;
  password?: string;
  walletPassword?: string;
  coins: number;
  diamonds: number;
  level: number;
  xp: number;
  followers: number;
  following: number;
  bio: string;
}

export interface MicSeat {
  seatNumber: number;
  occupantId: string | null;
  occupantUid?: string | null;
  occupantName: string | null;
  occupantAvatar: string | null;
  occupantVipLevel?: number;
  isHost: boolean;
  isAdmin?: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  isLocked?: boolean;
}

export interface RoomParticipant {
  id: string;
  uid: string;
  name: string;
  avatar: string;
  vipLevel?: number;
}

export interface GiftItem {
  id:
    | 'rose'
    | 'heart'
    | 'crown'
    | 'car'
    | 'yacht'
    | 'jet'
    | 'castle'
    | 'palace'
    | 'lucky-clover'
    | 'lucky-star'
    | 'lucky-spider'
    | 'lucky-dragon';
  name: string;
  urduTag: string;
  coins: number;
  emoji: string;
  accentGradient: string;
  category: 'normal' | 'lucky';
  maxMultiplier?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderUid?: string;
  senderName: string;
  senderAvatar: string;
  senderVipLevel?: number;
  text: string;
  timestamp: string;
  type: 'chat' | 'system' | 'gift';
  gift?: {
    id: GiftItem['id'];
    name: string;
    emoji: string;
    coins: number;
    recipientName: string;
    isLucky?: boolean;
    luckyMultiplier?: number;
    luckyWinCoins?: number;
  };
}

export interface VoiceRoom {
  id: string;
  name: string;
  topic: ExcludeAllCategory;
  subtitle: string;
  hostId: string;
  hostUid: string;
  hostName: string;
  hostAvatar: string;
  hostVipLevel?: number;
  adminIds: string[];
  participants: RoomParticipant[];
  coverImage: string;
  listenersCount: number;
  isLive: boolean;
  isPrivate: boolean;
  password?: string;
  createdByUser?: boolean;
  seats: MicSeat[];
  messages: ChatMessage[];
}

export interface DirectMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

export interface DirectThread {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  peerStatus: string;
  roomId?: string;
  unread: number;
  messages: DirectMessage[];
}

export interface HostSpotlight {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  specialty: ExcludeAllCategory;
  followers: string;
}

export interface DailyTaskItem {
  id: 'checkin' | 'room' | 'game' | 'gift';
  title: string;
  subtitle: string;
  reward: number;
  progress: number;
  target: number;
  claimed: boolean;
}

export interface ShareRewardState {
  sharesCount: number;
  lastSharedAt?: string;
  totalEarned: number;
}

export interface RechargeRecord {
  id: string;
  fromUid: string;
  toUid: string;
  toName: string;
  amount: number;
  time: string;
}

export interface UidDirectoryEntry {
  uid: string;
  name: string;
  avatar: string;
  coins: number;
  diamonds?: number;
  totalRecharged?: number;
  vipLevel?: number;
  password?: string;
  walletPassword?: string;
  email?: string;
}

export interface WalletTransaction {
  id: string;
  title: string;
  detail: string;
  deltaLabel: string;
  time: string;
}

export interface GameRankEntry {
  uid: string;
  name: string;
  avatar: string;
  vipLevel?: number;
  totalWon: number;
  bestWin: number;
  winsCount: number;
  lastGame: string;
}

import { AnimatePresence, motion } from 'motion/react';
import { Globe, Lock, Mic, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { ExcludeAllCategory } from '../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: {
    name: string;
    topic: ExcludeAllCategory;
    isPrivate: boolean;
    password?: string;
  }) => void;
}

const TOPICS: ExcludeAllCategory[] = ['Music', 'Gaming', 'Chatting', 'Poetry', 'Funny'];

export function CreateRoomModal({ isOpen, onClose, onCreate }: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [topic, setTopic] = useState<ExcludeAllCategory>('Music');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setErrorMsg('Please enter a Room Name.');
      return;
    }
    if (isPrivate && password.trim().length < 2) {
      setErrorMsg('Please set a password for your private room.');
      return;
    }

    onCreate({
      name: roomName.trim(),
      topic,
      isPrivate,
      password: isPrivate ? password.trim() : undefined,
    });

    setRoomName('');
    setTopic('Music');
    setIsPrivate(false);
    setPassword('');
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="glass-elevated max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:pb-6"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-white/20 sm:hidden" />

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#EC4899] text-white">
                  <Mic className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Create Voice Room</h2>
                  <p className="text-xs text-slate-300">Start your own live mehfil</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close create room modal"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="create-room-name"
                  className="mb-1.5 block text-xs font-medium text-slate-300"
                >
                  Room Name
                </label>
                <input
                  id="create-room-name"
                  type="text"
                  maxLength={36}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Raat Ki Mehfil"
                  className="min-h-[46px] w-full rounded-xl border border-white/15 bg-[#120C24] px-4 text-sm text-white placeholder:text-slate-500 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              <div>
                <span className="mb-2 block text-xs font-medium text-slate-300">Room Topic</span>
                <div className="flex flex-wrap gap-2">
                  {TOPICS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setTopic(item)}
                      className={`min-h-[38px] rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                        topic === item
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white'
                          : 'border border-white/12 bg-[#140E28] text-slate-300 hover:text-white'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-medium text-slate-300">Room Privacy</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsPrivate(false)}
                    className={`flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors ${
                      !isPrivate
                        ? 'border-pink-400 bg-pink-500/20 text-white'
                        : 'border-white/10 bg-[#140E28] text-slate-300'
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(true)}
                    className={`flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors ${
                      isPrivate
                        ? 'border-pink-400 bg-pink-500/20 text-white'
                        : 'border-white/10 bg-[#140E28] text-slate-300'
                    }`}
                  >
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </button>
                </div>
              </div>

              {isPrivate && (
                <div>
                  <label
                    htmlFor="create-room-password"
                    className="mb-1.5 block text-xs font-medium text-slate-300"
                  >
                    Room Password
                  </label>
                  <input
                    id="create-room-password"
                    type="password"
                    maxLength={16}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set a room password"
                    className="min-h-[46px] w-full rounded-xl border border-white/15 bg-[#120C24] px-4 text-sm text-white placeholder:text-slate-500 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                  />
                </div>
              )}

              {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

              <button
                type="submit"
                className="min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/25 transition-transform active:scale-[0.98] hover:brightness-110"
              >
                Create Room
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

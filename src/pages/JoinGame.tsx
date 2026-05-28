import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, ArrowRight, Dices } from "lucide-react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getAvatar, randomSeed } from "@/lib/avatars";

export default function JoinGame() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pin, setPin] = useState(searchParams.get("pin") ?? "");
  const [nickname, setNickname] = useState("");
  const [avatarSeed, setAvatarSeed] = useState(() => randomSeed());
  const [rolling, setRolling] = useState(false);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const game = useQuery(api.games.getByPin, pin.length === 6 ? { pin } : "skip");
  const joinGame = useMutation(api.players.join);

  const avatar = getAvatar(avatarSeed);

  function reroll() {
    setRolling(true);
    setTimeout(() => {
      setAvatarSeed(randomSeed());
      setRolling(false);
    }, 120);
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!game) {
      setError("Hra s tímto PINem neexistuje.");
      return;
    }
    if (game.status !== "lobby") {
      setError("Hra již probíhá nebo skončila.");
      return;
    }

    setJoining(true);
    try {
      const playerId = await joinGame({
        gameId: game._id,
        nickname: nickname.trim(),
        avatar: avatarSeed,
      });
      navigate(`/play/${game._id}?playerId=${playerId}`, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(
        message.includes("přezdívka") || message.includes("Přezdívka")
          ? "Tahle přezdívka už je ve hře obsazená."
          : "Nepodařilo se připojit. Zkus to znovu."
      );
    } finally {
      setJoining(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-animated relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.35 }}
        className="relative z-10 card p-5 sm:p-8 w-full max-w-sm"
      >
        <button
          type="button"
          onClick={() => navigate("/", { replace: true })}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} /> Zpět
        </button>
        <h1 className="text-3xl font-black text-white mb-1">Připojit se</h1>
        <p className="text-gray-500 text-sm mb-6">Vygeneruj si avatar a zadej přezdívku</p>

        <form onSubmit={handleJoin} className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={avatarSeed}
                initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 15 }}
                transition={{ type: "spring", bounce: 0.5, duration: 0.35 }}
                className="w-28 h-28 rounded-3xl overflow-hidden shadow-xl"
                style={{ backgroundColor: "#" + avatar.bg }}
              >
                <img src={avatar.url} alt="avatar" className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={reroll}
              disabled={rolling}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={rolling ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex" }}
              >
                <Dices size={16} />
              </motion.span>
              Znovu hodit
            </Button>
          </div>

          <Input
            label="Přezdívka"
            placeholder="SuperKvízař99"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 20))}
            maxLength={20}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-300 tracking-wide">PIN hry</label>
            <Input
              placeholder="123456"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              maxLength={6}
              className="text-center text-2xl font-black tracking-[0.3em]"
            />
          </div>

          {game && pin.length === 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2"
            >
              <CheckCircle2 size={15} />
              Hra nalezena!
            </motion.div>
          )}

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            size="lg"
            isLoading={joining}
            disabled={pin.length !== 6 || nickname.trim().length < 2}
            className="w-full"
          >
            Vstoupit do hry <ArrowRight size={18} />
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

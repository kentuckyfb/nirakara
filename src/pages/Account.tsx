import { useEffect, useState } from "react";
import accountContent from "@/content/account.json";

interface Profile {
  name: string;
  email: string;
  password: string;
  bio: string;
}

const storageKey = "nirakara-profile";

export default function Account() {
  const { intro, perks } = accountContent;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [form, setForm] = useState({ name: "", email: "", password: "", bio: "" });
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    if (mode === "register") {
      const payload: Profile = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        bio: form.bio.trim(),
      };

      if (!payload.name || !payload.email || !payload.password) {
        setMessage("Name, email, and password are required to create a profile.");
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(payload));
      setProfile(payload);
      setMessage("Profile saved locally. You can now sign in from any session on this device.");
    } else if (mode === "login") {
      if (!profile) {
        setMessage("No profile exists on this device yet. Please create one first.");
        return;
      }
      if (profile.email !== form.email.trim().toLowerCase() || profile.password !== form.password) {
        setMessage("Credentials do not match our local profile.");
        return;
      }
      setMessage(`Welcome back, ${profile.name}. Profile found.`);
    }
  };

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem(storageKey);
    setMessage("Your saved profile was cleared from this browser.");
  };

  const activeProfile = profile && mode === "login";

  return (
    <div className="bg-white text-black min-h-screen py-16 px-4">
      <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2">
        <section>
          <p className="text-[10px] uppercase tracking-[0.35em] text-black/50 mb-3">{intro.eyebrow}</p>
          <h1 className="text-4xl font-brand tracking-[0.1em] mb-6">{intro.title}</h1>
          <p className="text-sm text-black/60 mb-8">{intro.body}</p>

          <div className="flex gap-2 text-xs uppercase tracking-[0.3em] mb-6">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`px-4 py-2 border ${mode === "register" ? "bg-black text-white" : "border-black/30 text-black/60"}`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`px-4 py-2 border ${mode === "login" ? "bg-black text-white" : "border-black/30 text-black/60"}`}
            >
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <label className="block text-xs uppercase tracking-[0.3em] text-black/60">
                  Full Name
                  <input
                    type="text"
                    className="mt-2 w-full border border-black/20 px-3 py-2 text-sm"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </label>
                <label className="block text-xs uppercase tracking-[0.3em] text-black/60">
                  Short Bio
                  <textarea
                    className="mt-2 w-full border border-black/20 px-3 py-2 text-sm"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                  />
                </label>
              </>
            )}
            <label className="block text-xs uppercase tracking-[0.3em] text-black/60">
              Email
              <input
                type="email"
                className="mt-2 w-full border border-black/20 px-3 py-2 text-sm"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.3em] text-black/60">
              Password
              <input
                type="password"
                className="mt-2 w-full border border-black/20 px-3 py-2 text-sm"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </label>
            <button
              type="submit"
              className="w-full border border-black/80 bg-black text-white py-3 text-xs uppercase tracking-[0.35em]"
            >
              {mode === "register" ? "Save Profile" : "Sign In"}
            </button>
            {message && <p className="text-xs text-black/70">{message}</p>}
          </form>
        </section>

        <section className="border border-black/10 p-6 space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-black/50 mb-2">Profile Snapshot</p>
            {profile ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-sm text-black/60">{profile.bio || "No bio saved."}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">{profile.email}</p>
                <button
                  type="button"
                  className="mt-4 border border-black/40 px-4 py-2 text-xs uppercase tracking-[0.3em]"
                  onClick={handleLogout}
                >
                  Clear Local Profile
                </button>
              </div>
            ) : (
              <p className="text-sm text-black/60">No profile stored on this device yet.</p>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="text-sm uppercase tracking-[0.35em]">Perks</h3>
            <ul className="space-y-2 text-sm text-black/60">
              {perks.map((perk) => (
                <li key={perk}>• {perk}</li>
              ))}
            </ul>
          </div>
          {activeProfile && (
            <div className="text-xs uppercase tracking-[0.35em] text-green-700">Status // Signed In</div>
          )}
        </section>
      </div>
    </div>
  );
}

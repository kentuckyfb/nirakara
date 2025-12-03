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
    <div className="bg-[#f8f8f8] text-black min-h-screen flex flex-col relative overflow-x-hidden font-body selection:bg-black selection:text-white">
      {/* Top Bar Decoration */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-black via-blue-500/40 to-black z-50" />

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-black/5 to-transparent rounded-full blur-[100px] opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-16 relative z-10">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-black animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-mono">Account</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-brand leading-[0.85] tracking-tighter uppercase">
                {intro.title}
              </h1>
            </div>
            <p className="text-xs leading-relaxed text-black/60 max-w-md font-mono border-l border-black/20 pl-4">
              {intro.body}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 pb-12 md:pb-16 relative z-10">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Login/Register Form */}
            <div className="border border-black/20 bg-white/50 backdrop-blur-sm p-6 lg:p-8 relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-blue-500" />
                <span className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">
                  {mode === "register" ? "Create Profile" : "Sign In"}
                </span>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`flex-1 py-3 text-[9px] uppercase tracking-[0.4em] border transition-all duration-300 rounded-none ${mode === "register"
                    ? "bg-black text-white border-black"
                    : "border-black/15 text-black/60 hover:border-black/30 hover:text-black"
                    }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`flex-1 py-3 text-[9px] uppercase tracking-[0.4em] border transition-all duration-300 rounded-none ${mode === "login"
                    ? "bg-black text-white border-black"
                    : "border-black/15 text-black/60 hover:border-black/30 hover:text-black"
                    }`}
                >
                  Login
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "register" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Full Name</label>
                      <input
                        type="text"
                        className="w-full border border-black/15 px-4 py-3 text-sm focus:border-black/40 transition-all rounded-none"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Short Bio</label>
                      <textarea
                        className="w-full border border-black/15 px-4 py-3 text-sm min-h-[100px] focus:border-black/40 transition-all rounded-none"
                        value={form.bio}
                        onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Email</label>
                  <input
                    type="email"
                    className="w-full border border-black/15 px-4 py-3 text-sm focus:border-black/40 transition-all rounded-none"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Password</label>
                  <input
                    type="password"
                    className="w-full border border-black/15 px-4 py-3 text-sm focus:border-black/40 transition-all rounded-none"
                    value={form.password}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 text-[9px] uppercase tracking-[0.4em] bg-black text-white hover:bg-black/80 transition-all rounded-none"
                >
                  {mode === "register" ? "Save Profile" : "Sign In"}
                </button>
                {message && (
                  <div className="p-4 border border-black/15 bg-white/70">
                    <p className="text-[10px] leading-relaxed text-black/60 tracking-wide">{message}</p>
                  </div>
                )}
              </form>
            </div>

            {/* Profile & Perks */}
            <div className="space-y-6">
              <div className="border border-black/20 bg-white/30 backdrop-blur-sm p-6 lg:p-7 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-blue-500/60" />
                  <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Profile Snapshot</h2>
                </div>

                {profile ? (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-xl font-brand tracking-wider text-black/80 mb-2">{profile.name}</h3>
                      <p className="text-[11px] leading-relaxed text-black/60 tracking-wide">
                        {profile.bio || "No bio saved."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-black/30" />
                      <p className="text-[9px] uppercase tracking-[0.4em] text-black/50">{profile.email}</p>
                    </div>
                    {activeProfile && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="w-2 h-2 rounded-full bg-green-500/70 animate-pulse" />
                        <span className="text-[8px] uppercase tracking-[0.5em] text-green-700/70">Signed In</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="mt-2 w-full py-2.5 text-[9px] uppercase tracking-[0.4em] border border-black/15 text-black/70 hover:border-black/30 hover:text-black transition-all rounded-none"
                      onClick={handleLogout}
                    >
                      Clear Local Profile
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 border border-black/20 flex items-center justify-center mb-4">
                      <div className="w-4 h-4 border border-black/20" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-black/40">No Profile Stored</p>
                  </div>
                )}
              </div>

              <div className="border border-black/20 bg-white/30 backdrop-blur-sm p-6 lg:p-7 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-blue-500/60" />
                  <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Account Perks</h2>
                </div>

                <div className="space-y-3 pl-4">
                  {perks.map((perk) => (
                    <div key={perk} className="flex gap-3 group">
                      <div className="flex-shrink-0 w-1 h-1 bg-black/30 mt-2 group-hover:bg-blue-500/60 transition-colors" />
                      <p className="flex-1 text-[11px] leading-relaxed text-black/60 tracking-wide">
                        {perk}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

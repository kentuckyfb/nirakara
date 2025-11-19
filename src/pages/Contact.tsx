import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Received",
      description: "We'll get back to you soon via email.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <section className="relative py-24 md:py-32 border-b border-brand-border overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-brand-border"
              style={{ left: `${(i / 11) * 100}%` }}
            />
          ))}
        </div>

        {/* Corner markers */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-brand-accent opacity-30" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-brand-accent opacity-30" />

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-8 md:col-start-3 relative">
              <div className="absolute -left-12 top-0 text-[10px] text-brand-accent opacity-60 tracking-[0.3em]">
                01
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-px bg-brand-accent" />
                  <span className="text-xs uppercase tracking-[0.3em] text-brand-accent">Pulse</span>
                </div>
                <h1 className="font-brand text-5xl md:text-7xl uppercase tracking-tight">
                  Share Your Intent
                </h1>
                <p className="text-sm text-brand-muted max-w-2xl">
                  Send a message or connect with the studio directly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Golden ratio line */}
        <div className="absolute left-[38.2%] top-0 bottom-0 w-px bg-brand-accent opacity-10" />
      </section>

      {/* Contact Methods & Form */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="col-span-12 lg:col-span-4 lg:col-start-2 space-y-12 relative">
              <div className="absolute -left-8 top-0 text-[10px] text-brand-accent opacity-60 tracking-[0.3em]">
                02
              </div>

              {/* Direct Channels */}
              <div className="space-y-6">
                <h2 className="font-brand text-2xl uppercase tracking-wide">Direct Lines</h2>
                
                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="group flex items-start gap-4 p-4 border border-brand-border hover:border-brand-accent transition-colors"
                  >
                    <div className="w-10 h-10 border border-brand-border flex items-center justify-center flex-shrink-0 group-hover:border-brand-accent transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1 text-brand-accent">Email</p>
                      <p className="text-sm">{siteConfig.social.email}</p>
                    </div>
                  </a>

                  {/* Instagram */}
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-4 border border-brand-border hover:border-brand-accent transition-colors"
                  >
                    <div className="w-10 h-10 border border-brand-border flex items-center justify-center flex-shrink-0 group-hover:border-brand-accent transition-colors">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-1 text-brand-accent">Instagram</p>
                      <p className="text-sm">@nirakara.studio</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="font-brand text-lg uppercase tracking-wide">Location</h3>
                <div className="p-4 border border-brand-border/50">
                  <p className="text-xs uppercase tracking-widest text-brand-muted mb-2">Coordinates</p>
                  <p className="text-sm mb-3">06deg56'N 79deg51'E</p>
                  <p className="text-xs text-brand-muted">Colombo, Sri Lanka</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="text-brand-muted">Response time: within 24 hours</span>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-span-12 lg:col-span-5 relative">
              <div className="absolute -left-8 top-0 text-[10px] text-brand-accent opacity-60 tracking-[0.3em] lg:hidden">
                03
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-muted">
                    Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="font-mono text-sm"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-muted">
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="font-mono text-sm"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-brand-muted">
                    Message
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="font-mono text-sm min-h-[180px]"
                    placeholder="Your message..."
                  />
                </div>

                <div className="flex items-center gap-4">
                  <Button type="submit" size="lg" className="uppercase tracking-wider font-brand">
                    Send Signal
                  </Button>
                  <span className="text-[10px] text-brand-accent opacity-60">[TRANSMIT]</span>
                </div>
              </form>

              {/* Form decoration */}
              <div className="absolute -bottom-8 right-0 w-24 h-24 border-r border-b border-brand-accent opacity-20" />
            </div>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-brand-border opacity-5 rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-brand-border opacity-5" />
      </section>
    </div>
  );
}

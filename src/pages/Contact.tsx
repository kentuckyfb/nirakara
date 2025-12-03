import { useEffect, useState } from "react";
import { Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/config/site";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import productsData from "@/content/products.json";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get("product");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", productInquiry: "", message: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (productParam) {
      setFormData((prev) => ({
        ...prev,
        productInquiry: productParam,
        subject: `Product Inquiry: ${productParam}`,
      }));
    }
  }, [productParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Received",
      description: "We'll get back to you soon via email.",
    });
    setFormData({ name: "", email: "", subject: "", productInquiry: "", message: "" });
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col relative overflow-x-hidden font-body selection:bg-black selection:text-white">
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
                <span className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-mono">Contact</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-brand leading-[0.85] tracking-tighter uppercase">
                Get In Touch
              </h1>
            </div>
            <p className="text-xs leading-relaxed text-black/60 max-w-md font-mono border-l border-black/20 pl-4">
              Have questions about our pieces, custom orders, or collaborations? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <main className="flex-1 pb-12 md:pb-16 relative z-10">
        <div className="container mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="border border-black/20 bg-white/50 backdrop-blur-sm p-6 lg:p-8 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="absolute top-0 right-0 w-10 h-10 border-t border-r border-blue-500/20" />
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b border-l border-blue-500/20" />

                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-1.5 bg-blue-500" />
                  <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Send Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-sm border-black/15 focus:border-black/40 transition-all rounded-none"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Email</label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="text-sm border-black/15 focus:border-black/40 transition-all rounded-none"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Subject</label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="text-sm border-black/15 focus:border-black/40 transition-all rounded-none"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">
                      Product Inquiry (Optional)
                    </label>
                    <Select
                      value={formData.productInquiry}
                      onValueChange={(value) => setFormData({ ...formData, productInquiry: value })}
                    >
                      <SelectTrigger className="text-sm border-black/15 focus:border-black/40 transition-all rounded-none">
                        <SelectValue placeholder="Select a product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {productsData.map((product: any) => (
                          <SelectItem key={product.unitCode || product.id} value={product.unitCode || product.name}>
                            {product.unitCode || product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.4em] text-black/50">Message</label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="text-sm min-h-[180px] border-black/15 focus:border-black/40 transition-all rounded-none"
                      placeholder="Your message..."
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <Button
                      type="submit"
                      className="text-[9px] uppercase tracking-[0.35em] bg-black hover:bg-black/80 transition-all rounded-none px-6"
                    >
                      Send Message
                    </Button>
                    <div className="h-px flex-1 bg-gradient-to-r from-black/10 via-black/5 to-transparent" />
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-black/20 bg-white/30 backdrop-blur-sm p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-blue-500/60" />
                  <h2 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Direct Contact</h2>
                </div>

                <div className="space-y-3">
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="group flex items-center gap-3 p-4 border border-black/15 bg-white/70 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0 group-hover:text-white transition-colors" />
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-black/40 group-hover:text-white/60 mb-1">Email</p>
                      <p className="text-xs group-hover:text-white">{siteConfig.social.email}</p>
                    </div>
                  </a>

                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 border border-black/15 bg-white/70 hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <Instagram className="w-4 h-4 flex-shrink-0 group-hover:text-white transition-colors" />
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widest text-black/40 group-hover:text-white/60 mb-1">Instagram</p>
                      <p className="text-xs group-hover:text-white">@nirakara.studio</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="border border-black/20 bg-white/30 backdrop-blur-sm p-6 relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-1 bg-blue-500/60" />
                  <h3 className="text-[10px] uppercase tracking-[0.35em] font-bold text-black/70">Location</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-black/40">Studio</p>
                  <p className="text-xs text-black/70 font-mono">Colombo, Sri Lanka</p>
                  <p className="text-[10px] text-black/40 font-mono">06°56'N 79°51'E</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] p-4 border border-black/20 bg-black/5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                <span className="text-black/60 tracking-[0.3em] uppercase">Response within 24h</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

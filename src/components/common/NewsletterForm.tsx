import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to the chaos.",
        description: "You're now on the list for exclusive drops.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <Input
        type="email"
        placeholder="your@signal.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-background border-brand-border text-foreground placeholder:text-brand-muted"
      />
      <Button 
        type="submit" 
        disabled={isLoading}
        className="uppercase tracking-wider font-brand text-xs"
      >
        {isLoading ? "..." : "Connect"}
      </Button>
    </form>
  );
}

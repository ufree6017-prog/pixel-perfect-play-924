import { Headset, Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { brand } from "@/lib/brand";

interface ChatMessage {
  from: "support" | "you";
  text: string;
}

/** UI shell only — no messaging backend is wired up yet. */
export function SupportWidget() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: "support", text: "Hi! Ask us about a booking, a driver or an invoice." },
  ]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { from: "you", text },
      {
        from: "support",
        text: "Thanks — a support agent will pick this up. (Demo reply, chat backend coming soon.)",
      },
    ]);
    setDraft("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" className="rounded-full shadow-lg">
            <Headset className="mr-2 size-5" /> Help
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[22rem] p-0">
          <div className="surface-hero rounded-t-md px-4 py-3">
            <p className="font-display text-sm font-bold">{brand.name} support</p>
            <p className="text-xs opacity-80">Typically replies in under 5 minutes</p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-b border-border p-3 text-xs">
            <a
              href={`tel:${brand.supportPhone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 font-medium"
            >
              <Phone className="size-4" /> Call us
            </a>
            <a
              href={`mailto:${brand.supportEmail}`}
              className="flex items-center gap-2 rounded-md bg-secondary px-3 py-2 font-medium"
            >
              <Mail className="size-4" /> Email
            </a>
          </div>
          <div className="max-h-56 space-y-2 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.from === "you"
                    ? "ml-auto max-w-[80%] rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground"
                    : "max-w-[85%] rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground"
                }
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <MessageSquare className="size-4 text-muted-foreground" />
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && send()}
              placeholder="Type your question"
              className="h-9 text-sm"
            />
            <Button size="icon" className="size-9" onClick={send} aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

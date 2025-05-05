
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "./ChatInterface";

export const ChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 bg-[#6338DC] hover:bg-[#7852e3]"
        size="icon"
        aria-label="Abrir chat"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {isChatOpen && <ChatInterface onClose={() => setIsChatOpen(false)} />}
    </>
  );
};

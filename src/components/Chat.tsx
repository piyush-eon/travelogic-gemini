import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "./ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  itinerary: string;
}

export function Chat({ itinerary }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateResponse = (userInput: string) => {
    // Extract key information from itinerary
    const destinations = itinerary.match(/\b(?:visiting|in|to)\s+([A-Za-z\s,]+)/gi);
    const activities = itinerary.match(/\b(?:activities|visit|explore|enjoy)\s+([^.]+)/gi);
    
    // Check for different types of questions
    if (userInput.toLowerCase().includes("activities") || userInput.toLowerCase().includes("do")) {
      return `Based on your itinerary, you can ${activities?.[0] || "explore various attractions"}. Would you like more specific details about any particular activity?`;
    }
    
    if (userInput.toLowerCase().includes("where") || userInput.toLowerCase().includes("destination")) {
      return `According to your itinerary, you'll be ${destinations?.[0] || "visiting several locations"}. Which specific location would you like to know more about?`;
    }
    
    if (userInput.toLowerCase().includes("time") || userInput.toLowerCase().includes("when")) {
      const dates = itinerary.match(/\b(?:from|between|on)\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/gi);
      return `Your trip is scheduled for ${dates?.[0] || "the dates specified in your itinerary"}. Would you like to know more about the schedule?`;
    }

    // Default response with context
    return `I see you're asking about "${userInput}". Your itinerary includes ${destinations?.[0] || "various destinations"} with activities like ${activities?.[0] || "various experiences"}. Could you please specify what aspect you'd like to know more about?`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };

      setTimeout(() => {
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border rounded-lg shadow-lg bg-white">
      <div className="p-4 border-b flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-travel-primary" />
        <h3 className="text-lg font-semibold text-travel-primary">
          Travel Assistant Chat
        </h3>
      </div>
      <ScrollArea className="h-[300px] p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-travel-primary text-white"
                    : "bg-gray-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your itinerary..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
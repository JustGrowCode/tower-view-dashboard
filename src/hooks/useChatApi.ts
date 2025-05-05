
import { useState } from "react";
import { toast } from "sonner";

// Constants for the chat API
const AGENT_ID = "agent_id_here"; // Replace with your actual agent ID
const API_TOKEN = "your_token_here"; // Replace with your actual token

interface ChatApiOptions {
  query: string;
  conversationId?: string;
  visitorId?: string;
  temperature?: number;
  streaming?: boolean;
  modelName?: string;
  maxTokens?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  topP?: number;
  filters?: {
    custom_ids?: string[];
    datasource_ids?: string[];
  };
  systemPrompt?: string;
  userPrompt?: string;
}

export const useChatApi = () => {
  const [conversationId, setConversationId] = useState<string | undefined>(
    undefined
  );
  const [visitorId] = useState<string>(
    `visitor_${Math.random().toString(36).substring(2, 9)}`
  );

  const sendMessage = async (message: string): Promise<string> => {
    try {
      const options: RequestInit = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          conversationId: conversationId,
          visitorId: visitorId,
          temperature: 0.7,
          streaming: false, // Set to false for simplicity in this implementation
          modelName: "groq",
          maxTokens: 1024,
          presencePenalty: 0,
          frequencyPenalty: 0,
          topP: 0.9,
          filters: {
            custom_ids: [],
            datasource_ids: [],
          },
          // Optional prompts
          systemPrompt: "Você é um assistente especializado em torres de investimento e aplicações financeiras.",
          userPrompt: message,
        } as ChatApiOptions),
      };

      const response = await fetch(
        `https://dash.superagentes.ai/api/agents/${AGENT_ID}/query`,
        options
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store conversation ID for future messages
      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      // Return the actual message content
      return data.response || "Recebi sua mensagem e estou processando.";
    } catch (error) {
      console.error("Error sending message to SuperAgentes API:", error);
      toast.error("Erro ao enviar mensagem para o assistente");
      return "Desculpe, ocorreu um erro ao processar sua solicitação.";
    }
  };

  return { sendMessage };
};

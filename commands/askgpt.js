// commands/askgpt.js
import OpenAI from "openai";


const openai = new OpenAI({
  apiKey: "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",
});


export const conversationHistory = new Map();

export async function handleAskGPT(client, message, args) {
  const userId = message.author.id; 
  const input = args.join(" ");

  if (!input) {
    return message.reply({
      content: "❌Ví dụ: `.g Hôm nay trời thế nào?`",
      allowedMentions: { repliedUser: false },
    });
  }


  const thinkingMsg = await message.reply({
    content: "🤖 vui lòng chờ...",
    allowedMentions: { repliedUser: false },
  }).catch(() => {});

  try {

    const history = conversationHistory.get(userId) || [
      { role: "system", content: "Bạn là một trợ lý thân thiện, hiểu ngữ cảnh trò chuyện và trả lời tự nhiên." },
    ];


    history.push({ role: "user", content: input });


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: history,
    });

    const reply = completion.choices[0]?.message?.content || "❌không phản hồi.";
    history.push({ role: "assistant", content: reply });


    conversationHistory.set(userId, history.slice(-10));

    await thinkingMsg.edit({
      content: `💬 **Câu hỏi:** ${input}\n\n🤖 **:** ${reply}`,
      allowedMentions: { repliedUser: false },
    });
  } catch (err) {
    console.error("❌ Lỗi khi gọi API:", err);
    await thinkingMsg.edit({
      content: `⚠️ Lỗi khi gọi API:\n\`\`\`${err.message}\`\`\``,
      allowedMentions: { repliedUser: false },
    }).catch(() => {});
  }
}


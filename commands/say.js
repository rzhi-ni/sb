export async function handleSay(client, message, args) {
    const textToSay = args.join(" "); 
    if (!textToSay) {
        return message.reply({ 
            content: "❌ Vui lòng cung cấp nội dung để bot nói.", 
            allowedMentions: { repliedUser: false } 
        }).catch(() => {});
    }
    try {
        await message.channel.send(textToSay);
    } catch (error) {
        console.error(`❌ Lỗi khi bot cố gắng chat trong kênh ${message.channel.id}:`, error.message);
        message.reply({ 
            content: `⚠️ Lỗi: Bot không thể gửi tin nhắn. (Lý do: ${error.message})`,
            allowedMentions: { repliedUser: false } 
        }).catch(() => {});
    }
}
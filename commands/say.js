export async function handleSay(client, message, args) {
    // 1. Lấy nội dung cần chat
    const textToSay = args.join(" ");

    // 2. Kiểm tra nội dung
    if (!textToSay) {
        return message.reply({ 
            content: "❌ Vui lòng cung cấp nội dung để bot nói.", 
            allowedMentions: { repliedUser: false } 
        }).catch(() => {}); // catch() để tránh crash nếu không gửi được
    }

    // 3. Xóa tin nhắn lệnh gốc (giữ cho kênh "sạch")
    if (message.deletable) {
        await message.delete().catch(e => console.error("Không thể xóa tin nhắn lệnh:", e.message));
    }

    // 4. Gửi tin nhắn
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

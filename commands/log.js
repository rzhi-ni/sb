// commands/log.js

// import pkg from 'discord.js-selfbot-v13';
// const { EmbedBuilder } = pkg; 

/**
 * 
 * @param {Object} acc 
 * @param {string} direction 
 * @param {string} amount 
 * @param {string} partnerId
 * @param {string} channelName 
 * @param {string} messageUrl 
 */
export async function sendLog(client, acc, direction, amount, partnerId, channelName, messageUrl) {
    if (!acc.logChannelId) {
        console.error(`[LOG ERROR] Account ${acc.name}: logChannelId không được cấu hình.`);
        return;
    }
    const logChannel = client.channels.cache.get(acc.logChannelId);
    if (!logChannel) {
        console.error(`[LOG ERROR] Account ${acc.name}: Không tìm thấy kênh log ID ${acc.logChannelId}.`);
        return;
    }
    const amountNum = Number(amount);
    const amountStr = amountNum.toLocaleString('en-US');   
    let logMessage = '';

    if (direction === 'IN') {
        logMessage = `✅ **[LOG IN]** Account **${acc.name}** đã nhận **+${amountStr}** cowoncy.
        > 👤 Người gửi: <@${partnerId}> (ID: ${partnerId})
        > 💬 Kênh: #${channelName}
        > 🔗 [Chi tiết giao dịch](${messageUrl})`;
    } else if (direction === 'OUT') {
        logMessage = `🛑 **[LOG OUT]** Account **${acc.name}** đã gửi **-${amountStr}** cowoncy.
        > 👤 Người nhận: <@${partnerId}> (ID: ${partnerId})
        > 💬 Kênh: #${channelName}
        > 🔗 [Chi tiết giao dịch](${messageUrl})`;
    } else {
        logMessage = `[LOG UNKNOWN] Giao dịch không xác định cho ${acc.name}. Chi tiết: ${messageUrl}`;
    }

    try {
        await logChannel.send(logMessage);
    } catch (error) {
        console.error(`[LOG ERROR] Lỗi khi gửi log ${direction} cho ${acc.name}:`, error.message);
    }
}
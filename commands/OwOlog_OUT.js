// commands/OwOlog_OUT.js
import { sendLog } from './log.js'; 

/**
 * 
 * @param {Client} client 
 * @param {Object} acc 
 * @param {string} amount 
 * @param {string} targetId 
 * @param {string} channelName 
 * @param {string} messageUrl 
 */
export async function handleOwOLogOUT(client, acc, amount, targetId, channelName, messageUrl) {
    
    if (!acc.logChannelId) {
        console.error("❌ LỖI GHI LOG OUT: acc.logChannelId không tồn tại. Vui lòng chạy .setlog #ten-kenh");
        return;
    }

    try {
        await sendLog(
            client,
            acc,
            'OUT',
            amount,
            targetId,
            channelName,
            messageUrl
        );
    } catch (err) {
        console.error("❌ Lỗi khi gọi sendLog cho Log OUT:", err);
    }
}
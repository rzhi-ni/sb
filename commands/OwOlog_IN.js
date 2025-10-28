import { sendLog } from './log.js'; 
import pkg from "discord.js-selfbot-v13";
const { Client } = pkg;

// Cache để tránh xử lý tin nhắn trùng lặp
const processedMessages = new Set();
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 phút

// Dọn dẹp cache định kỳ để tránh memory leak
setInterval(() => {
    processedMessages.clear();
}, CACHE_CLEANUP_INTERVAL);

/**
 * Xử lý log IN từ OwO bot khi có message mới
 * @param {Message} message 
 * @param {Object} acc 
 * @param {Client} client 
 */
export async function handleOwOLogIN(message, acc, client) {
    if (!message || !message.content) return;

    const OWO_BOT_ID = "408785106942164992";
    const content = message.content;
    const botId = client.user.id; 
    const botMention = `<@${botId}>`;
    const botNicknameMention = `<@!${botId}>`;
   
    if (message.author.id !== OWO_BOT_ID) return; 
    
    if (!content.includes(botMention) && !content.includes(botNicknameMention)) {
        return; 
    }
    
    if (content.length < 10 || content.includes("declined the transaction") || content.includes("⚠️ This message is now inactive.")) {
        return;
    }
    
    let targetId = 'UNKNOWN'; 
    let amount = 'UNKNOWN';
    let direction = null;

    const regexInSend = new RegExp(`.*?\\| <@!?(\\d+)> sent \\*\\*([0-9,]+)\\*\\* cowoncy to <@!?${botId}>!`, 'i');
    let match = content.match(regexInSend);
    if (match) { 
        targetId = match[1]; 
        amount = match[2].replace(/,/g, ''); 
        direction = 'IN';
    }   
    if (!direction) {
        const regexInGive = new RegExp(`<@!?${botId}> (?:you got|has been gifted|was given) ([\\d,]+) (?:thanks to|by) <@!?(\\d+)>`, 'i');
        match = content.match(regexInGive);

        if (match) {
            amount = match[1].replace(/,/g, ''); 
            targetId = match[2]; 
            direction = 'IN';
        }
    }   
    if (direction === 'IN' && !isNaN(Number(amount)) && targetId !== 'UNKNOWN') {
        if (!acc.logChannelId) {
            console.error("❌ LỖI GHI LOG: acc.logChannelId không tồn tại. Vui lòng chạy .setlog #ten-kenh");
            return;
        }
        await sendLog(
            client,
            acc,
            'IN',
            amount,
            targetId,
            message.channel.name || 'DM',
            message.url
        );
    }
}

/**
 * Xử lý log IN từ OwO bot khi có message được edit (messageUpdate event)
 * @param {Message} oldMessage 
 * @param {Message} newMessage 
 * @param {Object} acc 
 * @param {Client} client 
 */
export async function handleOwOLogINUpdate(oldMessage, newMessage, acc, client) {
    // Chỉ xử lý nếu message được edit có nội dung khác với message cũ
    if (!newMessage || !newMessage.content || oldMessage.content === newMessage.content) {
        return;
    }
    
    // Tạo unique key cho message này
    const messageKey = `${newMessage.id}_${newMessage.content}`;
    
    // Kiểm tra cache để tránh xử lý trùng lặp
    if (processedMessages.has(messageKey)) {
        return;
    }

    const OWO_BOT_ID = "408785106942164992";
    const content = newMessage.content;
    const botId = client.user.id; 
    const botMention = `<@${botId}>`;
    const botNicknameMention = `<@!${botId}>`;
    
    if (newMessage.author.id !== OWO_BOT_ID) return; 
    
    if (!content.includes(botMention) && !content.includes(botNicknameMention)) {
        return; 
    }
    
    if (content.length < 10 || content.includes("declined the transaction") || content.includes("⚠️ This message is now inactive.")) {
        return;
    }
    
    let targetId = 'UNKNOWN'; 
    let amount = 'UNKNOWN';
    let direction = null;

    // Format mới: **💳 | <@ID>** sent **AMOUNT cowoncy** to **<@BOTID>**!
    const regexInSend = new RegExp(`\\*\\*.*?\\| <@!?(\\d+)>\\*\\* sent \\*\\*([0-9,]+) cowoncy\\*\\* to \\*\\*<@!?${botId}>\\*\\*!`, 'i');
    let match = content.match(regexInSend);
    if (match) { 
        targetId = match[1]; 
        amount = match[2].replace(/,/g, ''); 
        direction = 'IN';
    }   
    if (!direction) {
        const regexInGive = new RegExp(`<@!?${botId}> (?:you got|has been gifted|was given) ([\\d,]+) (?:thanks to|by) <@!?(\\d+)>`, 'i');
        match = content.match(regexInGive);

        if (match) {
            amount = match[1].replace(/,/g, ''); 
            targetId = match[2]; 
            direction = 'IN';
        }
    }   
    if (direction === 'IN' && !isNaN(Number(amount)) && targetId !== 'UNKNOWN') {
        if (!acc.logChannelId) {
            console.error("❌ LỖI GHI LOG: acc.logChannelId không tồn tại. Vui lòng chạy .setlog #ten-kenh");
            return;
        }
        await sendLog(
            client,
            acc,
            'IN',
            amount,
            targetId,
            newMessage.channel.name || 'DM',
            newMessage.url
        );
        
        // Đánh dấu message đã được xử lý
        processedMessages.add(messageKey);
    }
}

/**
 * Hàm tổng hợp để xử lý cả messageCreate và messageUpdate
 * @param {Message} message 
 * @param {Object} acc 
 * @param {Client} client 
 */
export async function handleOwOLogINGeneral(message, acc, client) {
    await handleOwOLogIN(message, acc, client);
}

/**
 * Hàm tổng hợp để xử lý messageUpdate
 * @param {Message} oldMessage 
 * @param {Message} newMessage 
 * @param {Object} acc 
 * @param {Client} client 
 */
export async function handleOwOLogINUpdateGeneral(oldMessage, newMessage, acc, client) {
    await handleOwOLogINUpdate(oldMessage, newMessage, acc, client);
}

/**
 * Hàm để setup các event listeners cho OwO log
 * @param {Client} client 
 * @param {Object} acc 
 */
export function setupOwOLogEvents(client, acc) {
    // Event khi có message mới
    client.on(Events.MessageCreate, async (message) => {
        try {
            await handleOwOLogIN(message, acc, client);
        } catch (error) {
            console.error('Lỗi khi xử lý messageCreate:', error);
        }
    });

    // Event khi có message được edit (THÊM MỚI)
    client.on(Events.MessageUpdate, async (oldMessage, newMessage) => {
        try {
            await handleOwOLogINUpdate(oldMessage, newMessage, acc, client);
        } catch (error) {
            console.error('Lỗi khi xử lý messageUpdate:', error);
        }
    });

    console.log('✅ Đã setup OwO log events (MessageCreate + MessageUpdate)');
}

import { RichPresence } from "discord.js-selfbot-v13";

export async function loadPresence(client) {
    try {
        const rpc = new RichPresence(client)
            .setApplicationId("1423099687497498734")
            .setType("PLAYING")
            .setName("Đang làm đơn")
            .setDetails("Đừng giục mà!")
            .setStartTimestamp(client.readyTimestamp ?? Date.now())
            .setAssetsLargeImage("image-1") 
            .setAssetsLargeText("RsStore")
            .setAssetsSmallImage("img_2660-2")
            .setAssetsSmallText("Trun Trí")
            .addButton("Anubis", "https://discord.gg/anubis")
            .addButton("rsstore", "https://discord.gg/kxveeWvb");

        client.user?.setPresence({ activities: [rpc] });
        console.log("🕹️ Rich Presence đã được bật tự động!");
    } catch (error) {
        console.error("❌", error);
    }
}

import { RichPresence } from "discord.js-selfbot-v13";

export async function loadPresence(client) {
    try {
        const rpc = new RichPresence(client)
            .setApplicationId("1249814041120215171")
            .setType("PLAYING")
            .setName("RsStore") // 📝 Tên game bạn muốn hiển thị
            .setDetails("Đừng giục mà!") // 📝 Mô tả RPC
            .setStartTimestamp(client.readyTimestamp ?? Date.now())
            .setAssetsLargeImage("4321")
            .setAssetsLargeText("RsStore")
            .setAssetsSmallImage("1234")
            .setAssetsSmallText("Trun Trí")
            .addButton("Anubis", "https://discord.gg/anubis")
            .addButton("rsstore", "https://discord.gg/kxveeWvb");

        client.user?.setPresence({ activities: [rpc] });

        console.log("🕹️ Rich Presence đã được bật tự động!");
    } catch (error) {
        console.error("❌", error);
    }
}

import mongoose from "mongoose";

let isConnected = false; // Track connection state

export async function connect() {
  if (isConnected) {
    return; // Already connected → skip
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState === 1;

    mongoose.connection.on("connected", () => {
      console.log("データベース接続成功しました");
    });

    mongoose.connection.on("error", (err) => {
      console.error("データベース接続失敗しました：" + err);
    });
  } catch (error) {
    console.error("データベース接続失敗しました：" + error);
    throw error;
  }
}

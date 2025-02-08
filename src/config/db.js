import mongoose from "mongoose";

class Database {
  constructor(uri) {
    this.uri = uri;
  }

  async connect() {
    try {
      mongoose.set("strictQuery", true);

      const conn = await mongoose.connect(this.uri);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);

      mongoose.connection.on("disconnected", async () => {
        console.warn("⚠️ MongoDB disconnected! Attempting to reconnect...");
        await this.reconnect();
      });

      mongoose.connection.on("error", (err) => {
        console.error(`❌ MongoDB error: ${err.message}`);
      });

    } catch (error) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      process.exit(1);
    }
  }

  async reconnect() {
    let attempts = 0;
    const maxAttempts = 5;
    const retryDelay = 5000; // 5 seconds

    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`🔄 Reconnecting to MongoDB (Attempt ${attempts}/${maxAttempts})...`);
        await mongoose.connect(this.uri);
        console.log("✅ MongoDB reconnected successfully!");
        return;
      } catch (error) {
        console.error(`❌ MongoDB reconnection failed: ${error.message}`);
        if (attempts < maxAttempts) {
          console.log(`⏳ Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          console.error("🚨 Max reconnection attempts reached. Exiting process.");
          process.exit(1);
        }
      }
    }
  }

  async disconnect() {
    try {
      await mongoose.connection.close();
      console.log("🚪 MongoDB disconnected.");
    } catch (error) {
      console.error(`❌ Error disconnecting MongoDB: ${error.message}`);
    }
  }
}

export default Database;
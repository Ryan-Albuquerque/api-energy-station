import mongoose from "mongoose";

export const DatabaseConnect = async (uri: string) => {
  try {
    const { connections } = await mongoose.connect(uri);

    connections.forEach((info) =>
      console.log(`[MONGO] Connected in ${info.host}`)
    );
  } catch (error) {
    console.error("[MONGO] Not connected", error);
    process.exit(1);
  }
};

export const DatabaseDisconnect = async () => {
  await mongoose.connection.close();
  console.log("[MONGO] Closed with success");
  process.exit(1);
};

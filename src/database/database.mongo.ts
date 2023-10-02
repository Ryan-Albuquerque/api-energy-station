import mongoose from "mongoose";

export const DatabaseConnect = (uri: string) => {
  mongoose
    .connect(uri)
    .then((res) =>
      res.connections.forEach((info) =>
        console.log(`[MONGO] Connected in ${info.host}`)
      )
    )
    .catch((error) => console.error("[MONGO] Not connected", error));
};

export const DatabaseDisconnect = async () => {
  await mongoose.connection.close();
  console.log("[MONGO] Closed with success");
};

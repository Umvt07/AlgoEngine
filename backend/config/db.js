import mongoose from 'mongoose';

export const cnct = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB OK");
  } catch (e) {
    console.error("DB Connection Failed:", e.message);
    process.exit(1);
  }
};
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  h: { type: String, required: true, unique: true }, // Codeforces Handle
  mxR: { type: Number, default: 0 }                  // Max Rating
});

const User= mongoose.model('User', userSchema);

export default User
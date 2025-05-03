import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: String,
  fname: String,
  dob: String,
  email: String,
  contact: Number,
  aadhaar: Number,
  pan: String,
  username: String,
  password: String,
  image: String,
  signature: String,
  acctype: String,
  amount: { type: Number, default: 0 },
  add: String,
});

export default mongoose.model("users", userSchema);

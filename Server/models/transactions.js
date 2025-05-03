import mongoose from "mongoose";

const userTrans = mongoose.Schema({
    username: String,
    amount: { type: Number, default: 0 },
    mode: String,
    transdate: String,
    transtime: String,
  });

  export default mongoose.model("transactions",userTrans);
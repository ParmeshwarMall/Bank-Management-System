import express from "express";

import {
  login,
  loginOTP,
  transaction,
  emailTransaction,
  transfer,
  detail,
  updateDetails,
  verifyUser,
  passwordChange,
  logout,
  userAuth,
} from "../controllers/user.js";
import { userMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/loginOTP", loginOTP);
router.get("/transaction", userMiddleware, transaction);
router.post("/emailTransaction", emailTransaction);
router.post("/transfer", userMiddleware, transfer);
router.get("/detail", userMiddleware, detail);
router.post("/updateDetails", updateDetails);
router.post("/verifyUser", verifyUser);
router.post("/passwordChange", passwordChange);
router.post("/logout", logout);
router.get("/userAuth", userMiddleware, userAuth);

export default router;

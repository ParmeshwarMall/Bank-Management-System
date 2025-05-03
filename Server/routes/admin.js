import express from "express";
import multer from "multer";

import {
  login,
  form,
  verifyEmail,
  balance,
  deposite,
  withdraw,
  transfer,
  deleteAccount,
  transaction,
  userDetail,
  allUsers,
  allTransactions,
  logout,
  adminAuth,
} from "../controllers/admin.js";
import { adminMiddleware } from "../middlewares/auth.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/login", login);
router.post(
  "/form",
  upload.fields([{ name: "image" }, { name: "signature" }]),
  form
);
router.post("/verifyEmail", verifyEmail);
router.post("/balance", adminMiddleware, balance);
router.post("/deposite", adminMiddleware, deposite);
router.post("/withdraw", adminMiddleware, withdraw);
router.post("/transfer", adminMiddleware, transfer);
router.post("/deleteAccount", adminMiddleware, deleteAccount);
router.post("/transaction", adminMiddleware, transaction);
router.post("/userDetail", adminMiddleware, userDetail);
router.get("/allUsers", adminMiddleware, allUsers);
router.get("/allTransactions", adminMiddleware, allTransactions);
router.post("/logout", logout);
router.get("/adminAuth", adminMiddleware, adminAuth);

export default router;

import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Transaction from "../models/transactions.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import otp_email_template from "./otpSendTemplate.js";

export const login = async (req, res) => {
  const { id, password } = req.body;
  if (id === "admin" && password === "1234") {
    const token = jwt.sign({ id: "admin" }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true, // true if using HTTPS
      sameSite: "None", // Required for cross-origin cookies
    });

    return res.json({ message: "Login successful" });
  } else {
    return res.json({ message: "Invalid credentials" });
  }
};

const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const form = async (req, res) => {
  try {
    const {
      name,
      fname,
      dob,
      email,
      contact,
      aadhaar,
      pan,
      username,
      password,
      acctype,
      amount,
      add,
    } = req.body;

    if (!req.files || !req.files.image || !req.files.signature) {
      return res
        .status(400)
        .json({ message: "Image and Signature are required" });
    }

    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashPass = await bcrypt.hash(password, 12);

    // Upload Image & Signature to Cloudinary
    const imageUrl = await uploadToCloudinary(
      req.files.image[0].buffer,
      "BankManagementSystem_Image"
    );
    const signatureUrl = await uploadToCloudinary(
      req.files.signature[0].buffer,
      "BankManagementSystem_Image"
    );

    // Save User Data in MongoDB
    const newUser = new User({
      name,
      fname,
      dob,
      email,
      contact,
      aadhaar,
      pan,
      username,
      password: hashPass,
      image: imageUrl,
      signature: signatureUrl,
      acctype,
      amount,
      add,
    });

    await newUser.save();

    // Save Transaction Data
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const newTrans = new Transaction({
      username,
      amount,
      mode: "Credit",
      transdate: formattedDate,
      transtime: formattedTime,
    });

    await newTrans.save();

    // Send Welcome Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bharat Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Bharat Bank!",
      html: `<h3>Dear ${name},</h3>
               <p>Thank you for choosing <strong>Bharat Bank</strong>. Your account has been successfully opened.</p>
               <p>For any queries, contact our support team.</p>
               <br/>
               <p>Best Regards,</p>
               <p>Bharat Bank Team</p>`,
    });

    res.status(201).json({
      message: "Account Open successfully",
    });
  } catch (err) {
    console.error("Error processing form submission:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Bharat Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verification",
      html: otp_email_template.replace("{OTP_CODE}", otp),
    });

    res.status(200).json({ message: "OTP sent successfully", otp }); // Only return OTP for testing; remove in production.
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const balance = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const isPassCrt = await bcrypt.compare(password, user.password);
      if (isPassCrt) {
        const amount = user.amount;
        res.send("Your current amount is: " + amount.toString());
      } else {
        res.send("Invalid Password");
      }
    } else {
      res.send("Invalid Username");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deposite = async (req, res) => {
  const { amount, username } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const newAmount = user.amount + Number(amount);
      user.amount = newAmount;
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

      const newTrans = new Transaction({
        username,
        amount,
        mode: "Credit",
        transdate: formattedDate,
        transtime: formattedTime,
      });
      await user.save();
      await newTrans.save();
      res.send(user.amount.toString());
    } else {
      res.send("InvalidU");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const withdraw = async (req, res) => {
  const { amount, username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const isPassCrt = await bcrypt.compare(password, user.password);
      if (isPassCrt) {
        if (user.amount >= amount) {
          user.amount -= Number(amount);
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
          const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

          const newTrans = new Transaction({
            username,
            amount,
            mode: "Debit",
            transdate: formattedDate,
            transtime: formattedTime,
          });
          await user.save();
          await newTrans.save();
          res.send(
            "Withdraw Successfully. Your current amount is: " +
              user.amount.toString()
          );
        } else {
          res.send("Your balance is less than withdraw amount");
        }
      } else {
        res.send("Invalid Password");
      }
    } else {
      res.send("Invalid Username");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const transfer = async (req, res) => {
  const { senusername, password, recusername, amount } = req.body;
  try {
    const sen = await User.findOne({ username: senusername });
    const rec = await User.findOne({ username: recusername });
    if (sen && rec) {
      const isPassCrt = await bcrypt.compare(password, sen.password);
      if (isPassCrt) {
        if (sen.amount >= amount) {
          sen.amount -= Number(amount);
          rec.amount += Number(amount);
          const now = new Date();
          const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
          const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

          const senNewTrans = new Transaction({
            username: senusername,
            amount,
            mode: "Debit",
            transdate: formattedDate,
            transtime: formattedTime,
          });
          const recNewTrans = new Transaction({
            username: recusername,
            amount,
            mode: "Credit",
            transdate: formattedDate,
            transtime: formattedTime,
          });
          await sen.save();
          await rec.save();
          await senNewTrans.save();
          await recNewTrans.save();
          res.send("Money transfer successfully");
        } else {
          res.send("Your current balance is low to complete this transaction");
        }
      } else {
        res.send("Invalid Password");
      }
    } else {
      res.send("Invalid Username");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const deleteAccount = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const isPassCrt = await bcrypt.compare(password, user.password);
      if (isPassCrt) {
        await user.deleteOne();
        await Transaction.deleteMany({ username: username });
        res.send("Account delete successfully");
      } else {
        res.send("Invalid Password");
      }
    } else {
      res.send("Invalid Username");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const transaction = async (req, res) => {
  const { username, password } = req.body;
  try {
    const transaction = await Transaction.find({ username: username });
    if (transaction) {
      res.send(transaction);
    } else {
      res.send("InvalidU");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const userDetail = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      const isPassCrt = await bcrypt.compare(password, user.password);
      if (isPassCrt) {
        res.send(user);
      } else {
        res.send("InvalidP");
      }
    } else {
      res.send("InvalidU");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    const transactions = await Transaction.find();
    res.json({
      users,
      totalUsers: users.length,
      totalTransactions: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const allTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.json({ message: "Logout successful" });
};

export const adminAuth = async (req, res) => {
  res.status(200).json({ message: "Authorized" });
};

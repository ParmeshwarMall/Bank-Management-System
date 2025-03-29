const express = require("express");
const cors = require("cors");
const port = 8000;
const mongoose = require("mongoose");
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: "https://bharat-bank.netlify.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const otp_email_template = require("./otpsendtemplate");

app.use(cookieParser());

require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
});

const secretKey = process.env.SECRET_KEY;
const mongoUrl1 = process.env.MONGO_URL1;
const mongoUrl2 = process.env.MONGO_URL2;

main()
  .then(() => {
    console.log("Connection success");
  })
  .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(mongoUrl2);
// }

async function main() {
  await mongoose.connect(mongoUrl1);
}

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

const userTrans = mongoose.Schema({
  username: String,
  amount: { type: Number, default: 0 },
  mode: String,
  transdate: String,
  transtime: String,
});

const User = mongoose.model("users", userSchema);
const Transaction = mongoose.model("transactions", userTrans);

const verifyToken = async (req, res, next) => {
  const token = await req.cookies.token;

  if (!token) {
    return res.status(403).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.cookies.adminToken;

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    if (decoded.id === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

app.post("/admin", (req, res) => {
  const { id, password } = req.body;
  if (id === "abc" && password === "xyz") {
    const token = jwt.sign({ id: "admin" }, secretKey, { expiresIn: "1h" });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: true, // true if using HTTPS
      sameSite: "None", // Required for cross-origin cookies
    });

    return res.json({ message: "Login successful" });
  } else {
    return res.json({ message: "Invalid credentials" });
  }
});

app.post("/", async (req, res) => {
  const { username, userpassword } = req.body;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return res.send("Invalid Username");
    }

    const isPassCrt = await bcrypt.compare(userpassword, userExist.password);
    if (isPassCrt) {
      const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true, // true if using HTTPS
        sameSite: "None", // Required for cross-origin cookies
      });
      return res.send("exist");
    } else {
      return res.send("Invalid Password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

app.post("/userotp", async (req, res) => {
  const { username, userpassword } = req.body;
  try {
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return res.send("Invalid Username");
    }
    const isPassCrt = await bcrypt.compare(userpassword, userExist.password);
    if (isPassCrt) {
      const email = userExist.email;
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
        from: `"Bharat Bank" <${process.env.EMAIL_USER}>`, // Corrected
        to: email,
        subject: "Verification",
        html: otp_email_template.replace("{OTP_CODE}", otp), // Corrected replacement
      });

      res.status(200).json({ message: "OTP sent successfully", otp });
    } else {
      return res.send("Invalid Password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred. Please try again later.");
  }
});

const upload = multer({ storage: multer.memoryStorage() });
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

app.post(
  "/form",
  upload.fields([{ name: "image" }, { name: "signature" }]),
  async (req, res) => {
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
  }
);

app.post("/balance", authMiddleware, async (req, res) => {
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
});

app.post("/deposite", authMiddleware, async (req, res) => {
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
});

app.post("/withdraw", authMiddleware, async (req, res) => {
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
});

app.post("/transfer", authMiddleware, async (req, res) => {
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
});

app.post("/delete", authMiddleware, async (req, res) => {
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
});

app.post("/transaction", authMiddleware, async (req, res) => {
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
});

app.get("/usertransaction", verifyToken, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      username: req.user.username,
    });
    res.send(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/passchg", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      user.password = await bcrypt.hash(password, 12);
      await user.save();
      res.send("Password change successfully!");
    } else {
      res.send("Invalid username");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/userdetail", authMiddleware, async (req, res) => {
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
});

app.get("/detail", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/updtdetail", async (req, res) => {
  const { ousername, nusername, email, contact, add } = req.body;
  try {
    const user = await User.findOne({ username: ousername });
    if (user) {
      if (nusername) user.username = nusername;
      if (email) user.email = email;
      if (contact) user.contact = contact;
      if (add) user.add = add;
      await user.save();
      if (nusername) {
        const updTrans = await Transaction.find({ username: ousername });
        for (let i of updTrans) {
          i.username = nusername;
          await i.save();
        }
      }
      //await updTrans.save();
      res.send("Update details successfully");
    } else {
      res.send("Invalid");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/email", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username: username });
  const email = user.email;
  const transaction = await Transaction.find({ username: username });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let tableRows = "";
  transaction.forEach((i) => {
    tableRows += `
            <tr>
                <td>${i.amount}</td>
                <td>${i.mode}</td>
                <td>${i.transdate}</td>
                <td>${i.transtime}</td>
            </tr>
            `;
  });

  async function main() {
    const info = await transporter.sendMail({
      from: `"Bharat Bank" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hello from Bharat Bank",
      html: `
                <h2> Transaction History </h2>
                <table border="3">
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>

                        ${tableRows}
                    </tbody>
                </table>`,
    });

    res.send("Email send successfully");
  }
  main().catch(console.error);
});

app.get("/allusers", authMiddleware, async (req, res) => {
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
});

app.get("/alltransactions", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/userlogout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.json({ message: "Logout successful" });
});

app.post("/adminlogout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.json({ message: "Logout successful" });
});

app.post("/otpsend", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const email = user.email;
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
      from: `"Bharat Bank" <${process.env.EMAIL_USER}>`, // Corrected
      to: email,
      subject: "Verification",
      html: otp_email_template.replace("{OTP_CODE}", otp), // Corrected replacement
    });

    res.status(200).json({ message: "OTP sent successfully", otp }); // Only return OTP for testing; remove in production.
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/verifyemail", async (req, res) => {
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
});

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
});

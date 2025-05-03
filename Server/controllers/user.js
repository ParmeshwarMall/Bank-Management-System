import jwt from "jsonwebtoken";
import User from "../models/users.js";
import Transaction from "../models/transactions.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import otp_email_template from "./otpSendTemplate.js";

export const login = async (req, res) => {
  const { username, userpassword } = req.body;

  try {
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return res.send("Invalid Username");
    }

    const isPassCrt = await bcrypt.compare(userpassword, userExist.password);
    if (isPassCrt) {
      const token = jwt.sign({ username }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });
      res.cookie("userToken", token, {
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
};

export const loginOTP = async (req, res) => {
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
};

export const transaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      username: req.user.username,
    });
    res.json({transactions,username:req.user.username});
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const emailTransaction = async (req, res) => {
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
};

export const transfer = async (req, res) => {
  const { recusername, amount } = req.body;
  try {
    const sen = await User.findOne({ username: req.user.username });
    const rec = await User.findOne({ username: recusername });
    if (sen && rec) {
      if (sen.amount >= amount) {
        sen.amount -= Number(amount);
        rec.amount += Number(amount);
        const now = new Date();
        const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
        const formattedTime = now.toTimeString().split(" ")[0]; // HH:MM:SS

        const senNewTrans = new Transaction({
          username: req.user.username,
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
      res.send("Invalid Username");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const detail = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    res.send(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const updateDetails = async (req, res) => {
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
};

export const verifyUser = async (req, res) => {
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
};

export const passwordChange = async (req, res) => {
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
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.json({ message: "Logout successful" });
};

export const userAuth = async (req, res) => {
  res.status(200).json({ message: "Authorized" });
};

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";
import PasswordReset from "../models/PasswordReset.js";
// Email JS 




dotenv.config();

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;



let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'Mrityunjaysingh.off@gmail.com',
    pass: 'Mrityunjays.Off#19'
  }
});


export const sendVerificationEmail = async (user, res) => {
  // console.log("send v : ", user, res);
  const { _id, email, lastName } = user;

  const token = _id + uuidv4();
  console.log('token : ', token);

  const link = APP_URL + "users/verify/" + _id + "/" + token;
  console.log('Link : ', link);

  //  mail options
  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `<div
    style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
    <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
    <hr>
    <h4>Hi ${lastName},</h4>
    <p>
        Please verify your email address so we can know that it's really you.
        <br>
    <p>This link <b>expires in 1 hour</b></p>
    <br>
    <a href=${link}
        style="color: #fff; padding: 14px; text-decoration: none; background-color: #000;  border-radius: 8px; font-size: 18px;">Verify
        Email Address</a>
    </p>
    <div style="margin-top: 20px;">
        <h5>Best Regards</h5>
        <h5>Socialink Team</h5>
    </div>
    </div>`,
  };

  try {
    const hashedToken = await hashString(token);
    // console.log('Hash Token : ',hashedToken);

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: token,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    console.log('new verrific : ', newVerifiedEmail);

    if (newVerifiedEmail) {
      console.log('enter new');
      transporter.sendMail(mailOptions)
        .then(() => {
          res.status(201).send({
            success: "PENDING",
            message:
              "Verification email has been sent to your account. Check your email for further instructions.",
          });
        })
        .catch((err) => {
          console.log('not new');

          console.log(err);
          res.status(500).json({ message: "Something went wrong1" });
        });
    }


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong2" });
  }
};

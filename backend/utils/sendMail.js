import { tranEmailApi } from "../config/brevo.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendMail = async (name, email, message) => {
  try {
    const sender = {
      email: process.env.VERIFIED_EMAIL, // verified Brevo email
      name: "Janhavi Portfolio",
    };

    const receivers = [
      {
        email: "itankarjanvi@gmail.com",
        name: "Janhavi",
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,

      // recruiter email so you can reply directly
      replyTo: {
        email: email,
        name: name,
      },

      subject: `📩 New Portfolio Contact Request from ${name}`,

      htmlContent: `
        <div style="font-family: Arial, sans-serif; padding:20px; background:#f9f9f9">
          
          <h2 style="color:#2563eb;">New Recruiter Contact</h2>

          <p>
            Someone has contacted you through your <b>Portfolio Contact Form</b>.
          </p>

          <hr style="margin:20px 0"/>

          <h3>Contact Details</h3>

          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>

          <h3>Message</h3>
          <p style="background:white;padding:15px;border-radius:6px;border:1px solid #ddd">
            ${message}
          </p>

          <hr style="margin:20px 0"/>

          <p style="color:#555;font-size:14px">
            You can reply directly to this email to respond to the sender.
          </p>

          <p style="color:#888;font-size:12px">
            Sent from your Portfolio Contact Form
          </p>

        </div>
      `,
    });

  

  } catch (error) {
    console.error("Brevo mail error:", error);
    throw error;
  }
};
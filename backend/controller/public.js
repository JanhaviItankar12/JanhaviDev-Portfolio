import { sendMail } from "../utils/sendMail.js";
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  try {

    const { name, email, message } = req.body;
    console.log(req.body);

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Save message in DB
    const newMessage = await Message.create({
      name,
      email,
      message
    });

    // Send email notification
    await sendMail(name, email, message);

   

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage
    });
     
  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
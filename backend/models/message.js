import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please use a valid email address"
      ]
    },

    message: {
      type: String,
      required: [true, "Message cannot be empty"],
      minlength: [10, "Message should be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"]
    },

    isRead: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true
  }
);

export default mongoose.model("Message", messageSchema);
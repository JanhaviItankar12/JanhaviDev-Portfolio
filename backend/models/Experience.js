import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    technologies: [
      {
        type: String
      }
    ],

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date
    },

    currentlyWorking: {
      type: Boolean,
      default: false
    },

    companyLogo: {
      type: String
    },

    location: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Experience", experienceSchema);
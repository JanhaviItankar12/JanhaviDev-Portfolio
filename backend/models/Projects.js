import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
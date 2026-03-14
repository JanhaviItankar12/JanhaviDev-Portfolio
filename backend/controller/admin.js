import cloudinary from "../config/cloudinary.js";
import Admin from "../models/Admin.js";
import Experience from "../models/Experience.js";
import message from "../models/message.js";
import Message from "../models/message.js";
import Project from "../models/Projects.js";



export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, github, live, featured } = req.body;

    //  Basic field validations
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Project title is required",
      });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Project description is required",
      });
    }

    if (!technologies || technologies.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "At least one technology is required",
      });
    }

    //  Optional URL validation for GitHub and Live links
    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.+)?$/i;

    if (github && !urlPattern.test(github)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub URL",
      });
    }

    if (live && !urlPattern.test(live)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Live project URL",
      });
    }

    //  Validate featured as boolean
    const isFeatured = featured === true || featured === "true";

    //  Image upload to Cloudinary if file exists
    let imageURL = "";
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio_projects",
      });
      imageURL = uploaded.secure_url;
    }

    console.log(imageURL);

    //  Create project
    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      techStack: technologies.split(",").map((t) => t.trim()),
      githubLink: github ? github.trim() : "",
      liveLink: live ? live.trim() : "",
      featured: isFeatured,
      imageURL,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {

    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, github, live, featured } = req.body;

    // --- Basic field validations ---
    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ success: false, message: "Project description is required" });
    }
    if (!technologies || technologies.trim() === "") {
      return res.status(400).json({ success: false, message: "At least one technology is required" });
    }

    // --- URL validation ---
    const urlPattern = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.+)?$/i;
    if (github && !urlPattern.test(github)) {
      return res.status(400).json({ success: false, message: "Invalid GitHub URL" });
    }
    if (live && !urlPattern.test(live)) {
      return res.status(400).json({ success: false, message: "Invalid Live project URL" });
    }

    const isFeatured = featured === true || featured === "true";

    // --- Find the existing project first ---
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // --- Handle new image upload ---
    if (req.file) {
      // Delete previous image from Cloudinary if it exists
      if (project.imageURL) {
        const publicId = project.imageURL.split("/").pop().split(".")[0]; // extract public_id
        await cloudinary.uploader.destroy(`portfolio_projects/${publicId}`);
      }

      // Upload new image
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio_projects",
      });
      project.imageURL = uploaded.secure_url;
    }

    // --- Update other fields ---
    project.title = title.trim();
    project.description = description.trim();
    project.techStack = technologies.split(",").map((t) => t.trim());
    project.githubLink = github ? github.trim() : "";
    project.liveLink = live ? live.trim() : "";
    project.featured = isFeatured;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the project first
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Delete image from Cloudinary if it exists
    if (project.imageURL) {
      // Extract public_id from URL
      // Example: https://res.cloudinary.com/<cloud>/image/upload/v1670000000/portfolio_projects/abc123.jpg
      const urlParts = project.imageURL.split("/");
      const filename = urlParts[urlParts.length - 1]; // "abc123.jpg"
      const publicId = `portfolio_projects/${filename.split(".")[0]}`; // "portfolio_projects/abc123"

      await cloudinary.uploader.destroy(publicId);
    }

    // Delete the project from DB
    await Project.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getProjectById=async(req,res)=>{
    try {
        const {id}=req.params;
        const project=await Project.find({id});
        if(!project){
            return res.status(404).json({
                message:"Project not found!"
            })
        }

        return res.status(200).json({
            message:"Project data fetched..",
            project
        })
    } catch (error) {
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

export const markMessageAsRead = async (req, res) => {
  try {

    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    message.isRead = true;

    await message.save();

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
      data: message
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const getMessages = async (req, res) => {
  try {

    const messages = await Message.find().sort({ createdAt: -1 });

    if (messages.length === 0) {
      return res.status(404).json({
        message: "Messages not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages fetched",
      messages
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {

    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({
        message: "Message not found"
      });
    }

    if (!message.isRead) {
      return res.status(400).json({
        message: "Unread message cannot be deleted"
      });
    }

    await Message.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const createExperience = async (req, res) => {
  try {
    const {
      company = "",
      role = "",
      description = "",
      technologies = "",
      startDate = "",
      endDate = "",
      currentlyWorking = false,
      location = ""
    } = req.body;

    // --- Validations ---
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company, role, and start date are required",
      });
    }

    let companyLogoURL = "";

    // --- Handle company logo if file uploaded ---
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "experience_logos",
      });
      companyLogoURL = uploaded.secure_url;
    }

    // --- Create experience entry ---
    const experience = await Experience.create({
      company: company.trim(),
      role: role.trim(),
      description: description.trim(),
      technologies: technologies ? technologies.split(",").map(t => t.trim()) : [],
      startDate,
      endDate,
      currentlyWorking,
      location: location.trim(),
      companyLogo: companyLogoURL, // store Cloudinary URL
    });

    return res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: experience,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getExperiences = async (req, res) => {
  try {

    const experiences = await Experience.find().sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      message: "Experiences fetched",
      data: experiences
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });

  }
};

export const getExperienceById = async (req, res) => {
  try {

    const { id } = req.params;

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: experience
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });

  }
};


export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body) {
      return res.status(400).json({ success: false, message: "No data provided" });
    }

    const {
      company = "",
      role = "",
      description = "",
      technologies = "",
      startDate = "",
      endDate = "",
      currentlyWorking = false,
      location = ""
    } = req.body;

    // --- Validate required fields ---
    if (!company.trim() || !role.trim() || !startDate.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company, role, and start date are required",
      });
    }

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    // --- Handle new companyLogo ---
    if (req.file) {
      // Delete old logo from Cloudinary if exists
      if (experience.companyLogo) {
        const urlParts = experience.companyLogo.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `experience_logos/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new logo
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "experience_logos",
      });
      experience.companyLogo = uploaded.secure_url;
    }

    // --- Update other fields ---
    experience.company = company.trim();
    experience.role = role.trim();
    experience.description = description.trim();
    experience.technologies = technologies ? technologies.split(",").map(t => t.trim()) : [];
    experience.startDate = startDate;
    experience.endDate = endDate;
    experience.currentlyWorking = currentlyWorking;
    experience.location = location.trim();

    await experience.save();

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ success: false, message: "Experience not found" });
    }

    // Delete companyLogo from Cloudinary if exists
    if (experience.companyLogo) {
      const urlParts = experience.companyLogo.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = `experience_logos/${filename.split(".")[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete from DB
    await Experience.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

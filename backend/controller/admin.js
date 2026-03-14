import cloudinary from "../config/cloudinary.js";
import Admin from "../models/Admin.js";
import Experience from "../models/Experience.js";
import message from "../models/message.js";
import Message from "../models/message.js";
import Project from "../models/Projects.js";




export const createProject = async (req, res) => {
  try {

    const { title, description, technologies, github, live, featured } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required"
      });
    }

    let imageURL = "";

   

    if (req.file) {

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio_projects"
      });

      imageURL = uploaded.secure_url;
    }

    const project = await Project.create({
      title,
      description,
      techStack: technologies.split(",").map(t => t.trim()),
      githubLink: github,
      liveLink: live,
      featured,
      imageURL
    });

    return res.status(201).json({
      success: true,
      message: "Project created",
      data: project
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Server Error"
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

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const deleteProject = async (req, res) => {
  try {

    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
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
      company,
      role,
      description,
      technologies,
      startDate,
      endDate,
      currentlyWorking,
      location
    } = req.body;

    if (!company || !role || !startDate) {
      return res.status(400).json({
        success: false,
        message: "Company, role and start date are required"
      });
    }

    const experience = await Experience.create({
      company,
      role,
      description,
      technologies,
      startDate,
      endDate,
      currentlyWorking,
      location
    });

    return res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: experience
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error"
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

    const experience = await Experience.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: experience
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });

  }
};

export const deleteExperience = async (req, res) => {
  try {

    const { id } = req.params;

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return res.status(404).json({
        message: "Experience not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });

  }
};

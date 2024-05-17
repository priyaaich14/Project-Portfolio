const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  about: [{
    content: { type: String, required: true },
  }],
  skills: [{
    name: { type: String, required: true },
    proficiency: { type: Number, required: true },
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    link: String,
  }],
  contact: [{
    email: { type: String, required: true },
    phoneNumber: String,
    linkedin: String,
    message: String,
  }],
  certifications: [{
    name: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true },
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    year: { type: Number, required: true },
  }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    achievements: [{ type: String }],
  }],
  languages: [{
    name: { type: String, required: true },
    proficiency: { type: Number, required: true },
  }],
}, { timestamps: true });

const Profile = model('Profile', profileSchema);
module.exports = Profile;

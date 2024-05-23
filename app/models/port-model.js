
const mongoose = require('mongoose')
const { Schema, model } = mongoose

const profileSchema = new Schema({
  about: [{
    content: { type: String, required: true, minlength: 10 },
  }],
  skills: [{
    name: { type: String, required: true },
    proficiency: { type: Number, required: true, min: 1, max: 10 },
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    link: { type: String, validate: { validator: v => !v || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v), message: 'Invalid URL' } },
  }],
  contact: [{
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    phoneNumber: { type: String, match: /^\+91-\d{10}$/ },
    linkedin: { type: String, validate: { validator: v => !v || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v), message: 'Invalid URL' } },
    message: { type: String, minlength: 10 },
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
    field: { type: String, required: false }  // Optionally required
  }],
  // experience: [{
  //   title: { type: String, required: true },
  //   company: { type: String, required: true },
  //   startDate: { type: Date, required: true },
  //   endDate: { type: String, enum: ['current', 'present', null] },
  //   location: { type: String, required: true },
  //   description: { type: String, required: true },
  //   technologies: [{ type: String }],
  //   achievements: [{ type: String }],
  // }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: String, required: false, validate: {
        validator: function(v) {
            return v === 'current' || v === 'present' || /^\d{4}-\d{2}-\d{2}$/.test(v);
        },
        message: props => `${props.value} is not a valid ending date. It must be 'current', 'present', or a valid date (YYYY-MM-DD).`
    }},
    location: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    achievements: [{ type: String }],
  }],
   languages: [{
    name: { type: String, required: true },
    proficiency: { type: Number, required: true, min: 1, max: 10 },
  }],
}, { timestamps: true });

const Profile = model('Profile', profileSchema)
module.exports = Profile

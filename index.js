const express = require('express');
const cors = require('cors');
const configureDB = require('./config/db');
const profileController = require('./app/controller/port-cltr');
const {
  aboutValidationSchema,
  skillsValidationSchema,
  projectsValidationSchema,
  contactValidationSchema,
  certificationsValidationSchema,
  educationValidationSchema,
  experienceValidationSchema,
  languageValidationSchema
} = require('./app/validators/port-validator');

const app = express();
const port = 7800;

app.use(express.json());
app.use(cors());
configureDB();

// Routes for About section
app.get('/api/about/:id', profileController.showAbout);
app.put('/api/about/:id', aboutValidationSchema, profileController.updateAbout);
app.delete('/api/about/:id', profileController.removeAbout);

// Routes for Contact section
app.get('/api/contact/:id', profileController.showContact);
app.put('/api/contact/:id', contactValidationSchema, profileController.updateContact);
app.delete('/api/contact/:id', profileController.removeContact);

// Routes for Skills section
app.get('/api/skills/:id/:skillId', profileController.showSkill);
app.put('/api/skills/:id/:skillId', skillsValidationSchema, profileController.updateSkill);
app.delete('/api/skills/:id/:skillId', profileController.removeSkill);

// Routes for Projects section
app.get('/api/projects/:id/:projectId', profileController.showProject);
app.put('/api/projects/:id/:projectId', projectsValidationSchema, profileController.updateProject);
app.delete('/api/projects/:id/:projectId', profileController.removeProject);

// Routes for Certifications section
app.get('/api/certifications/:id/:certificationId', profileController.showCertification);
app.put('/api/certifications/:id/:certificationId', certificationsValidationSchema, profileController.updateCertification);
app.delete('/api/certifications/:id/:certificationId', profileController.removeCertification);

// Routes for Education section
app.get('/api/education/:id/:educationId', profileController.showEducation);
app.put('/api/education/:id/:educationId', educationValidationSchema, profileController.updateEducation);
app.delete('/api/education/:id/:educationId', profileController.removeEducation);

// Routes for Experience section
app.get('/api/experience/:id/:experienceId', profileController.showExperience);
app.put('/api/experience/:id/:experienceId', experienceValidationSchema, profileController.updateExperience);
app.delete('/api/experience/:id/:experienceId', profileController.removeExperience);

// Routes for Language section
app.get('/api/language/:id/:languageId', profileController.showLanguage);
app.put('/api/language/:id/:languageId', languageValidationSchema, profileController.updateLanguage);
app.delete('/api/language/:id/:languageId', profileController.removeLanguage);

// Routes for creating and listing profiles
app.get('/api/profiles', profileController.listProfiles);
app.post('/api/profiles', profileController.createProfile);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

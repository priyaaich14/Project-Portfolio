const { body } = require('express-validator');

const aboutValidationSchema = [
  body('about.content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long')
];

const skillsValidationSchema = [
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*.name')
    .trim()
    .notEmpty()
    .withMessage('Skill name cannot be empty'),
  body('skills.*.proficiency')
    .isInt({ min: 1, max: 10 })
    .withMessage('Proficiency must be between 1 and 10')
];

const projectsValidationSchema = [
  body('projects')
    .isArray()
    .withMessage('Projects must be an array'),
  body('projects.*.title')
    .notEmpty()
    .withMessage('Project title cannot be empty'),
  body('projects.*.description')
    .notEmpty()
    .withMessage('Project description cannot be empty'),
  body('projects.*.technologies')
    .isArray()
    .withMessage('Technologies must be an array'),
  body('projects.*.link')
    .optional()
    .isURL()
    .withMessage('Link must be a valid URL')
];

const contactValidationSchema = [
  body('contact.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email must be valid'),
  body('contact.phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Phone number must be valid'),
  body('contact.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
  body('contact.message')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters long')
];

const certificationsValidationSchema = [
  body('certifications')
    .isArray()
    .withMessage('Certifications must be an array'),
  body('certifications.*.name')
    .notEmpty()
    .withMessage('Certification name cannot be empty'),
  body('certifications.*.institution')
    .notEmpty()
    .withMessage('Institution name cannot be empty'),
  body('certifications.*.year')
    .isInt()
    .withMessage('Year must be an integer')
];

const educationValidationSchema = [
  body('education')
    .isArray()
    .withMessage('Education must be an array'),
  body('education.*.degree')
    .notEmpty()
    .withMessage('Degree cannot be empty'),
  body('education.*.institution')
    .notEmpty()
    .withMessage('Institution name cannot be empty'),
  body('education.*.year')
    .isInt()
    .withMessage('Year must be an integer')
];

const experienceValidationSchema = [
  body('experience')
    .isArray()
    .withMessage('Experience must be an array'),
  body('experience.*.title')
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('experience.*.company')
    .notEmpty()
    .withMessage('Company name cannot be empty'),
  body('experience.*.startDate')
    .isISO8601()
    .toDate()
    .withMessage('Start date must be a valid date'),
  body('experience.*.endDate')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('End date must be a valid date'),
  body('experience.*.location')
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('experience.*.description')
    .notEmpty()
    .withMessage('Description cannot be empty'),
  body('experience.*.technologies')
    .isArray()
    .withMessage('Technologies must be an array'),
  body('experience.*.achievements')
    .isArray()
    .withMessage('Achievements must be an array')
];

const languageValidationSchema = [
  body('languages')
    .isArray()
    .withMessage('Languages must be an array'),
  body('languages.*.name')
    .notEmpty()
    .withMessage('Language name cannot be empty'),
  body('languages.*.proficiency')
    .isInt({ min: 1, max: 10 })
    .withMessage('Proficiency must be between 1 and 10')
];

module.exports = {
  aboutValidationSchema,
  skillsValidationSchema,
  projectsValidationSchema,
  contactValidationSchema,
  certificationsValidationSchema,
  educationValidationSchema,
  experienceValidationSchema,
  languageValidationSchema
};

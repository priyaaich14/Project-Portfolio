const Profile = require('../models/port-model');
const { validationResult } = require('express-validator');
const { format } = require('date-fns');

const profileController = {};

// Helper function to format dates
function formatDates(profile) {
  const dateFormat = 'yyyy-MM-dd HH:mm:ss';
  return {
    ...profile.toObject(),
    createdAt: format(profile.createdAt, dateFormat),
    updatedAt: format(profile.updatedAt, dateFormat),
  };
}

// List all profiles
profileController.listProfiles = (req, res) => {
  Profile.find()
    .then(profiles => {
      const formattedProfiles = profiles.map(profile => formatDates(profile));
      res.json(formattedProfiles);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Create a new profile
profileController.createProfile = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { about, skills, projects, contact, certifications, education, experience, languages } = req.body;
  const profile = new Profile({ about, skills, projects, contact, certifications, education, experience, languages });

  profile.save()
    .then(savedProfile => {
      res.status(201).json(formatDates(savedProfile));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Show specific section
profileController.showAbout = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile.about);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.showContact = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile.contact);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Update specific section
profileController.updateAbout = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      profile.about = req.body.about;
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.about);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateContact = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      profile.contact = req.body.contact;
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.contact);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Delete specific section
profileController.removeAbout = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      profile.about = undefined;
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeContact = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      profile.contact = undefined;
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Show, Update, and Delete individual skills
profileController.showSkill = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const skill = profile.skills.id(req.params.skillId);
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      res.json(skill);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateSkill = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const skill = profile.skills.id(req.params.skillId);
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      skill.set(req.body);
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.skills.id(req.params.skillId));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeSkill = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const skill = profile.skills.id(req.params.skillId);
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      skill.remove();
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

// Similarly, create methods for projects, certifications, education, and experience sections
profileController.showProject = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const project = profile.projects.id(req.params.projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateProject = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const project = profile.projects.id(req.params.projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      project.set(req.body);
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.projects.id(req.params.projectId));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeProject = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const project = profile.projects.id(req.params.projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      project.remove();
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.showCertification = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const certification = profile.certifications.id(req.params.certificationId);
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      res.json(certification);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateCertification = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const certification = profile.certifications.id(req.params.certificationId);
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      certification.set(req.body);
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.certifications.id(req.params.certificationId));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeCertification = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const certification = profile.certifications.id(req.params.certificationId);
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' });
      }
      certification.remove();
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.showEducation = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const education = profile.education.id(req.params.educationId);
      if (!education) {
        return res.status(404).json({ error: 'Education not found' });
      }
      res.json(education);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateEducation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const education = profile.education.id(req.params.educationId);
      if (!education) {
        return res.status(404).json({ error: 'Education not found' });
      }
      education.set(req.body);
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.education.id(req.params.educationId));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeEducation = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const education = profile.education.id(req.params.educationId);
      if (!education) {
        return res.status(404).json({ error: 'Education not found' });
      }
      education.remove();
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.showExperience = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const experience = profile.experience.id(req.params.experienceId);
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      res.json(experience);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateExperience = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const experience = profile.experience.id(req.params.experienceId);
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      experience.set(req.body);
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.experience.id(req.params.experienceId));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeExperience = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const experience = profile.experience.id(req.params.experienceId);
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      experience.remove();
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.showLanguage = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const language = profile.languages.id(req.params.languageId);
      if (!language) {
        return res.status(404).json({ error: 'Language not found' });
      }
      res.json(language);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.updateLanguage = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const language = profile.languages.id(req.params.languageId);
      if (!language) {
        return res.status(404).json({ error: 'Language not found' });
      }
      language.set(req.body);
      return profile.save();
    })
    .then(updatedProfile => {
      res.json(updatedProfile.languages.id(req.params.languageId));
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

profileController.removeLanguage = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const language = profile.languages.id(req.params.languageId);
      if (!language) {
        return res.status(404).json({ error: 'Language not found' });
      }
      language.remove();
      return profile.save();
    })
    .then(() => {
      res.status(204).send();
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
};

module.exports = profileController;

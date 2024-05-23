const Profile = require('../models/port-model')
const { validationResult } = require('express-validator')
const { format } = require('date-fns')
//const mongoose = require('mongoose')
const profileController = {}

// Helper function to format dates
function formatDates(profile) {
  const dateFormat = 'yyyy-MM-dd HH:mm:ss'
  return {
    ...profile.toObject(),
    createdAt: format(profile.createdAt, dateFormat),
    updatedAt: format(profile.updatedAt, dateFormat),
  }
}

// List all profiles
profileController.listProfiles = (req, res) => {
  Profile.find()
    .then(profiles => {
      const formattedProfiles = profiles.map(profile => formatDates(profile))
      res.json(formattedProfiles)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

// Create a new profile
profileController.createProfile = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { about, skills, projects, contact, certifications, education, experience, languages } = req.body
  const profile = new Profile({ about, skills, projects, contact, certifications, education, experience, languages })

  profile.save()
    .then(savedProfile => {
      res.status(201).json(formatDates(savedProfile))
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

// Show about section
profileController.showAbout = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      res.json(profile.about)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

// Update about section
profileController.updateAbout = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  const { about } = req.body

  Profile.findByIdAndUpdate(id, { about }, { new: true })
    .then(updatedProfile => {
      if (!updatedProfile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      res.json(updatedProfile.about)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}



    // Delete about section
profileController.removeAbout = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      const aboutToDelete = profile.about; // Store the about section to return it later
      Profile.findByIdAndDelete(req.params.id) // Correct deletion method
        .then(() => {
          res.status(200).json({ message: 'About section deleted', about: aboutToDelete })
        })
        .catch(err => {
          res.status(500).json({ error: err.message })
        })
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}


// Show contact section
profileController.showContact = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      res.json(profile.contact)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
  
}

// Update contact section
profileController.updateContact = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  const { contact } = req.body

  Profile.findByIdAndUpdate(id, { contact }, { new: true })
    .then(updatedProfile => {
      if (!updatedProfile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      res.json(updatedProfile.contact)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

// Delete contact section
profileController.removeContact = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      const contactToDelete = profile.contact; // Save the contact info
      Profile.findByIdAndDelete(req.params.id)  // Delete the profile now
        .then(() => {
          res.json({ message: 'Contact deleted', contact: contactToDelete }) // Send deleted contact info in the response
        })
        .catch(err => {
          res.status(500).json({ error: err.message })
        })
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}


// Show skills
profileController.showSkill = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      const skill = profile.skills.id(req.params.skillId)
      if (!skill) {
        return res.status(404).json({ error: 'Skill not found' })
      }
      res.json(skill)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

//update skills
profileController.updateSkill = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id, skillId } = req.params
  const { skills } = req.body

  // Retrieve the profile first
  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Update the specific skill
      const skillIndex = profile.skills.findIndex(skill => skill._id.toString() === skillId)
      if (skillIndex === -1) {
        return res.status(404).json({ error: 'Skill not found' })
      }

      // Update the skill at the found index
      profile.skills[skillIndex] = { ...profile.skills[skillIndex].toObject(), ...skills[0] }

      // Save the profile with updated skill
      profile.save()
        .then(updatedProfile => {
          res.json(updatedProfile.skills[skillIndex])
        })
        .catch(err => {
          console.error('Error saving the profile:', err)
          res.status(500).json({ error: err.message })
        })

    })
    .catch(err => {
      console.error('Error finding the profile:', err)
      res.status(500).json({ error: err.message })
    })
}


// Delete skill
profileController.removeSkill = (req, res) => {
  const { id, skillId } = req.params

  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Find the skill and remove it
      const skillIndex = profile.skills.findIndex(skill => skill._id.toString() === skillId)
      if (skillIndex === -1) {
        return res.status(404).json({ error: 'Skill not found' })
      }

      // Store the deleted skill for response
      const deletedSkill = profile.skills.splice(skillIndex, 1)

      // Save the updated profile
      profile.save()
        .then(() => res.status(200).json({ 
          message: 'Skill deleted successfully',
          deletedSkill: deletedSkill[0]  // Since splice returns an array, take the first element
        }))
        .catch(err => res.status(500).json({ error: err.message }))

    })
    .catch(err => {
      console.error('Error finding the profile:', err)
      res.status(500).json({ error: err.message })
    })
}

// Show projects
profileController.showProject = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      const project = profile.projects.id(req.params.projectId)
      if (!project) {
        return res.status(404).json({ error: 'Project not found' })
      }
      res.json(project)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}
// Update project
profileController.updateProject = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id, projectId } = req.params
  const { projects } = req.body

  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Find the project index in the profile's projects array
      const projectIndex = profile.projects.findIndex(project => project._id.toString() === projectId)
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Update the project at the found index
      profile.projects[projectIndex] = { ...profile.projects[projectIndex].toObject(), ...projects[0] }

      // Save the updated profile
      profile.save()
        .then(updatedProfile => {
          res.json(updatedProfile.projects[projectIndex])
        })
        .catch(err => {
          console.error('Error saving the profile:', err)
          res.status(500).json({ error: err.message })
        })
    })
    .catch(err => {
      console.error('Error finding the profile:', err)
      res.status(500).json({ error: err.message })
    })
}

// Delete project
profileController.removeProject = (req, res) => {
  const { id, projectId } = req.params; // Ensure projectId is part of your route parameters

  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Find the index of the project to be removed
      const projectIndex = profile.projects.findIndex(project => project._id.toString() === projectId)
      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' })
      }

      // Store the deleted project for response
      const deletedProject = profile.projects.splice(projectIndex, 1)

      // Save the updated profile
      profile.save()
        .then(() => res.status(200).json({
          message: 'Project deleted successfully',
          deletedProject: deletedProject[0]  // Since splice returns an array, take the first element
        }))
        .catch(err => {
          console.error('Error saving the profile:', err)
          res.status(500).json({ error: err.message })
        })

    })
    .catch(err => {
      console.error('Error finding the profile:', err)
      res.status(500).json({ error: err.message })
    })
}

// Show certification
profileController.showCertification = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      const certification = profile.certifications.id(req.params.certificationId)
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' })
      }
      res.json(certification)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}
// Update certification
profileController.updateCertification = (req, res) => {
  const { id, certificationId } = req.params  // IDs from the route parameters
  const updatedCertificationData = req.body.certification  // Updated data from the request body

  Profile.findById(id)  // Find the profile by ID
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      const certification = profile.certifications.id(certificationId) // Get the specific certification
      if (!certification) {
        return res.status(404).json({ error: 'Certification not found' })
      }

      // Update the certification fields
      Object.assign(certification, updatedCertificationData)

      // Save the profile after updating the certification
      return profile.save()  // Ensure to return this promise for proper chaining
    })
    .then(updatedProfile => {
      // After saving, fetch the updated certification again to ensure the response contains the latest data
      const updatedCertification = updatedProfile.certifications.id(certificationId)
      res.json(updatedCertification); // Send the updated certification in the response
    })
    .catch(err => {
      console.error('Error updating the certification:', err)
      res.status(500).json({ error: err.message })
    })
}

// Delete certification
profileController.removeCertification = (req, res) => {
  const { id, certificationId } = req.params

  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      const certificationIndex = profile.certifications.findIndex(cert => cert._id.toString() === certificationId)
      if (certificationIndex === -1) {
        return res.status(404).json({ error: 'Certification not found' })
      }

      const deletedCertification = profile.certifications.splice(certificationIndex, 1)

      profile.save()
        .then(() => res.status(200).json({
          message: 'Certification deleted successfully',
          deletedCertification: deletedCertification[0]
        }))
        .catch(err => {
          console.error('Error saving the profile:', err)
          res.status(500).json({ error: err.message })
        })
    })
    .catch(err => {
      console.error('Error finding the profile:', err)
      res.status(500).json({ error: err.message })
    })
}

//show education
profileController.showEducation = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
      const education = profile.education.id(req.params.educationId)
      if (!education) {
        return res.status(404).json({ error: 'Education not found' })
      }
      res.json(education)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

//update education
profileController.updateEducation = (req, res) => {
  const { id, educationId } = req.params  // IDs from the route parameters
  const updatedEducationData = req.body.education  // Updated data from the request body

  if (!Array.isArray(updatedEducationData)) {
    return res.status(400).json({ error: 'Education data must be an array' })
  }

  const educationToUpdate = updatedEducationData.find(edu => edu._id === educationId)
  if (!educationToUpdate) {
    // console.log("Updated education data provided:", updatedEducationData)
    // console.log("Education ID provided:", educationId)
    return res.status(404).json({ error: 'Education entry not found' })
  }

  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      const education = profile.education.id(educationId)
      if (!education) {
        return res.status(404).json({ error: 'Education not found' })
      }

      education.set(educationToUpdate)
      profile.markModified('education')

      return profile.save()
    })
    .then(savedProfile => {
      const updatedEducation = savedProfile.education.id(educationId)
      res.json(updatedEducation)
    })
    .catch(err => {
      console.error('Error updating education:', err)
      res.status(500).json({ error: err.message })
    })
}

//delete education
profileController.removeEducation = (req, res) => {
  const { id, educationId } = req.params // Assume educationId is part of the route parameters

  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      const educationIndex = profile.education.findIndex(edu => edu._id.toString() === educationId)
      if (educationIndex === -1) {
        return res.status(404).json({ error: 'Education not found' })
      }

      const deletedEducation = profile.education.splice(educationIndex, 1)
      profile.save()
        .then(() => res.status(200).json({
          message: 'Education deleted successfully',
          deletedEducation: deletedEducation[0]
        }))
        .catch(err => {
          console.error('Error saving the profile:', err)
          res.status(500).json({ error: err.message })
        })
    })
    .catch(err => {
      console.error('Error finding the profile:', err)
      res.status(500).json({ error: err.message })
    })
}

// Show experience
profileController.showExperience = (req, res) => {
  const { id, experienceId } = req.params // Extract parameters clearly at the start

  Profile.findById(id) // Use findById to get the profile
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' }) // Profile not found error
      }

      const experience = profile.experience.id(experienceId) // Access experience subdocument by ID
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' }) // Experience not found error
      }

      res.json(experience) // Return the specific experience entry
    })
    .catch(err => {
      console.error('Error fetching experience:', err) // Log server-side error
      res.status(500).json({ error: err.message }) // Return server error
    })
}

// Update experience
profileController.updateExperience = (req, res) => {
  const { id, experienceId } = req.params
  const updatedExperienceData = req.body.experience
if (!Array.isArray(updatedExperienceData) || updatedExperienceData.length === 0) {
    return res.status(400).json({ error: 'Experience data must be an array and cannot be empty' })
  }
// Find the specific experience object in the array that matches the experienceId
  const experienceToUpdate = updatedExperienceData.find(exp => exp._id && exp._id.toString() === experienceId)
  if (!experienceToUpdate) {
    return res.status(404).json({ error: 'Experience entry not found' })
  }
  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }
    const experience = profile.experience.id(experienceId)
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' })
      }
    // Update the experience fields
      Object.keys(experienceToUpdate).forEach(key => {
        experience[key] = experienceToUpdate[key]
      })
    // Mark the experience field as modified
      profile.markModified('experience')
    // Save the updated profile
      return profile.save()
    })
    .then(savedProfile => {
      const updatedExperience = savedProfile.experience.id(experienceId)
      res.json(updatedExperience)
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

// Delete experience
profileController.removeExperience = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Retrieve the experience using the experienceId
      const experienceToDelete = profile.experience.id(req.params.experienceId)

      // Check if the experience exists
      if (!experienceToDelete) {
        return res.status(404).json({ error: 'Experience not found' })
      }
  // Extract experience details for response before deletion
      const deletedExperience = {
        _id: experienceToDelete._id,
        title: experienceToDelete.title, // Assume `title` is a field in your experience subdocument
        company: experienceToDelete.company,
        startDate: experienceToDelete.startDate,
        endDate: experienceToDelete.endDate,
        location: experienceToDelete.location,
        description: experienceToDelete.description,
        technologies: experienceToDelete.technologies,
        achievements: experienceToDelete.achievements
      }
    // Remove the experience from the array
      profile.experience.pull({ _id: req.params.experienceId })
    // Save the profile after removing the experience
      profile.save()
        .then(() => {
          res.json({ message: 'Experience deleted', experience: deletedExperience })
        })
        .catch(saveErr => {
          res.status(500).json({ error: saveErr.message })
        })
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

// Show language
profileController.showLanguage = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        // Standardized error response for not finding the profile
        return res.status(404).json({ error: 'Profile not found' })
      }
    // Retrieve the specific language from the profile's languages subdocument array
      const language = profile.languages.id(req.params.languageId)
      if (!language) {
        // Standardized error response for not finding the specific language
        return res.status(404).json({ error: 'Language not found' })
      }
    // Response formatting, if any additional formatting is needed
      // For example, you might format the response to include more or specific data
      const formattedLanguage = {
        id: language._id,
        name: language.name,  // Assuming 'name' is a field within the language subdocument
        proficiency: language.proficiency  // Assuming 'proficiency' is a field within the language subdocument
        // Add more fields or calculations as needed
      }
  // Return the formatted language data
      res.json(formattedLanguage)
    })
    .catch(err => {
      // Standardized error handling
      res.status(500).json({ error: err.message })
    })
}

// Update language
profileController.updateLanguage = (req, res) => {
  const { id, languageId } = req.params;
  const { name, proficiency } = req.body.languages[0] // Assuming only one language is updated

  // Validate request inputs
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
// Fetch the profile by ID
  Profile.findById(id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Find the specific language by ID within the languages array
      const language = profile.languages.id(languageId)
      if (!language) {
        return res.status(404).json({ error: 'Language not found' })
      }
    // Update the language fields
      language.name = name;
      language.proficiency = proficiency
    // Save the updated profile
      return profile.save()
     })
    .then(updatedProfile => {
      // Fetch updated language after save
      const updatedLanguage = updatedProfile.languages.id(languageId)
      return res.json(updatedLanguage)
    })
    .catch(err => {
      console.error("Error updating language:", err)
      res.status(500).json({ error: err.message })
    })
}


// Delete language
profileController.removeLanguage = (req, res) => {
  Profile.findById(req.params.id)
    .then(profile => {
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' })
      }

      // Find the specific language by its ID within the languages array
      const languageToDelete = profile.languages.id(req.params.languageId)
      if (!languageToDelete) {
        return res.status(404).json({ error: 'Language not found' })
      }

      // Store the details of the language to be deleted for the response
      const deletedLanguageDetails = {
        _id: languageToDelete._id,
        name: languageToDelete.name,  // Assuming 'name' is a field within the language subdocument
        proficiency: languageToDelete.proficiency  // Assuming 'proficiency' is also a field
      }

      // Remove the language from the array using pull or direct manipulation
      profile.languages.pull({_id: req.params.languageId}) // This is the correct way to remove an item

      // Save the profile after the language has been removed
      profile.save()
        .then(() => {
          res.json({ message: 'Language deleted', language: deletedLanguageDetails })
        })
        .catch(saveErr => {
          res.status(500).json({ error: saveErr.message })
        })
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
}

module.exports = profileController

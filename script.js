// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(ele => {
    ele.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        })
    })
})

// Fetch profile data and update the DOM
function fetchProfileData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:7803/api/profiles') // Change this URL to match your API
    xhr.onload = function () {
        if (xhr.status === 200) {
            const profiles = JSON.parse(xhr.responseText)
            const profile = profiles[0] // Assuming you want the first profile
            updateProfile(profile)
        } else {
            console.error('Error fetching profiles:', xhr.status, xhr.statusText)
        }
    }
    xhr.send()
}

function updateProfile(profile) {
    updateAboutSection(profile)
    updateSkillsSection(profile)
    updateExperienceSection(profile)
    updateProjectsSection(profile)
    updateEducationSection(profile)
    updateLanguagesSection(profile)
    updateCertificationsSection(profile)
    updateContactDetails(profile)
}

function updateAboutSection(profile) {
    document.getElementById('about-content').textContent = profile.about[0].content
}

function updateSkillsSection(profile) {
    const skillsContent = document.getElementById('skills-content') // Ensure you have a container with this ID in HTML
    skillsContent.innerHTML = profile.skills.map(skill => `
        <li>${skill.name} (Proficiency: ${skill.proficiency}/10)</li>
    `).join('')
}

function updateExperienceSection(profile) {
    const experienceContent = document.getElementById('experience-content')
    experienceContent.innerHTML = profile.experience.map(exp => {
        let formattedEndDate = exp.endDate === 'current' || exp.endDate === 'present' ?
            exp.endDate.charAt(0).toUpperCase() + exp.endDate.slice(1) :
            new Date(exp.endDate).toLocaleDateString()
        return `
            <div class="experience-item">
                <h3>${exp.title} at ${exp.company}</h3>
                <p>${new Date(exp.startDate).toLocaleDateString()} - ${formattedEndDate}</p>
                <p>${exp.description}</p>
            </div>
        `
    }).join('')
}

function updateProjectsSection(profile) {
    const projectsContent = document.getElementById('projects-content')
    projectsContent.innerHTML = profile.projects.map(project => `
        <div class="project-item">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
        </div>
    `).join('')
}

function updateEducationSection(profile) {
    const educationContent = document.getElementById('education-content')
    educationContent.innerHTML = profile.education.map(edu => `
        <div class="education-item">
            <h3>${edu.degree}</h3>
            <p>${edu.institution} - ${edu.year}</p>
        </div>
    `).join('')
}

function updateLanguagesSection(profile) {
    const languagesContent = document.getElementById('languages-content')
    languagesContent.innerHTML = profile.languages.map(lang => `
        <p>${lang.name} (Proficiency: ${lang.proficiency}/10)</p>
    `).join('')
}

function updateCertificationsSection(profile) {
    const certificationsContent = document.getElementById('certifications-content')
    certificationsContent.innerHTML = profile.certifications.map(cert => `
        <div class="certification-item">
            <h3>${cert.name}</h3>
            <p>${cert.institution} - ${cert.year}</p>
        </div>
    `).join('')
}

function updateContactDetails(profile) {
    const contact = profile.contact[0]
    document.getElementById('email-link').textContent = contact.email
    document.getElementById('email-link').href = `mailto:${contact.email}`
    document.getElementById('phone').textContent = contact.phoneNumber
    document.getElementById('linkedin-link').href = contact.linkedin
}

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault()
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const message = document.getElementById('message').value.trim()

    if (!name || !email || !message) {
        alert('Please fill in all fields.')
        return
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.')
        return
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:7803/api/contact', true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
        if (xhr.status === 201) {
            alert('Form submitted successfully!')
        } else {
            console.error('Error submitting form:', xhr.status, xhr.statusText)
            alert('Failed to submit form. Please try again.')
        }
    }
    xhr.send(JSON.stringify({ name, email, message }))
})

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email.toLowerCase())
}

// Initial fetch to load profile data
fetchProfileData()

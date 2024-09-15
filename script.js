
document.querySelectorAll('nav ul li a').forEach(ele => {
    ele.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        })
    })
})

function fetchProfileData() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:7803/api/profiles', true) // Ensure this URL matches your API
    xhr.onload = function () {
        if (xhr.status === 200) {
            const profiles = JSON.parse(xhr.responseText)
            console.log(profiles) // Debug: Log the profiles to verify the response
            updateProfiles(profiles)
        } else {
            console.error('Error fetching profiles:', xhr.status, xhr.statusText)
        }
    }
    xhr.send()
}
function deleteProfile(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:7803/api/profiles/${id}`, true)
    xhr.onload = function () {
        if (xhr.status === 200) {
            alert('Profile deleted successfully!')
            fetchProfileData(); // Refresh the profiles list
        } else {
            console.error('Error deleting profile:', xhr.status, xhr.statusText)
            alert('Failed to delete profile. Please try again.')
        }
    }
    xhr.send()
}

function updateProfiles(profiles) {
    const profilesContainer = document.getElementById('profiles-container')
    profilesContainer.innerHTML = '' // Clear existing content

    profiles.forEach(profile => {
        const profileElement = document.createElement('div')
        profileElement.classList.add('profile')

        profileElement.innerHTML = `
            <section id="about">
                <h1>About Me</h1>
                <div class="about-content">
                    <img src="profile.jpg" alt="Profile Image" class="profile-image">
                    <p>${profile.about[0].content}</p>
                </div>
            </section>
            <section id="skills">
                <h2>Skills</h2>
                <ul>
                    ${profile.skills.map(skill => `<li>${skill.name} (Proficiency: ${skill.proficiency}/10)</li>`).join('')}
                </ul>
            </section>
            <section id="experience">
                <h2>Experience</h2>
                ${profile.experience.map(exp => `
                    <div class="experience-item">
                        <h3>${exp.title} at ${exp.company}</h3>
                        <p>${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate === 'current' ? 'Present' : new Date(exp.endDate).toLocaleDateString()}</p>
                        <p>${exp.description}</p>
                    </div>
                `).join('')}
            </section>
            <section id="projects">
                <h2>Projects</h2>
                ${profile.projects.map(project => `
                    <div class="project-item">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                `).join('')}
            </section>
            <section id="education">
                <h2>Education</h2>
                ${profile.education.map(edu => `
                    <div class="education-item">
                        <h3>${edu.degree}</h3>
                        <p>${edu.institution} - ${edu.year}</p>
                    </div>
                `).join('')}
            </section>
            <section id="languages">
                <h2>Languages</h2>
                ${profile.languages.map(lang => `
                    <p>${lang.name} (Proficiency: ${lang.proficiency}/10)</p>
                `).join('')}
            </section>
            <section id="certifications">
                <h2>Certifications</h2>
                ${profile.certifications.map(cert => `
                    <div class="certification-item">
                        <h3>${cert.name}</h3>
                        <p>${cert.institution} - ${cert.year}</p>
                    </div>
                `).join('')}
            </section>
            <section id="contact">
                <h2>Contact</h2>
                <p>Email: <a href="mailto:${profile.contact[0].email}">${profile.contact[0].email}</a></p>
                <p>Phone: ${profile.contact[0].phoneNumber}</p>
                <p><a href="${profile.contact[0].linkedin}" target="_blank">LinkedIn</a></p>
            </section>
        `

        profilesContainer.appendChild(profileElement)
    })
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

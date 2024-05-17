document.addEventListener('DOMContentLoaded', () => {
    loadAbout();
    loadSkills();
    loadProjects();
    loadContact();
    loadCertifications();
    loadEducation();
    loadExperience();
});

function xhrRequest(method, url, data = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
            callback(JSON.parse(xhr.responseText));
        } else {
            console.error('Request failed', xhr.statusText);
        }
    };
    xhr.send(data ? JSON.stringify(data) : null);
}

function loadAbout() {
    xhrRequest('GET', '/api/about', null, data => {
        if (data.length > 0) {
            document.getElementById('about-content').value = data[0].content;
        }
    });
}

function updateAbout() {
    const content = document.getElementById('about-content').value;
    xhrRequest('POST', '/api/about', { content }, () => {
        alert('About section updated!');
    });
}

function loadSkills() {
    xhrRequest('GET', '/api/skills', null, data => {
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = '';
        data.forEach(skill => {
            const li = document.createElement('li');
            li.textContent = `${skill.name} (Proficiency: ${skill.proficiency})`;
            skillsList.appendChild(li);
        });
    });
}

function addSkill() {
    const name = document.getElementById('skill-name').value;
    const proficiency = document.getElementById('skill-proficiency').value;
    xhrRequest('POST', '/api/skills', { name, proficiency }, () => {
        loadSkills();
    });
}

function loadProjects() {
    xhrRequest('GET', '/api/projects', null, data => {
        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = '';
        data.forEach(project => {
            const li = document.createElement('li');
            li.textContent = `${project.title}: ${project.description}`;
            projectsList.appendChild(li);
        });
    });
}

function addProject() {
    const title = document.getElementById('project-title').value;
    const description = document.getElementById('project-description').value;
    xhrRequest('POST', '/api/projects', { title, description }, () => {
        loadProjects();
    });
}

function loadContact() {
    xhrRequest('GET', '/api/contact', null, data => {
        if (data.length > 0) {
            document.getElementById('contact-email').value = data[0].email;
            document.getElementById('contact-phone').value = data[0].phoneNumber;
            document.getElementById('contact-linkedin').value = data[0].linkedin;
        }
    });
}

function updateContact() {
    const email = document.getElementById('contact-email').value;
    const phoneNumber = document.getElementById('contact-phone').value;
    const linkedin = document.getElementById('contact-linkedin').value;
    xhrRequest('POST', '/api/contact', { email, phoneNumber, linkedin }, () => {
        alert('Contact section updated!');
    });
}

function loadCertifications() {
    xhrRequest('GET', '/api/certifications', null, data => {
        const certificationsList = document.getElementById('certifications-list');
        certificationsList.innerHTML = '';
        data.forEach(certification => {
            const li = document.createElement('li');
            li.textContent = `${certification.name} - ${certification.institution} (${certification.year})`;
            certificationsList.appendChild(li);
        });
    });
}

function addCertification() {
    const name = document.getElementById('certification-name').value;
    const institution = document.getElementById('certification-institution').value;
    const year = document.getElementById('certification-year').value;
    xhrRequest('POST', '/api/certifications', { name, institution, year }, () => {
        loadCertifications();
    });
}

function loadEducation() {
    xhrRequest('GET', '/api/education', null, data => {
        const educationList = document.getElementById('education-list');
        educationList.innerHTML = '';
        data.forEach(education => {
            const li = document.createElement('li');
            li.textContent = `${education.degree} - ${education.institution} (${education.year})`;
            educationList.appendChild(li);
        });
    });
}

function addEducation() {
    const degree = document.getElementById('education-degree').value;
    const institution = document.getElementById('education-institution').value;
    const year = document.getElementById('education-year').value;
    xhrRequest('POST', '/api/education', { degree, institution, year }, () => {
        loadEducation();
    });
}

function loadExperience() {
    xhrRequest('GET', '/api/experience', null, data => {
        const experienceList = document.getElementById('experience-list');
        experienceList.innerHTML = '';
        data.forEach(experience => {
            const li = document.createElement('li');
            li.textContent = `${experience.title} at ${experience.company} (${experience.startDate.split('T')[0]} - ${experience.endDate ? experience.endDate.split('T')[0] : 'Present'}) in ${experience.location}: ${experience.description}`;
            experienceList.appendChild(li);
        });
    });
}

function addExperience() {
    const title = document.getElementById('experience-title').value;
    const company = document.getElementById('experience-company').value;
    const startDate = document.getElementById('experience-startDate').value;
    const endDate = document.getElementById('experience-endDate').value;
    const location = document.getElementById('experience-location').value;
    const description = document.getElementById('experience-description').value;
    xhrRequest('POST', '/api/experience', { title, company, startDate, endDate, location, description }, () => {
        loadExperience();
    });
}

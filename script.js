// Tab functionality
const tabs = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.id.replace('Tab', 'Section');
        
        // Update tab styles
        tabs.forEach(t => {
            t.classList.remove('tab-active');
            t.classList.add('text-gray-600', 'hover:bg-white', 'hover:bg-opacity-50');
        });
        tab.classList.add('tab-active');
        tab.classList.remove('text-gray-600', 'hover:bg-white', 'hover:bg-opacity-50');
        
        // Show/hide sections
        sections.forEach(section => section.classList.add('hidden'));
        document.getElementById(targetId).classList.remove('hidden');
    });
});

// Simulated AI responses
const aiResponses = {
    resume: {
        summary: "Dynamic and results-driven professional with expertise in modern technologies and a passion for innovation. Proven track record of delivering high-quality solutions and collaborating effectively in team environments.",
        experience: "• Led development of scalable web applications using modern frameworks\n• Collaborated with cross-functional teams to deliver projects on time\n• Implemented best practices for code quality and performance optimization\n• Mentored junior developers and contributed to technical documentation",
        skills: "Technical Skills: JavaScript, React, Node.js, Python, SQL, Git\nSoft Skills: Problem-solving, Team collaboration, Communication, Project management"
    },
    coverLetter: "Dear Hiring Manager,\n\nI am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in software development and passion for creating innovative solutions, I am excited about the opportunity to contribute to your team.\n\nMy experience includes developing scalable web applications, working with modern frameworks, and collaborating effectively in agile environments. I am particularly drawn to [Company Name] because of your commitment to innovation and excellence in the industry.\n\nI would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's success. Thank you for considering my application.\n\nSincerely,\n[Your Name]",
    proofread: "Here are some suggestions to improve your document:\n\n✅ Grammar & Style:\n• Consider using more active voice\n• Ensure consistent tense throughout\n• Replace generic terms with specific achievements\n\n✅ Content Improvements:\n• Add quantifiable results where possible\n• Use stronger action verbs\n• Tailor content to match job requirements\n\n✅ Formatting:\n• Ensure consistent spacing and alignment\n• Use bullet points for better readability\n• Keep sections well-organized and scannable"
};

// Local storage for saved documents
let savedDocuments = JSON.parse(localStorage.getItem('aiResumeDocuments') || '[]');

function showLoading() {
    document.getElementById('loadingModal').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingModal').classList.add('hidden');
}

function saveDocument(type, content, metadata) {
    const doc = {
        id: Date.now(),
        type: type,
        content: content,
        metadata: metadata,
        createdAt: new Date().toISOString()
    };
    savedDocuments.push(doc);
    localStorage.setItem('aiResumeDocuments', JSON.stringify(savedDocuments));
    updateSavedDocuments();
}

function updateSavedDocuments() {
    const container = document.getElementById('savedDocuments');
    
    if (savedDocuments.length === 0) {
        container.innerHTML = `
            <div class="text-center text-gray-500 py-12">
                <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <p class="text-lg">No saved documents yet</p>
                <p class="text-sm">Generate resumes and cover letters to see them here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = savedDocuments.map(doc => `
        <div class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h3 class="font-semibold text-lg">${doc.type === 'resume' ? '📄' : '📝'} ${doc.metadata.title || (doc.type === 'resume' ? 'Resume' : 'Cover Letter')}</h3>
                    <p class="text-gray-600 text-sm">${doc.metadata.subtitle || ''}</p>
                    <p class="text-gray-500 text-xs mt-2">Created: ${new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="flex space-x-2">
                    <button onclick="viewDocument(${doc.id})" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors">
                        👁️ View
                    </button>
                    <button onclick="downloadDocument(${doc.id})" class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors">
                        ⬇️ Download
                    </button>
                    <button onclick="deleteDocument(${doc.id})" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function viewDocument(id) {
    const doc = savedDocuments.find(d => d.id === id);
    if (!doc) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">${doc.type === 'resume' ? '📄' : '📝'} ${doc.metadata.title || (doc.type === 'resume' ? 'Resume' : 'Cover Letter')}</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div class="prose max-w-none">
                    <pre class="whitespace-pre-wrap font-sans">${doc.content}</pre>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function downloadDocument(id) {
    const doc = savedDocuments.find(d => d.id === id);
    if (!doc) return;

    const blob = new Blob([doc.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.metadata.title || doc.type}_${new Date(doc.createdAt).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function deleteDocument(id) {
    // Create custom confirmation modal instead of browser alert
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <h3 class="text-lg font-bold mb-4">Delete Document</h3>
            <p class="text-gray-600 mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
            <div class="flex space-x-3 justify-end">
                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                    Cancel
                </button>
                <button onclick="confirmDelete(${id}); this.closest('.fixed').remove()" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    Delete
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmDelete(id) {
    savedDocuments = savedDocuments.filter(d => d.id !== id);
    localStorage.setItem('aiResumeDocuments', JSON.stringify(savedDocuments));
    updateSavedDocuments();
}

// Resume form handler
document.addEventListener('DOMContentLoaded', function() {
    const resumeForm = document.getElementById('resumeForm');
    if (resumeForm) {
        resumeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            if (!data.fullName || !data.jobTitle) {
                showInlineMessage('Please fill in at least your name and target job title.', 'error');
                return;
            }

            showLoading();
            
            // Simulate AI processing
            setTimeout(() => {
                const resumeContent = `
${data.fullName.toUpperCase()}
${data.email} | ${data.phone}

PROFESSIONAL SUMMARY
${aiResponses.resume.summary}

SKILLS
${data.skills ? data.skills.split(',').map(skill => `• ${skill.trim()}`).join('\n') : aiResponses.resume.skills}

WORK EXPERIENCE
${data.experience || aiResponses.resume.experience}

EDUCATION
${data.education || 'Bachelor\'s Degree in relevant field'}

ADDITIONAL INFORMATION
• Seeking ${data.jobTitle} position
• Strong problem-solving and analytical skills
• Excellent communication and teamwork abilities
                `.trim();

                const previewElement = document.getElementById('resumePreview');
                if (previewElement) {
                    previewElement.innerHTML = `
                        <div class="text-left space-y-4 fade-in">
                            <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed">${resumeContent}</pre>
                        </div>
                    `;
                }
                
                const downloadBtn = document.getElementById('downloadResume');
                if (downloadBtn) {
                    downloadBtn.classList.remove('hidden');
                }
                
                // Save to local storage
                saveDocument('resume', resumeContent, {
                    title: `${data.fullName} - ${data.jobTitle}`,
                    subtitle: `Resume for ${data.jobTitle} position`
                });
                
                hideLoading();
            }, 2000);
        });
    }
});

// Cover letter form handler
document.addEventListener('DOMContentLoaded', function() {
    const coverLetterForm = document.getElementById('coverLetterForm');
    if (coverLetterForm) {
        coverLetterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            if (!data.clFullName || !data.companyName || !data.clJobTitle) {
                showInlineMessage('Please fill in your name, company name, and job title.', 'error');
                return;
            }

            showLoading();
            
            setTimeout(() => {
                const coverLetterContent = aiResponses.coverLetter
                    .replace(/\[Job Title\]/g, data.clJobTitle)
                    .replace(/\[Company Name\]/g, data.companyName)
                    .replace(/\[Your Name\]/g, data.clFullName);

                const previewElement = document.getElementById('coverLetterPreview');
                if (previewElement) {
                    previewElement.innerHTML = `
                        <div class="text-left space-y-4 fade-in">
                            <pre class="whitespace-pre-wrap font-sans text-sm leading-relaxed">${coverLetterContent}</pre>
                        </div>
                    `;
                }
                
                const downloadBtn = document.getElementById('downloadCoverLetter');
                if (downloadBtn) {
                    downloadBtn.classList.remove('hidden');
                }
                
                saveDocument('coverLetter', coverLetterContent, {
                    title: `Cover Letter - ${data.companyName}`,
                    subtitle: `${data.clJobTitle} position`
                });
                
                hideLoading();
            }, 2000);
        });
    }
});

// Proofread handler
document.addEventListener('DOMContentLoaded', function() {
    const proofreadBtn = document.getElementById('proofreadBtn');
    if (proofreadBtn) {
        proofreadBtn.addEventListener('click', () => {
            const textElement = document.getElementById('documentText');
            const text = textElement ? textElement.value.trim() : '';
            
            if (!text) {
                showInlineMessage('Please paste some text to proofread.', 'error');
                return;
            }

            showLoading();
            
            setTimeout(() => {
                const resultsElement = document.getElementById('proofreadResults');
                const outputElement = document.getElementById('proofreadOutput');
                
                if (resultsElement) {
                    resultsElement.classList.remove('hidden');
                }
                
                if (outputElement) {
                    outputElement.innerHTML = `
                        <div class="fade-in">
                            <pre class="whitespace-pre-wrap font-sans text-sm">${aiResponses.proofread}</pre>
                        </div>
                    `;
                }
                hideLoading();
            }, 1500);
        });
    }
});

// Download handlers
document.addEventListener('DOMContentLoaded', function() {
    const downloadResumeBtn = document.getElementById('downloadResume');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            const previewElement = document.getElementById('resumePreview');
            const content = previewElement ? previewElement.textContent : '';
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    const downloadCoverLetterBtn = document.getElementById('downloadCoverLetter');
    if (downloadCoverLetterBtn) {
        downloadCoverLetterBtn.addEventListener('click', () => {
            const previewElement = document.getElementById('coverLetterPreview');
            const content = previewElement ? previewElement.textContent : '';
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cover_letter.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
});

// Inline message function (replaces alert)
function showInlineMessage(message, type = 'info') {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-md w-full p-6">
            <div class="flex items-center mb-4">
                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 ${type === 'error' ? 'bg-red-100' : 'bg-blue-100'}">
                    <svg class="w-5 h-5 ${type === 'error' ? 'text-red-600' : 'text-blue-600'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        ${type === 'error' 
                            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
                        }
                    </svg>
                </div>
                <h3 class="text-lg font-semibold">${type === 'error' ? 'Error' : 'Information'}</h3>
            </div>
            <p class="text-gray-600 mb-6">${message}</p>
            <div class="flex justify-end">
                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    OK
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize saved documents on page load
document.addEventListener('DOMContentLoaded', function() {
    updateSavedDocuments();
});
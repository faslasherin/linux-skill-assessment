// Linux Skill Assessment - Main Application Logic
// Handles: index.html (form submission) and result.html (results display)

(function() {
    'use strict';
    
    // State management
    const state = {
        studentName: '',
        studentEmail: '',
        questions: [],
        currentIndex: 0,
        answers: {},
        isAnswerShuffled: true,
        isSubmitted: false
    };
    
    // DOM element cache
    const elements = {};
    
    // Initialize the application
    function init() {
        cacheDOM();
        bindEvents();
        
        // Check URL for redirect
        if (window.location.pathname.includes('quiz.html')) {
            // Quiz page handles its own logic now
            return;
        } else if (window.location.pathname.includes('result.html')) {
            loadResultState();
        }
    }
    
    // Cache DOM elements
    function cacheDOM() {
        // Home page elements
        elements.studentForm = document.getElementById('student-form');
        elements.fullName = document.getElementById('full-name');
        elements.email = document.getElementById('email');
        elements.nameError = document.getElementById('name-error');
        elements.emailError = document.getElementById('email-error');
        
        // Result page elements
        elements.resultIcon = document.getElementById('result-icon');
        elements.resultTitle = document.getElementById('result-title');
        elements.resultStatus = document.getElementById('result-status');
        elements.resultName = document.getElementById('result-name');
        elements.resultEmail = document.getElementById('result-email');
        elements.resultDate = document.getElementById('result-date');
        elements.resultTotal = document.getElementById('result-total');
        elements.resultCorrect = document.getElementById('result-correct');
        elements.resultIncorrect = document.getElementById('result-incorrect');
        elements.resultScore = document.getElementById('result-score');
        elements.resultPercentage = document.getElementById('result-percentage');
        elements.downloadPdfBtn = document.getElementById('download-pdf-btn');
        elements.retryBtn = document.getElementById('retry-btn');
    }
    
    // Bind event listeners
    function bindEvents() {
        // Home page - form submission
        if (elements.studentForm) {
            elements.studentForm.addEventListener('submit', handleFormSubmit);
            
            // Real-time validation
            elements.fullName.addEventListener('input', () => validateName());
            elements.email.addEventListener('input', () => validateEmail());
        }
        
        // Result page - actions
        if (elements.downloadPdfBtn) {
            elements.downloadPdfBtn.addEventListener('click', downloadResultPDF);
        }
        
        if (elements.retryBtn) {
            elements.retryBtn.addEventListener('click', restartAssessment);
        }
    }
    
    // ==================== HOME PAGE LOGIC ====================
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const name = elements.fullName.value.trim();
        const email = elements.email.value.trim();
        
        let isValid = true;
        
        // Validate name
        if (!name || name.length < 2) {
            showError(elements.nameError, elements.fullName);
            isValid = false;
        } else {
            clearError(elements.nameError, elements.fullName);
        }
        
        // Validate email
        if (!isValidEmail(email)) {
            showError(elements.emailError, elements.email);
            isValid = false;
        } else {
            clearError(elements.emailError, elements.email);
        }
        
        if (!isValid) return;
        
        // Save state
        state.studentName = name;
        state.studentEmail = email;
        state.currentIndex = 0;
        state.answers = {};
        
        // Generate and store shuffled questions
        const shuffledQuestions = shuffleQuestions(QUESTIONS, state.isAnswerShuffled);
        localStorage.setItem('lsa_questions', JSON.stringify(shuffledQuestions));
        localStorage.setItem('lsa_currentIndex', '0');
        localStorage.setItem('lsa_answers', JSON.stringify({}));
        
        // Store student info
        localStorage.setItem('lsa_studentName', name);
        localStorage.setItem('lsa_studentEmail', email);
        
        // Redirect to quiz
        window.location.href = 'quiz.html';
    }
    
    function validateName() {
        const name = elements.fullName.value.trim();
        if (name && name.length >= 2) {
            clearError(elements.nameError, elements.fullName);
        }
    }
    
    function validateEmail() {
        const email = elements.email.value.trim();
        if (isValidEmail(email)) {
            clearError(elements.emailError, elements.email);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(errorElement, inputElement) {
        errorElement.classList.add('show');
        inputElement.classList.add('error');
    }
    
    function clearError(errorElement, inputElement) {
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
    
    // ==================== RESULT PAGE LOGIC ====================
    
    function loadResultState() {
        const isSubmitted = localStorage.getItem('lsa_isSubmitted') === 'true';
        
        if (!isSubmitted) {
            window.location.href = 'index.html';
            return;
        }
        
        const resultsJson = localStorage.getItem('lsa_results');
        if (!resultsJson) {
            window.location.href = 'index.html';
            return;
        }
        
        const results = JSON.parse(resultsJson);
        renderResults(results);
    }
    
    function renderResults(results) {
        // Update header icon and title
        const passIcon = elements.resultIcon.querySelector('.icon-pass');
        const failIcon = elements.resultIcon.querySelector('.icon-fail');
        
        if (results.passed) {
            passIcon.style.display = 'block';
            failIcon.style.display = 'none';
        } else {
            passIcon.style.display = 'none';
            failIcon.style.display = 'block';
        }
        
        // Update status badge
        elements.resultStatus.textContent = results.passed ? 'PASS' : 'FAIL';
        elements.resultStatus.className = `result-status ${results.passed ? 'pass' : 'fail'}`;
        
        // Update result details
        elements.resultName.textContent = results.studentName;
        elements.resultEmail.textContent = results.studentEmail;
        elements.resultDate.textContent = results.assessmentDate;
        elements.resultTotal.textContent = results.totalQuestions.toString();
        elements.resultCorrect.textContent = results.correctAnswers.toString();
        elements.resultIncorrect.textContent = results.incorrectAnswers.toString();
        elements.resultScore.textContent = results.score;
        
        const percentageEl = elements.resultPercentage;
        percentageEl.textContent = `${results.percentage}%`;
        percentageEl.style.color = results.passed ? 'var(--success)' : 'var(--danger)';
    }
    
    // ==================== PDF DOWNLOAD ====================
    
    function downloadResultPDF() {
        const resultsJson = localStorage.getItem('lsa_results');
        if (!resultsJson) return;
        
        const results = JSON.parse(resultsJson);
        
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('Please allow popups to download the PDF result.');
            return;
        }
        
        const pdfContent = generatePDFContent(results);
        
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };
    }
    
    function generatePDFContent(results) {
        const passColor = results.passed ? '#059669' : '#dc2626';
        const passBg = results.passed ? '#ecfdf5' : '#fef2f2';
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Linux Skill Assessment Result</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: white;
            color: #0f172a;
            padding: 40px;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2563eb;
        }
        .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        .logo-icon { width: 32px; height: 32px; color: #2563eb; }
        .logo-text { font-size: 18px; font-weight: 700; }
        h1 { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 5px; }
        .subtitle { font-size: 14px; color: #2563eb; font-weight: 500; }
        .result-card {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            border: 1px solid #e2e8f0;
        }
        .result-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
        }
        .result-icon { width: 60px; height: 60px; margin: 0 auto 15px; }
        .result-icon svg { width: 100%; height: 100%; }
        .result-title {
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 10px;
        }
        .result-status {
            display: inline-block;
            padding: 6px 20px;
            font-size: 14px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-radius: 20px;
            background: ${passBg};
            color: ${passColor};
            border: 1px solid ${passColor};
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        .info-item {
            padding: 12px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .info-label {
            font-size: 11px;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            margin-bottom: 5px;
        }
        .info-value { font-size: 14px; font-weight: 600; }
        .info-value.highlight { color: #2563eb; font-size: 18px; font-weight: 700; }
        .info-value.correct { color: #059669; }
        .info-value.incorrect { color: #dc2626; }
        .divider { height: 1px; background: #e2e8f0; margin: 15px 0; }
        .score-section {
            background: #eff6ff;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }
        .score-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
        }
        .score-label { font-size: 13px; color: #475569; }
        .score-value { font-size: 16px; font-weight: 700; }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 12px;
        }
        @media print {
            body { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <svg viewBox="0 0 40 40" class="logo-icon">
                <rect x="2" y="2" width="36" height="36" rx="8" fill="none" stroke="currentColor" stroke-width="2"/>
                <rect x="8" y="10" width="24" height="2" rx="1" fill="currentColor"/>
                <rect x="8" y="16" width="24" height="2" rx="1" fill="currentColor" opacity="0.7"/>
                <rect x="8" y="22" width="16" height="2" rx="1" fill="currentColor" opacity="0.5"/>
                <rect x="8" y="28" width="20" height="2" rx="1" fill="currentColor" opacity="0.3"/>
            </svg>
            <span class="logo-text">Linux Skill Assessment</span>
        </div>
        <h1>Assessment Result</h1>
        <p class="subtitle">RHCSA & Linux Administration</p>
    </div>
    
    <div class="result-card">
        <div class="result-header">
            <div class="result-icon">
                ${results.passed 
                    ? '<svg viewBox="0 0 48 48" style="color: #059669"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 28l6-6 6 6M14 20l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
                    : '<svg viewBox="0 0 48 48" style="color: #dc2626"><circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 16l16 16M32 16l-16 16" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>'
                }
            </div>
            <h2 class="result-title">Exam Completed</h2>
            <span class="result-status">${results.passed ? 'PASS' : 'FAIL'}</span>
        </div>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Student Name</div>
                <div class="info-value">${results.studentName}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Email Address</div>
                <div class="info-value">${results.studentEmail}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Assessment Date</div>
                <div class="info-value">${results.assessmentDate}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Total Questions</div>
                <div class="info-value">${results.totalQuestions}</div>
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Correct Answers</div>
                <div class="info-value correct">${results.correctAnswers} / ${results.totalQuestions}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">Incorrect Answers</div>
                <div class="info-value incorrect">${results.incorrectAnswers} / ${results.totalQuestions}</div>
            </div>
        </div>
        
        <div class="score-section">
            <div class="score-row">
                <span class="score-label">Score</span>
                <span class="score-value">${results.score}</span>
            </div>
            <div class="score-row">
                <span class="score-label">Percentage</span>
                <span class="score-value" style="color: ${passColor}">${results.percentage}%</span>
            </div>
            <div class="score-row">
                <span class="score-label">Result</span>
                <span class="score-value" style="color: ${passColor}">${results.passed ? 'PASS' : 'FAIL'}</span>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>Linux Skill Assessment &bull; For educational purposes only &bull; Generated on ${new Date().toISOString().split('T')[0]}</p>
    </div>
</body>
</html>`;
    }
    
    // ==================== RESTART ASSESSMENT ====================
    
    function restartAssessment() {
        localStorage.removeItem('lsa_studentName');
        localStorage.removeItem('lsa_studentEmail');
        localStorage.removeItem('lsa_questions');
        localStorage.removeItem('lsa_currentIndex');
        localStorage.removeItem('lsa_answers');
        localStorage.removeItem('lsa_results');
        localStorage.removeItem('lsa_isSubmitted');
        
        window.location.href = 'index.html';
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for debugging
    window.__lsaState = state;
    
})();

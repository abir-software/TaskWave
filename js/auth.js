// Authentication logic for TaskWave
import { showToast } from './ui.js';
import { renderDashboard } from './tasks.js';

// Auth state
let currentUser = null;
let isGuest = false;

// DOM Elements
const authModal = document.getElementById('auth-modal');
const closeAuthModal = document.getElementById('close-auth-modal');
const authBtn = document.getElementById('auth-btn');
const tryNowBtn = document.getElementById('try-now');
const getStartedBtn = document.getElementById('get-started');
const guestModeBtn = document.getElementById('guest-mode-btn');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const switchToSignup = document.getElementById('switch-to-signup');
const switchToLogin = document.getElementById('switch-to-login');
const loadingScreen = document.getElementById('loading-screen');
const homePage = document.getElementById('home-page');
const dashboardPage = document.getElementById('dashboard-page');

// Show Auth Modal
export function showAuthModal(activeTab = 'login') {
    gsap.to(authModal, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3
    });
    
    gsap.to(authModal.querySelector('div'), {
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.2)'
    });
    
    if (activeTab === 'login') {
        showLoginForm();
    } else {
        showSignupForm();
    }
}

// Hide Auth Modal
function hideAuthModal() {
    gsap.to(authModal, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3
    });
    
    gsap.to(authModal.querySelector('div'), {
        scale: 0.95,
        duration: 0.3
    });
}

// Show Login Form
function showLoginForm() {
    loginTab.classList.add('border-indigo-600', 'dark:border-indigo-400', 'text-indigo-600', 'dark:text-indigo-400');
    loginTab.classList.remove('text-gray-500', 'dark:text-gray-400');
    signupTab.classList.add('text-gray-500', 'dark:text-gray-400');
    signupTab.classList.remove('border-indigo-600', 'dark:border-indigo-400', 'text-indigo-600', 'dark:text-indigo-400');
    
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
}

// Show Signup Form
function showSignupForm() {
    signupTab.classList.add('border-indigo-600', 'dark:border-indigo-400', 'text-indigo-600', 'dark:text-indigo-400');
    signupTab.classList.remove('text-gray-500', 'dark:text-gray-400');
    loginTab.classList.add('text-gray-500', 'dark:text-gray-400');
    loginTab.classList.remove('border-indigo-600', 'dark:border-indigo-400', 'text-indigo-600', 'dark:text-indigo-400');
    
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

// Show Loading Screen
export function showLoadingScreen(message = 'Loading your tasks...') {
    if (loadingScreen) {
        loadingScreen.querySelector('p').textContent = message;
        gsap.to(loadingScreen, {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.5
        });
    }
}

// Hide Loading Screen
export function hideLoadingScreen() {
    if (loadingScreen) {
        gsap.to(loadingScreen, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.5,
            delay: 0.5
        });
    }
}

// Switch to Dashboard View
export function switchToDashboard(user = null, guest = false) {
    currentUser = user;
    isGuest = guest;
    
    // Hide home page, show dashboard
    homePage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    
    // Render the dashboard
    renderDashboard();
    
    // Update UI based on auth state
    updateAuthUI();
}

// Switch to Home View
function switchToHome() {
    currentUser = null;
    isGuest = false;
    
    // Show home page, hide dashboard
    homePage.classList.remove('hidden');
    dashboardPage.classList.add('hidden');
    
    // Clear any existing tasks from UI
    const taskList = document.getElementById('task-list');
    if (taskList) taskList.innerHTML = '';
    
    // Update UI
    updateAuthUI();
}

// Update UI based on auth state
function updateAuthUI() {
    const logoutBtn = document.getElementById('logout-btn');
    const authBtn = document.getElementById('auth-btn');
    
    if (logoutBtn) {
        logoutBtn.textContent = isGuest ? 'Exit Guest Mode' : 'Logout';
    }
    
    if (authBtn) {
        authBtn.textContent = currentUser ? 'My Account' : 'Sign In';
    }
}

// Initialize Authentication
export function initAuth() {
    // Event Listeners
    authBtn?.addEventListener('click', () => {
        if (currentUser) {
            // Show account management (not implemented)
            showToast('Account management coming soon!', 'info');
        } else {
            showAuthModal('login');
        }
    });
    
    tryNowBtn?.addEventListener('click', () => enterGuestMode());
    getStartedBtn?.addEventListener('click', () => showAuthModal('signup'));
    closeAuthModal?.addEventListener('click', hideAuthModal);
    guestModeBtn?.addEventListener('click', () => enterGuestMode());
    
    // Tab Switching
    loginTab?.addEventListener('click', showLoginForm);
    signupTab?.addEventListener('click', showSignupForm);
    switchToSignup?.addEventListener('click', showSignupForm);
    switchToLogin?.addEventListener('click', showLoginForm);
    
    // Form Submissions
    document.getElementById('login-btn')?.addEventListener('click', handleLogin);
    document.getElementById('signup-btn')?.addEventListener('click', handleSignup);
    
    // Close modal when clicking outside
    authModal?.addEventListener('click', function(e) {
        if (e.target === authModal) {
            hideAuthModal();
        }
    });
    
    // Check for existing session on load
    checkExistingSession();
}

// Check for existing session
function checkExistingSession() {
    // In a real app, you would check Firebase auth state here
    // For demo, we'll check localStorage for guest mode
    const guestTasks = localStorage.getItem('guestTasks');
    if (guestTasks) {
        enterGuestMode(false);
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoadingScreen('Authenticating...');
    hideAuthModal();
    
    try {
        // In a real app, you would use Firebase auth here
        // const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        // currentUser = userCredential.user;
        
        // For demo, we'll simulate a successful login
        await new Promise(resolve => setTimeout(resolve, 1000));
        currentUser = {
            uid: 'demo-user',
            email: email,
            displayName: 'Demo User'
        };
        
        showToast('Welcome back!', 'success');
        switchToDashboard(currentUser, false);
    } catch (error) {
        showToast(error.message || 'Login failed', 'error');
    } finally {
        hideLoadingScreen();
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (!name || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    showLoadingScreen('Creating your account...');
    hideAuthModal();
    
    try {
        // In a real app, you would use Firebase auth here
        // const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        // await userCredential.user.updateProfile({ displayName: name });
        // currentUser = userCredential.user;
        
        // For demo, we'll simulate a successful signup
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentUser = {
            uid: 'demo-user-' + Math.random().toString(36).substring(7),
            email: email,
            displayName: name
        };
        
        showToast('Account created successfully!', 'success');
        switchToDashboard(currentUser, false);
    } catch (error) {
        showToast(error.message || 'Signup failed', 'error');
    } finally {
        hideLoadingScreen();
    }
}

// Enter Guest Mode
function enterGuestMode(showWelcome = true) {
    isGuest = true;
    currentUser = null;
    
    if (showWelcome) {
        showToast('Entering Guest Mode. Tasks will be saved locally.', 'info');
    }
    
    switchToDashboard(null, true);
}

// Handle Logout
export function handleLogout() {
    if (isGuest) {
        showToast('Exiting Guest Mode', 'info');
    } else {
        // In a real app, you would sign out from Firebase
        // await firebase.auth().signOut();
        showToast('Logged out successfully', 'success');
    }
    
    // Clear any guest tasks if exiting guest mode
    if (isGuest) {
        localStorage.removeItem('guestTasks');
    }
    
    switchToHome();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuth);
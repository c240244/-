// auth.js - User authentication system using localStorage

// Initialize users array in localStorage if not exists
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
}

// Function to check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Function to get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

// Function to login user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }
    return null;
}

// Function to register new user
function registerUser(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

// Function to logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Function to validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Progress tracking functions
function updateUserProgress(course, lesson, completed = true) {
    const user = getCurrentUser();
    if (!user) return null;
    
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const userId = user.id;
    
    if (!progress[userId]) {
        progress[userId] = {};
    }
    
    if (!progress[userId][course]) {
        progress[userId][course] = { lessons: {}, lastAccessed: new Date().toISOString() };
    }
    
    progress[userId][course].lessons[lesson] = {
        completed: completed,
        date: new Date().toISOString()
    };
    
    localStorage.setItem('userProgress', JSON.stringify(progress));
    return progress[userId][course];
}

function getUserProgress() {
    const user = getCurrentUser();
    if (!user) return {};
    
    const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    return progress[user.id] || {};
}

function getCourseProgress(course) {
    const progress = getUserProgress();
    return progress[course] || { lessons: {} };
}

function isLessonCompleted(course, lessonId) {
    const progress = getCourseProgress(course);
    return progress.lessons && progress.lessons[lessonId] && progress.lessons[lessonId].completed;
}

// Export functions for use in other files
window.auth = {
    isLoggedIn,
    getCurrentUser,
    loginUser,
    registerUser,
    logoutUser,
    isValidEmail,
    updateUserProgress,
    getUserProgress,
    getCourseProgress,
    isLessonCompleted
};
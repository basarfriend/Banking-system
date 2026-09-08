document.addEventListener('DOMContentLoaded', () => {
  const signinForm = document.getElementById('signinForm');
  const signupForm = document.getElementById('signupForm');
  const showSignupBtn = document.getElementById('showSignupBtn');
  const showLoginBtn = document.getElementById('showLoginBtn');
  const headerTitle = document.getElementById('headerTitle');
  const headerSubtitle = document.getElementById('headerSubtitle');

  showSignupBtn.addEventListener('click', () => {
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    headerTitle.textContent = 'Create Owner Account';
    headerSubtitle.textContent = 'Register your business with NO-COMMERCE';
  });

  showLoginBtn.addEventListener('click', () => {
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
    headerTitle.textContent = 'Owner Login';
    headerSubtitle.textContent = 'Access your dashboard securely';
  });
});
class CleanBankingRegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.fullNameInput = document.getElementById('fullName');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.confirmPasswordInput = document.getElementById('confirmPassword');
        this.termsCheckbox = document.getElementById('terms');

        this.passwordToggle = document.getElementById('passwordToggle');
        this.confirmPasswordToggle = document.getElementById('confirmPasswordToggle');

        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');

        this.init();
    }

    init() {
        this.bindEvents();
        this.setupPasswordToggles();
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        this.fullNameInput.addEventListener('blur', () => this.validateFullName());
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.confirmPasswordInput.addEventListener('blur', () => this.validateConfirmPassword());
        this.termsCheckbox.addEventListener('change', () => this.validateTerms());

        this.fullNameInput.addEventListener('input', () => this.clearError('fullName'));
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        this.confirmPasswordInput.addEventListener('input', () => this.clearError('confirmPassword'));
    }

    setupPasswordToggles() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            this.passwordToggle.classList.toggle('show-password', type === 'text');
        });

        this.confirmPasswordToggle.addEventListener('click', () => {
            const type = this.confirmPasswordInput.type === 'password' ? 'text' : 'password';
            this.confirmPasswordInput.type = type;
            this.confirmPasswordToggle.classList.toggle('show-password', type === 'text');
        });
    }


    validateFullName() {
        const fullName = this.fullNameInput.value.trim();
        if (!fullName) {
            this.showError('fullName', "Будь ласка, введіть ваше повне ім'я");
            return false;
        }
        if (fullName.length < 3) {
            this.showError('fullName', "Повне ім'я має містити щонайменше 3 символи");
            return false;
        }
        this.clearError('fullName');
        return true;
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError('email', 'Електронна пошта є обов\'язковою');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError('email', 'Будь ласка, введіть дійсну електронну адресу');
            return false;
        }

        this.clearError('email');
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;

        if (!password) {
            this.showError('password', 'Пароль є обов\'язковим');
            return false;
        }

        if (password.length < 8) {
            this.showError('password', 'Пароль має містити щонайменше 8 символів');
            return false;
        }

        const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordStrengthRegex.test(password)) {
            this.showError('password', 'Пароль повинен містити великі та малі літери, цифри та символи');
            return false;
        }

        this.clearError('password');
        return true;
    }

    validateConfirmPassword() {
        const password = this.passwordInput.value;
        const confirmPassword = this.confirmPasswordInput.value;

        if (!confirmPassword) {
            this.showError('confirmPassword', 'Повторне введення пароля є обов\'язковим');
            return false;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPassword', 'Паролі не співпадають');
            return false;
        }

        this.clearError('confirmPassword');
        return true;
    }

    validateTerms() {
        if (!this.termsCheckbox.checked) {
            this.showError('terms', 'Необхідно погодитись з Умовами користування');
            return false;
        }
        this.clearError('terms');
        return true;
    }


    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);

        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);

        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 200);
    }


    async handleSubmit(e) {
        e.preventDefault();

        const isFullNameValid = this.validateFullName();
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        const isConfirmPasswordValid = this.validateConfirmPassword();
        const isTermsChecked = this.validateTerms();

        if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isTermsChecked) {
            return;
        }

        this.setLoading(true);

        try {
            console.log('Attempting to register new user...');
            await new Promise(resolve => setTimeout(resolve, 3000));

            this.showSuccess();
        } catch (error) {
            this.showError('email', 'Помилка реєстрації. Можливо, користувач вже існує.');
            console.error('Registration error:', error);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
    }

    showSuccess() {
        const loginCard = this.form.closest('.login-card');
        loginCard.style.transform = 'scale(0.95)';
        loginCard.style.opacity = '0';

        setTimeout(() => {
            this.form.style.display = 'none';
            loginCard.style.transform = 'scale(1)';
            loginCard.style.opacity = '1';

            this.successMessage.classList.add('show');
        }, 300);

        setTimeout(() => {
            console.log('Redirecting to login page...');
            window.location.href = 'login.html';
        }, 3500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CleanBankingRegistrationForm();
});
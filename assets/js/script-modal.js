function initConsentModal() {
    const modal = document.getElementById('consentModal');
    const acceptBtn = document.getElementById('acceptConsent');
    const declineBtn = document.getElementById('declineConsent');
    const consentKey = 'whitepace_privacy_accepted';

    if (localStorage.getItem(consentKey) === 'true') {
        return;
    }

    modal.classList.add('show');

    function setConsent(accepted) {
        if (accepted) {
            localStorage.setItem(consentKey, 'true');
        }
        modal.classList.remove('show');

        if (!accepted) {
            window.location.href = 'terms-of-use.html';
        }
    }

    acceptBtn.addEventListener('click', () => {
        setConsent(true);
    });

    declineBtn.addEventListener('click', () => {
        setConsent(false);
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            setConsent(true);
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsentModal);
} else {
    initConsentModal();
}
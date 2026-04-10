document.addEventListener('DOMContentLoaded', () => {
    // Target date: 2025-12-25 00:00:00 Beijing Time (UTC+8)
    const targetDate = new Date('2025-12-25T00:00:00+08:00').getTime();

    const countdownContainer = document.getElementById('countdownContainer');
    const titleStack = document.querySelector('.title-stack');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    let interval;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Countdown finished
            if (interval) clearInterval(interval);

            // Hide countdown with fade out
            countdownContainer.style.opacity = '0';
            setTimeout(() => {
                countdownContainer.style.display = 'none';

                // Show title stack
                titleStack.style.display = 'flex';
                // Trigger reflow to ensure animations play
                // void titleStack.offsetWidth; 
            }, 800);

            return;
        }

        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM
        daysEl.innerText = String(days).padStart(2, '0');
        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    // Initial check
    const now = new Date().getTime();
    if (targetDate > now) {
        // Active countdown
        // Ensure correct visibility (matches CSS defaults, but enforcing here is safe)
        titleStack.style.display = 'none';
        countdownContainer.style.display = 'flex';

        updateCountdown();
        interval = setInterval(updateCountdown, 1000);
    } else {
        // Already passed - Show content immediately
        countdownContainer.style.display = 'none';
        titleStack.style.display = 'flex';
    }
});

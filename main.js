/* ============================================
   CLARITY IMMIGRATION — MAIN JAVASCRIPT
   ============================================ */

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ========== HAMBURGER MENU ==========
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px,5px)',
         spans[1].style.opacity = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)')
      : (spans[0].style.transform = '', spans[1].style.opacity = '', spans[2].style.transform = '');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ========== SCROLL TO TOP ==========
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) scrollTopBtn.classList.add('visible');
    else scrollTopBtn.classList.remove('visible');
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ========== INTERSECTION OBSERVER (Fade-up animations) ==========
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => observer.observe(el));
}

// ========== COUNTER ANIMATION ==========
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); }
    else el.textContent = Math.floor(start);
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));
}

// ========== FAQ ACCORDION ==========
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-question');
  if (btn) {
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});

// ========== CALENDAR ==========
const calendarDays = document.getElementById('calendarDays');
const calendarTitle = document.getElementById('calendarTitle');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const timeSlots = document.getElementById('timeSlots');
const selectedDateLabel = document.getElementById('selectedDateLabel');

if (calendarDays) {
  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  let selectedDay = null;

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function buildCalendar(year, month) {
    calendarTitle.textContent = `${monthNames[month]} ${year}`;
    calendarDays.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calendarDays.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;

      const cellDate = new Date(year, month, d);
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isWeekend = cellDate.getDay() === 0 || cellDate.getDay() === 6;
      const isPast = cellDate < todayMidnight;

      if (isPast || isWeekend) {
        cell.classList.add('disabled');
      } else {
        if (cellDate.toDateString() === today.toDateString()) cell.classList.add('today');
        if (selectedDay && cellDate.toDateString() === selectedDay.toDateString()) cell.classList.add('selected');

        cell.addEventListener('click', () => {
          document.querySelectorAll('.cal-day').forEach(c => c.classList.remove('selected'));
          cell.classList.add('selected');
          selectedDay = cellDate;
          showTimeSlots(cellDate);
        });
      }
      calendarDays.appendChild(cell);
    }
  }

  function showTimeSlots(date) {
    if (!timeSlots) return;
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    if (selectedDateLabel) selectedDateLabel.textContent = date.toLocaleDateString('en-US', options);
    timeSlots.style.display = 'block';
    timeSlots.style.animation = 'fadeIn 0.3s ease';
    // Reset slot selections
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      const prev = new Date(currentYear, currentMonth - 1, 1);
      const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (prev >= todayMonth) {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        buildCalendar(currentYear, currentMonth);
      }
    });
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      buildCalendar(currentYear, currentMonth);
    });
  }

  buildCalendar(currentYear, currentMonth);

  // Time slot selection
  document.querySelectorAll('.time-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });
}

// ========== BOOKING FORM SUBMISSION ==========
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.querySelector('input[type="text"]')?.value.trim();
    const email = document.querySelector('input[type="email"]')?.value.trim();

    if (!name || !email) {
      // Simple shake animation
      submitBtn.style.animation = 'shake 0.4s ease';
      submitBtn.textContent = '⚠ Please fill in required fields';
      setTimeout(() => {
        submitBtn.style.animation = '';
        submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Consultation';
      }, 2000);
      return;
    }

    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Consultation';
      const overlay = document.getElementById('successOverlay');
      if (overlay) overlay.style.display = 'flex';
    }, 1500);
  });
}

// ========== CHARACTER COUNTER ==========
const caseDesc = document.getElementById('caseDescription');
const charCount = document.getElementById('charCount');
if (caseDesc && charCount) {
  caseDesc.addEventListener('input', () => {
    charCount.textContent = caseDesc.value.length;
  });
}

// ========== SMOOTH REVEAL on page load ==========
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// ========== CSS SHAKE KEYFRAME (injected) ==========
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}`;
document.head.appendChild(shakeStyle);

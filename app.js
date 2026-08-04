/* ==========================================================================
   إعدادات FIREBASE (استبدلي بالقيم الخاصة بمشروعك)
   ========================================================================== */
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let db;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
} catch (e) {
    console.warn("لم يتم ربط Firebase بشكل كامل بعد. يمكنك استخدام النموذج وتجربته محلياً.");
}

/* ==========================================================================
   تهيئة الصفحة والأحداث
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initCountdown();
    initScrollAnimations();
    initAudioPlayer();
    initLightbox();
    initRSVPForm();
    initExtraFeatures();
});

/* 0. شاشة التحميل والمؤثرات */
function initLoader() {
    const loader = document.getElementById("loader");
    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
            triggerConfetti();
        }, 800);
    });
}

function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#C5A059', '#E6D2B3', '#FFFFFF']
        });
    }
}

/* 1. العداد التنازلي */
function initCountdown() {
    // ضعي هنا تاريخ ووقت زفافك (السنة-الشهر-اليوم)
    const weddingDate = new Date("2026-10-09T19:00:00").getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = weddingDate - now;

        if (diff < 0) {
            clearInterval(timer);
            document.querySelector(".countdown-grid").innerHTML = "<h3>اليوم هو اليوم الموعود! أهلاً بكم</h3>";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }, 1000);
}

/* 2. الحركة عند التمرير وشريط التصفح */
function initScrollAnimations() {
    const navbar = document.getElementById("navbar");
    const scrollTopBtn = document.getElementById("scroll-top");
    const reveals = document.querySelectorAll(".reveal");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
            scrollTopBtn.classList.add("visible");
        } else {
            navbar.classList.remove("scrolled");
            scrollTopBtn.classList.remove("visible");
        }

        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add("active");
            }
        });
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* 3. مشغل الموسيقى */
function initAudioPlayer() {
    const audioBtn = document.getElementById("audio-toggle");
    const audio = document.getElementById("bg-music");
    let isPlaying = false;

    audioBtn.addEventListener("click", () => {
        if (isPlaying) {
            audio.pause();
            audioBtn.innerHTML = '<i class="fas fa-music"></i>';
        } else {
            audio.play().catch(() => console.log("يتطلب تشغيل الصوت التفاعل مع الصفحة أولاً"));
            audioBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });
}

/* 4. تكبير الصور */
function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");
    const triggers = document.querySelectorAll(".lightbox-trigger");

    triggers.forEach(img => {
        img.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
        });
    });

    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    lightbox.addEventListener("click", (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = "none";
        }
    });
}

/* 5. إرسال استمارة تأكيد الحضور إلى Firebase */
function initRSVPForm() {
    const form = document.getElementById("rsvp-form");
    const statusMsg = document.getElementById("form-status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("guest-name").value;
        const count = document.getElementById("guest-count").value;
        const attendance = document.getElementById("attendance").value;
        const message = document.getElementById("message").value;

        statusMsg.innerText = "جاري إرسال تأكيد الحضور...";

        try {
            if (db) {
                await db.collection("rsvps").add({
                    name,
                    count,
                    attendance,
                    message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                console.log("تمت التجربة محلياً:", { name, count, attendance, message });
            }

            statusMsg.innerText = "شكراً لك! تم استلام ردك بنجاح.";
            form.reset();
        } catch (error) {
            console.error("خطأ في الإرسال: ", error);
            statusMsg.innerText = "عذراً، حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.";
        }
    });
}

/* 6. ميزات إضافية */
function initExtraFeatures() {
    // نسخ رابط الدعوة
    const copyBtn = document.getElementById("copy-link-btn");
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href);
        alert("تم نسخ رابط الدعوة بنجاح!");
    });

    // إضافة إلى التقويم (.ics)
    const calBtn = document.getElementById("add-to-calendar");
    calBtn.addEventListener("click", () => {
        const icsData = 
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:حفل زفاف [اسم العروس] و [اسم العريس]
DESCRIPTION:انضموا إلينا لمشاركتنا فرحتنا!
LOCATION:[اسم القاعة]
DTSTART:20261231T170000Z
DTEND:20261231T230000Z
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'wedding-event.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}
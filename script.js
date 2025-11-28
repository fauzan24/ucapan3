document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('background-music');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const pages = document.querySelectorAll('.album-page');
    const epilogueMessage = document.getElementById('epilogue-message');
    const header = document.querySelector('.page-header');
    
    let isMusicPlaying = false;

    // 1. Kontrol Musik dan Transisi Awal
    function startExperience() {
        if (!isMusicPlaying) {
            // Coba putar musik
            music.play().then(() => {
                isMusicPlaying = true;
            }).catch(error => {
                console.warn("Audio autoplay diblokir. Harap putar secara manual.", error);
            });
        }
        
        // Hilangkan layar intro secara perlahan
        introScreen.style.opacity = '0';
        setTimeout(() => {
            introScreen.style.display = 'none';
            mainContent.style.opacity = '1';
        }, 1500); // Sesuai dengan durasi transisi CSS
    }

    introScreen.addEventListener('click', startExperience);
    introScreen.addEventListener('touchstart', startExperience);

    // 2. Efek Interaktif Saat Scroll (Inti Aksi)
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Parallax Header: Gerakkan header lebih lambat
        header.style.transform = `translateY(${scrollPosition * 0.3}px)`;

        pages.forEach((page) => {
            const pageTop = page.offsetTop;
            const pageHeight = page.offsetHeight;
            const pageCenter = pageTop + (pageHeight / 2);

            // Titik aktivasi (tengah viewport)
            const activationPoint = scrollPosition + (windowHeight * 0.5); 

            // Jarak halaman dari titik aktivasi
            const distance = pageCenter - activationPoint;
            
            // Jangkauan aktivasi 
            if (Math.abs(distance) < windowHeight * 0.45) {
                // Halaman Aktif: Muncul Penuh
                page.classList.add('active');
                page.classList.remove('flipped');
                page.style.transform = `rotateY(0deg) scale(1) translateZ(0px)`;
                
                // Animasi Parallax Ringan Saat Aktif
                const parallaxY = distance * 0.1;
                page.style.transform += ` translateY(${parallaxY}px)`;
            } else if (pageCenter < activationPoint) {
                // Halaman Sudah Lewat: Rotasi 180 derajat (Flip)
                page.classList.remove('active');
                page.classList.add('flipped');
            } else {
                // Halaman Belum Sampai: Semakin jauh, semakin kecil
                page.classList.remove('active');
                page.classList.remove('flipped');
                const scale = 1 - (Math.abs(distance) / (windowHeight * 1.5));
                page.style.transform = `scale(${Math.max(0.5, scale)})`;
            }
        });
        
        // 3. Pesan Epilog (Aksi Penutup)
        const lastPage = pages[pages.length - 1];
        if (lastPage) {
            const lastPageBottom = lastPage.offsetTop + lastPage.offsetHeight;
            
            // Munculkan Epilog setelah halaman terakhir melewati titik tengah
            if (scrollPosition > lastPageBottom - windowHeight * 0.5) {
                epilogueMessage.classList.add('visible');
            } else {
                epilogueMessage.classList.remove('visible');
            }
        }
    });
    
    // Aksi Klik Epilog
    epilogueMessage.addEventListener('click', () => {
        // Kembali ke atas dengan lembut
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Putar ulang lagu dari awal
        music.currentTime = 0;
        music.play();
    });

    // Panggil sekali saat load
    window.dispatchEvent(new Event('scroll'));
});
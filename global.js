(function() {
    // 1. INJECT GLOBAL STYLES
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --navy: #0a192f;
            --skynet-blue: #3b82f6;
            --skynet-blue-hover: #1d4ed8;
            --white: #ffffff;
            --gray-100: #f3f4f6;
            --text-muted: rgba(255, 255, 255, 0.7);
            --transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* Smoother premium easing */
        }

        /* Header Layout */
        .global-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 8%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            position: sticky;
            top: 0;
            z-index: 9998;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            font-family: 'Inter', sans-serif;
            transition: background-color 0.4s ease;
        }

        /* When mobile menu is open, make navbar transparent so it blends with the dark overlay */
        .global-nav.menu-open {
            background: transparent;
            box-shadow: none;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
        }

        .logo-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            z-index: 10000;
            position: relative;
        }

        .logo-wrapper img { height: 42px; width: auto; transition: var(--transition); }

        .brand-text { display: flex; align-items: baseline; gap: 4px; transition: var(--transition); }
        .brand-name { font-size: 1.25rem; font-weight: 800; color: var(--navy); letter-spacing: -0.5px; }
        .brand-sub { font-size: 1.25rem; font-weight: 400; color: var(--skynet-blue); }

        /* Dynamic logo colors when mobile menu is open */
        .global-nav.menu-open .brand-name { color: var(--white); }
        .global-nav.menu-open .logo-wrapper img { filter: brightness(0) invert(1); } /* Makes logo white */

        .nav-links { display: flex; list-style: none; gap: 2rem; align-items: center; margin: 0; padding: 0; }
        .nav-links a { 
            text-decoration: none; 
            color: var(--navy); 
            font-weight: 600; 
            font-size: 15px;
            position: relative;
            transition: var(--transition);
        }
        
        .nav-links a:not(.btn-get-started)::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: var(--skynet-blue);
            transition: var(--transition);
        }
        .nav-links a:not(.btn-get-started):hover::after,
        .nav-links a.active-page::after { width: 100%; }
        .nav-links a:not(.btn-get-started):hover,
        .nav-links a.active-page { color: var(--skynet-blue); }

        .btn-get-started {
            background: var(--navy) !important;
            color: white !important;
            padding: 0.65rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            box-shadow: 0 4px 14px rgba(10, 25, 47, 0.15);
        }
        .btn-get-started:hover {
            background: var(--skynet-blue) !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
        }

        /* Animated Hamburger Menu */
        .mobile-toggle {
            display: none;
            flex-direction: column;
            justify-content: space-between;
            width: 28px;
            height: 20px;
            cursor: pointer;
            z-index: 10000;
            position: relative;
            background: none;
            border: none;
            padding: 0;
        }

        .mobile-toggle span {
            width: 100%;
            height: 2px;
            background: var(--navy);
            border-radius: 2px;
            transition: var(--transition);
            transform-origin: center;
        }

        /* Hamburger to X Transform animations */
        .mobile-toggle.open span { background: var(--white); }
        .mobile-toggle.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
        .mobile-toggle.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .mobile-toggle.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

        /* Footer Layout (Kept same as before) */
        .global-footer { background: var(--navy); color: white; padding: 5rem 8% 2rem; font-family: 'Inter', sans-serif; }
        .footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 3rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 3rem; }
        .footer-logo-section { max-width: 350px; }
        .footer-links-list, .footer-contact-list { list-style: none; padding: 0; margin: 0; }
        .footer-links-list li, .footer-contact-list li { margin-bottom: 0.75rem; color: var(--text-muted); }
        .footer-links-list a { color: var(--text-muted); text-decoration: none; transition: var(--transition); }
        .footer-links-list a:hover { color: white; }
        .footer-copyright { text-align: center; padding-top: 2rem; font-size: 0.85rem; color: var(--text-muted); }

        /* =========================================
           PREMIUM MOBILE OVERLAY MENU 
           ========================================= */
        @media (max-width: 992px) {
            .global-nav { padding: 1.5rem 6%; }
            .mobile-toggle { display: flex; }
            
            .nav-links {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(10, 25, 47, 0.98); /* Deep translucent navy */
                backdrop-filter: blur(15px);
                -webkit-backdrop-filter: blur(15px);
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2.5rem;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.4s ease, visibility 0.4s ease;
                z-index: 9999;
            }
            
            .nav-links.active {
                opacity: 1;
                visibility: visible;
            }

            /* Oversized, elegant typography for mobile links */
            .nav-links a { 
                font-size: 2.5rem; 
                font-weight: 700;
                color: var(--white);
                opacity: 0;
                transform: translateY(30px); /* Start slightly lower */
                transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
                letter-spacing: -1px;
            }
            
            /* Staggered entrance animations for each link */
            .nav-links.active li:nth-child(1) a { transition-delay: 0.1s; opacity: 1; transform: translateY(0); }
            .nav-links.active li:nth-child(2) a { transition-delay: 0.15s; opacity: 1; transform: translateY(0); }
            .nav-links.active li:nth-child(3) a { transition-delay: 0.2s; opacity: 1; transform: translateY(0); }
            .nav-links.active li:nth-child(4) a { transition-delay: 0.25s; opacity: 1; transform: translateY(0); }
            .nav-links.active li:nth-child(5) a { transition-delay: 0.3s; opacity: 1; transform: translateY(0); }

            /* Mobile Hover state */
            .nav-links a:hover, .nav-links a.active-page {
                color: var(--skynet-blue);
            }
            .nav-links a:not(.btn-get-started)::after { display: none; } /* Remove underlines on mobile */

            .btn-get-started {
                margin-top: 1rem;
                font-size: 1.25rem !important;
                padding: 1rem 2.5rem;
                background: var(--skynet-blue) !important;
            }
        }
    `;
    document.head.appendChild(style);

    // 2. GENERATE HEADER
    const headerHTML = `
        <nav class="global-nav" id="global-nav-container">
            <a href="index.html" class="logo-wrapper">
                <img src="images/Skynet.png" alt="SkyNet Consult Logo">
                <div class="brand-text">
                    <span class="brand-name">SKYNET</span>
                    <span class="brand-sub">CONSULT</span>
                </div>
            </a>
            
            <button class="mobile-toggle" id="global-mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="global-nav-links">
                <span></span><span></span><span></span>
            </button>

            <ul class="nav-links" id="global-nav-links">
                <li><a href="index.html">Home</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="unimatcher.html">UniMatcher®</a></li>
                <li><a href="contact.html" class="btn-get-started">Get Started</a></li>
            </ul>
        </nav>
    `;

    // 3. GENERATE FOOTER
    const footerHTML = `
        <footer class="global-footer">
            <div class="footer-content">
                <div class="footer-logo-section">
                    <h3 style="color: var(--skynet-blue); margin-bottom: 1.2rem; font-weight: 800; font-size: 1.4rem; letter-spacing: -0.5px;">SKYNET CONSULT</h3>
                    <p style="color: var(--text-muted); line-height: 1.6; font-size: 0.95rem;">Empowering Ghanaian students with data-driven academic orientation and career pathways.</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.2rem; font-weight: 700; font-size: 1.1rem;">Navigation</h4>
                    <ul class="footer-links-list">
                        <li><a href="about.html">Our Story</a></li>
                        <li><a href="services.html">Services</a></li>
                        <li><a href="unimatcher.html">UniMatcher Tool</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.2rem; font-weight: 700; font-size: 1.1rem;">Contact</h4>
                    <ul class="footer-contact-list">
                        <li>Accra, Ghana</li>
                        <li><a href="mailto:skynet1consult@gmail.com" style="color: inherit; text-decoration: none;">skynet1consult@gmail.com</a></li>
                        <li><a href="tel:+233209893750" style="color: inherit; text-decoration: none;">+233 20 989 3750</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-copyright">
                &copy; ${new Date().getFullYear()} SkyNet Consult. Built with Precision.
            </div>
        </footer>
    `;

    // 4. INJECT INTO DOM BASE
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 5. RUN PREMIUM NAVIGATION LOGIC
    const navContainer = document.getElementById('global-nav-container');
    const toggle = document.getElementById('global-mobile-toggle');
    const links = document.getElementById('global-nav-links');
    const navAnchors = links.querySelectorAll('a');

    // Highlight active page link
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    navAnchors.forEach(anchor => {
        if (anchor.getAttribute('href') === currentPath) {
            anchor.classList.add('active-page');
        }
    });

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const isOpened = links.classList.toggle('active');
            toggle.classList.toggle('open');
            navContainer.classList.toggle('menu-open');
            
            // Lock body scrolling when full-screen menu is open
            document.body.style.overflow = isOpened ? 'hidden' : '';
            toggle.setAttribute('aria-expanded', isOpened);
        });
    }
})();
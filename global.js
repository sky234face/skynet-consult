(function() {
    // 1. INJECT GLOBAL STYLES
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --navy: #0a192f;
            --skynet-blue: #3b82f6;
            --white: #ffffff;
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Header Styles */
        .global-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 8%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: sticky;
            top: 0;
            z-index: 9999;
            box-shadow: 0 2px 15px rgba(0,0,0,0.05);
            font-family: 'Inter', sans-serif;
        }

        .logo-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .logo-wrapper img { height: 45px; width: auto; }

        .brand-text { display: flex; align-items: baseline; gap: 4px; }
        .brand-name { font-size: 1.3rem; font-weight: 800; color: var(--navy); letter-spacing: -0.5px; }
        .brand-sub { font-size: 1.3rem; font-weight: 400; color: var(--skynet-blue); }

        .nav-links { display: flex; list-style: none; gap: 2rem; align-items: center; margin: 0; padding: 0; }
        .nav-links a { 
            text-decoration: none; 
            color: var(--navy); 
            font-weight: 600; 
            font-size: 15px;
            transition: var(--transition);
        }
        .nav-links a:hover { color: var(--skynet-blue); }

        .btn-get-started {
            background: var(--navy) !important;
            color: white !important;
            padding: 0.7rem 1.5rem;
            border-radius: 50px;
            font-weight: 700;
            box-shadow: 0 4px 12px rgba(10, 25, 47, 0.15);
        }

        /* Hamburger Menu */
        .mobile-toggle {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
        }

        .mobile-toggle span {
            width: 25px;
            height: 3px;
            background: var(--navy);
            border-radius: 2px;
            transition: 0.3s;
        }

        /* Footer Styles */
        .global-footer {
            background: var(--navy);
            color: white;
            padding: 5rem 8% 2rem;
            margin-top: 0;
            font-family: 'Inter', sans-serif;
        }

        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 3rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 3rem;
        }

        .footer-logo-section { max-width: 350px; }
        .footer-copyright {
            text-align: center;
            padding-top: 2rem;
            font-size: 0.85rem;
            opacity: 0.6;
        }

        /* Mobile Responsive */
        @media (max-width: 992px) {
            .global-nav { padding: 1rem 5%; }
            .mobile-toggle { display: flex; }
            .nav-links {
                position: fixed;
                top: 70px;
                right: -100%;
                flex-direction: column;
                background: white;
                width: 100%;
                padding: 2rem;
                gap: 1.5rem;
                box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                transition: 0.4s ease;
            }
            .nav-links.active { right: 0; }
            .brand-name, .brand-sub { font-size: 1.1rem; }
        }
    `;
    document.head.appendChild(style);

    // 2. GENERATE HEADER
    const headerHTML = `
        <nav class="global-nav">
            <a href="index.html" class="logo-wrapper">
                <img src="images/Skynet.png" alt="SkyNet Logo">
                <div class="brand-text">
                    <span class="brand-name">SKYNET</span>
                    <span class="brand-sub">CONSULT</span>
                </div>
            </a>
            
            <div class="mobile-toggle" id="global-mobile-toggle">
                <span></span><span></span><span></span>
            </div>

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
                    <h3 style="color: var(--skynet-blue); margin-bottom: 1.2rem; font-weight: 800;">SKYNET CONSULT</h3>
                    <p style="opacity: 0.8; line-height: 1.6;">Empowering Ghanaian students with data-driven academic orientation and career pathways.</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.2rem; font-weight: 700;">Navigation</h4>
                    <ul style="list-style: none; opacity: 0.8; line-height: 2.5; padding: 0;">
                        <li><a href="about.html" style="color: white; text-decoration: none;">Our Story</a></li>
                        <li><a href="services.html" style="color: white; text-decoration: none;">Services</a></li>
                        <li><a href="unimatcher.html" style="color: white; text-decoration: none;">UniMatcher Tool</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin-bottom: 1.2rem; font-weight: 700;">Contact</h4>
                    <ul style="list-style: none; opacity: 0.8; line-height: 2.5; padding: 0;">
                        <li>Accra, Ghana</li>
                        <li>skynet1consult@gmail.com</li>
                        <li>+233 209 893 750</li>
                    </ul>
                </div>
            </div>
            <div class="footer-copyright">
                © ${new Date().getFullYear()} SkyNet Consult. Built with Precision.
            </div>
        </footer>
    `;

    // 4. INJECT INTO PAGE
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 5. MOBILE INTERACTION LOGIC
    const toggle = document.getElementById('global-mobile-toggle');
    const links = document.getElementById('global-nav-links');

    if (toggle) {
        toggle.addEventListener('click', () => {
            links.classList.toggle('active');
            // Basic animation for toggle
            toggle.style.opacity = links.classList.contains('active') ? "0.5" : "1";
        });
    }
})();
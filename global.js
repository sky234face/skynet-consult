(function() {
    // 1. INJECT GLOBAL STYLES
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --navy: #0a192f;
            --skynet-blue: #4facfe;
            --white: #ffffff;
            --transition: all 0.3s ease;
        }

        /* Header Styles */
        .global-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 8%;
            background: rgba(255, 255, 255, 0.98);
            position: sticky;
            top: 0;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            font-family: 'Inter', sans-serif;
        }

        .logo-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }

        .logo-wrapper img { height: 50px; width: auto; }

        .brand-text { display: flex; align-items: baseline; gap: 8px; }
        .brand-name { font-size: 1.4rem; font-weight: 800; color: var(--navy); }
        .brand-sub { font-size: 1.4rem; font-weight: 400; color: var(--skynet-blue); }

        .nav-links { display: flex; list-style: none; gap: 2rem; align-items: center; }
        .nav-links a { 
            text-decoration: none; 
            color: var(--navy); 
            font-weight: 600; 
            transition: var(--transition);
        }
        .nav-links a:hover { color: var(--skynet-blue); }

        .btn-get-started {
            background: var(--navy) !important;
            color: white !important;
            padding: 0.8rem 1.6rem;
            border-radius: 8px;
            font-weight: 700;
        }

        /* Footer Styles */
        .global-footer {
            background: var(--navy);
            color: white;
            padding: 4rem 8% 2rem;
            margin-top: 5rem;
            font-family: 'Inter', sans-serif;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 2rem;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 2rem;
        }

        .footer-logo-section { max-width: 300px; }
        .footer-copyright {
            text-align: center;
            padding-top: 2rem;
            font-size: 0.9rem;
            opacity: 0.7;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .global-nav { padding: 0.8rem 5%; }
            .nav-links { display: none; } /* Consider adding a hamburger menu later */
            .brand-name, .brand-sub { font-size: 1.1rem; }
        }
    `;
    document.head.appendChild(style);

    // 2. GENERATE HEADER
    const headerHTML = `
        <nav class="global-nav">
            <a href="index.html" class="logo-wrapper">
                <img src="images/Skynet.png" alt="Logo">
                <div class="brand-text">
                    <span class="brand-name">SKYNET</span>
                    <span class="brand-sub">CONSULT</span>
                </div>
            </a>
            <ul class="nav-links">
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
                    <h3 style="color: var(--skynet-blue); margin-bottom: 1rem;">SKYNET CONSULT</h3>
                    <p style="opacity: 0.8;">Expert educational pathways for ambitious students in Ghana and beyond.</p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1rem;">Quick Links</h4>
                    <ul style="list-style: none; opacity: 0.8; line-height: 2;">
                        <li><a href="about.html" style="color: white; text-decoration: none;">Our Vision</a></li>
                        <li><a href="services.html" style="color: white; text-decoration: none;">Voucher Portal</a></li>
                        <li><a href="contact.html" style="color: white; text-decoration: none;">Contact Us</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-copyright">
                © ${new Date().getFullYear()} SkyNet Consult. All Rights Reserved.
            </div>
        </footer>
    `;

    // 4. INJECT INTO PAGE
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);
})();
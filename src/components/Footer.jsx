import "../assets/css/Footer.css";
import logo from "../assets/images/logo.png";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Ícones sociais no topo - como no layout original */}
                <div className="social-icons">
                    <a href="https://youtube.com/@creatorsplash?si=D23xBsHPxKg64dgf" className="social-icon youtube" aria-label="YouTube">
                        <i className="fab fa-youtube"></i>
                    </a>
                    <a href="https://www.twitch.tv/harp6288/" className="social-icon twitch" aria-label="Twitch">
                        <i className="fab fa-twitch"></i>
                    </a>
                    <a href="https://open.spotify.com/user/6mootkdohaai8rb15od6fy0ag?si=d0fe891d989849b0&nd=1&dlsi=5c56579d79ce433b" className="social-icon spotify" aria-label="Spotify">
                        <i className="fab fa-spotify"></i>
                    </a>
                    <a href="https://www.instagram.com/harp_6288" className="social-icon instagram" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://x.com/CreatorSplash_" className="social-icon twitter" aria-label="Twitter">
                        <i className="fab fa-x-twitter"></i>
                    </a>
                </div>

                {/* Layout principal horizontal */}
                <div className="footer-main">
                    <div className="footer-logo-section">
                        <div className="footer-logo">
                            <img src={logo} className="logo-image" alt="Creator Splash"/>
                        </div>
                        <div className="footer-info">
                            <p className="footer-description">
                                Since 2011 Noxcrew™ have been creating adventure
                                maps, skins and texture packs, and now we sell them
                                on the Minecraft Marketplace! Got a question for us?
                                Use the Contact page, or email us at
                                <a href="mailto:contact@noxcrew.com"> contact@noxcrew.com</a>
                            </p>
                        </div>
                    </div>

                    {/* Links à direita como "Looking for more?" */}
                    <div className="footer-links-container">
                        <div className="footer-links-section">
                            <h3>Looking for more?</h3>
                            <div className="discord-link">
                                <a href="https://discord.com/invite/YX2KZyeBeJ">Discord</a> • <a href="/careers">Careers</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer bottom com links legais inline */}
                <div className="footer-bottom">
                    <div className="legal-links">
                        <a href="/terms">Terms of Service</a>
                        <span className="dot">•</span>
                        <a href="/privacy">Privacy Notice</a>
                        <span className="dot">•</span>
                        <a href="/cookies">Cookie Policy</a>
                        <span className="dot">•</span>
                        <a href="/help">Help & FAQ</a>
                    </div>
                    <div className="copyright">
                        © 2025 Creator Splash. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
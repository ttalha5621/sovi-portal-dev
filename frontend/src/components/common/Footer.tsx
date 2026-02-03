import React from 'react'
import { APP_CONSTANTS } from '../../utils/constants'
import { FiHeart, FiGithub, FiTwitter, FiMail } from 'react-icons/fi'
import './Footer.css'

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear()

    const socialLinks = [
        { icon: <FiGithub />, label: 'GitHub', url: 'https://github.com/sovi-portal' },
        { icon: <FiTwitter />, label: 'Twitter', url: 'https://twitter.com/sovi_portal' },
        { icon: <FiMail />, label: 'Email', url: 'mailto:info@sovi.gov.pk' },
    ]

    const footerLinks = [
        { label: 'About', url: '/about' },
        { label: 'Documentation', url: '/docs' },
        { label: 'API', url: '/api-docs' },
        { label: 'Privacy Policy', url: '/privacy' },
        { label: 'Terms of Service', url: '/terms' },
        { label: 'Contact', url: '/contact' },
    ]

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-main">
                    <div className="footer-brand">
                        <h3 className="footer-title">{APP_CONSTANTS.APP_NAME}</h3>
                        <p className="footer-description">
                            Social Vulnerability Index Portal for Pakistan.
                            Monitoring and analyzing social vulnerabilities across districts.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-links-title">Quick Links</h4>
                        <ul className="footer-links-list">
                            {footerLinks.map((link) => (
                                <li key={link.label} className="footer-links-item">
                                    <a href={link.url} className="footer-link">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="footer-social">
                        <h4 className="footer-social-title">Connect With Us</h4>
                        <div className="footer-social-icons">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="footer-social-link"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <p>
                            © {currentYear} {APP_CONSTANTS.APP_NAME}. All rights reserved.
                            <span className="footer-heart">
                                Made with <FiHeart className="inline" /> for Pakistan
                            </span>
                        </p>
                    </div>

                    <div className="footer-version">
                        <span className="version-badge">v{APP_CONSTANTS.VERSION}</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
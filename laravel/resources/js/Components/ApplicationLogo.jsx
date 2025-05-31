export default function ApplicationLogo({ className }) {
    return (
        <div className={`navbar-logo ${className}`}>
            <style>{`
                .navbar-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 1.8em;
                    font-weight: bold;
                    color: #1563ff;
                    text-decoration: none;
                    position: relative;
                    padding-right: 32px;
                }

                .navbar-logo span {
                    background: linear-gradient(135deg, #1563ff 0%, #54a0ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: logoColorShift 8s infinite;
                }

                @keyframes logoColorShift {
                    0%, 100% {
                        filter: hue-rotate(0deg);
                    }
                    50% {
                        filter: hue-rotate(30deg);
                    }
                }

                .navbar-logo::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 1px;
                    height: 32px;
                    background: #e0e5f2;
                }

                @media (max-width: 768px) {
                    .navbar-logo {
                        font-size: 1.5em;
                        padding-right: 16px;
                    }
                }
            `}</style>
            <span>ONESSTA</span>
        </div>
    );
}

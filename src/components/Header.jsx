import "../assets/css/Header.css";
import logo from "../assets/images/logo.png";

function Header() {

    return (
        <>
            <header className="header bg-header">
                <div className="logo">
                    <img className="logo-image" src={logo} alt="Creator Splash"/>
                </div>
                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <a className="navbar-item" href="/#about">ABOUT</a>
                        </li>
                        <li className="header-nav-item">
                            <a className="navbar-item" href="/participants">PARTICIPANTS</a>
                        </li>
                        <li className="header-nav-item">
                            <a className="navbar-item" href="/creatorsplash">CREATOR SPLASH</a>
                        </li>
                        <li className="header-nav-item">
                            <a className="navbar-item" href="/shop">SHOP</a>
                        </li>
                        <li className="header-nav-item">
                            <a className="navbar-item" href="/news">NEWS</a>
                        </li>
                        <li className="header-nav-item">
                            <a className="navbar-item" href="/contact">CONTACT US</a>
                        </li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header

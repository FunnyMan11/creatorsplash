import "../assets/css/Home.css";
import video from "../assets/video/homepage.mp4";

function Home() {
    return (
        <section className="home" id="inicio">
            <div className="wrapper">
                <div className="frame-container">
                    <video src={video} autoPlay loop muted playsInline preload="auto" />

                    <a className="youtube-subscribe-btn" href="https://www.youtube.com/@creatorsplash" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-youtube"></i>
                        <span>SUBSCRIBE</span>
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Home;
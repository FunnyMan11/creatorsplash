import '../assets/css/ClientLogos.css';
import logoMicrosoft from "../assets/images/mslogo.png";
import logoApple from "../assets/images/applelogo.png";

// You would import actual logo images in a real application
// This is just a placeholder structure

const ClientLogos = () => {

    return (
        <section className="client-logos-section">
            <div className="client-logos-container">
                <h2 className="client-logos-heading">We&#39;ve worked with...</h2>

                <div className="client-logos-grid">
                    <div className="client-logo-item">
                        <div className="client-logo" aria-label="Microsoft">
                            <img src={logoMicrosoft} alt="Microsoft"/>
                        </div>
                    </div>
                    <div className="client-logo-item">
                        <div className="client-logo" aria-label="Apple">
                            <img src={logoApple} alt="Apple"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClientLogos;
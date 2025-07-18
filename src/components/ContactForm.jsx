import { useForm } from "./FormContext";
import { useState } from "react";
import "../assets/css/Form.css";
import logo from "../assets/images/logo.png";

export default function ContactForm() {
    const { isOpen, closeForm } = useForm();
    const [formData, setFormData] = useState({ email: "", nickname: "" });

    const handleOutsideClick = (e) => {
        if (e.target.id === "form-overlay") {
            closeForm();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Adicionando 'action' para indicar que é um cadastro
        fetch(`${window.location.origin}/api.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "signup",  // Indica que é um cadastro
                email: formData.email,
                nickname: formData.nickname,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Caso o PHP retorne sucesso
                    alert(data.message || "Inscrição enviada com sucesso!");
                    closeForm();
                } else {
                    // Caso o PHP retorne falha
                    alert(data.message || "O email já foi usado ou o Nick já foi registrado.");
                }
            })
            .catch((error) => {
                // Caso ocorra um erro inesperado
                console.error("Erro ao enviar o formulário:", error);
                alert("Ocorreu um erro inesperado. Tente novamente mais tarde.");
            });
    };

    if (!isOpen) return null;

    return (
        <div
            id="form-overlay"
            className="form-overlay"
            onClick={handleOutsideClick}
        >
            <div className="form-container">
                <img src={logo} alt="Logo do Projeto" className="form-logo" />
                <p className="form-description">
                    Inscreva-se para concorrer ao sorteio de acesso à alpha, caso seja sorteado, receberá um email informativo.
                </p>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nickname" className="form-label">Nickname(Minecraft)</label>
                        <input
                            type="text"
                            id="nickname"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleInputChange}
                            required
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="form-submit-button">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}
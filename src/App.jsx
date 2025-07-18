import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from "./components/Header.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";
import {FormProvider} from "./components/FormContext.jsx";
import ContactForm from "./components/ContactForm.jsx";
import Informations from "./components/Informations.jsx";
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./components/Dashboard/";
import UserManagement from "./components/UserManagement.jsx";
import Login from "./components/Login.jsx";
import Shop from "./components/Shop.jsx";
import ClientLogos from "./components/ClientLogos.jsx";
import GameParticipants from "./components/GameParticipants.jsx";
import NewsList from './components/News/NewsList';
import NewsDetail from './components/News/NewsDetail';
import CreatorSplash from "./components/CreatorSplash.jsx";
import Mainf from "./components/mainf.jsx";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminView, setAdminView] = useState('Dashboard'); // Changed 'dashboard' to 'Dashboard'
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Verifica se o token está expirado
                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);  // Token válido
                } else {
                    localStorage.removeItem('token');  // Token expirado
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, [navigate]);

    // Função de login para armazenar o token e autenticar o usuário
    const handleLogin = (status) => {
        setIsAuthenticated(status);
        if (status) {
            navigate('/admin');
        }
    };

    // Função para renderizar o componente administrativo correto
    const renderAdminComponent = () => {
        switch (adminView) {
            case 'users':
                return <UserManagement />;
            case 'Dashboard':
            default:
                return <Dashboard onViewChange={setAdminView} />;
        }
    };

    return (
        <>
            <FormProvider>
                <ContactForm />
                <Routes>
                    <Route path="/" element={
                        <>
                            <Header/>
                            <Home />
                            <About />
                            <Informations/>
                            <Faq />
                            <ClientLogos />
                            <Footer />
                        </>
                    } />
                    <Route path="/participants" element={
                        <>
                            <Header/>
                            <GameParticipants />
                            <Footer />
                        </>
                    } />
                    <Route path="/creatorsplash" element={
                        <>
                            <Header/>
                            <CreatorSplash />
                            <Footer />
                        </>
                    } />

                    <Route path="/shop" element={
                        <>
                            <Header />
                            <Shop />
                            <Footer />
                        </>
                    } />

                    <Route path="/contact" element={
                        <>
                            <Header/>
                            <Footer />
                        </>
                    } />

                    <Route path="/admin" element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <>
                                {renderAdminComponent()}
                            </>
                        </ProtectedRoute>
                    } />

                    <Route path="/admin-login" element={
                        <>
                            <Header />
                            <Login onLogin={handleLogin} />
                            <Footer />
                        </>
                    } />

                    <Route path="/news" element={
                        <>
                            <Header />
                            <NewsList API_URL="/api" />
                            <Footer />
                        </>

                    } />
                    <Route path="/news/:slug" element={
                        <>
                            <Header />
                            <NewsDetail API_URL="/api" />
                            <Footer />
                        </>

                    } />
                    <Route path="/en-gbp" element={<Mainf />} />
                </Routes>
            </FormProvider>
        </>
    )
}

export default App
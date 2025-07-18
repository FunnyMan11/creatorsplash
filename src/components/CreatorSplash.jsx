"use client";

import React, { useState } from "react";
import '../assets/css/CreatorSplash.css';
import Faq from "./Faq.jsx";

const CreatorSplash = () => {
    const games = [
        {
            id: 1,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 2,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 3,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 4,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 5,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 6,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 7,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 8,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
        {
            id: 9,
            title: "Example",
            image: "https://placehold.co/600x400",
            description: "Example",
        },
    ];

    const staff = [
        {
            id: 1,
            name: "People",
            role: "Role",
            image: "https://placehold.co/600x400",
        },
        {
            id: 2,
            name: "People",
            role: "Role",
            image: "https://placehold.co/600x400",
        },
        {
            id: 3,
            name: "People",
            role: "Role",
            image: "https://placehold.co/600x400",
        },
        {
            id: 4,
            name: "People",
            role: "Role",
            image: "https://placehold.co/600x400",
        },
        {
            id: 5,
            name: "People",
            role: "Role",
            image: "https://placehold.co/600x400",
        },
        {
            id: 6,
            name: "People",
            role: "Role",
            image: "https://placehold.co/600x400",
        },
    ];

    const [openDescriptionId, setOpenDescriptionId] = useState(null);

    // Function to toggle description visibility
    const toggleDescription = (id) => {
        setOpenDescriptionId(openDescriptionId === id ? null : id);
    };

    return (
        <div className="creator-splash-container">
            <div className="creator-splash-header">
                <div className="creator-splash-header__container">
                    <h1 className="creator-splash-header__title">LOREM IPSUM</h1>
                </div>
            </div>

            <div className="creator-splash-main">
                <div className="creator-splash-intro">
                    <div className="creator-splash-intro__content">
                        <h2 className="creator-splash-intro__title">Lorem ipsum dolor quisquam est qui dolorem</h2>
                        <div className="creator-splash-intro__text">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rhoncus mollis libero. Phasellus commodo cursus arcu non interdum. Curabitur dapibus tellus sit amet turpis rutrum, quis
                                lobortis neque porta. Nunc neque lorem, gravida dapibus auctor a, gravida nec elit. Morbi finibus dolor et tellus feugiat, eget tempor augue commodo. Aliquam rhoncus consectetur erat
                                eu posuere. Fusce ut consequat libero. Vivamus sagittis nunc eu quam venenatis, sit amet lacinia sapien porta. Donec eros massa, faucibus porta tempus eget, tincidunt molestie nulla.
                                Fusce tincidunt aliquam dolor, ac eleifend ex finibus vel. Aliquam felis nibh, malesuada a elementum at, tristique eget orci. Nullam tellus massa, vestibulum ac condimentum eu, feugiat
                                nec sem. Mauris sit amet eros vitae magna dictum scelerisque. Sed vitae fermentum diam. Donec feugiat elit id purus dictum, non posuere ex iaculis. Proin vitae est porta, sollicitudin
                                nisi at, porta quam. Cras mattis lectus in libero maximus, in tincidunt dui aliquam. Sed sit amet quam at nisl ultricies tincidunt at in nulla. Proin id interdum ex. Praesent placerat
                                vitae metus vitae fringilla. Duis eget laoreet odio. Donec vel nulla et urna interdum rhoncus eget et massa. Maecenas porta dignissim quam, a malesuada tellus.
                            </p>
                            <p className="creator-splash-intro__text--emphasis">Lorem ipsum dolor id varius nulla. Quisque iaculis mauris...</p>
                        </div>
                    </div>

                    <div className="creator-splash-intro__image-wrapper">
                        <div className="creator-splash-intro__image-container">
                            <img src="https://placehold.co/600x400" alt="Image" className="creator-splash-intro__image" />
                        </div>
                    </div>
                </div>

                <div className="creator-splash-games">
                    {games.map((game) => (
                        <div key={game.id} className="creator-splash-games__card">
                            <div className="creator-splash-games__image-container">
                                <img src={game.image} alt={game.title} className="creator-splash-games__image" />
                            </div>

                            <div className="creator-splash-games__content">
                                <div className="creator-splash-games__header">
                                    <h3 className="creator-splash-games__title" onClick={() => toggleDescription(game.id)}>
                                        {game.title}
                                    </h3>
                                </div>
                                <div className={`creator-splash-games__description ${openDescriptionId === game.id ? "creator-splash-games__description--open" : ""}`}>
                                    <p className="creator-splash-games__description-text">{game.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Faq />

                <div className="creator-splash-staff">
                    {staff.map((value) => (
                        <div key={value.id} className="creator-splash-staff__card">
                            <div className="creator-splash-staff__image-container">
                                <img src={value.image} alt={value.name} className="creator-splash-staff__image" />
                            </div>

                            <div className="creator-splash-staff__content">
                                <div className="creator-splash-staff__header">
                                    <h3 className="creator-splash-staff__name">{value.name}</h3>
                                </div>
                                <p className="creator-splash-staff__role">{value.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreatorSplash;
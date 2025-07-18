import React, { useState, useEffect } from 'react';

const fontStack = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif`;

const AXOLOTL_COUNT = 25; // Change this to your total number of images

const Mainf = () => {
    const [current, setCurrent] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => prev >= AXOLOTL_COUNT ? 1 : prev + 1);
        }, 1300); // Change image every 1 second
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ fontFamily: fontStack }}>
            {/* Banner Image */}


            {/* New Section with Background Image, Text, and Buttons */}
            <section
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '80vh',
                    backgroundImage: 'url(/src/assets/images/bgc.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0,0,0,0.0)', // transparent overlay if needed
                        zIndex: 1,
                    }}
                />
                <div
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        textAlign: 'center',
                        color: '#d1a4f7',
                        width: '100%',
                        padding: '80px 20px 40px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={`/src/assets/images/AxolotlHeads/Axolotl_${current}.png`}
                        alt={`Axolotl ${current}`}
                        style={{ width: 300, height: 300, objectFit: 'contain', transition: 'opacity 0.3s', marginTop: -180 }}
                    />
                    <h1
                        style={{
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            letterSpacing: '2px',
                            marginBottom: '32px',
                            color: '#d1a4f7',
                            textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                    >
                        Shop Creator Splash Collection
                    </h1>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <a
                            href="https://creatorsplash-shop.fourthwall.com/en-gbp"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: '#a259f7',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '16px 32px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                letterSpacing: '1px',
                                transition: 'background 0.2s',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            SHOP NOW
                        </a>
                        <a
                            href="https://www.youtube.com/@CreatorSplash"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: '#fff',
                                border: '1px solid #fff',
                                borderRadius: '6px',
                                padding: '16px 32px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                letterSpacing: '1px',
                                transition: 'background 0.2s',
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            VISIT CHANNEL
                        </a>
                    </div>
                </div>
            </section>

            {/* Instagram Feed Section */}
            <div className="container wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
                <div
                    className="instagram-feed__header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: 24
                    }}
                >
                    <h2
                        className="section-header__heading"
                        style={{
                            fontSize: '2rem',
                            color: '#a259f7',
                            margin: 0,
                            fontWeight: 500
                        }}
                    >
                        Follow on Instagram
                    </h2>
                    <div className="section-header__cta visible-desktop">
                        <a
                            href="https://instagram.com/saithsfuff"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button--primary"
                            style={{
                                background: '#a259f7',
                                color: '#fff',
                                padding: '10px 24px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                marginLeft: '16px'
                            }}
                        >
                            Visit profile
                        </a>
                    </div>
                </div>

                <div className="instagram-feed__grid" style={{ marginTop: 32 }}>
                    <div
                        className="grid grid--waffle grid--gapless"
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 24,
                            justifyContent: 'center',
                        }}
                    >
                        {/* Instagram Posts */}
                        {[
                            {
                                href: "https://www.instagram.com/harp_6288/",
                                src: "src/assets/images/instagram1.png",
                                alt: "Who should I paint next?"
                            },
                            {
                                href: "https://www.instagram.com/harp_6288/",
                                src: "src/assets/images/instagram2.png",
                                alt: "You can still enjoy the important moments while capturing them forever"
                            },
                            {
                                href: "https://www.instagram.com/harp_6288/",
                                src: "src/assets/images/instagram3.png",
                                alt: "ASUS ROG XG27ACS is on Black Friday limited offer"
                            },
                            {
                                href: "https://www.instagram.com/harp_6288/",
                                src: "src/assets/images/instagram4.png",
                                alt: "This past Halloween we raised £2,606 for the Blue Cross!"
                            },
                            {
                                href: "https://www.instagram.com/harp_6288/",
                                src: "src/assets/images/instagram5.png",
                                alt: "This past Halloween we raised £2,606 for the Blue Cross!"
                            },
                            {
                                href: "https://www.instagram.com/harp_6288/",
                                src: "src/assets/images/instagram6.png",
                                alt: "This past Halloween we raised £2,606 for the Blue Cross!"
                            }
                        ].map((post, idx) => (
                            <div
                                key={idx}
                                className="grid__column grid__column--4 grid__column--2@md"
                                style={{ flex: '1 1 30%', maxWidth: 180, minWidth: 120 }}
                            >
                                <a href={post.href} target="_blank" rel="noopener noreferrer" className="instagram-feed__post">
                                    <img
                                        src={post.src}
                                        alt={post.alt}
                                        className="instagram-feed__image"
                                        style={{
                                            width: '100%',
                                            aspectRatio: '1/1',
                                            objectFit: 'cover',
                                            borderRadius: 12,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                        }}
                                    />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA for small screens */}
                <div className="instagram-feed__cta-container visible-mobile" style={{ marginTop: 32, textAlign: 'center', display: 'none' }}>
                    <a
                        href="https://www.instagram.com/harp_6288/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button button--primary button--small"
                        style={{
                            background: '#a259f7',
                            color: '#fff',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1rem'
                        }}
                    >
                        Visit profile
                    </a>
                </div>
            </div>

            {/* TikTok Feed Section */}
            <div className="container wrapper" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 0' }}>
                <div className="recent-tiktok__header">
                    <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <h2 className="section-header__heading" style={{ fontSize: '2rem', color: '#a259f7', margin: 0 }}>Follow on TikTok</h2>
                        <div className="section-header__cta visible@sm">
                            <a
                                href="https://www.tiktok.com/@creator.splash"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="button button--outline button--small"
                                style={{
                                    border: '2px solid #a259f7',
                                    color: '#a259f7',
                                    background: 'transparent',
                                    padding: '10px 24px',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    marginLeft: '16px'
                                }}
                            >
                                Visit channel
                            </a>
                        </div>
                    </div>
                </div>

                <div className="recent-tiktok__grid" style={{ marginTop: 32 }}>
                    <div className="grid grid--center grid--waffle" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                        {[
                            {
                                href: "https://www.tiktok.com/@creator.splash",
                                src: "src/assets/images/tiktok1.png",
                                alt: "Whos your favourite?? #art #artist #streamer #fyp #cute #gamer #keycap #pokemon #bulbasaur #gengar #snorlax #artisankeycaps "
                            },
                            {
                                href: "https://www.tiktok.com/@creator.splash",
                                src: "src/assets/images/tiktok2.png",
                                alt: "Thank you @Higround and @Minecraft for this amazing keyboard!!"
                            },
                            {
                                href: "https://www.tiktok.com/@creator.splash",
                                src: "src/assets/images/tiktok3.png",
                                alt: "Can you guess what im making? #craft #diy #art #mcart #minecraftart #mcyt #streamer #twitch #minecraft #mcheart #minecraftheart #heart "
                            },
                            {
                                href: "https://www.tiktok.com/@creator.splash",
                                src: "src/assets/images/tiktok4.png",
                                alt: "Can you guess what im making? #craft #diy #art #mcart #minecraftart #mcyt #streamer #twitch #minecraft #mcheart #minecraftheart #heart "
                            },

                        ].map((video, idx) => (
                            <div
                                key={idx}
                                className="grid__column grid__column--6 grid__column--3@md"
                                style={{ flex: '1 1 40%', maxWidth: 280, minWidth: 180 }}
                            >
                                <div className="video-tile">
                                    <a href={video.href} target="_blank" rel="noopener noreferrer" className="video-tile__link" style={{ display: 'block', position: 'relative' }}>
                                        <div className="video-tile__image-container" style={{ position: 'relative' }}>
                                            <div className="video-tile__image video-tile__image--no-opacity">
                                                <div className="image image--video-thumbnail image--video-thumbnail-large">
                                                    <div className="image__object">
                                                        <img
                                                            src={video.src}
                                                            alt={video.alt}
                                                            className="image__image"
                                                            style={{
                                                                width: '100%',
                                                                aspectRatio: '1/1',
                                                                objectFit: 'cover',
                                                                borderRadius: 12,
                                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA for small screens */}
                <div className="recent-tiktok__cta-container hidden@sm" style={{ marginTop: 32, textAlign: 'center' }}>
                    <div className="recent-tiktok__cta">
                        <a
                            href="https://www.tiktok.com/@saithsfuff"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button button--outline button--small"
                            style={{
                                border: '2px solid #a259f7',
                                color: '#a259f7',
                                background: 'transparent',
                                padding: '10px 24px',
                                borderRadius: '6px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            Visit channel
                        </a>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Mainf; 
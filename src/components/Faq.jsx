import { useEffect, useRef } from "react";
import "../assets/css/Faq.css";

function Faq() {
    const detailsRefs = useRef([]);

    useEffect(() => {
        // Get all details elements within the FAQ section
        const detailsElements = document.querySelectorAll("section#faq details");

        // Store references to the details elements
        detailsRefs.current = Array.from(detailsElements);

        // Function to handle the toggle event
        const handleToggle = (openedDetail) => {
            if (openedDetail.open) {
                // Get the content element
                const content = openedDetail.querySelector('.details-content');

                // Make content visible immediately
                content.style.opacity = '1';

                // Set actual height for the animation
                const contentHeight = content.scrollHeight;
                content.style.maxHeight = `${contentHeight}px`;

                // Close all other details
                detailsRefs.current.forEach(detail => {
                    if (detail !== openedDetail && detail.open) {
                        // Reset the content height before closing
                        const otherContent = detail.querySelector('.details-content');
                        otherContent.style.maxHeight = '0px';
                        otherContent.style.opacity = '0';

                        // Small delay to allow animation to start before closing
                        setTimeout(() => {
                            detail.open = false;
                        }, 10);
                    }
                });
            } else {
                // When closing, animate the content collapse
                const content = openedDetail.querySelector('.details-content');
                content.style.maxHeight = '0px';
                content.style.opacity = '0';
            }
        };

        // Add click event listeners to all summary elements
        detailsRefs.current.forEach(detail => {
            const summary = detail.querySelector('summary');

            summary.addEventListener('click', (e) => {
                // If it's already open, we need to manually handle the closing animation
                // because we'll prevent the default toggle behavior
                if (detail.open) {
                    e.preventDefault();

                    // Start the closing animation
                    const content = detail.querySelector('.details-content');
                    content.style.maxHeight = '0px';
                    content.style.opacity = '0';

                    // Close the details after the animation completes
                    setTimeout(() => {
                        detail.open = false;
                    }, 400); // Match this with your CSS transition duration
                }
                // If it's closed, let the default behavior happen and our toggle handler will take care of it
            });

            // Still need the toggle handler for programmatic opening/closing
            detail.addEventListener('toggle', () => handleToggle(detail));

            // Set initial state for already open details (if any)
            if (detail.open) {
                const content = detail.querySelector('.details-content');
                content.style.maxHeight = `${content.scrollHeight}px`;
                content.style.opacity = '1';
            }
        });

        // Cleanup: remove event listeners when component unmounts
        return () => {
            detailsRefs.current.forEach(detail => {
                const summary = detail.querySelector('summary');
                summary.removeEventListener('click', () => {});
                detail.removeEventListener('toggle', () => handleToggle(detail));
            });
        };
    }, []);

    return (
        <>
            <section id="faq" className="faq">
                <div className="faq-container">
                    <div className="faq-content">
                        <h1 className="faq-title bold">FAQ</h1>
                        <p className="faq-text">
                            We get asked lots of questions, lots of times, so we&#39;ve gathered the most
                            frequently asked ones here. If you&#39;ve something to ask that&#39;s not covered,
                            then do use our contact form and we&#39;ll get back to you as soon as we can!
                        </p>

                        <details>
                            <summary>What is Creator Splash?</summary>
                            <div className="details-content">
                                <p>
                                    We are a dynamic Minecraft Event in the Gaming industry designed to bring content
                                    creators together through fun, engaging, and light hearted gameplay experiences. At
                                    Creator Splash, we create unique, high-energy events that encourage collaboration,
                                    creativity, and entertainment to viewers. Our goal is to provide a welcoming space
                                    where creators can connect, compete, and create memorable content while fostering a
                                    strong, inclusive community. Whether it’s through innovative game formats or shared
                                    laughter, Creator Splash is all about bringing creators together in a way that feels
                                    fresh, exciting, and accessible to all.
                                </p>
                            </div>
                        </details>

                        <details>
                            <summary>Our Mission</summary>
                            <div className="details-content">
                                <p>
                                    Our mission is to create an inclusive, welcoming space where creators can connect,
                                    collaborate, and entertain their audiences through unique and memorable gameplay
                                    experiences. Creator Splash exists to break down barriers between content creators
                                    by providing fun, inclusive, and light hearted gaming experiences.
                                </p>
                            </div>
                        </details>

                        <details>
                            <summary>How can I join?</summary>
                            <div className="details-content">
                                <p>
                                    Every month we host a fun new event in the community. To get involved make sure you
                                    follow us on Twitter and join the discord server!
                                </p>
                            </div>
                        </details>

                        <details>
                            <summary>Can I stream or record the event for my own content?</summary>
                            <div className="details-content">
                                <p>
                                    Of course! Depending on the event we will suggest either streaming or recording.
                                </p>
                            </div>
                        </details>

                        <details>
                            <summary>Can I ask Harp to be in my video?</summary>
                            <div className="details-content">
                                <p>
                                    Harp&#39;s schedule varies depending on the day so it just depends on when you catch
                                    him. Please keep in mind Harp usually has a pretty tight schedule so we&#39;re afraid
                                    the odds of him joining isn&#39;t the greatest. The more notice you can give in advance
                                    the better!
                                </p>
                            </div>
                        </details>
                        <details>
                            <summary>Where can I watch Creator Splash content?</summary>
                            <div className="details-content">
                                <p>
                                    You can subscribe to the Creator Splash YouTube channel to keep up to date with videos.
                                </p>
                            </div>
                        </details>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Faq;
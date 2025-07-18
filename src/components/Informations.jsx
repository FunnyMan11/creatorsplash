import "../assets/css/Informations.css";
import community from "../assets/images/community.png";
import events from "../assets/images/events.png";

function Informations() {


    return (
        <>
            <section className="information container" id="inicio">
                <div className="information-left">
                    <img className="information-image" src={community}/>
                    <div className="information-texts">
                        <h1 className="information-texts-title">COMMUNITY</h1>
                        <p className="information-texts-paragraph">The heart of Creator Splash’s content is the
                            incredible community that makes every stream, event, and video even more fun. Whether it’s
                            through chaotic Minecraft moments, genuinely funny jokes, or legendary event lore, the
                            community is all about fun, friendship, and absolute madness. </p>
                        <p className="information-texts-paragraph">Want to be part of the community? Join the Discord
                            Server to chat, hang out, and get involved in upcoming events. <br/> Plus, stay up to date
                            with announcements and creations on Creator Splash by following Creator Splash on Twitter/X.
                        </p>
                    </div>
                </div>
                <div className="information-right">
                    <img className="information-image" src={events}/>
                    <div className="information-texts">
                        <h1 className="information-texts-title">EVENTS</h1>
                        <p className="information-texts-paragraph">Harp is the host of Creator Splash, a thrilling New
                            Minecraft Event that brings together Content creators from around the world for exciting,
                            chaotic Minecraft challenges. Known for its unpredictable twists and funny moments, Creator
                            Splash is more than just a fun event competition...it’s an experience. </p>
                        <p className="information-texts-paragraph">Each event is packed with exciting action, hilarious
                            moments, and unforgettable rivalries, making it a must watch for fans of Minecraft and
                            Content Creation.</p>
                        <a className="information-texts-link" href="#creatorsplash">➡ Learn more about Creator
                            Splash</a>
                    </div>
                </div>
                <div className="information-left">
                    <img className="information-image" src={events}/>
                    <div className="information-texts">
                        <h1 className="information-texts-title">MERCH</h1>
                        <p className="information-texts-paragraph">Harp is the host of Creator Splash, a thrilling New
                            Minecraft Event that brings together Content creators from around the world for exciting,
                            chaotic Minecraft challenges. Known for its unpredictable twists and funny moments, Creator
                            Splash is more than just a fun event competition...it’s an experience. </p>
                        <p className="information-texts-paragraph">Each event is packed with exciting action, hilarious
                            moments, and unforgettable rivalries, making it a must watch for fans of Minecraft and
                            Content Creation.</p>
                        <a className="information-texts-link" href="#creatorsplash">➡ Learn more about Creator
                            Splash</a>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Informations

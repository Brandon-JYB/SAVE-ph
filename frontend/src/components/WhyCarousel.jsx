import { useState } from "react";
import WheatIcon from "../svg/WheatIcon";
import OldPersonIcon from "../svg/OldPersonIcon";
import MythIcon from "../svg/MythIcon";
import ArrowLeftCircleIcon from "../svg/ArrowLeftCircleIcon";
import ArrowRightCircleIcon from "../svg/ArrowRightCircleIcon";
import ArrowUpRightIcon from "../svg/ArrowUpRightIcon";

/*
    Every card links to its source, for transparency.
        source.name -> tag shown on the card
        source.type -> tag: NEWS | STUDY | DATA | REPORT
        source.url  -> where the round ↗ button goes
*/
const WHY_CARDS = [
    {
        id: "food",
        title: "GROWING FOOD INSECURITY",
        Icon: WheatIcon,
        source: {
            name: "PIDS · BusinessWorld",
            type: "News",
            url: "https://pids.gov.ph/details/news/in-the-news/hunger-knocks-on-door-as-philippine-farmers-vanish",
        },
        body: (
            <>
                A dramatic drop in farm workers translates directly to an inability to maintain food <strong>self-sufficiency</strong>, forcing the country to rely heavily on expensive imported commodities.
            </>
        ),
    },
    {
        id: "workforce",
        title: "GRAYING WORKFORCE",
        Icon: OldPersonIcon,
        source: {
            name: "Manila Times via SEARCA",
            type: "Editorial",
            url: "https://www.searca.org/press/aging-farmers-could-add-food-insecurity",
        },
        body: (
            <>
                The average age of the Filipino farmer ranges between <strong>57 and 59 years old</strong>. Experts predict a critical shortage of farmers within the next 10 to 12 years if younger generations do not step up.
            </>
        ),
    },
    {
        id: "stereotypes",
        title: "BREAKING STEREOTYPES",
        Icon: MythIcon,
        source: {
            name: "Mercado & Osbahr, 2023",
            type: "Study",
            url: "https://doi.org/10.37801/ajad2023.20.2.3",
        },
        body: (
            <>
                Agriculture is widely stigmatized in rural communities as an unprofitable, low-status, and physically exhausting <strong>"poor man's profession."</strong>
            </>
        ),
    },
];

export default function WhyCarousel() {
    const [active, setActive] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const total = WHY_CARDS.length;

    const goTo = (index) => setActive((index + total) % total);
    const next = () => goTo(active + 1);
    const prev = () => goTo(active - 1);

    function handleKeyDown(event) {
        if (event.key === "ArrowRight") next();
        if (event.key === "ArrowLeft") prev();
    }

    function handleTouchStart(event) {
        setTouchStartX(event.touches[0].clientX);
    }

    function handleTouchEnd(event) {
        if (touchStartX === null) return;
        const dx = event.changedTouches[0].clientX - touchStartX;
        setTouchStartX(null);
        if (dx < -50) next();
        else if (dx > 50) prev();
    }

    return (
        <div
            className="why"
            role="region"
            aria-roledescription="carousel"
            aria-label="Why your community needs you"
            onKeyDown={handleKeyDown}
        >
            <div
                className="why__viewport"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="why__track" style={{ "--active": active }}>
                    {WHY_CARDS.map(({ id, title, Icon, body, source }, index) => {
                        const isActive = index === active;

                        return (
                            <div
                                className={"why__slide" + (isActive ? " is-active" : "")}
                                key={id}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${index + 1} of ${total}`}
                                aria-hidden={!isActive}
                                onClick={() => {
                                    if (!isActive) goTo(index);   // tapping a peeking card brings it forward
                                }}
                            >
                                <article className="why__card">
                                    {source && (
                                        <a
                                            className="why__source-btn"
                                            href={source.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`Read the source: ${source.name} (opens in a new tab)`}
                                            title={`Read the source: ${source.name}`}
                                            tabIndex={isActive ? 0 : -1}
                                        >
                                            <ArrowUpRightIcon className="why__source-icon" />
                                        </a>
                                    )}

                                    <span className="why__icon">
                                        <Icon />
                                    </span>

                                    <div className="why__body">
                                        <h3>{title}</h3>
                                        <p>{body}</p>
                                    </div>

                                    <div className="why__foot">
                                        <span className="why__count">
                                            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                                        </span>
                                        {source && (
                                            <span className="why__tags">
                                                <span className="why__tag why__tag--type">{source.type}</span>
                                                <span className="why__tag">{source.name}</span>
                                            </span>
                                        )}
                                    </div>
                                </article>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="why__controls">
                <button
                    type="button"
                    className="why__arrow"
                    onClick={prev}
                    aria-label="Previous card"
                >
                    <ArrowLeftCircleIcon className="why__arrow-icon" />
                </button>

                <div className="why__dots">
                    {WHY_CARDS.map((card, index) => (
                        <button
                            key={card.id}
                            type="button"
                            className={"why__dot" + (index === active ? " is-active" : "")}
                            onClick={() => goTo(index)}
                            aria-label={`Show card ${index + 1}: ${card.title}`}
                            aria-current={index === active}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="why__arrow"
                    onClick={next}
                    aria-label="Next card"
                >
                    <ArrowRightCircleIcon className="why__arrow-icon" />
                </button>
            </div>
        </div>
    );
}
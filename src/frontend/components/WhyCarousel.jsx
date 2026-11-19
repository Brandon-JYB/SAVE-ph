import { useState } from "react";
import WheatIcon from "../svg/WheatIcon";
import OldPersonIcon from "../svg/OldPersonIcon";
import MythIcon from "../svg/MythIcon";
import ArrowLeftCircleIcon from "../svg/ArrowLeftCircleIcon";
import ArrowRightCircleIcon from "../svg/ArrowRightCircleIcon";

const WHY_CARDS = [
    {
        id: "food",
        title: "GROWING FOOD INSECURITY",
        Icon: WheatIcon,
        source: "",   // paste a link here to show a "SOURCE →" link
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
        source: "",
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
        source: "",
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
            <div className="why__viewport" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                <div className="why__track" style={{ transform: `translateX(-${active * 100}%)` }}>
                    {WHY_CARDS.map(({ id, title, Icon, body, source }, index) => (
                        <div
                            className="why__slide"
                            key={id}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${index + 1} of ${total}`}
                            aria-hidden={index !== active}
                        >
                            <article className="why__card">
                                <span className="why__count">
                                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                                </span>
                                <span className="why__icon">
                                    <Icon />
                                </span>
                                <div className="why__body">
                                    <h3>{title}</h3>
                                    <p>{body}</p>
                                    {source && (
                                        <a className="why__source" href={source} target="_blank" rel="noopener noreferrer">
                                            SOURCE →
                                        </a>
                                    )}
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </div>

            <div className="why__controls">
                <button type="button" className="why__arrow" onClick={prev} aria-label="Previous card">
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

                <button type="button" className="why__arrow" onClick={next} aria-label="Next card">
                    <ArrowRightCircleIcon className="why__arrow-icon" />
                </button>
            </div>
        </div>
    );
}

import { useState } from "react";

const WHY_CARDS = [
    {
        title: "GROWING FOOD INSECURITY",
        icon: (
            // wheat ear
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 10v12" />
                <path d="M12 3c1.3 1 2 2.2 2 3.5S13.3 9 12 10c-1.3-1-2-2.2-2-3.5S10.7 4 12 3z" />
                <path d="M12 13c-2.5.2-4.3-.9-5-3 2.5-.2 4.3.9 5 3z" />
                <path d="M12 13c2.5.2 4.3-.9 5-3-2.5-.2-4.3.9-5 3z" />
                <path d="M12 18c-2.5.2-4.3-.9-5-3 2.5-.2 4.3.9 5 3z" />
                <path d="M12 18c2.5.2 4.3-.9 5-3-2.5-.2-4.3.9-5 3z" />
            </svg>
        ),
        body: (
            <>
                A dramatic drop in farm workers translates directly to an inability to maintain food <strong>self-sufficiency</strong>, forcing the country to rely heavily on expensive imported commodities.
            </>
        ),
    },
    {
        title: "GRAYING WORKFORCE",
        icon: (
            // hourglass
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 3h12M6 21h12" />
                <path d="M7 3c0 5 5 6 5 9s-5 4-5 9" />
                <path d="M17 3c0 5-5 6-5 9s5 4 5 9" />
            </svg>
        ),
        body: (
            <>
                The average age of the Filipino farmer ranges between <strong>57 and 59 years old</strong>. Experts predict a critical shortage of farmers within the next 10 to 12 years if younger generations do not step up.
            </>
        ),
    },
    {
        title: "BREAKING STEREOTYPES",
        icon: (
            // sprout
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 21h16" />
                <path d="M12 21v-9" />
                <path d="M12 12c0-4 2.5-6.5 7-6.5 0 4-2.5 6.5-7 6.5z" />
                <path d="M12 15c0-3-2-5-6-5 0 3 2 5 6 5z" />
            </svg>
        ),
        body: (
            <>
                Agriculture is widely stigmatized in rural communities as an unprofitable, low-status, and physically exhausting <strong>"poor man's profession."</strong>
            </>
        ),
    },
];

function WhyDoItCards() {
    const [active, setActive] = useState(0);
    const total = WHY_CARDS.length;

    const go = (i) => setActive((i + total) % total);

    const onKeyDown = (e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
    };

    // 0 = active, 1 = next, 2 = previous (works for 3 cards)
    const positionOf = (i) => {
        const offset = (i - active + total) % total;
        return ["active", "next", "prev"][offset];
    };

    return (
        <div
            className="why-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Reasons to volunteer"
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            <button className="why-arrow" onClick={() => go(active - 1)} aria-label="Previous reason">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>

            <div className="cards-stage">
                {WHY_CARDS.map((card, i) => {
                    const pos = positionOf(i);
                    return (
                        <div
                            key={card.title}
                            className={`card card--${pos}`}
                            aria-hidden={pos !== "active"}
                            onClick={() => pos !== "active" && go(i)}
                        >
                            <div className="card-icon">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.body}</p>
                        </div>
                    );
                })}
            </div>

            <button className="why-arrow" onClick={() => go(active + 1)} aria-label="Next reason">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>

            <div className="why-dots" role="tablist" aria-label="Choose a reason">
                {WHY_CARDS.map((card, i) => (
                    <button
                        key={card.title}
                        role="tab"
                        aria-selected={i === active}
                        aria-label={card.title}
                        className={`why-dot ${i === active ? "is-active" : ""}`}
                        onClick={() => go(i)}
                    />
                ))}
            </div>
        </div>
    );
}
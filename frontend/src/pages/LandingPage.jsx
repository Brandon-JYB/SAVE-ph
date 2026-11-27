import { Link } from "react-router-dom";

/*  ---------- COMPONENTS/LAYOUT ----------  */
import Section from "../components/layout/Section";

/*  ---------- COMPONENTS/LANDING ----------  */
import WhyCarousel from "../components/landing/WhyCarousel";
import ProcessSteps from "../components/landing/ProcessSteps";
import PredictionTeaser from "../components/landing/PredictionTeaser";
import FaqList from "../components/landing/FaqList";

/*  ---------- IMAGES ----------  */
import homeBg from "../images/home-bg.jpg";
import aboutImg2 from "../images/about-img-2.jpg";
import aboutImg3 from "../images/about-img-3.jpg";

/*  ---------- SVG ----------  */
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

const HERO_TITLE_LINES = ["SUPPORTING", "AGRICULTURE VIA", "VOLUNTEER", "ENGAGEMENT"];

const PROGRAM_STATS = [
    { value: "4", label: "program pillars" },
    { value: "5", label: "steps to sign up" },
    { value: "AI", label: "crop predictions for farmers" },
];

const PROGRAM_PILLARS = [
    "Volunteer Mobilization",
    "Agricultural Immersion",
    "AI Predictive Analytics",
    "Crop Optimization",
];

function LandingPage() {
    return (
        <>
            {/*  ---------- HOME ----------  */}
            <section id="Home">
                <div className="hero__content">
                    <h1 className="hero__title">
                        {HERO_TITLE_LINES.map((line) => (
                            <span className="hero__line" key={line}>
                                <span className="hero__initial">{line[0]}</span>
                                {line.slice(1)}
                            </span>
                        ))}
                    </h1>

                    <p className="hero__text">
                        Immerse yourself in the daily realities of Philippine agriculture to understand, appreciate, and actively sustain the future of food production.
                    </p>

                    <Link className="cta-btn" to="/contact">
                        <span className="cta-btn__text">Get Involved</span>
                        <ArrowCircleIcon className="cta-btn__icon" />
                    </Link>
                </div>

                <div className="home-image">
                    <img src={homeBg} alt="" />
                </div>
            </section>
            
            {/*  ---------- ABOUT INFO ----------  */}
            <Section id="About" tone="light" watermark="ABOUT">
                <div className="program-header">
                    <span className="subtitle">what do we offer?</span>
                    <h2>OUR PROGRAM</h2>
                    <p>in pursuing the future’s preservation</p>
                </div>

                <div className="bento">
                    <article className="bento__card bento__card--statement">
                        <span className="bento__label">THE PROGRAM</span>
                        <span className="bento__quote" aria-hidden="true">“</span>
                        <h3 className="bento__heading">
                            EMPOWERING LOCAL FARMS
                            <span>THROUGH YOUTH ACTION.</span>
                        </h3>
                        <p className="bento__text">
                            Through hands-on volunteer experience, participants gain a deeper understanding of sustainable farming practices and develop a fresh perspective on the daily lives and challenges of Filipino farmers. Join us in recognizing and supporting the vital role they play in the country’s food security and agricultural development.
                        </p>
                        <div className="bento__foot">
                            <span>SAVE PHILIPPINES · VOLUNTEER PROGRAM</span>
                        </div>
                    </article>

                    <aside className="bento__card bento__card--stats">
                        <span className="bento__label">AT A GLANCE</span>
                        <dl className="bento__stats">
                            {PROGRAM_STATS.map((stat) => (
                                <div className="bento__stat" key={stat.label}>
                                    <dt>{stat.label}</dt>
                                    <dd>{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </aside>

                    <div className="bento__card bento__card--pillars">
                        <span className="bento__label">PROGRAM PILLARS</span>
                        <ul className="bento__pills">
                            {PROGRAM_PILLARS.map((pillar) => (
                                <li key={pillar}>{pillar}</li>
                            ))}
                        </ul>
                    </div>

                    <figure className="bento__card bento__photo">
                        <img src={aboutImg3} alt="A smiling farmer holding freshly harvested rice" />
                        <figcaption className="bento__chip">ON THE FIELD</figcaption>
                    </figure>

                    <article className="bento__card bento__card--about">
                        <span className="bento__label">ABOUT SAVE</span>
                        <p className="bento__lead">
                            SAVE is a program dedicated to promoting the agricultural industry in the Philippines by engaging college students from different schools in volunteer activities on local farms. Bridging the gap to cultivate a new generation of agricultural advocates who drive innovation and sustainable food security.
                        </p>
                    </article>

                    <figure className="bento__card bento__photo">
                        <img src={aboutImg2} alt="A volunteer planting a seedling in sunlit soil" />
                        <figcaption className="bento__chip">HANDS-ON</figcaption>
                    </figure>
                </div>
            </Section>

            {/*  ---------- ABOUT WHY ----------  */}
            <Section id="WhyDoIt" tone="dark" watermark="GROW">
                <div className="why-do-it-header">
                    <span className="subtitle">why do it?</span>
                    <h2>YOUR COMMUNITY NEEDS YOU</h2>
                    <p>that is more than enough reason</p>
                </div>

                <WhyCarousel />
            </Section>

            {/*  ---------- HOW TO VOLUNTEER ----------  */}
            <Section id="Process" tone="mint" watermark="JOIN">
                <div className="process-header">
                    <span className="subtitle">how do i sign up?</span>
                    <h2>THE WHOLE PROCESS</h2>
                    <p>join the force in a few simple steps</p>
                </div>

                <ProcessSteps />
            </Section>

            {/*  ---------- REGISTER FARM ----------  */}
            <Section id="Farmers" tone="accent" watermark="PARTNER">
                <div className="farmer-call">
                    <div className="farmer-call__copy">
                        <span className="subtitle">own a local farm?</span>
                        <h2>HOST STUDENT VOLUNTEERS</h2>
                        <p>
                            Partner with Save PH to welcome safety-vetted college volunteers for planting and harvest seasons, plus unlock quarterly AI crop insights for your region.
                        </p>
                    </div>

                    <div className="farmer-call__card">
                        <span className="bento__label">PARTNER ONBOARDING</span>
                        <ul className="farmer-call__perks">
                            <li><strong>Extra Hands</strong> — Scheduled student groups matched to your farm's daily capacity.</li>
                            <li><strong>Safety-First</strong> — Clear boundaries: zero heavy machinery or chemical handling.</li>
                            <li><strong>Crop Analytics</strong> — Regional quarterly price and rainfall outlooks.</li>
                        </ul>

                        <Link to="/farmer-signup" className="cta-btn farmer-call__btn">
                            <span className="cta-btn__text">Register Your Farm</span>
                            <ArrowCircleIcon className="cta-btn__icon" />
                        </Link>
                    </div>
                </div>
            </Section>

            {/*  ---------- QUESTIONS ----------  */}
            <Section id="Questions" tone="light" watermark="ASK">
                <div className="faq-header">
                    <span className="subtitle">you might be wondering...</span>
                    <h2>DIGGING DEEPER IN THE FIELD</h2>
                    <p>a couple questions you might have</p>
                </div>

                <FaqList />
            </Section>

            {/*  ---------- AI OPTIMIZATION ----------  */}
            <Section id="Discover" tone="dark" watermark="REAP">
                <div className="ai-header">
                    <span className="subtitle">check out our predictions!</span>
                    <h2>NEXT GENERATION OF CROPS</h2>
                    <p>analytics meets crop optimization</p>
                </div>

                <PredictionTeaser />
            </Section>
        </>
    );
}
export default LandingPage;

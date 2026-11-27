import { useState } from "react";
import { Link } from "react-router-dom";
import AccordionItem from "./AccordionItem";
import ArrowCircleIcon from "../../svg/ArrowCircleIcon";

const FAQS = [
    {
        question: "I have zero experience in farming. Can I still join?",
        answer: "Of course! You are there to lend a hand and learn along the way. On-site coordinators and host farmers will guide you through everything you need to do—no prior agricultural background required.",
    },
    {
        question: "Do I need to pay any registration or processing fees to sign up?",
        answer: "None at all!—signing up is completely free. Just keep in mind that you will need to cover and plan your own logistics, including transportation to the farm, overnight accommodations (if applicable), and your meals.",
    },
    {
        question: "Can I choose which farm I volunteer at?",
        answer: "Yes, you have full freedom to pick whichever partner farm fits your interests, location, and availability best.",
    },
    {
        question: "Can I sign up as a group or do we have to apply individually?",
        answer: "Each volunteer needs to register individually so we have everyone's details on file. If you want to volunteer together as friends or an organization, just coordinate your sign-ups for the same farm and dates!",
    },
    {
        question: "How long does a typical farm immersion last?",
        answer: "Right now, each registration covers a single day—feel free to submit a separate one if you'd like to visit more than once!",
        // answer: "Sessions vary depending on the partner farm and schedule—ranging from single-day visits to weekend or multi-day immersions. Check each farm's listing or details when planning your visit so you know what to expect.",
    },
    {
        question: "What should I pack or wear for the farm immersion?",
        answer: "Wear comfortable, breathable clothes and sturdy closed-toe shoes or boots that you don't mind getting muddy—be sure to check the specific terrain and weather of your chosen farm beforehand. Don't forget sun protection (a hat and sunscreen), a refillable water bottle, and your own packed meals and snacks.",
    },
    {
        question: "What happens if it rains or I need to reschedule my visit?",
        answer: "Farm work depends heavily on weather and field conditions, so schedules can shift if heavy rain or bad weather hits. If your plans change or weather affects your visit, reach out as early as possible so we can coordinate a reschedule or next steps.",
    },
];

export default function FaqList() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="faq-grid">
            {FAQS.map(({ question, answer }, index) => (
                <AccordionItem
                    key={question}
                    className="acc--faq"
                    open={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    header={<span className="faq-question">{question}</span>}
                >
                    <p>{answer}</p>
                </AccordionItem>
            ))}

            <Link className="faq-cta" to="/contact?mode=inquiry">
                <span className="faq-cta__text">
                    <strong>Still curious?</strong>
                    <span>Ask us anything</span>
                </span>
                <ArrowCircleIcon className="faq-cta__icon" />
            </Link>
        </div>
    );
}
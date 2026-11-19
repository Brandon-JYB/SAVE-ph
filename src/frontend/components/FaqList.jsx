import { useState } from "react";
import { Link } from "react-router-dom";
import AccordionItem from "./AccordionItem";
import ArrowCircleIcon from "../svg/ArrowCircleIcon";

const PLACEHOLDER = "Placeholder answer. Replace this text with your real answer.";

const FAQS = [
    {
        question: "Do I need to pay any registration or processing fees to sign up?",
        answer: PLACEHOLDER,
    },
    {
        question: "Can I sign up as a group or do we have to apply individually?",
        answer: "Sign-up is individual: each volunteer registers on their own.",
    },
    {
        question: "What should I pack or wear for the farm immersion?",
        answer: PLACEHOLDER,
    },
    {
        question: "I have zero experience in farming. Can I still join?",
        answer: PLACEHOLDER,
    },
    {
        question: "Can I choose which farm I volunteer at?",
        answer: PLACEHOLDER,
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

            {/* bottom-right card: a button to the Ask Question tab of the Contact page */}
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
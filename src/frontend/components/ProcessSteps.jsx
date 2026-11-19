import { useState } from "react";
import AccordionItem from "./AccordionItem";
import { MailIcon, PinIcon, CheckCircleIcon, SendIcon, HeartIcon } from "../svg/Icons";

const PROCESS_STEPS = [
    {
        title: "Email & Number",
        Icon: MailIcon,
        description: "Tell us your name, email, mobile number, and the date you'd like to join.",
    },
    {
        title: "Farm Selection",
        Icon: PinIcon,
        description: "Browse the available farms and pick the one you'd like to volunteer at.",
    },
    {
        title: "Confirm Match",
        Icon: CheckCircleIcon,
        description: "Review your details and your chosen farm, then confirm your registration.",
    },
    {
        title: "Receive Confirmation Feedback",
        Icon: SendIcon,
        description: "We send a confirmation to your email, with a reference code you can keep.",
    },
    {
        title: "Keep In Touch",
        Icon: HeartIcon,
        description: "Choose how you'd like to hear from us, by email or text, before your visit.",
    },
];

export default function ProcessSteps() {
    const [openIndex, setOpenIndex] = useState(0);   // step 1 starts open

    return (
        <div className="process-steps-container">
            {PROCESS_STEPS.map(({ title, Icon, description }, index) => (
                <AccordionItem
                    key={title}
                    className="acc--process"
                    open={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    header={
                        <>
                            <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                            <span className="step-icon"><Icon /></span>
                            <span className="step-title">{title}</span>
                        </>
                    }
                >
                    <p>{description}</p>
                </AccordionItem>
            ))}
        </div>
    );
}
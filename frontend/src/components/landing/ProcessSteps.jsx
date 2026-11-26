import { useState } from "react";
import AccordionItem from "../landing/AccordionItem";
import MailIcon from "../../svg/MailIcon";
import PinIcon from "../../svg/PinIcon";
import ConfirmIcon from "../../svg/ConfirmIcon";
import SendIcon from "../../svg/SendIcon";
import HeartIcon from "../../svg/HeartIcon";

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
        Icon: ConfirmIcon,
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
        description: "Thank you for volunteering with us! After your schedule concludes, we’d appreciate hearing how your experience went.",
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

import { useId } from "react";
import PlusIcon from "../svg/PlusIcon";
import MinusIcon from "../svg/MinusIcon";

export default function AccordionItem({ className = "", header, open, onToggle, children }) {
    const panelId = useId();

    return (
        <div className={`acc ${className}${open ? " is-open" : ""}`}>
            <button
                type="button"
                className="acc__head"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={onToggle}
            >
                <span className="acc__label">{header}</span>
                <span className="acc__toggle" aria-hidden="true">
                    <PlusIcon className="acc__plus" />
                    <MinusIcon className="acc__minus" />
                </span>
            </button>

            <div className="acc__panel" id={panelId}>
                <div className="acc__inner">{children}</div>
            </div>
        </div>
    );
}

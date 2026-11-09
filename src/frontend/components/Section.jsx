import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function Section({ id, tone = "dark", watermark, children }) {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    // starts lower in the section, ends higher: rises as you scroll down
    const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

    return (
        <section id={id} ref={ref} className={`section section--${tone}`}>
            {watermark && (
                <motion.div
                    className="section__watermark-wrap"
                    aria-hidden="true"
                    style={reduceMotion ? undefined : { y }}
                >
                    <span className="section__watermark">{watermark}</span>
                </motion.div>
            )}
            <div className="section__content">{children}</div>
        </section>
    );
}
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export default function Section({ id, tone = "dark", watermark, children }) {
const ref = useRef(null);
const reduceMotion = useReducedMotion();

// progress goes 0 -> 1 while the section travels through the viewport
const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
});

// the word drifts sideways slower than the content, which gives the parallax feel
const x = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

return (
    <section id={id} ref={ref} className={`section section--${tone}`}>
    {watermark && (
        <div className="section__watermark-wrap" aria-hidden="true">
        <motion.span
            className="section__watermark"
            style={reduceMotion ? undefined : { x }}
        >
            {watermark}
        </motion.span>
        </div>
    )}
    <div className="section__content">{children}</div>
    </section>
);
}
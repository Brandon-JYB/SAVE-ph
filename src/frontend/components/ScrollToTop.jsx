import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, hash, key } = useLocation();
    const lastPath = useRef(null);

    useEffect(() => {
        const changedPage = lastPath.current !== pathname;
        lastPath.current = pathname;

        // link without a #section: start at the top of the page
        if (!hash) {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            return undefined;
        }

        // link with a #section: wait until the page has rendered it, then scroll there
        const id = decodeURIComponent(hash.slice(1));
        let frame = 0;
        let tries = 0;

        const scrollToSection = () => {
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({
                    behavior: changedPage ? "instant" : "smooth",
                    // jump when arriving, glide when already here
                    block: "start",
                });
            } else if (tries < 30) {
                tries += 1;
                frame = requestAnimationFrame(scrollToSection);
            }
        };

        scrollToSection();
        return () => cancelAnimationFrame(frame);
    }, [pathname, hash, key]);
    // key: clicking the same link twice still scrolls

    return null;
}
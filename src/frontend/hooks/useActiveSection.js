import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useActiveSection(ids) {
    const { pathname } = useLocation();
    const onLanding = pathname === "/";
    const [active, setActive] = useState(ids[0]);

    useEffect(() => {
        if (!onLanding) return undefined;   
        // no landing sections on other pages

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [ids, onLanding]);                   
    // re-runs when you come back to the landing page

    return onLanding ? active : "";
}
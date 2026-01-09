import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const AnimatedSection = ({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) => {
    const { ref, hasIntersected } = useIntersectionObserver();

    return (
        <section
            ref={ref}
            className={`transition-all duration-700 ease-out ${hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            style={{
                transitionDelay: hasIntersected ? `${delay}ms` : "0ms",
            }}
        >
            {children}
        </section>
    );
};
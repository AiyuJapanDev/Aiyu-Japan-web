import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const BlockSection = ({
  children,
  component,
  isAnimated,
  blockBackground,
  delay = 0,
}: {
  children: React.ReactNode;
  component: string;
  isAnimated: boolean;
  blockBackground: any;
  delay?: number;
}) => {
  const { ref, hasIntersected } = useIntersectionObserver();

  const background = `${blockBackground?.background ? "bg-white" : ""} ${blockBackground?.transparentBackground ? "bg-white/50" : ""} `;

  const animation = `transition-all duration-700 ease-out ${
    hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`;

  return (
    <section
      ref={ref}
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${background} ${component === "blocks.heading-section" ? "pt-16" : "py-12"} ${isAnimated && animation}`}
      style={{
        transitionDelay: hasIntersected ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </section>
  );
};

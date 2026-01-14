import { HeroBlock } from "@/types/blocks";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { getImage } from "@/lib/utils";

interface HeroProps {
    data: HeroBlock;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
    const { heading, text, image, links } = data;
    const { src, srcset } = image ? getImage(image as any) : { src: "", srcset: "" };

    return (
        <section className=" max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                {heading && (
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        {heading}
                    </h2>
                )}

                {text && (
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mb-8">
                        {text}
                    </p>
                )}

                {links && links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mb-10">
                        {links.map((link, index) => (
                            <Button
                                key={index}
                                asChild
                                variant={link.type === "SECONDARY" ? "outline" : "default"}
                                size="lg"
                                className="rounded-full px-8"
                            >
                                <Link
                                    to={link.href}
                                    target={link.isExternal ? "_blank" : undefined}
                                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                                >
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                    </div>
                )}

                {image && (
                    <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src={src}
                            srcSet={srcset}
                            alt={image.alternativeText || heading || "Hero image"}
                            className="w-full h-auto object-cover"
                            width={image.width}
                            height={image.height}
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;

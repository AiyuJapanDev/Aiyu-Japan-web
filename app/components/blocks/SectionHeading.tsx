import { HeadingSectionBlock } from "@/types/blocks";
import { useApp } from "@/contexts/AppContext";

function SectionHeading(data: HeadingSectionBlock) {
  const { t } = useApp();
  const { anchorLink, subHeading, heading, paragraph } = data;
  return (
    <div className="text-center mb-16" id={anchorLink}>
      {subHeading && (
        <span className="text-blue-600 font-bold">{subHeading}</span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {heading}
      </h2>
      <p className="text-lg text-gray-600">{paragraph}</p>
    </div>
  );
}

export default SectionHeading;

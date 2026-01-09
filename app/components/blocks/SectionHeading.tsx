import { HeadingSectionBlock } from "@/types/blocks";
import { useApp } from "@/contexts/AppContext";

function SectionHeading(data: any) {
  const { t } = useApp();
  const { anchorLink, subHeading, heading, paragraph } = data.data as HeadingSectionBlock;
  return (
    <div className="text-center max-w-7xl mx-auto" id={anchorLink}>
      {subHeading && (
        <span className="text-blue-600 font-bold" dangerouslySetInnerHTML={{ __html: subHeading }} />
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" dangerouslySetInnerHTML={{ __html: heading }} />
      <p className="text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: paragraph }} />
    </div>
  );
}

export default SectionHeading;

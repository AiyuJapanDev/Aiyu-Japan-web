import { ComparisonTable } from "@/components/ui/custom/ComparisonTable";
import { useApp } from "@/contexts/AppContext";
import { ComparisonTableBlock } from "@/types/blocks";

interface ComparisonTableSectionProps {
  data: ComparisonTableBlock;
}

export default function ComparisonTableSection({ data }: ComparisonTableSectionProps) {
  const { t } = useApp();
  return (


    <ComparisonTable />

  );
}

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface QuickAmountButtonsProps {
  onAddAmount: (amount: number) => void;
}

const QuickAmountButtons = ({ onAddAmount }: QuickAmountButtonsProps) => {
  const quickAmounts = [
    { value: 1, label: "+1", color: "bg-green-100 hover:bg-green-200 text-green-800" },
    { value: 10, label: "+10", color: "bg-blue-100 hover:bg-blue-200 text-blue-800" },
    { value: 100, label: "+100", color: "bg-purple-100 hover:bg-purple-200 text-purple-800" }
  ];

  return (
    <div className="mb-4">
      <span className="text-sm text-muted-foreground block mb-3">
        Valores rápidos:
      </span>
      <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        {quickAmounts.map((quick) => (
          <Button
            key={quick.value}
            variant="outline"
            size="sm"
            onClick={() => onAddAmount(quick.value)}
            className={`${quick.color} border-0 transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm font-medium min-h-[2.5rem] px-2 sm:px-3`}
          >
            <Plus className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="whitespace-nowrap">R$ {quick.value}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickAmountButtons;
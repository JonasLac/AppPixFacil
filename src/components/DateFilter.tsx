import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface DateFilterProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DateFilter = ({ date, onDateChange }: DateFilterProps) => {
  return (
    <div className="flex flex-col gap-3 p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Filtrar por data
        </label>
        {date && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDateChange(undefined)}
                className="h-8 w-8 p-0 rounded-full bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 hover:border-destructive transition-all duration-200 shadow-sm"
                title="Limpar data selecionada"
              >
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Limpar data</TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover>
          {/* Composição dos triggers para mostrar tooltip sem quebrar o Popover */}
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal h-10",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  {date ? (
                    <span className="truncate">
                      {format(date, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>
              {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
            </TooltipContent>
          </Tooltip>

          <PopoverContent 
            className="w-auto p-0 z-50 bg-popover border shadow-lg" 
            align="start"
            sideOffset={4}
          >
            <div className="bg-background border rounded-md shadow-lg">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateChange}
                disabled={(date) => date > new Date()}
                initialFocus
                className={cn("p-3 pointer-events-auto bg-background")}
              />
            </div>
          </PopoverContent>
        </Popover>
        
        {date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/50 px-3 py-2 rounded-md">
            <span>Mostrando: {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateFilter;
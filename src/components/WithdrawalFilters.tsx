import React, { useState } from 'react';
import { Search, Download, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface WithdrawalFiltersProps {
  onFiltersChange: (filters: any) => void;
  onRefresh: () => void;
  onExport: () => void;
}

export const WithdrawalFilters: React.FC<WithdrawalFiltersProps> = ({
  onFiltersChange,
  onRefresh,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const handleFiltersChange = () => {
    onFiltersChange({
      searchTerm,
      status,
      dateFrom,
      dateTo,
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatus('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    onFiltersChange({});
  };

  React.useEffect(() => {
    handleFiltersChange();
  }, [searchTerm, status, dateFrom, dateTo]);

  const hasActiveFilters = searchTerm || status !== 'all' || dateFrom || dateTo;

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 space-y-4">
      <div className="flex flex-col justify-end lg:flex-row gap-4">
        {/* Search Bar */}
        {/* <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by transaction hash, amount, or remark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/80 border-border/50"
          />
        </div> */}

        {/* Status Filter */}
        {/* <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full lg:w-48 bg-background/80 border-border/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select> */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-background/80 border-border/50",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : "From date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-background/80 border-border/50",
                !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : "To date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="border-border/50 hover:bg-background/80"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="border-border/50 hover:bg-background/80"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Active filters applied - use Clear button to reset
        </div>
      )}
    </div>
  );
};
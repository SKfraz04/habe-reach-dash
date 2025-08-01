import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  onExport: () => void;
  resultCount: number;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  onExport,
  resultCount,
}) => {
  // Convert string dates to Date objects for the date range picker
  const dateRangeValue: DateRange | undefined = dateRange.start && dateRange.end ? {
    from: new Date(dateRange.start),
    to: new Date(dateRange.end),
  } : undefined;

  const handleDateRangeChange = (range: DateRange | undefined) => {
    console.log('Date range changed:', range);
    if (range?.from && range?.to) {
      setDateRange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: format(range.to, 'yyyy-MM-dd'),
      });
    } else if (range?.from) {
      // If only start date is selected, set both to same date
      setDateRange({
        start: format(range.from, 'yyyy-MM-dd'),
        end: format(range.from, 'yyyy-MM-dd'),
      });
    } else {
      setDateRange({ start: '', end: '' });
    }
  };

  const clearDateRange = () => {
    setDateRange({ start: '', end: '' });
  };

  return (
    <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/80"
          />
        </div>

        {/* Status Filter */}
        <div className="w-full lg:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-background/80">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div className="w-full lg:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal bg-background/80 border-border/50 w-full lg:w-auto",
                  !dateRangeValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRangeValue?.from ? (
                  dateRangeValue.to ? (
                    <>
                      {format(dateRangeValue.from, "MMM dd, yyyy")} -{" "}
                      {format(dateRangeValue.to, "MMM dd, yyyy")}
                    </>
                  ) : (
                    format(dateRangeValue.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-border/50" align="start">
              <div className="p-3">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRangeValue?.from}
                  selected={dateRangeValue}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="rounded-md border-0"
                />
                {dateRangeValue && (
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearDateRange}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      {dateRangeValue.from && dateRangeValue.to && (
                        <>
                          {format(dateRangeValue.from, "MMM dd, yyyy")} - {format(dateRangeValue.to, "MMM dd, yyyy")}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Export Button */}
        <Button 
          onClick={onExport}
          variant="outline"
          className="bg-primary/10 hover:bg-primary/20 border-primary/30"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {resultCount} transaction{resultCount !== 1 ? 's' : ''} found
        </div>
        {dateRange.start && dateRange.end && (
          <div className="text-sm text-muted-foreground">
            Date range: {format(new Date(dateRange.start), "MMM dd, yyyy")} - {format(new Date(dateRange.end), "MMM dd, yyyy")}
          </div>
        )}
      </div>
    </Card>
  );
};
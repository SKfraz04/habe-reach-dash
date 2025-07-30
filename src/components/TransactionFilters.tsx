import React from 'react';
import { Calendar, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

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
  return (
    <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by transaction hash, wallet address, or amount..."
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
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Date Range */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Date Range:</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="bg-background/80 w-auto"
          />
          <span className="text-muted-foreground self-center">to</span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="bg-background/80 w-auto"
          />
        </div>
        <div className="text-sm text-muted-foreground ml-auto">
          {resultCount} transaction{resultCount !== 1 ? 's' : ''} found
        </div>
      </div>
    </Card>
  );
};
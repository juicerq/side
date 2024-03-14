import {
  Pagination as PaginationCN,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
}

export default function Pagination({ page, setPage }: PaginationProps) {
  return (
    <PaginationCN className="pt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(page + 1)}
            disabled={page === 10}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationCN>
  );
}

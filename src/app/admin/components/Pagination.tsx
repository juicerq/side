import {
  Pagination as PaginationCN,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  totalPage: number;
}

export default function Pagination({ page, totalPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePageChangeBack = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page - 1));
    router.push("admin" + "?" + params.toString());
  };

  const handlePageChangeFoward = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page + 1));
    router.push("admin" + "?" + params.toString());
  };

  return (
    <PaginationCN>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePageChangeBack}
            disabled={page === 1}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={handlePageChangeFoward}
            disabled={page >= totalPage}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationCN>
  );
}

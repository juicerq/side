import {
  Pagination as PaginationCN,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  queryTotal: number;
}

export default function Pagination({ page, queryTotal }: PaginationProps) {
  const searchParams = useSearchParams();
  const totalPage = Math.ceil(queryTotal / page);
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

  console.log({
    totalPage,
    queryTotal,
  });

  return (
    <PaginationCN className="pt-4">
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

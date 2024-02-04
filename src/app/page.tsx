import { unstable_noStore as noStore } from "next/cache";

export default async function Home() {
  noStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <div className="bg-black/10 p-8">
        <div className="grid w-[500px] grid-cols-8 gap-4">
          {Array.from({ length: 31 }).map((_, i) => (
            <div className="col-span-1 h-10 w-10 rounded-md bg-white text-center">
              Hi
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

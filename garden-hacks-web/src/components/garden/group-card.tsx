import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PublicGroup } from "@/lib/public-data/types";

export function GroupCard({ group }: { group: PublicGroup }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] bg-[#dfe8d8]">
        <Image
          src={group.imageUrl ?? "https://placehold.co/1200x800/e8f5dc/31572c/png?text=Garden+Group"}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-[#18231c]">{group.title}</h3>
        <p className="mt-2 min-h-20 text-sm leading-6 text-[#59655c]">
          {group.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#405046]">
          <span className="rounded-md bg-[#ecf7e8] px-2.5 py-1 font-semibold">
            {group.membersCount} members
          </span>
          <span className="rounded-md bg-[#eef8fd] px-2.5 py-1 font-semibold">
            {group.hacksCount} hacks
          </span>
        </div>
        <Button href={`/groups/${group.slug}`} variant="secondary" className="mt-5 w-full">
          View group details
        </Button>
      </div>
    </Card>
  );
}

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SproutIcon, UserIcon } from "@/components/ui/garden-icons";
import type { PublicGroup } from "@/lib/public-data/types";

export function GroupCard({ group }: { group: PublicGroup }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#dff8e9] to-[#c7f4ee]">
        <Image
          src={group.imageUrl ?? "https://placehold.co/1200x800/e8f5dc/31572c/png?text=Garden+Group"}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10231c]/35 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-black tracking-tight text-[#10231c]">
          {group.title}
        </h3>
        <p className="mt-2 min-h-20 text-sm leading-6 text-[#59655c]">
          {group.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#405046]">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ecf7e8] px-3 py-1.5 font-bold text-[#176b49]">
            <UserIcon size={14} />
            {group.membersCount} members
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#eef8fd] px-3 py-1.5 font-bold text-[#08747d]">
            <SproutIcon size={14} />
            {group.hacksCount} hacks
          </span>
        </div>
        <Button href={`/groups/${group.id}`} variant="secondary" className="mt-5 w-full">
          View group details
        </Button>
      </div>
    </Card>
  );
}

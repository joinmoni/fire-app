import Image from "next/image";

export function CommunityBadge() {
  return (
    <div className="relative inline-block">
      <Image
        src="/comfin.png"
        alt="Community Finance"
        width={100}
        height={60}
      />
    </div>
  );
}

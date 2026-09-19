import { MARQUEE } from "../data/constants";

function Marquee() {
  return (
    <div className="relative overflow-hidden bg-[#5A0E14] py-5 border-y border-[#5A0E14]/20">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
        {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-14 font-display text-xl italic text-[#FDECC8]/80"
          >
            {item}
            <span className="text-[#F4C766]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
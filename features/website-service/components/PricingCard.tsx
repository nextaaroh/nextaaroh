type Props = {
  emoji: string;
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
  onSelect: () => void;
};

export default function PricingCard({ emoji, name, price, features, cta, popular, onSelect }: Props) {
  return (
    <div className={"rounded-2xl p-5 border " + (popular ? "border-orange-500 bg-orange-50 relative" : "border-gray-200 bg-white")}>
      {popular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
      ) : null}
      <p className="text-2xl mb-1">{emoji}</p>
      <p className="font-bold text-base">{name}</p>
      <p className="text-2xl font-bold text-orange-600 my-2">{price}</p>
      <ul className="space-y-1.5 mb-4">
        {features.map((f, i) => {
          return <li key={i} className="text-xs text-gray-600 flex gap-1.5"><span className="text-green-500">✓</span>{f}</li>;
        })}
      </ul>
      <button type="button" onClick={onSelect} className="w-full bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-lg">
        {cta}
      </button>
    </div>
  );
}

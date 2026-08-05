type Props = {
  onClick: () => void;
};

export default function FloatingPostButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-orange-500 text-white text-2xl shadow-lg flex items-center justify-center md:hidden"
    >
      +
    </button>
  );
}
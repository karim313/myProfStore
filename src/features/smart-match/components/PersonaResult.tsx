interface PersonaResultProps {
  title: string;
  description: string;
  emoji: string;
}

export default function PersonaResult({ title, description, emoji }: PersonaResultProps) {
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 mb-4 text-center">
      <div className="text-5xl mb-3 animate-bounce">{emoji}</div>
      <h3 className="text-xl font-bold text-[#00342B] mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-4 pt-4 border-t border-emerald-200">
        <p className="text-xs text-emerald-700 font-medium">
          بناءً على شخصيتك، اخترنا ليك المنتجات دى
        </p>
      </div>
    </div>
  );
}

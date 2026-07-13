import { motion } from 'framer-motion';
import type { Category } from '../../data/categories';

interface CategoryCardProps {
  category: Category;
  onSelect: (categoryId: string) => void;
}

export default function CategoryCard({ category, onSelect }: CategoryCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(category.id)}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-200 shadow-sm transition-all"
    >
      <span className="text-3xl">{category.icon}</span>
      <span className="text-sm font-medium text-gray-800">{category.name}</span>
    </motion.button>
  );
}

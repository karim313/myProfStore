/**
 * Categories Data
 *
 * This file defines all available product categories for the AI Shopping Assistant.
 * Each category has an ID, name, icon, and description.
 *
 * This is static data that can later be replaced with API data without changing the architecture.
 */

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'إلكترونيات',
    icon: '💻',
    description: 'لابتوب، هواتف، سماعات، وأجهزة ذكية'
  },
  {
    id: 'fashion',
    name: 'أزياء',
    icon: '👕',
    description: 'ملابس، أحذية، إكسسوارات، وعناصر نمط الحياة'
  },
  {
    id: 'home-kitchen',
    name: 'المنزل والمطبخ',
    icon: '🏠',
    description: 'أثاث، أجهزة منزلية، وديكور'
  },
  {
    id: 'gaming',
    name: 'ألعاب',
    icon: '🎮',
    description: 'كونسول، إكسسوارات، ومعدات الألعاب'
  },
  {
    id: 'sports',
    name: 'رياضة',
    icon: '🏋️',
    description: 'معدات اللياقة، إكسسوارات، ومعدات رياضية'
  }
];

import { useEffect, useMemo, useState } from 'react';

type FieldType = 'select' | 'text';

interface FieldDefinition {
  key: string;
  label: string;
  previewLabel: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface CategoryConfig {
  id: string;
  title: string;
  description: string;
  fields: FieldDefinition[];
}

const categoryConfigs: CategoryConfig[] = [
  {
    id: 'electronics',
    title: 'Electronics',
    description: 'Structure product specs for laptops, phones, and devices with AI-friendly attributes.',
    fields: [
      { key: 'usage', label: 'Usage', previewLabel: 'Usage', type: 'select', options: ['Gaming', 'Work', 'Study', 'Daily Use', 'Entertainment'] },
      { key: 'cpu', label: 'CPU', previewLabel: 'CPU', type: 'text', placeholder: 'Intel Core i7-14700HX' },
      { key: 'gpu', label: 'GPU', previewLabel: 'GPU', type: 'text', placeholder: 'NVIDIA RTX 4060' },
      { key: 'ram', label: 'RAM', previewLabel: 'RAM', type: 'select', options: ['8 GB', '16 GB', '32 GB', '64 GB'] },
      { key: 'storage', label: 'Storage', previewLabel: 'Storage', type: 'select', options: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '2 TB SSD'] },
      { key: 'screenSize', label: 'Screen Size', previewLabel: 'Screen', type: 'select', options: ['13 Inch', '14 Inch', '15.6 Inch', '16 Inch', '17 Inch'] },
      { key: 'battery', label: 'Battery', previewLabel: 'Battery', type: 'select', options: ['Poor', 'Good', 'Excellent'] },
      { key: 'operatingSystem', label: 'Operating System', previewLabel: 'Operating System', type: 'select', options: ['Windows', 'macOS', 'Linux', 'No OS'] },
      { key: 'budgetLevel', label: 'Budget Level', previewLabel: 'Budget', type: 'select', options: ['Low', 'Medium', 'High', 'Premium'] },
    ],
  },
  {
    id: 'fashion',
    title: 'Fashion',
    description: 'Capture style, fit, and material details for apparel and accessories.',
    fields: [
      { key: 'productType', label: 'Product Type', previewLabel: 'Type', type: 'select', options: ['T-Shirt', 'Shirt', 'Pants', 'Jacket', 'Hoodie', 'Shoes', 'Dress'] },
      { key: 'gender', label: 'Gender', previewLabel: 'Gender', type: 'select', options: ['Men', 'Women', 'Unisex'] },
      { key: 'style', label: 'Style', previewLabel: 'Style', type: 'select', options: ['Casual', 'Formal', 'Sport', 'Streetwear', 'Luxury'] },
      { key: 'material', label: 'Material', previewLabel: 'Material', type: 'text', placeholder: 'Cotton' },
      { key: 'color', label: 'Color', previewLabel: 'Color', type: 'text', placeholder: 'Black' },
      { key: 'season', label: 'Season', previewLabel: 'Season', type: 'select', options: ['Summer', 'Winter', 'Spring', 'Autumn', 'All Seasons'] },
      { key: 'fit', label: 'Fit', previewLabel: 'Fit', type: 'select', options: ['Slim', 'Regular', 'Oversized', 'Relaxed'] },
      { key: 'budgetLevel', label: 'Budget Level', previewLabel: 'Budget', type: 'select', options: ['Low', 'Medium', 'High', 'Premium'] },
    ],
  },
  {
    id: 'home-kitchen',
    title: 'Home & Kitchen',
    description: 'Create structured descriptions for home essentials and kitchen products.',
    fields: [
      { key: 'productType', label: 'Product Type', previewLabel: 'Type', type: 'select', options: ['Kitchen Appliance', 'Furniture', 'Cookware', 'Decoration', 'Lighting', 'Storage'] },
      { key: 'room', label: 'Room', previewLabel: 'Room', type: 'select', options: ['Kitchen', 'Living Room', 'Bedroom', 'Bathroom', 'Dining Room'] },
      { key: 'material', label: 'Material', previewLabel: 'Material', type: 'text', placeholder: 'Stainless Steel' },
      { key: 'capacity', label: 'Capacity', previewLabel: 'Capacity', type: 'text', placeholder: '6 L' },
      { key: 'power', label: 'Power', previewLabel: 'Power', type: 'text', placeholder: '1700 W' },
      { key: 'dimensions', label: 'Dimensions', previewLabel: 'Dimensions', type: 'text', placeholder: '40x30x35 cm' },
      { key: 'energyEfficiency', label: 'Energy Efficiency', previewLabel: 'Energy Efficiency', type: 'select', options: ['A', 'B', 'C', 'D'] },
      { key: 'budgetLevel', label: 'Budget Level', previewLabel: 'Budget', type: 'select', options: ['Low', 'Medium', 'High', 'Premium'] },
    ],
  },
  {
    id: 'gaming',
    title: 'Gaming',
    description: 'Build detailed specs for peripherals and gaming accessories.',
    fields: [
      { key: 'productType', label: 'Product Type', previewLabel: 'Type', type: 'select', options: ['Mouse', 'Keyboard', 'Headset', 'Controller', 'Gaming Chair', 'Monitor'] },
      { key: 'platform', label: 'Platform', previewLabel: 'Platform', type: 'select', options: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Universal'] },
      { key: 'connection', label: 'Connection', previewLabel: 'Connection', type: 'select', options: ['Wired', 'Wireless', 'Bluetooth'] },
      { key: 'rgbLighting', label: 'RGB Lighting', previewLabel: 'RGB', type: 'select', options: ['Yes', 'No'] },
      { key: 'switchType', label: 'Switch Type', previewLabel: 'Switch', type: 'text', placeholder: 'Gateron Brown' },
      { key: 'responseTime', label: 'Response Time', previewLabel: 'Response Time', type: 'text', placeholder: '1 ms' },
      { key: 'compatibility', label: 'Compatibility', previewLabel: 'Compatibility', type: 'text', placeholder: 'Windows / macOS' },
      { key: 'budgetLevel', label: 'Budget Level', previewLabel: 'Budget', type: 'select', options: ['Low', 'Medium', 'High', 'Premium'] },
    ],
  },
  {
    id: 'sports',
    title: 'Sports',
    description: 'Describe athletic gear with performance, material, and use-case details.',
    fields: [
      { key: 'productType', label: 'Product Type', previewLabel: 'Type', type: 'select', options: ['Shoes', 'Clothing', 'Equipment', 'Accessories', 'Fitness Machine'] },
      { key: 'sport', label: 'Sport', previewLabel: 'Sport', type: 'select', options: ['Running', 'Gym', 'Football', 'Basketball', 'Cycling', 'Swimming', 'Yoga'] },
      { key: 'skillLevel', label: 'Skill Level', previewLabel: 'Skill Level', type: 'select', options: ['Beginner', 'Intermediate', 'Professional'] },
      { key: 'material', label: 'Material', previewLabel: 'Material', type: 'text', placeholder: 'Mesh' },
      { key: 'weight', label: 'Weight', previewLabel: 'Weight', type: 'text', placeholder: '280 g' },
      { key: 'waterResistant', label: 'Water Resistant', previewLabel: 'Water Resistant', type: 'select', options: ['Yes', 'No'] },
      { key: 'usage', label: 'Indoor / Outdoor', previewLabel: 'Usage', type: 'select', options: ['Indoor', 'Outdoor', 'Both'] },
      { key: 'budgetLevel', label: 'Budget Level', previewLabel: 'Budget', type: 'select', options: ['Low', 'Medium', 'High', 'Premium'] },
    ],
  },
];

const getInitialValues = (fields: FieldDefinition[]) =>
  fields.reduce<Record<string, string>>((acc, field) => {
    acc[field.key] = '';
    return acc;
  }, {});

interface ProductDescriptionBuilderProps {
  initialCategoryId?: string;
  onApplyDescription?: (description: string) => void;
}

export default function ProductDescriptionBuilder({ initialCategoryId, onApplyDescription }: ProductDescriptionBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState(categoryConfigs[0].id);
  const [formValues, setFormValues] = useState<Record<string, string>>(() => getInitialValues(categoryConfigs[0].fields));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const nextConfig = categoryConfigs.find((category) => category.id === initialCategoryId) ?? categoryConfigs[0];
    setSelectedCategory(nextConfig.id);
    setFormValues(getInitialValues(nextConfig.fields));
    setCopied(false);
  }, [initialCategoryId]);

  const currentConfig = useMemo(
    () => categoryConfigs.find((category) => category.id === selectedCategory) ?? categoryConfigs[0],
    [selectedCategory]
  );

  const previewText = useMemo(() => {
    const sections = currentConfig.fields.map((field) => {
      const value = formValues[field.key]?.trim();
      return `${field.previewLabel}: ${value || '—'}`;
    });
    return sections.join('\n');
  }, [currentConfig, formValues]);

  const missingFields = useMemo(() => {
    return currentConfig.fields.filter((field) => field.required !== false && !formValues[field.key]?.trim()).map((field) => field.label);
  }, [currentConfig, formValues]);

  const isComplete = missingFields.length === 0;

  const handleCategoryChange = (nextCategory: string) => {
    const nextConfig = categoryConfigs.find((item) => item.id === nextCategory) ?? categoryConfigs[0];
    setSelectedCategory(nextConfig.id);
    setFormValues(getInitialValues(nextConfig.fields));
    setCopied(false);
  };

  const handleFieldChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-[0_24px_80px_-40px_rgba(0,52,43,0.35)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-[#00342B]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00342B]" />
            Premium AI Description Builder
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Build structured product descriptions with live parsing-ready output.</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">The form adapts to the selected category, and the preview always follows the same field order for consistent AI parsing.</p>
        </div>
        <div className="w-full max-w-xs rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
          <label className="mb-2 block text-sm font-semibold text-[#00342B]">Category</label>
          <select
            value={selectedCategory}
            onChange={(event) => handleCategoryChange(event.target.value)}
            className="w-full rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none ring-0"
          >
            {categoryConfigs.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-gray-200 bg-gray-50/80 p-5">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">{currentConfig.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{currentConfig.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {currentConfig.fields.map((field) => (
              <div key={field.key} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <label className="mb-2 block text-sm font-semibold text-gray-700">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={formValues[field.key] ?? ''}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formValues[field.key] ?? ''}
                    onChange={(event) => handleFieldChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-emerald-100 bg-gradient-to-br from-[#00342B] to-[#0d5e4f] p-5 text-white shadow-[0_20px_60px_-24px_rgba(0,52,43,0.8)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100">Live Description Preview</p>
              <h3 className="mt-2 text-xl font-semibold">Structured output for AI parsing</h3>
            </div>
            {isComplete ? (
              <span className="rounded-full border border-emerald-300/60 bg-white/10 px-3 py-1 text-sm font-medium text-emerald-50">
                ✓ Ready
              </span>
            ) : (
              <span className="rounded-full border border-amber-300/60 bg-amber-400/20 px-3 py-1 text-sm font-medium text-amber-100">
                Needs details
              </span>
            )}
          </div>

          <div className="mt-6 rounded-[20px] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-emerald-50">{previewText}</pre>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-[20px] border border-white/15 bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Description Validation</p>
              <p className="mt-1 text-sm text-emerald-50">
                {isComplete
                  ? 'All required fields are completed. The description is ready for AI parsing.'
                  : `Missing: ${missingFields.join(', ')}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onApplyDescription?.(previewText)}
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#00342B] transition hover:bg-emerald-50"
              >
                Use in Product Form
              </button>
              <button
                onClick={handleCopy}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {copied ? 'Copied ✓' : 'Copy Description'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

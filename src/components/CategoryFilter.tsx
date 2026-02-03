import React from 'react';
import { EquipmentCategory } from '../types';

interface CategoryFilterProps {
    categories: EquipmentCategory[];
    selectedCategory: number | null;
    onSelectCategory: (categoryId: number | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onSelectCategory
}) => {
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter op Categorie
            </label>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onSelectCategory(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === null
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Alle
                </button>
                {categories.map((category) => (
                    <button
                        key={category.Id}
                        onClick={() => onSelectCategory(category.Id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedCategory === category.Id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {category.Name}
                    </button>
                ))}
            </div>
        </div>
    );
};

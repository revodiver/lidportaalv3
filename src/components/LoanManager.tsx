import React, { useState } from 'react';
import { Person } from '../types';
import { EquipmentGrid } from './EquipmentGrid';
import { CategoryFilter } from './CategoryFilter';
import { LoadingSpinner } from './LoadingSpinner';
import { useEquipment } from '../hooks/useEquipment';
import { useLoans } from '../hooks/useLoans';

interface LoanManagerProps {
    person: Person;
    onLoanCreated: () => void;
}

export const LoanManager: React.FC<LoanManagerProps> = ({ person, onLoanCreated }) => {
    const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>([]);
    const { equipment, categories, selectedCategory, loading, error, setSelectedCategory, refreshEquipment } = useEquipment();
    const { loading: loanLoading, error: loanError, success: loanSuccess, createLoan, clearMessages } = useLoans();

    const handleToggleSelection = (id: number) => {
        setSelectedEquipmentIds(prev => 
            prev.includes(id) 
                ? prev.filter(equipId => equipId !== id)
                : [...prev, id]
        );
    };

    const handleLoan = async () => {
        if (selectedEquipmentIds.length === 0) return;

        const success = await createLoan({
            personId: person.Id,
            equipmentIds: selectedEquipmentIds
        });

        if (success) {
            setSelectedEquipmentIds([]);
            await refreshEquipment();
            onLoanCreated();
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                clearMessages();
            }, 3000);
        }
    };

    // Filter only available equipment
    const availableEquipment = equipment.filter(item => item.IsAvailable);

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Beschikbaar Materiaal</h2>

            {loanSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
                    {loanSuccess}
                </div>
            )}

            {loanError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                    {loanError}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            {selectedEquipmentIds.length > 0 && (
                <div className="mb-4 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <span className="text-blue-900 font-medium">
                        Geselecteerd: {selectedEquipmentIds.length} {selectedEquipmentIds.length === 1 ? 'item' : 'items'}
                    </span>
                    <button
                        onClick={handleLoan}
                        disabled={loanLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loanLoading ? 'Laden...' : 'Lenen'}
                    </button>
                </div>
            )}

            {loading ? (
                <LoadingSpinner />
            ) : (
                <EquipmentGrid
                    equipment={availableEquipment}
                    selectedIds={selectedEquipmentIds}
                    onToggleSelection={handleToggleSelection}
                />
            )}
        </div>
    );
};

import React from 'react';
import { Equipment } from '../types';

interface EquipmentCardProps {
    equipment: Equipment;
    isSelected: boolean;
    onToggle: (id: number) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
    equipment,
    isSelected,
    onToggle
}) => {
    const isExpiringSoon = equipment.NextInspection && 
        new Date(equipment.NextInspection) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    return (
        <div
            onClick={() => onToggle(equipment.Id)}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : equipment.IsAvailable
                    ? 'border-gray-200 bg-white hover:border-blue-300'
                    : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
            }`}
        >
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{equipment.Name}</h3>
                {isSelected && (
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                )}
            </div>

            {equipment.CategoryName && (
                <p className="text-sm text-gray-500 mb-2">{equipment.CategoryName}</p>
            )}

            <div className="space-y-1 text-sm">
                {equipment.ItemNumber && (
                    <p className="text-gray-600">Nr: {equipment.ItemNumber}</p>
                )}
                {equipment.Brand && (
                    <p className="text-gray-600">Merk: {equipment.Brand}</p>
                )}
                {equipment.Size && (
                    <p className="text-gray-600">Maat: {equipment.Size}</p>
                )}
                {equipment.Volume && (
                    <p className="text-gray-600">Volume: {equipment.Volume}</p>
                )}
                {equipment.Model && (
                    <p className="text-gray-600">Model: {equipment.Model}</p>
                )}
            </div>

            {equipment.NextInspection && (
                <div className={`mt-3 text-xs ${isExpiringSoon ? 'text-orange-600 font-medium' : 'text-gray-500'}`}>
                    Volgende keuring: {new Date(equipment.NextInspection).toLocaleDateString('nl-NL')}
                </div>
            )}

            {equipment.Notes && (
                <p className="mt-2 text-xs text-gray-500 italic">{equipment.Notes}</p>
            )}

            <div className="mt-3 flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    equipment.IsAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {equipment.IsAvailable ? 'Beschikbaar' : 'Uitgeleend'}
                </span>
            </div>
        </div>
    );
};

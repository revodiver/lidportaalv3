import React from 'react';
import { Equipment } from '../types';
import { EquipmentCard } from './EquipmentCard';

interface EquipmentGridProps {
    equipment: Equipment[];
    selectedIds: number[];
    onToggleSelection: (id: number) => void;
}

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({
    equipment,
    selectedIds,
    onToggleSelection
}) => {
    if (equipment.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                Geen materiaal gevonden
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {equipment.map((item) => (
                <EquipmentCard
                    key={item.Id}
                    equipment={item}
                    isSelected={selectedIds.includes(item.Id)}
                    onToggle={onToggleSelection}
                />
            ))}
        </div>
    );
};

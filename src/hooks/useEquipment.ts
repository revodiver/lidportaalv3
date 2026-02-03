import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Equipment, EquipmentCategory } from '../types';

/**
 * Hook for managing equipment
 */
export function useEquipment() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [categories, setCategories] = useState<EquipmentCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            const cats = await api.categories.getAll();
            setCategories(cats);
        } catch (err) {
            setError('Fout bij het laden van categorieën');
        }
    }, []);

    const loadEquipment = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            let items: Equipment[];
            if (selectedCategory) {
                items = await api.equipment.getByCategory(selectedCategory);
            } else {
                items = await api.equipment.getAvailable();
            }
            setEquipment(items);
        } catch (err) {
            setError('Fout bij het laden van materiaal');
            setEquipment([]);
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    // Load categories on mount
    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Load equipment when category changes
    useEffect(() => {
        loadEquipment();
    }, [loadEquipment]);

    const refreshEquipment = useCallback(async () => {
        await loadEquipment();
    }, [loadEquipment]);

    return {
        equipment,
        categories,
        selectedCategory,
        loading,
        error,
        setSelectedCategory,
        refreshEquipment
    };
}

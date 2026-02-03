import { useState, useCallback } from 'react';
import { api } from '../services/api';
import { Person, Loan } from '../types';

/**
 * Hook for managing person search and selection
 */
export function usePersons() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [currentLoans, setCurrentLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchPersons = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setPersons([]);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const results = await api.persons.search(query);
            setPersons(results);
        } catch (err) {
            setError('Fout bij het zoeken van leden');
            setPersons([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const selectPerson = useCallback(async (person: Person) => {
        setSelectedPerson(person);
        setLoading(true);
        setError(null);

        try {
            const loans = await api.persons.getLoans(person.Id);
            setCurrentLoans(loans);
        } catch (err) {
            setError('Fout bij het ophalen van uitgeleend materiaal');
            setCurrentLoans([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshLoans = useCallback(async () => {
        if (!selectedPerson) return;

        setLoading(true);
        setError(null);

        try {
            const loans = await api.persons.getLoans(selectedPerson.Id);
            setCurrentLoans(loans);
        } catch (err) {
            setError('Fout bij het ophalen van uitgeleend materiaal');
        } finally {
            setLoading(false);
        }
    }, [selectedPerson]);

    return {
        persons,
        selectedPerson,
        currentLoans,
        loading,
        error,
        searchPersons,
        selectPerson,
        refreshLoans
    };
}

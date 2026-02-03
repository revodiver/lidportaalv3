import React, { useState, useEffect } from 'react';
import { Person } from '../types';

interface PersonSearchProps {
    onSearch: (query: string) => void;
    onSelect: (person: Person) => void;
    persons: Person[];
    selectedPerson: Person | null;
    loading: boolean;
}

export const PersonSearch: React.FC<PersonSearchProps> = ({
    onSearch,
    onSelect,
    persons,
    selectedPerson,
    loading
}) => {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query);
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [query, onSearch]);

    const handleSelect = (person: Person) => {
        onSelect(person);
        setQuery(`${person.Name} ${person.Surname}`);
        setShowResults(false);
    };

    return (
        <div className="relative mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoek lid
            </label>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder="Zoek lid..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {showResults && query.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-3 text-gray-500">Laden...</div>
                    ) : persons.length === 0 ? (
                        <div className="px-4 py-3 text-gray-500">Geen leden gevonden</div>
                    ) : (
                        <ul>
                            {persons.map((person) => (
                                <li
                                    key={person.Id}
                                    onClick={() => handleSelect(person)}
                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                                >
                                    <div className="font-medium text-gray-900">
                                        {person.Name} {person.Surname}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {person.IDLid && `ID: ${person.IDLid}`}
                                        {person.brevet && ` • ${person.brevet}`}
                                        {person.Groep && ` • ${person.Groep}`}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

import React from 'react';
import { PersonSearch } from '../components/PersonSearch';
import { PersonInfo } from '../components/PersonInfo';
import { LoanManager } from '../components/LoanManager';
import { ReturnManager } from '../components/ReturnManager';
import { ErrorMessage } from '../components/ErrorMessage';
import { usePersons } from '../hooks/usePersons';

export const Home: React.FC = () => {
    const {
        persons,
        selectedPerson,
        currentLoans,
        loading,
        error,
        searchPersons,
        selectPerson,
        refreshLoans
    } = usePersons();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Materiaal Uitleensysteem
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Beheer materiaal uitleningen voor duikvereniging leden
                    </p>
                </div>

                {/* Person Search */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <PersonSearch
                        onSearch={searchPersons}
                        onSelect={selectPerson}
                        persons={persons}
                        selectedPerson={selectedPerson}
                        loading={loading}
                    />
                </div>

                {error && <ErrorMessage message={error} />}

                {/* Content - only show when a person is selected */}
                {selectedPerson && (
                    <>
                        {/* Person Info */}
                        <PersonInfo person={selectedPerson} />

                        {/* Material in possession */}
                        <ReturnManager 
                            loans={currentLoans}
                            onReturned={refreshLoans}
                        />

                        {/* Available Material for Loan */}
                        <div className="mt-6">
                            <LoanManager
                                person={selectedPerson}
                                onLoanCreated={refreshLoans}
                            />
                        </div>
                    </>
                )}

                {!selectedPerson && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Selecteer een lid
                        </h3>
                        <p className="text-gray-500">
                            Zoek en selecteer een lid om materiaal te beheren
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

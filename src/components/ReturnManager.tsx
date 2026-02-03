import React, { useState } from 'react';
import { Loan } from '../types';
import { useLoans } from '../hooks/useLoans';

interface ReturnManagerProps {
    loans: Loan[];
    onReturned: () => void;
}

export const ReturnManager: React.FC<ReturnManagerProps> = ({ loans, onReturned }) => {
    const [selectedLoanIds, setSelectedLoanIds] = useState<number[]>([]);
    const { loading, error, success, returnLoans, clearMessages } = useLoans();

    const handleToggleSelection = (id: number) => {
        setSelectedLoanIds(prev => 
            prev.includes(id) 
                ? prev.filter(loanId => loanId !== id)
                : [...prev, id]
        );
    };

    const handleReturn = async () => {
        if (selectedLoanIds.length === 0) return;

        const returnSuccess = await returnLoans({ loanIds: selectedLoanIds });

        if (returnSuccess) {
            setSelectedLoanIds([]);
            onReturned();

            // Clear success message after 3 seconds
            setTimeout(() => {
                clearMessages();
            }, 3000);
        }
    };

    if (loans.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Materiaal in Bezit</h2>
                <p className="text-gray-500 text-center py-8">
                    Dit lid heeft momenteel geen materiaal in bezit
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Materiaal in Bezit</h2>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {selectedLoanIds.length > 0 && (
                <div className="mb-4 flex items-center justify-between bg-green-50 p-4 rounded-lg">
                    <span className="text-green-900 font-medium">
                        Geselecteerd: {selectedLoanIds.length} {selectedLoanIds.length === 1 ? 'item' : 'items'}
                    </span>
                    <button
                        onClick={handleReturn}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? 'Laden...' : 'Terugbrengen'}
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {loans.map((loan) => (
                    <div
                        key={loan.Id}
                        onClick={() => handleToggleSelection(loan.Id)}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                            selectedLoanIds.includes(loan.Id)
                                ? 'border-green-600 bg-green-50'
                                : 'border-gray-200 bg-white hover:border-green-300'
                        }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">
                                    {loan.Equipment?.Name || 'Onbekend materiaal'}
                                </h3>
                                {loan.Equipment?.CategoryName && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {loan.Equipment.CategoryName}
                                    </p>
                                )}
                                {loan.Equipment?.ItemNumber && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Nr: {loan.Equipment.ItemNumber}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-2">
                                    Geleend op: {new Date(loan.BorrowedAt).toLocaleDateString('nl-NL', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                                {loan.Notes && (
                                    <p className="text-sm text-gray-500 mt-1 italic">
                                        Notitie: {loan.Notes}
                                    </p>
                                )}
                            </div>
                            {selectedLoanIds.includes(loan.Id) && (
                                <svg className="w-6 h-6 text-green-600 ml-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

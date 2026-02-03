import { useState } from 'react';
import { api } from '../services/api';
import { LoanRequest, ReturnRequest } from '../types';

/**
 * Hook for managing loans
 */
export function useLoans() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const createLoan = async (loanRequest: LoanRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.loans.create(loanRequest);
            setSuccess('Materiaal succesvol uitgeleend');
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Fout bij het uitlenen van materiaal';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const returnLoans = async (returnRequest: ReturnRequest): Promise<boolean> => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.loans.return(returnRequest);
            setSuccess('Materiaal succesvol teruggebracht');
            return true;
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Fout bij het terugbrengen van materiaal';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return {
        loading,
        error,
        success,
        createLoan,
        returnLoans,
        clearMessages
    };
}

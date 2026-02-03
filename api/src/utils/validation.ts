/**
 * Validation utility functions
 */

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidId(id: any): boolean {
    const numId = Number(id);
    return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
}

export function validateLoanRequest(body: any): { valid: boolean; error?: string } {
    if (!body) {
        return { valid: false, error: 'Request body is required' };
    }

    if (!isValidId(body.personId)) {
        return { valid: false, error: 'Valid personId is required' };
    }

    if (!Array.isArray(body.equipmentIds) || body.equipmentIds.length === 0) {
        return { valid: false, error: 'equipmentIds must be a non-empty array' };
    }

    for (const id of body.equipmentIds) {
        if (!isValidId(id)) {
            return { valid: false, error: `Invalid equipment ID: ${id}` };
        }
    }

    return { valid: true };
}

export function validateReturnRequest(body: any): { valid: boolean; error?: string } {
    if (!body) {
        return { valid: false, error: 'Request body is required' };
    }

    if (!Array.isArray(body.loanIds) || body.loanIds.length === 0) {
        return { valid: false, error: 'loanIds must be a non-empty array' };
    }

    for (const id of body.loanIds) {
        if (!isValidId(id)) {
            return { valid: false, error: `Invalid loan ID: ${id}` };
        }
    }

    return { valid: true };
}

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { query } from '../services/database';
import { validateLoanRequest, validateReturnRequest } from '../utils/validation';
import { EmailService } from '../services/emailService';

interface LoanRequest {
    personId: number;
    equipmentIds: number[];
    notes?: string;
}

interface ReturnRequest {
    loanIds: number[];
}

/**
 * POST /api/loans - Create new loans
 * PATCH /api/loans/return - Return equipment
 */
export async function handleLoans(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const method = request.method;
        const isReturnAction = request.url.includes('/return');

        // Handle equipment return
        if (method === 'PATCH' && isReturnAction) {
            const body: ReturnRequest = await request.json() as ReturnRequest;
            const validation = validateReturnRequest(body);

            if (!validation.valid) {
                return {
                    status: 400,
                    jsonBody: { success: false, error: validation.error }
                };
            }

            // Get loan details before updating
            const loansResult = await query<any>(`
                SELECT 
                    l.Id,
                    l.PersonId,
                    p.Name,
                    p.Surname,
                    p.Email,
                    p.[E-Mail],
                    e.Name AS EquipmentName,
                    e.Id AS EquipmentId
                FROM Loans l
                INNER JOIN Persons p ON l.PersonId = p.Id
                INNER JOIN Equipment e ON l.EquipmentId = e.Id
                WHERE l.Id IN (${body.loanIds.join(',')})
                AND l.ReturnedAt IS NULL
            `);

            if (loansResult.recordset.length === 0) {
                return {
                    status: 404,
                    jsonBody: { success: false, error: 'No active loans found with provided IDs' }
                };
            }

            const equipmentIds = loansResult.recordset.map((l: any) => l.EquipmentId);

            // Update loans to mark as returned
            await query(`
                UPDATE Loans
                SET ReturnedAt = GETDATE()
                WHERE Id IN (${body.loanIds.join(',')})
            `);

            // Update equipment availability
            await query(`
                UPDATE Equipment
                SET IsAvailable = 1, UpdatedAt = GETDATE()
                WHERE Id IN (${equipmentIds.join(',')})
            `);

            // Send email notifications
            try {
                const emailService = new EmailService();
                const firstLoan = loansResult.recordset[0];
                const personName = `${firstLoan.Name} ${firstLoan.Surname}`;
                const equipmentList = loansResult.recordset.map((l: any) => l.EquipmentName);

                // Send email to member
                const memberEmail = firstLoan.Email || firstLoan['E-Mail'];
                if (memberEmail) {
                    await emailService.sendReturnNotification(memberEmail, personName, equipmentList, false);
                }

                // Send email to admin
                const adminEmail = process.env.ADMIN_EMAIL;
                if (adminEmail) {
                    await emailService.sendReturnNotification(adminEmail, personName, equipmentList, true);
                }
            } catch (emailError) {
                context.warn('Failed to send email notifications:', emailError);
                // Continue even if email fails
            }

            return {
                status: 200,
                jsonBody: { 
                    success: true, 
                    message: 'Materiaal succesvol teruggebracht',
                    data: { returnedCount: loansResult.recordset.length }
                }
            };
        }

        // Handle new loan creation
        if (method === 'POST') {
            const body: LoanRequest = await request.json() as LoanRequest;
            const validation = validateLoanRequest(body);

            if (!validation.valid) {
                return {
                    status: 400,
                    jsonBody: { success: false, error: validation.error }
                };
            }

            // Check if person exists
            const personResult = await query<any>(`
                SELECT Id, Name, Surname, Email, [E-Mail]
                FROM Persons
                WHERE Id = @personId
            `, { personId: body.personId });

            if (personResult.recordset.length === 0) {
                return {
                    status: 404,
                    jsonBody: { success: false, error: 'Person not found' }
                };
            }

            // Check if equipment exists and is available
            const equipmentResult = await query<any>(`
                SELECT Id, Name, IsAvailable
                FROM Equipment
                WHERE Id IN (${body.equipmentIds.join(',')})
            `);

            if (equipmentResult.recordset.length !== body.equipmentIds.length) {
                return {
                    status: 404,
                    jsonBody: { success: false, error: 'One or more equipment items not found' }
                };
            }

            const unavailableItems = equipmentResult.recordset.filter((e: any) => !e.IsAvailable);
            if (unavailableItems.length > 0) {
                return {
                    status: 400,
                    jsonBody: { 
                        success: false, 
                        error: `Equipment not available: ${unavailableItems.map((e: any) => e.Name).join(', ')}`
                    }
                };
            }

            // Create loans
            const loanIds: number[] = [];
            for (const equipmentId of body.equipmentIds) {
                const loanResult = await query<any>(`
                    INSERT INTO Loans (PersonId, EquipmentId, Notes)
                    OUTPUT INSERTED.Id
                    VALUES (@personId, @equipmentId, @notes)
                `, { 
                    personId: body.personId, 
                    equipmentId, 
                    notes: body.notes || null 
                });
                loanIds.push(loanResult.recordset[0].Id);
            }

            // Update equipment availability
            await query(`
                UPDATE Equipment
                SET IsAvailable = 0, UpdatedAt = GETDATE()
                WHERE Id IN (${body.equipmentIds.join(',')})
            `);

            // Send email notifications
            try {
                const emailService = new EmailService();
                const person = personResult.recordset[0];
                const personName = `${person.Name} ${person.Surname}`;
                const equipmentList = equipmentResult.recordset.map((e: any) => e.Name);

                // Send email to member
                const memberEmail = person.Email || person['E-Mail'];
                if (memberEmail) {
                    await emailService.sendLoanNotification(memberEmail, personName, equipmentList, false);
                }

                // Send email to admin
                const adminEmail = process.env.ADMIN_EMAIL;
                if (adminEmail) {
                    await emailService.sendLoanNotification(adminEmail, personName, equipmentList, true);
                }
            } catch (emailError) {
                context.warn('Failed to send email notifications:', emailError);
                // Continue even if email fails
            }

            return {
                status: 201,
                jsonBody: { 
                    success: true, 
                    message: 'Materiaal succesvol uitgeleend',
                    data: { loanIds }
                }
            };
        }

        return {
            status: 405,
            jsonBody: { success: false, error: 'Method not allowed' }
        };

    } catch (error) {
        context.error('Error in handleLoans:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Internal server error' }
        };
    }
}

// Register the function
app.http('loans', {
    methods: ['POST', 'PATCH'],
    route: 'loans/{action?}',
    authLevel: 'anonymous',
    handler: handleLoans
});

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { query } from '../services/database';
import { isValidId } from '../utils/validation';

interface Person {
    Id: number;
    Name: string;
    Surname: string;
    Email?: string;
    IDLid?: string;
    SaldoZuurstof?: number;
    SaldoDuiken?: number;
    'E-Mail'?: string;
    brevet?: string;
    Groep?: string;
}

interface Loan {
    Id: number;
    PersonId: number;
    EquipmentId: number;
    BorrowedAt: string;
    ReturnedAt?: string;
    Notes?: string;
    EquipmentName: string;
    EquipmentItemNumber?: string;
    CategoryName?: string;
}

/**
 * GET /api/persons?search={query} - Search persons
 * GET /api/persons/{id} - Get person by ID
 * GET /api/persons/{id}/loans - Get active loans for person
 */
export async function getPersons(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const searchQuery = request.query.get('search');
        const personId = request.params.id;
        const loansPath = request.url.includes('/loans');

        // Get person by ID with loans
        if (personId && loansPath) {
            if (!isValidId(personId)) {
                return {
                    status: 400,
                    jsonBody: { success: false, error: 'Invalid person ID' }
                };
            }

            const result = await query<Loan>(`
                SELECT 
                    l.Id,
                    l.PersonId,
                    l.EquipmentId,
                    l.BorrowedAt,
                    l.ReturnedAt,
                    l.Notes,
                    e.Name AS EquipmentName,
                    e.ItemNumber AS EquipmentItemNumber,
                    ec.Name AS CategoryName
                FROM Loans l
                INNER JOIN Equipment e ON l.EquipmentId = e.Id
                LEFT JOIN EquipmentCategories ec ON e.CategoryId = ec.Id
                WHERE l.PersonId = @personId AND l.ReturnedAt IS NULL
                ORDER BY l.BorrowedAt DESC
            `, { personId });

            return {
                status: 200,
                jsonBody: { success: true, data: result.recordset }
            };
        }

        // Get person by ID
        if (personId) {
            if (!isValidId(personId)) {
                return {
                    status: 400,
                    jsonBody: { success: false, error: 'Invalid person ID' }
                };
            }

            const result = await query<Person>(`
                SELECT 
                    Id, Name, Surname, Email, IDLid, SaldoZuurstof, SaldoDuiken,
                    [E-Mail], brevet, Groep, Telefoon, [GSM N°] AS GSM, 
                    Adres, Gemeente, Postnr, [Actief Lid]
                FROM Persons
                WHERE Id = @personId
            `, { personId });

            if (result.recordset.length === 0) {
                return {
                    status: 404,
                    jsonBody: { success: false, error: 'Person not found' }
                };
            }

            return {
                status: 200,
                jsonBody: { success: true, data: result.recordset[0] }
            };
        }

        // Search persons
        if (searchQuery) {
            const searchPattern = `%${searchQuery}%`;
            const result = await query<Person>(`
                SELECT TOP 50
                    Id, Name, Surname, Email, IDLid, SaldoZuurstof, SaldoDuiken,
                    [E-Mail], brevet, Groep
                FROM Persons
                WHERE 
                    Name LIKE @search 
                    OR Surname LIKE @search 
                    OR IDLid LIKE @search
                    OR Email LIKE @search
                    OR [E-Mail] LIKE @search
                ORDER BY Surname, Name
            `, { search: searchPattern });

            return {
                status: 200,
                jsonBody: { success: true, data: result.recordset }
            };
        }

        // No search query provided
        return {
            status: 400,
            jsonBody: { success: false, error: 'Search query is required' }
        };

    } catch (error) {
        context.error('Error in getPersons:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Internal server error' }
        };
    }
}

// Register the function
app.http('persons', {
    methods: ['GET'],
    route: 'persons/{id?}/{action?}',
    authLevel: 'anonymous',
    handler: getPersons
});

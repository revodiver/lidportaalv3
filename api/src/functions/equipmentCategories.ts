import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { query } from '../services/database';

interface EquipmentCategory {
    Id: number;
    Name: string;
    Description?: string;
    SortOrder: number;
    CreatedAt: string;
}

/**
 * GET /api/equipment-categories - Get all equipment categories
 */
export async function getEquipmentCategories(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const result = await query<EquipmentCategory>(`
            SELECT 
                Id,
                Name,
                Description,
                SortOrder,
                CreatedAt
            FROM EquipmentCategories
            ORDER BY SortOrder, Name
        `);

        return {
            status: 200,
            jsonBody: { success: true, data: result.recordset }
        };

    } catch (error) {
        context.error('Error in getEquipmentCategories:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Internal server error' }
        };
    }
}

// Register the function
app.http('equipmentCategories', {
    methods: ['GET'],
    route: 'equipment-categories',
    authLevel: 'anonymous',
    handler: getEquipmentCategories
});

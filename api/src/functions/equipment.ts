import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { query } from '../services/database';

interface Equipment {
    Id: number;
    CategoryId: number;
    ItemNumber?: string;
    Name: string;
    Brand?: string;
    Size?: string;
    Volume?: string;
    LastInspection?: string;
    NextInspection?: string;
    Model?: string;
    Notes?: string;
    IsAvailable: boolean;
    CreatedAt: string;
    UpdatedAt: string;
    CategoryName?: string;
}

/**
 * GET /api/equipment - Get all equipment
 * GET /api/equipment?available=true - Get available equipment
 * GET /api/equipment?categoryId={id} - Get equipment by category
 */
export async function getEquipment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const available = request.query.get('available');
        const categoryId = request.query.get('categoryId');

        let queryString = `
            SELECT 
                e.Id,
                e.CategoryId,
                e.ItemNumber,
                e.Name,
                e.Brand,
                e.Size,
                e.Volume,
                e.LastInspection,
                e.NextInspection,
                e.Model,
                e.Notes,
                e.IsAvailable,
                e.CreatedAt,
                e.UpdatedAt,
                ec.Name AS CategoryName
            FROM Equipment e
            LEFT JOIN EquipmentCategories ec ON e.CategoryId = ec.Id
            WHERE 1=1
        `;

        const params: any = {};

        if (available === 'true') {
            queryString += ' AND e.IsAvailable = 1';
        } else if (available === 'false') {
            queryString += ' AND e.IsAvailable = 0';
        }

        if (categoryId) {
            queryString += ' AND e.CategoryId = @categoryId';
            params.categoryId = parseInt(categoryId);
        }

        queryString += ' ORDER BY ec.SortOrder, e.Name';

        const result = await query<Equipment>(queryString, params);

        return {
            status: 200,
            jsonBody: { success: true, data: result.recordset }
        };

    } catch (error) {
        context.error('Error in getEquipment:', error);
        return {
            status: 500,
            jsonBody: { success: false, error: 'Internal server error' }
        };
    }
}

// Register the function
app.http('equipment', {
    methods: ['GET'],
    route: 'equipment',
    authLevel: 'anonymous',
    handler: getEquipment
});

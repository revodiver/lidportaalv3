import axios, { AxiosInstance } from 'axios';
import { 
    Person, 
    Equipment, 
    EquipmentCategory, 
    Loan, 
    LoanRequest, 
    ReturnRequest,
    ApiResponse 
} from '../types';

// API client configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * API service for communicating with Azure Functions backend
 */
export const api = {
    // Person endpoints
    persons: {
        search: async (query: string): Promise<Person[]> => {
            const response = await apiClient.get<ApiResponse<Person[]>>(`/persons?search=${encodeURIComponent(query)}`);
            return response.data.data || [];
        },
        
        getById: async (id: number): Promise<Person | null> => {
            const response = await apiClient.get<ApiResponse<Person>>(`/persons/${id}`);
            return response.data.data || null;
        },
        
        getLoans: async (id: number): Promise<Loan[]> => {
            const response = await apiClient.get<ApiResponse<Loan[]>>(`/persons/${id}/loans`);
            return response.data.data || [];
        }
    },

    // Equipment endpoints
    equipment: {
        getAll: async (): Promise<Equipment[]> => {
            const response = await apiClient.get<ApiResponse<Equipment[]>>('/equipment');
            return response.data.data || [];
        },
        
        getAvailable: async (): Promise<Equipment[]> => {
            const response = await apiClient.get<ApiResponse<Equipment[]>>('/equipment?available=true');
            return response.data.data || [];
        },
        
        getByCategory: async (categoryId: number): Promise<Equipment[]> => {
            const response = await apiClient.get<ApiResponse<Equipment[]>>(`/equipment?categoryId=${categoryId}`);
            return response.data.data || [];
        }
    },

    // Equipment categories endpoints
    categories: {
        getAll: async (): Promise<EquipmentCategory[]> => {
            const response = await apiClient.get<ApiResponse<EquipmentCategory[]>>('/equipment-categories');
            return response.data.data || [];
        }
    },

    // Loan endpoints
    loans: {
        create: async (loanRequest: LoanRequest): Promise<{ loanIds: number[] }> => {
            const response = await apiClient.post<ApiResponse<{ loanIds: number[] }>>('/loans', loanRequest);
            return response.data.data || { loanIds: [] };
        },
        
        return: async (returnRequest: ReturnRequest): Promise<{ returnedCount: number }> => {
            const response = await apiClient.patch<ApiResponse<{ returnedCount: number }>>('/loans/return', returnRequest);
            return response.data.data || { returnedCount: 0 };
        }
    }
};

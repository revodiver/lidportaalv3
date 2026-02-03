import React from 'react';
import { Person } from '../types';

interface PersonInfoProps {
    person: Person;
}

export const PersonInfo: React.FC<PersonInfoProps> = ({ person }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Lid Informatie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <span className="text-sm font-medium text-gray-500">Naam:</span>
                    <p className="text-gray-900">{person.Name} {person.Surname}</p>
                </div>
                {person.Email && (
                    <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-gray-900">{person.Email}</p>
                    </div>
                )}
                {person.IDLid && (
                    <div>
                        <span className="text-sm font-medium text-gray-500">Lid ID:</span>
                        <p className="text-gray-900">{person.IDLid}</p>
                    </div>
                )}
                {person.brevet && (
                    <div>
                        <span className="text-sm font-medium text-gray-500">Brevet:</span>
                        <p className="text-gray-900">{person.brevet}</p>
                    </div>
                )}
                {person.Groep && (
                    <div>
                        <span className="text-sm font-medium text-gray-500">Groep:</span>
                        <p className="text-gray-900">{person.Groep}</p>
                    </div>
                )}
                {person.SaldoZuurstof !== undefined && (
                    <div>
                        <span className="text-sm font-medium text-gray-500">Saldo Zuurstof:</span>
                        <p className="text-gray-900">{person.SaldoZuurstof}</p>
                    </div>
                )}
                {person.SaldoDuiken !== undefined && (
                    <div>
                        <span className="text-sm font-medium text-gray-500">Saldo Duiken:</span>
                        <p className="text-gray-900">{person.SaldoDuiken}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

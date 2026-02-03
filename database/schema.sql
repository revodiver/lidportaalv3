-- Equipment Lending System Database Schema
-- Note: Persons table already exists in the database

-- Create EquipmentCategories table
CREATE TABLE EquipmentCategories (
    [Id] INT PRIMARY KEY IDENTITY(1,1),
    [Name] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500),
    [SortOrder] INT DEFAULT 0,
    [CreatedAt] DATETIME2 DEFAULT GETDATE()
);

-- Create Equipment table
CREATE TABLE Equipment (
    [Id] INT PRIMARY KEY IDENTITY(1,1),
    [CategoryId] INT FOREIGN KEY REFERENCES EquipmentCategories(Id),
    [ItemNumber] NVARCHAR(50) UNIQUE,
    [Name] NVARCHAR(200) NOT NULL,
    [Brand] NVARCHAR(100),
    [Size] NVARCHAR(50),
    [Volume] NVARCHAR(50),
    [LastInspection] DATE,
    [NextInspection] DATE,
    [Model] NVARCHAR(100),
    [Notes] NVARCHAR(MAX),
    [IsAvailable] BIT DEFAULT 1,
    [CreatedAt] DATETIME2 DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2 DEFAULT GETDATE()
);

-- Create Loans table
CREATE TABLE Loans (
    [Id] INT PRIMARY KEY IDENTITY(1,1),
    [PersonId] INT FOREIGN KEY REFERENCES Persons(Id),
    [EquipmentId] INT FOREIGN KEY REFERENCES Equipment(Id),
    [BorrowedAt] DATETIME2 DEFAULT GETDATE(),
    [ReturnedAt] DATETIME2 NULL,
    [Notes] NVARCHAR(MAX),
    [CreatedAt] DATETIME2 DEFAULT GETDATE()
);

-- Create indexes for better performance
CREATE INDEX IX_Equipment_CategoryId ON Equipment(CategoryId);
CREATE INDEX IX_Equipment_IsAvailable ON Equipment(IsAvailable);
CREATE INDEX IX_Loans_PersonId ON Loans(PersonId);
CREATE INDEX IX_Loans_EquipmentId ON Loans(EquipmentId);
CREATE INDEX IX_Loans_ReturnedAt ON Loans(ReturnedAt);

-- Insert seed data for equipment categories
INSERT INTO EquipmentCategories ([Name], [Description], [SortOrder]) VALUES
('Duikflessen', 'Persluchtflessen en duikflessen', 1),
('Duikpakken', 'Droogpakken en natpakken', 2),
('BCD', 'Buoyancy Control Devices', 3),
('Regulators', 'Ademautomaten en octopussen', 4),
('Maskers en Vinnen', 'Duikmaskers, snorkels en zwemvinnen', 5),
('Duikcomputers', 'Duikcomputers en consoles', 6),
('Lampen', 'Duiklampen en backup lampen', 7),
('Gewichten', 'Loodgewichten en gewichtsystemen', 8),
('Accessoires', 'Diversen en andere duikuitrusting', 9);

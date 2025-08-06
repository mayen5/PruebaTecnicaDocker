-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'evidencias_db')
BEGIN
    CREATE DATABASE evidencias_db;
END
GO

USE evidencias_db;
GO

-- Tabla de usuarios
IF OBJECT_ID('dbo.Usuarios', 'U') IS NOT NULL DROP TABLE dbo.Usuarios;
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    rol NVARCHAR(20) NOT NULL CHECK (rol IN ('tecnico', 'coordinador')),
    activo BIT NOT NULL DEFAULT 1
);
GO

-- Tabla de expedientes
IF OBJECT_ID('dbo.Expedientes', 'U') IS NOT NULL DROP TABLE dbo.Expedientes;
CREATE TABLE Expedientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo NVARCHAR(50) UNIQUE NOT NULL,
    descripcion NVARCHAR(255),
    fecha_registro DATETIME NOT NULL DEFAULT GETDATE(),
    tecnico_id INT NOT NULL,
    estado NVARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    justificacion NVARCHAR(255),
    FOREIGN KEY (tecnico_id) REFERENCES Usuarios(id)
);
GO

-- Tabla de indicios
IF OBJECT_ID('dbo.Indicios', 'U') IS NOT NULL DROP TABLE dbo.Indicios;
CREATE TABLE Indicios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    expediente_id INT NOT NULL,
    descripcion NVARCHAR(255),
    color NVARCHAR(50),
    tamano NVARCHAR(50),
    peso DECIMAL(10,2),
    ubicacion NVARCHAR(255),
    tecnico_id INT NOT NULL,
    fecha_registro DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (expediente_id) REFERENCES Expedientes(id),
    FOREIGN KEY (tecnico_id) REFERENCES Usuarios(id)
);
GO

-- Insertar usuarios con contraseña encriptada por bcrypt (rounds = 10)
-- Contraseña: '1234' y '5678'
INSERT INTO Usuarios (username, password_hash, rol)
VALUES
('tecnico', '$2b$10$1zWo2S0AKC7xvxIzsppZA.I47061lFDSsogE39zYZr/TjKNpKxuUy', 'tecnico'),
('coordinador', '$2b$10$PoSg2CL4ps8nSEaBvtHb2./vyRAD8oaV6x1gr4KgSM9w.DHW6tavm', 'coordinador');
GO

--Procedimientos almacenados
-- Procedimiento almacenado para obtener usuario por username si está activo
/*
    Nombre:          SP_GET_UsuarioByUsername
    Descripción:     Devuelve los datos del usuario según el nombre de usuario proporcionado,
                     únicamente si el usuario está activo.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
    Notas:           Utilizado para autenticación y validación de roles desde backend.
*/

CREATE PROCEDURE SP_GET_UsuarioByUsername
    @username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validación del parámetro de entrada
        IF @username IS NULL OR LTRIM(RTRIM(@username)) = ''
        BEGIN
            RAISERROR('El nombre de usuario no puede ser nulo o vacío.', 16, 1);
            RETURN;
        END

        -- Consulta principal: solo usuarios activos
        SELECT id, username, password_hash, rol, activo
        FROM Usuarios
        WHERE username = @username
          AND activo = 1;
    END TRY
    BEGIN CATCH
        -- Manejo de errores
        DECLARE @ErrorMessage NVARCHAR(4000);
        SET @ErrorMessage = ERROR_MESSAGE();

        RAISERROR('Error en SP_GET_UsuarioByUsername: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO


--Procedimiento almacenado para insertar un nuevo usuario
/*
    Nombre:          SP_INSERT_Usuario
    Descripción:     Inserta un nuevo usuario en la tabla Usuarios.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
*/

CREATE PROCEDURE SP_INSERT_Usuario
    @username NVARCHAR(100),
    @password_hash NVARCHAR(255),
    @rol NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        INSERT INTO Usuarios (username, password_hash, rol, activo)
        VALUES (@username, @password_hash, @rol, 1);
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000);
        SET @ErrorMessage = ERROR_MESSAGE();
        RAISERROR('Error en SP_INS_Usuario: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

--Procedimiento almacenado para actualizar un usuario existente
/*
    Nombre:          SP_UPDATE_UsuarioByUsername
    Descripción:     Actualiza los datos del usuario identificado por su username.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.1
*/

CREATE OR ALTER PROCEDURE SP_UPDATE_UsuarioByUsername
    @username NVARCHAR(100),
    @password_hash NVARCHAR(255),
    @rol NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE Usuarios
        SET password_hash = @password_hash,
            rol = @rol
        WHERE username = @username;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000);
        SET @ErrorMessage = ERROR_MESSAGE();
        RAISERROR('Error en SP_UPD_Usuario: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

--Procedimiento almacenado para desactivar (eliminar lógicamente) un usuario
/*
    Nombre:          SP_UPDATE_UsuarioActivoByUsername
    Descripción:     Desactiva (eliminación lógica) al usuario identificado por su username.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.1
*/

CREATE OR ALTER PROCEDURE SP_UPDATE_UsuarioActivoByUsername
    @username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE Usuarios
        SET activo = 0
        WHERE username = @username;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000);
        SET @ErrorMessage = ERROR_MESSAGE();
        RAISERROR('Error en SP_DEL_Usuario: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

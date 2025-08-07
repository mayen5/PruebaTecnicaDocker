/*
    Nombre:          evidencias_db
    Descripción:     Base de datos principal para el sistema de gestión de evidencias del DICRI.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
    Notas:           Contiene tablas para usuarios, expedientes e indicios.
*/

-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'evidencias_db')
BEGIN
    CREATE DATABASE evidencias_db;
END
GO

USE evidencias_db;
GO


/*
    Nombre:          Usuarios
    Descripción:     Almacena los datos de autenticación y rol de los usuarios del sistema.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
    Notas:           Utiliza campo 'activo' para eliminación lógica.
*/
IF OBJECT_ID('dbo.Usuarios', 'U') IS NULL
BEGIN
    CREATE TABLE Usuarios (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        rol NVARCHAR(20) NOT NULL CHECK (rol IN ('tecnico', 'coordinador')),
        activo BIT NOT NULL DEFAULT 1
    );
END
GO

/*
    Nombre:          Expedientes
    Descripción:     Registra los expedientes ingresados por técnicos y su estado de revisión.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
    Notas:           Incluye referencia al técnico responsable. Usa 'activo' para eliminación lógica.
*/
IF OBJECT_ID('dbo.Expedientes', 'U') IS NULL
BEGIN
    CREATE TABLE Expedientes (
        id INT IDENTITY(1,1) PRIMARY KEY,
        codigo NVARCHAR(50) UNIQUE NOT NULL,
        descripcion NVARCHAR(255),
        fecha_registro DATETIME NOT NULL DEFAULT GETDATE(),
        tecnico_id INT NOT NULL,
        estado NVARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
        justificacion NVARCHAR(255),
        aprobador_id INT NULL,
        fecha_estado DATETIME NULL,
        activo BIT NOT NULL DEFAULT 1,
        FOREIGN KEY (tecnico_id) REFERENCES Usuarios(id),
        FOREIGN KEY (aprobador_id) REFERENCES Usuarios(id)
    );
END
GO

/*
    Nombre:          Indicios
    Descripción:     Almacena los indicios asociados a cada expediente, incluyendo características físicas.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
    Notas:           Relacionado con expediente y técnico. Incluye campo 'activo' para eliminación lógica.
*/
IF OBJECT_ID('dbo.Indicios', 'U') IS NULL
BEGIN
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
        activo BIT NOT NULL DEFAULT 1,
        FOREIGN KEY (expediente_id) REFERENCES Expedientes(id),
        FOREIGN KEY (tecnico_id) REFERENCES Usuarios(id)
    );
END
GO

-- Insertar usuarios con contraseña encriptada por bcrypt (rounds = 10)
-- Contraseña: '1234' y '5678'
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE username = 'tecnico')
BEGIN
    INSERT INTO Usuarios (username, password_hash, rol)
    VALUES ('tecnico', '$2b$10$1zWo2S0AKC7xvxIzsppZA.I47061lFDSsogE39zYZr/TjKNpKxuUy', 'tecnico');
END
IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE username = 'coordinador')
BEGIN
    INSERT INTO Usuarios (username, password_hash, rol)
    VALUES ('coordinador', '$2b$10$PoSg2CL4ps8nSEaBvtHb2./vyRAD8oaV6x1gr4KgSM9w.DHW6tavm', 'coordinador');
END
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

IF OBJECT_ID('SP_GET_UsuarioByUsername', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_UsuarioByUsername;
GO
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
        WHERE username = @username;
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
IF OBJECT_ID('SP_INSERT_Usuario', 'P') IS NOT NULL
    DROP PROCEDURE SP_INSERT_Usuario;
GO
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
    Versión:         1.0
*/

IF OBJECT_ID('SP_UPDATE_UsuarioByUsername', 'P') IS NOT NULL
    DROP PROCEDURE SP_UPDATE_UsuarioByUsername;
GO
CREATE PROCEDURE SP_UPDATE_UsuarioByUsername
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

-- =============================================
-- Nombre:          SP_GET_Usuarios
-- Descripción:     Devuelve todos los usuarios registrados (activos e inactivos).
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-05
-- Versión:         1.0
-- Notas:           Lista los Usuarios.
-- =============================================

IF OBJECT_ID('SP_GET_Usuarios', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_Usuarios;
GO
CREATE PROCEDURE SP_GET_Usuarios
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            username,
            password_hash,
            rol,
            activo
        FROM Usuarios;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_GET_Usuarios: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO


--Procedimiento almacenado para desactivar (eliminar lógicamente) un usuario
/*
    Nombre:          SP_UPDATE_UsuarioActivoByUsername
    Descripción:     Desactiva (eliminación lógica) al usuario identificado por su username.
    Autor:           Carmelo Mayén
    Fecha creación:  2025-08-05
    Versión:         1.0
*/

IF OBJECT_ID('SP_UPDATE_UsuarioActivoByUsername', 'P') IS NOT NULL
    DROP PROCEDURE SP_UPDATE_UsuarioActivoByUsername;
GO
CREATE PROCEDURE SP_UPDATE_UsuarioActivoByUsername
    @username NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        UPDATE Usuarios
        SET activo = CASE WHEN activo = 1 THEN 0 ELSE 1 END
        WHERE username = @username;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000);
        SET @ErrorMessage = ERROR_MESSAGE();
        RAISERROR('Error en SP_DEL_Usuario: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_GET_ExpedienteById
-- Descripción:     Devuelve los datos de un expediente según su ID, si está activo.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Utilizado para visualizar los detalles de un expediente.
-- =============================================

IF OBJECT_ID('SP_GET_ExpedienteById', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_ExpedienteById;
GO
CREATE PROCEDURE SP_GET_ExpedienteById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validación del parámetro de entrada
        IF @id IS NULL OR @id <= 0
        BEGIN
            RAISERROR('El ID del expediente debe ser un número válido y mayor que cero.', 16, 1);
            RETURN;
        END

        -- Consulta principal
        SELECT 
            e.id,
            e.codigo,
            e.descripcion,
            e.fecha_registro,
            e.tecnico_id,
            u.username AS tecnico_username,
            e.estado,
            e.justificacion,
            e.aprobador_id,
            ua.username AS aprobador_username,
            e.fecha_estado,
            e.activo
        FROM Expedientes e
        INNER JOIN Usuarios u ON e.tecnico_id = u.id
        LEFT JOIN Usuarios ua ON e.aprobador_id = ua.id
        WHERE e.id = @id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_GET_ExpedienteById: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_GET_Expedientes
-- Descripción:     Devuelve todos los expedientes activos registrados.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Utilizado para listar todos los expedientes activos.
-- =============================================

IF OBJECT_ID('SP_GET_Expedientes', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_Expedientes;
GO
CREATE PROCEDURE SP_GET_Expedientes
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            e.id,
            e.codigo,
            e.descripcion,
            e.fecha_registro,
            e.tecnico_id,
            u.username AS tecnico_username,
            e.estado,
            e.justificacion,
            e.aprobador_id,
            ua.username AS aprobador_username,
            e.fecha_estado,
            e.activo
        FROM Expedientes e
        INNER JOIN Usuarios u ON e.tecnico_id = u.id
        LEFT JOIN Usuarios ua ON e.aprobador_id = ua.id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_GET_Expedientes: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_INSERT_Expediente
-- Descripción:     Inserta un nuevo expediente con estado 'pendiente' por defecto.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Utilizado para el registro inicial de expedientes. 
--                  El estado se define internamente como 'pendiente'.
-- =============================================

IF OBJECT_ID('SP_INSERT_Expediente', 'P') IS NOT NULL
    DROP PROCEDURE SP_INSERT_Expediente;
GO
CREATE PROCEDURE SP_INSERT_Expediente
    @codigo NVARCHAR(50),
    @descripcion NVARCHAR(255),
    @tecnico_id INT,
    @justificacion NVARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF (@codigo IS NULL OR LTRIM(RTRIM(@codigo)) = '')
    BEGIN
        RAISERROR('El código del expediente es requerido.', 16, 1);
        RETURN;
    END

    INSERT INTO Expedientes (
        codigo,
        descripcion,
        fecha_registro,
        tecnico_id,
        estado,
        justificacion,
        activo
    )
    VALUES (
        @codigo,
        @descripcion,
        GETDATE(),
        @tecnico_id,
        'pendiente',
        @justificacion,
        1
    );
END;
GO


-- =============================================
-- Nombre:          SP_UPDATE_ExpedienteById
-- Descripción:     Actualiza los campos de un expediente por su ID.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Actualiza descripción, estado, justificación y técnico.
-- =============================================

IF OBJECT_ID('SP_UPDATE_ExpedienteById', 'P') IS NOT NULL
    DROP PROCEDURE SP_UPDATE_ExpedienteById;
GO
CREATE PROCEDURE SP_UPDATE_ExpedienteById
    @id INT,
    @descripcion NVARCHAR(255),
    @estado NVARCHAR(20),
    @justificacion NVARCHAR(255),
    @tecnico_id INT,
    @aprobador_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @id AND activo = 1)
        BEGIN
            RAISERROR('El expediente no existe o está inactivo.', 16, 1);
            RETURN;
        END

        IF @estado NOT IN ('pendiente', 'aprobado', 'rechazado')
        BEGIN
            RAISERROR('El estado proporcionado no es válido.', 16, 1);
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE id = @tecnico_id AND activo = 1)
        BEGIN
            RAISERROR('El técnico proporcionado no existe o está inactivo.', 16, 1);
            RETURN;
        END

        -- Validación de justificación si el estado es 'rechazado'
        IF @estado = 'rechazado' AND (@justificacion IS NULL OR LTRIM(RTRIM(@justificacion)) = '')
        BEGIN
            RAISERROR('Debe proporcionar una justificación para expedientes rechazados.', 16, 1);
            RETURN;
        END

        -- Si el estado es aprobado o rechazado, registrar aprobador y fecha_estado
        IF @estado IN ('aprobado', 'rechazado')
        BEGIN
            IF @aprobador_id IS NULL OR NOT EXISTS (SELECT 1 FROM Usuarios WHERE id = @aprobador_id AND activo = 1)
            BEGIN
                RAISERROR('Debe proporcionar un aprobador válido para aprobar/rechazar.', 16, 1);
                RETURN;
            END

            UPDATE Expedientes
            SET descripcion = @descripcion,
                estado = @estado,
                justificacion = @justificacion,
                tecnico_id = @tecnico_id,
                aprobador_id = @aprobador_id,
                fecha_estado = GETDATE()
            WHERE id = @id;
        END
        ELSE
        BEGIN
            UPDATE Expedientes
            SET descripcion = @descripcion,
                estado = @estado,
                justificacion = @justificacion,
                tecnico_id = @tecnico_id
            WHERE id = @id;
        END
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_UPDATE_ExpedienteById: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_UPDATE_ExpedienteActivoById
-- Descripción:     Cambia el valor del campo activo de un expediente (eliminación lógica).
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Usado para eliminar/restaurar registros sin borrado físico.
-- =============================================

IF OBJECT_ID('SP_UPDATE_ExpedienteActivoById', 'P') IS NOT NULL
    DROP PROCEDURE SP_UPDATE_ExpedienteActivoById;
GO
CREATE PROCEDURE SP_UPDATE_ExpedienteActivoById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @id)
        BEGIN
            RAISERROR('El expediente no existe.', 16, 1);
            RETURN;
        END

        UPDATE Expedientes
        SET activo = CASE WHEN activo = 1 THEN 0 ELSE 1 END
        WHERE id = @id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_UPDATE_ExpedienteActivoById: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_GET_IndicioById
-- Descripción:     Devuelve un indicio según su ID.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Incluye solo registros activos.
-- =============================================

IF OBJECT_ID('SP_GET_IndicioById', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_IndicioById;
GO
CREATE PROCEDURE SP_GET_IndicioById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            expediente_id,
            descripcion,
            color,
            tamano,
            peso,
            ubicacion,
            tecnico_id,
            fecha_registro,
            activo
        FROM Indicios
        WHERE id = @id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_GET_IndicioById: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_GET_Indicios
-- Descripción:     Devuelve todos los indicios activos.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           No incluye registros eliminados lógicamente.
-- =============================================

IF OBJECT_ID('SP_GET_Indicios', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_Indicios;
GO
CREATE PROCEDURE SP_GET_Indicios
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            expediente_id,
            descripcion,
            color,
            tamano,
            peso,
            ubicacion,
            tecnico_id,
            fecha_registro,
            activo
        FROM Indicios;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_GET_Indicios: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_INSERT_Indicio
-- Descripción:     Inserta un nuevo indicio vinculado a un expediente.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           El campo "activo" se define automáticamente.
-- =============================================

IF OBJECT_ID('SP_INSERT_Indicio', 'P') IS NOT NULL
    DROP PROCEDURE SP_INSERT_Indicio;
GO
CREATE PROCEDURE SP_INSERT_Indicio
    @expediente_id INT,
    @descripcion NVARCHAR(255),
    @color NVARCHAR(50),
    @tamano NVARCHAR(50),
    @peso DECIMAL(10,2),
    @ubicacion NVARCHAR(255),
    @tecnico_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        -- Validación de claves foráneas
        IF NOT EXISTS (SELECT 1 FROM Expedientes WHERE id = @expediente_id AND activo = 1)
        BEGIN
            RAISERROR('El expediente proporcionado no existe o está inactivo.', 16, 1);
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE id = @tecnico_id AND activo = 1)
        BEGIN
            RAISERROR('El técnico proporcionado no existe o está inactivo.', 16, 1);
            RETURN;
        END

        INSERT INTO Indicios (expediente_id, descripcion, color, tamano, peso, ubicacion, tecnico_id)
        VALUES (@expediente_id, @descripcion, @color, @tamano, @peso, @ubicacion, @tecnico_id);
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_INSERT_Indicio: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_UPDATE_IndicioById
-- Descripción:     Actualiza los datos de un indicio según su ID.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Se valida que el registro esté activo antes de actualizar.
-- =============================================

IF OBJECT_ID('SP_UPDATE_IndicioById', 'P') IS NOT NULL
    DROP PROCEDURE SP_UPDATE_IndicioById;
GO
CREATE PROCEDURE SP_UPDATE_IndicioById
    @id INT,
    @descripcion NVARCHAR(255),
    @color NVARCHAR(50),
    @tamano NVARCHAR(50),
    @peso DECIMAL(10,2),
    @ubicacion NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Indicios WHERE id = @id AND activo = 1)
        BEGIN
            RAISERROR('El indicio no existe o está inactivo.', 16, 1);
            RETURN;
        END

        UPDATE Indicios
        SET descripcion = @descripcion,
            color = @color,
            tamano = @tamano,
            peso = @peso,
            ubicacion = @ubicacion
        WHERE id = @id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_UPDATE_IndicioById: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_Update_IndicioActivoById
-- Descripción:     Realiza eliminación lógica del indicio (cambia el estado activo).
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           El cambio es reversible (activo = 1 o 0).
-- =============================================

IF OBJECT_ID('SP_Update_IndicioActivoById', 'P') IS NOT NULL
    DROP PROCEDURE SP_Update_IndicioActivoById;
GO
CREATE PROCEDURE SP_Update_IndicioActivoById
    @id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Indicios WHERE id = @id)
        BEGIN
            RAISERROR('El indicio no existe.', 16, 1);
            RETURN;
        END

        UPDATE Indicios
        SET activo = CASE WHEN activo = 1 THEN 0 ELSE 1 END
        WHERE id = @id;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_Update_IndicioActivoById: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

-- =============================================
-- Nombre:          SP_GET_IndiciosByExpedienteId
-- Descripción:     Devuelve todos los indicios activos asociados a un expediente.
-- Autor:           Carmelo Mayén
-- Fecha creación:  2025-08-06
-- Versión:         1.0
-- Notas:           Filtra por expediente_id y activo = 1.
-- =============================================

IF OBJECT_ID('SP_GET_IndiciosByExpedienteId', 'P') IS NOT NULL
    DROP PROCEDURE SP_GET_IndiciosByExpedienteId;
GO
CREATE PROCEDURE SP_GET_IndiciosByExpedienteId
    @expediente_id INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        SELECT 
            id,
            expediente_id,
            descripcion,
            color,
            tamano,
            peso,
            ubicacion,
            tecnico_id,
            fecha_registro,
            activo
        FROM Indicios
        WHERE expediente_id = @expediente_id AND activo = 1;
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR('Error en SP_GET_IndiciosByExpedienteId: %s', 16, 1, @ErrorMessage);
    END CATCH
END;
GO

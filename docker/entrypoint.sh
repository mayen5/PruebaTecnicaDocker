#!/bin/bash

# Inicia SQL Server en segundo plano
/opt/mssql/bin/sqlservr &

# Espera hasta que el servicio esté disponible
echo "Esperando a que SQL Server se inicie..."
sleep 20

# Ejecuta el script de inicialización
/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'Db@dm1n2025' -i /init.sql

# Mantiene el contenedor activo
wait

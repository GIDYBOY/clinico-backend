#!/bin/bash

# === Configuration Variables ===
DB_NAME="clinico_postgres"
DB_USER="clinico_postgres_admin"
DB_PASSWORD="secureclinicopassword123"
DB_HOST="localhost"
DB_PORT="5433"
POSTGRES_PASS="postgres"

# === Export password for psql to use without prompt ===
#export PGPASSWORD=$POSTGRES_PASS

# === Create the user (if not exists) ===
psql -h $DB_HOST -p $DB_PORT -U postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

# === Create the database (if not exists) ===
psql -h $DB_HOST -p $DB_PORT -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -h $DB_HOST -p $DB_PORT -U postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# === Grant privileges ===
psql -h $DB_HOST -p $DB_PORT -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

echo "✅ Database '$DB_NAME' and user '$DB_USER' setup completed."

# === Unset password for safety ===
unset PGPASSWORD


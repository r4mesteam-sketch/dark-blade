CREATE DATABASE dark_blade_db;
CREATE USER darkblade_user WITH PASSWORD 'darkblade_password';
ALTER ROLE darkblade_user SET client_encoding TO 'utf8';
ALTER ROLE darkblade_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE darkblade_user SET default_transaction_deferrable TO on;
ALTER ROLE darkblade_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE dark_blade_db TO darkblade_user;

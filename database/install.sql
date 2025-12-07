-- =====================================================
-- XHETON MASTER DATABASE INSTALLATION SCRIPT
-- PostgreSQL v12+ required
-- Execute this script to create the complete database
-- =====================================================

-- =====================================================
-- DATABASE CREATION
-- =====================================================

-- Drop database if exists (CAUTION: This will delete all data)
-- DROP DATABASE IF EXISTS xheton_db;

-- Create database
CREATE DATABASE xheton_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE xheton_db IS 'XHETON Sales & Inventory System v0.0.014';

-- Connect to the database
\c xheton_db;

-- =====================================================
-- EXTENSIONS
-- =====================================================

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Full-text search (optional)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate sequential numbers (for document numbers)
CREATE OR REPLACE FUNCTION generate_document_number(prefix TEXT, sequence_name TEXT)
RETURNS TEXT AS $$
DECLARE
    next_id BIGINT;
    padded_id TEXT;
BEGIN
    EXECUTE format('SELECT nextval(%L)', sequence_name) INTO next_id;
    padded_id := LPAD(next_id::TEXT, 6, '0');
    RETURN prefix || '-' || padded_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- IMPORT SCHEMA FILES
-- =====================================================

-- Import core schema (Users, Customers, Products, Inventory, Sales, Procurement)
\i schema_core.sql

-- Import additional modules schema (Accounting, HR, Payroll, Delivery, Projects, etc.)
\i schema_additional.sql

-- Import future modules and landing page schema
\i schema_future_landing.sql

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Automatically update updated_at on all relevant tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END $$;

-- =====================================================
-- SEQUENCES FOR DOCUMENT NUMBERS
-- =====================================================

-- Sales
CREATE SEQUENCE IF NOT EXISTS seq_sales_order START 1;
CREATE SEQUENCE IF NOT EXISTS seq_invoice START 1;
CREATE SEQUENCE IF NOT EXISTS seq_sales_return START 1;

-- Procurement
CREATE SEQUENCE IF NOT EXISTS seq_rfq START 1;
CREATE SEQUENCE IF NOT EXISTS seq_purchase_order START 1;
CREATE SEQUENCE IF NOT EXISTS seq_grn START 1;
CREATE SEQUENCE IF NOT EXISTS seq_supplier_invoice START 1;

-- Inventory
CREATE SEQUENCE IF NOT EXISTS seq_stock_movement START 1;
CREATE SEQUENCE IF NOT EXISTS seq_inventory_adjustment START 1;
CREATE SEQUENCE IF NOT EXISTS seq_inventory_transfer START 1;

-- Accounting
CREATE SEQUENCE IF NOT EXISTS seq_journal_entry START 1;
CREATE SEQUENCE IF NOT EXISTS seq_payment START 1;
CREATE SEQUENCE IF NOT EXISTS seq_expense START 1;

-- Delivery
CREATE SEQUENCE IF NOT EXISTS seq_delivery_order START 1;

-- HR & Payroll
CREATE SEQUENCE IF NOT EXISTS seq_payroll_period START 1;
CREATE SEQUENCE IF NOT EXISTS seq_payslip START 1;

-- Billing
CREATE SEQUENCE IF NOT EXISTS seq_billing_invoice START 1;

-- Projects
CREATE SEQUENCE IF NOT EXISTS seq_project START 1;

-- Documents
CREATE SEQUENCE IF NOT EXISTS seq_document START 1;

-- Others
CREATE SEQUENCE IF NOT EXISTS seq_lead START 1;
CREATE SEQUENCE IF NOT EXISTS seq_work_order START 1;
CREATE SEQUENCE IF NOT EXISTS seq_quality_inspection START 1;
CREATE SEQUENCE IF NOT EXISTS seq_contract START 1;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Already created with table definitions
-- Additional composite indexes can be added here

-- Sales performance indexes
CREATE INDEX IF NOT EXISTS idx_sales_orders_customer_date ON sales_orders(customer_id, order_date DESC);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status_date ON sales_orders(status, order_date DESC);

-- Inventory performance indexes
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_date ON stock_movements(product_id, movement_date DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category_id, is_active);

-- Financial performance indexes
CREATE INDEX IF NOT EXISTS idx_payments_party_date ON payments(party_type, party_id, payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_category_date ON expenses(category_id, expense_date DESC);

-- Audit performance indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created ON audit_logs(user_id, created_at DESC);

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- Product Stock Summary View
CREATE OR REPLACE VIEW vw_product_stock_summary AS
SELECT 
    p.id,
    p.product_code,
    p.product_name,
    p.category_id,
    pc.category_name,
    p.cost_price,
    p.selling_price,
    p.current_stock,
    p.reorder_level,
    CASE 
        WHEN p.current_stock <= p.reorder_level THEN 'Reorder'
        WHEN p.current_stock <= p.min_stock_level THEN 'Low Stock'
        ELSE 'Normal'
    END as stock_status,
    (p.current_stock * p.cost_price) as stock_value_cost,
    (p.current_stock * p.selling_price) as stock_value_selling
FROM products p
LEFT JOIN product_categories pc ON p.category_id = pc.id
WHERE p.deleted_at IS NULL;

-- Customer Balance Summary View
CREATE OR REPLACE VIEW vw_customer_balances AS
SELECT 
    c.id,
    c.customer_code,
    c.customer_name,
    c.credit_limit,
    COALESCE(SUM(so.total_amount), 0) as total_invoiced,
    COALESCE(SUM(so.amount_paid), 0) as total_paid,
    COALESCE(SUM(so.balance_due), 0) as current_balance,
    CASE 
        WHEN COALESCE(SUM(so.balance_due), 0) > c.credit_limit THEN 'Over Limit'
        WHEN COALESCE(SUM(so.balance_due), 0) > (c.credit_limit * 0.8) THEN 'Near Limit'
        ELSE 'Normal'
    END as credit_status
FROM customers c
LEFT JOIN sales_orders so ON c.id = so.customer_id AND so.deleted_at IS NULL
WHERE c.deleted_at IS NULL
GROUP BY c.id, c.customer_code, c.customer_name, c.credit_limit;

-- Supplier Balance Summary View
CREATE OR REPLACE VIEW vw_supplier_balances AS
SELECT 
    s.id,
    s.supplier_code,
    s.supplier_name,
    COALESCE(SUM(si.total_amount), 0) as total_invoiced,
    COALESCE(SUM(si.amount_paid), 0) as total_paid,
    COALESCE(SUM(si.balance_due), 0) as current_balance
FROM suppliers s
LEFT JOIN supplier_invoices si ON s.id = si.supplier_id
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.supplier_code, s.supplier_name;

-- Sales Summary by Period
CREATE OR REPLACE VIEW vw_sales_summary AS
SELECT 
    DATE_TRUNC('month', order_date) as period,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_sales,
    SUM(amount_paid) as total_collected,
    AVG(total_amount) as average_order_value,
    COUNT(DISTINCT customer_id) as unique_customers
FROM sales_orders
WHERE deleted_at IS NULL
GROUP BY DATE_TRUNC('month', order_date);

-- =====================================================
-- DEFAULT DATA INSERTION
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('currency', 'UGX', 'string', 'Default currency', true),
('currency_symbol', 'UGX', 'string', 'Currency symbol', true),
('tax_rate', '18', 'number', 'Default tax rate percentage', false),
('date_format', 'DD/MM/YYYY', 'string', 'Date display format', true),
('items_per_page', '50', 'number', 'Default pagination size', false)
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default roles
INSERT INTO roles (role_name, role_code, description, is_system_role, is_active) VALUES
('Super Admin', 'SUPER_ADMIN', 'Full system access', true, true),
('Admin', 'ADMIN', 'Administrative access', true, true),
('Manager', 'MANAGER', 'Management level access', true, true),
('Sales', 'SALES', 'Sales team access', true, true),
('Warehouse', 'WAREHOUSE', 'Warehouse operations', true, true),
('Accountant', 'ACCOUNTANT', 'Accounting and finance', true, true),
('Viewer', 'VIEWER', 'Read-only access', true, true)
ON CONFLICT (role_code) DO NOTHING;

-- Insert default permissions/modules
INSERT INTO permissions (permission_name, permission_code, module, description) VALUES
('Dashboard', 'DASHBOARD', 'dashboard', 'Dashboard access'),
('Sales Management', 'SALES', 'sales', 'Sales orders and invoices'),
('Customer Management', 'CUSTOMERS', 'customers', 'Customer data management'),
('Purchase Management', 'PURCHASES', 'procurement', 'Purchase orders and suppliers'),
('Inventory Management', 'INVENTORY', 'inventory', 'Product and stock management'),
('Accounting', 'ACCOUNTING', 'accounting', 'Financial accounting'),
('HR & Payroll', 'HR_PAYROLL', 'hr', 'Human resources and payroll'),
('Reports', 'REPORTS', 'analytics', 'Reports and analytics'),
('Settings', 'SETTINGS', 'settings', 'System settings'),
('User Management', 'USERS', 'users', 'User and role management')
ON CONFLICT (permission_code) DO NOTHING;

-- Insert notification categories
INSERT INTO notification_categories (category_code, category_name, icon, color) VALUES
('SYSTEM', 'System', 'Server', 'blue'),
('SALES', 'Sales', 'ShoppingCart', 'green'),
('INVENTORY', 'Inventory', 'Package', 'orange'),
('DELIVERY', 'Deliveries', 'Truck', 'purple'),
('FINANCE', 'Finance', 'DollarSign', 'red'),
('WORKFLOW', 'Workflow', 'Workflow', 'pink'),
('HR', 'Human Resources', 'Users', 'indigo')
ON CONFLICT (category_code) DO NOTHING;

-- Insert leave types
INSERT INTO leave_types (leave_code, leave_name, description, default_days, is_paid) VALUES
('ANNUAL', 'Annual Leave', 'Paid annual vacation leave', 21, true),
('SICK', 'Sick Leave', 'Paid sick leave', 14, true),
('MATERNITY', 'Maternity Leave', 'Maternity leave for mothers', 60, true),
('PATERNITY', 'Paternity Leave', 'Paternity leave for fathers', 4, true),
('UNPAID', 'Unpaid Leave', 'Unpaid leave', 0, false),
('COMPASSIONATE', 'Compassionate Leave', 'Leave due to family emergency', 3, true)
ON CONFLICT (leave_code) DO NOTHING;

-- Insert salary components
INSERT INTO salary_components (component_code, component_name, component_type, calculation_type, is_taxable, is_statutory) VALUES
('BASIC', 'Basic Salary', 'earning', 'fixed', true, false),
('HOUSING', 'Housing Allowance', 'earning', 'fixed', true, false),
('TRANSPORT', 'Transport Allowance', 'earning', 'fixed', true, false),
('PAYE', 'PAYE Tax', 'deduction', 'formula', false, true),
('NSSF', 'NSSF Contribution', 'deduction', 'percentage', false, true),
('LOCAL_SERVICE_TAX', 'Local Service Tax', 'deduction', 'fixed', false, true)
ON CONFLICT (component_code) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (plan_name, plan_code, description, price_monthly, price_annual, max_users, max_branches, max_storage_gb, is_active, is_popular) VALUES
('Starter', 'STARTER', 'Perfect for small businesses', 120000, 1224000, 5, 1, 5, true, false),
('Business', 'BUSINESS', 'For growing companies', 350000, 3570000, 25, 10, 50, true, true),
('Enterprise', 'ENTERPRISE', 'Unlimited power for large organizations', 900000, 9180000, 999, 999, 500, true, false)
ON CONFLICT (plan_code) DO NOTHING;

-- Insert default expense categories
INSERT INTO expense_categories (category_code, category_name, description) VALUES
('RENT', 'Rent', 'Office or warehouse rent'),
('UTILITIES', 'Utilities', 'Electricity, water, internet'),
('SALARIES', 'Salaries & Wages', 'Employee compensation'),
('TRANSPORT', 'Transport', 'Vehicle fuel and maintenance'),
('MARKETING', 'Marketing', 'Advertising and promotion'),
('OFFICE', 'Office Supplies', 'Stationery and office equipment'),
('LEGAL', 'Legal & Professional', 'Legal and consulting fees'),
('MAINTENANCE', 'Maintenance', 'Repairs and maintenance')
ON CONFLICT (category_code) DO NOTHING;

-- Insert default taxes
INSERT INTO taxes (tax_code, tax_name, tax_type, tax_rate, is_compound) VALUES
('VAT18', 'VAT 18%', 'vat', 18.00, false),
('WHT6', 'Withholding Tax 6%', 'withholding_tax', 6.00, false)
ON CONFLICT (tax_code) DO NOTHING;

-- Insert default onboarding steps
INSERT INTO onboarding_steps (step_code, step_name, step_description, step_order, is_required) VALUES
('VERIFY_EMAIL', 'Verify Email', 'Verify your email address', 1, true),
('COMPLETE_PROFILE', 'Complete Profile', 'Fill in your business information', 2, true),
('SELECT_PLAN', 'Select Plan', 'Choose a subscription plan', 3, true),
('SETUP_TEAM', 'Setup Team', 'Invite team members', 4, false),
('IMPORT_DATA', 'Import Data', 'Import your existing data', 5, false)
ON CONFLICT (step_code) DO NOTHING;

-- =====================================================
-- DATABASE HEALTH CHECK
-- =====================================================

-- Table count
SELECT 
    schemaname,
    COUNT(*) as table_count
FROM pg_tables
WHERE schemaname = 'public'
GROUP BY schemaname;

-- Total tables created
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Total views created
SELECT COUNT(*) as total_views FROM information_schema.views WHERE table_schema = 'public';

-- Total sequences created
SELECT COUNT(*) as total_sequences FROM information_schema.sequences WHERE sequence_schema = 'public';

-- =====================================================
-- INSTALLATION COMPLETE
-- =====================================================

SELECT 'XHETON Database v0.0.014 Installation Complete!' as status;
SELECT 'Total Tables: ' || COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
SELECT 'Database ready for use' as message;

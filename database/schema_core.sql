-- =====================================================
-- XHETON SALES & INVENTORY SYSTEM v0.0.014
-- CORE DATABASE SCHEMA - PostgreSQL
-- =====================================================
-- This schema supports all 179 routes across 18+ modules
-- Currency: Uganda Shillings (UGX) throughout
-- Audit fields: created_at, updated_at, deleted_at, created_by, updated_by
-- =====================================================

-- Enable UUID extension for primary keys (optional, can use SERIAL instead)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable soft delete and audit timestamp functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- SECTION 1: CORE SYSTEM TABLES
-- =====================================================

-- System configuration and settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
COMMENT ON TABLE system_settings IS 'Global system configuration including business name, currency, timezone, etc.';

-- Business information
CREATE TABLE business_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    postal_code VARCHAR(20),
    logo_url TEXT,
    currency_code VARCHAR(10) DEFAULT 'UGX',
    currency_symbol VARCHAR(10) DEFAULT 'UGX',
    fiscal_year_start DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE business_info IS 'Main business/company information and settings';

-- Branches/Locations
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_code VARCHAR(50) UNIQUE NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    branch_type VARCHAR(50) DEFAULT 'branch', -- headquarters, branch, warehouse, outlet
    manager_id UUID,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    postal_code VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_branches_code ON branches(branch_code);
CREATE INDEX idx_branches_active ON branches(is_active);
COMMENT ON TABLE branches IS 'Branch/location management for multi-location businesses';

-- =====================================================
-- SECTION 2: USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) UNIQUE NOT NULL,
    role_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_roles_code ON roles(role_code);
COMMENT ON TABLE roles IS 'User roles for access control (Admin, Manager, Sales, Warehouse, etc.)';

-- Permissions/Modules
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    permission_code VARCHAR(50) UNIQUE NOT NULL,
    module VARCHAR(100), -- sales, inventory, accounting, hr, etc.
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permissions_module ON permissions(module);
COMMENT ON TABLE permissions IS 'System permissions/modules for granular access control';

-- Role-Permission mapping (Many-to-Many)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    can_create BOOLEAN DEFAULT false,
    can_read BOOLEAN DEFAULT false,
    can_update BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_export BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);
COMMENT ON TABLE role_permissions IS 'Permission matrix linking roles to modules with CRUD access levels';

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_code VARCHAR(50) UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    role_id UUID REFERENCES roles(id),
    branch_id UUID REFERENCES branches(id),
    department VARCHAR(100),
    position VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_active ON users(is_active);
COMMENT ON TABLE users IS 'System users with authentication and profile information';

-- User Sessions (for audit and security monitoring)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    device_type VARCHAR(50),
    location VARCHAR(255),
    login_at TIMESTAMPTZ DEFAULT NOW(),
    logout_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
COMMENT ON TABLE user_sessions IS 'Active user sessions for security monitoring and session management';

-- =====================================================
-- SECTION 3: SUBSCRIPTION & BILLING MANAGEMENT
-- =====================================================

-- Subscription Plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name VARCHAR(100) UNIQUE NOT NULL,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(15,2) DEFAULT 0, -- UGX
    price_annual DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_annual_percent DECIMAL(5,2) DEFAULT 15.00,
    max_users INTEGER DEFAULT 1,
    max_branches INTEGER DEFAULT 1,
    max_products INTEGER,
    max_storage_gb INTEGER DEFAULT 5,
    max_automations INTEGER,
    features JSONB, -- Array of feature codes
    is_active BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_subscription_plans_code ON subscription_plans(plan_code);
COMMENT ON TABLE subscription_plans IS 'Subscription pricing plans (Starter, Business, Enterprise)';

-- User Subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, expired, cancelled
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- monthly, annual
    amount DECIMAL(15,2) NOT NULL, -- UGX
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    auto_renew BOOLEAN DEFAULT true,
    trial_ends_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_end_date ON user_subscriptions(end_date);
COMMENT ON TABLE user_subscriptions IS 'Active user subscriptions with billing cycle and expiry tracking';

-- Payment Methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    method_type VARCHAR(50) NOT NULL, -- mobile_money, bank_account, card
    provider VARCHAR(100), -- MTN, Airtel, Stanbic, Equity, etc.
    account_number VARCHAR(255), -- Encrypted/Masked
    account_name VARCHAR(255),
    is_default BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(method_type);
COMMENT ON TABLE payment_methods IS 'User payment methods for subscription billing';

-- Invoices (Subscription Billing)
CREATE TABLE billing_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    subscription_id UUID REFERENCES user_subscriptions(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(15,2) DEFAULT 0, -- UGX
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    total_amount DECIMAL(15,2) NOT NULL, -- UGX
    amount_paid DECIMAL(15,2) DEFAULT 0, -- UGX
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    payment_date DATE,
    payment_method_id UUID REFERENCES payment_methods(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_billing_invoices_number ON billing_invoices(invoice_number);
CREATE INDEX idx_billing_invoices_user ON billing_invoices(user_id);
CREATE INDEX idx_billing_invoices_status ON billing_invoices(status);
CREATE INDEX idx_billing_invoices_date ON billing_invoices(invoice_date);
COMMENT ON TABLE billing_invoices IS 'Subscription billing invoices with payment tracking';

-- Invoice Line Items
CREATE TABLE billing_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES billing_invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL, -- UGX
    total DECIMAL(15,2) NOT NULL, -- UGX
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_billing_invoice_items_invoice ON billing_invoice_items(invoice_id);

-- Usage Tracking
CREATE TABLE usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    metric_type VARCHAR(50) NOT NULL, -- users, storage, branches, automations, api_calls
    metric_value DECIMAL(15,2) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_usage_logs_user ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_type ON usage_logs(metric_type);
CREATE INDEX idx_usage_logs_date ON usage_logs(recorded_at);
COMMENT ON TABLE usage_logs IS 'Track resource usage for billing and analytics';

-- =====================================================
-- SECTION 4: CUSTOMERS & SUPPLIERS
-- =====================================================

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50) DEFAULT 'individual', -- individual, business
    company_name VARCHAR(255),
    tax_id VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    website VARCHAR(255),
    billing_address TEXT,
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_country VARCHAR(100) DEFAULT 'Uganda',
    billing_postal_code VARCHAR(20),
    shipping_address TEXT,
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_country VARCHAR(100) DEFAULT 'Uganda',
    shipping_postal_code VARCHAR(20),
    credit_limit DECIMAL(15,2) DEFAULT 0, -- UGX
    current_balance DECIMAL(15,2) DEFAULT 0, -- UGX
    payment_terms INTEGER DEFAULT 30, -- days
    discount_percent DECIMAL(5,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_customers_code ON customers(customer_code);
CREATE INDEX idx_customers_name ON customers(customer_name);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_active ON customers(is_active);
COMMENT ON TABLE customers IS 'Customer master data with billing and credit information';

-- Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    tax_id VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    website VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    postal_code VARCHAR(20),
    payment_terms INTEGER DEFAULT 30, -- days
    credit_limit DECIMAL(15,2) DEFAULT 0, -- UGX
    current_balance DECIMAL(15,2) DEFAULT 0, -- UGX
    rating DECIMAL(3,2) DEFAULT 0, -- 0-5 rating
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX idx_suppliers_name ON suppliers(supplier_name);
CREATE INDEX idx_suppliers_active ON suppliers(is_active);
COMMENT ON TABLE suppliers IS 'Supplier master data with payment and rating information';

-- Supplier Evaluations
CREATE TABLE supplier_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    evaluation_date DATE NOT NULL,
    quality_score DECIMAL(3,2), -- 0-5
    delivery_score DECIMAL(3,2), -- 0-5
    price_score DECIMAL(3,2), -- 0-5
    service_score DECIMAL(3,2), -- 0-5
    overall_score DECIMAL(3,2), -- 0-5
    comments TEXT,
    evaluator_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supplier_evaluations_supplier ON supplier_evaluations(supplier_id);
CREATE INDEX idx_supplier_evaluations_date ON supplier_evaluations(evaluation_date);
COMMENT ON TABLE supplier_evaluations IS 'Supplier performance evaluations and ratings';

-- =====================================================
-- SECTION 5: PRODUCT & INVENTORY MANAGEMENT
-- =====================================================

-- Product Categories
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES product_categories(id),
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_product_categories_code ON product_categories(category_code);
CREATE INDEX idx_product_categories_parent ON product_categories(parent_id);
COMMENT ON TABLE product_categories IS 'Hierarchical product categories';

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    product_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES product_categories(id),
    description TEXT,
    product_type VARCHAR(50) DEFAULT 'physical', -- physical, service, digital
    unit_of_measure VARCHAR(50) DEFAULT 'piece', -- piece, kg, liter, meter, etc.
    cost_price DECIMAL(15,2) DEFAULT 0, -- UGX
    selling_price DECIMAL(15,2) DEFAULT 0, -- UGX
    tax_rate DECIMAL(5,2) DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    current_stock INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_taxable BOOLEAN DEFAULT true,
    track_inventory BOOLEAN DEFAULT true,
    allow_backorder BOOLEAN DEFAULT false,
    image_url TEXT,
    images JSONB, -- Array of image URLs
    attributes JSONB, -- Product attributes (size, color, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_products_code ON products(product_code);
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_name ON products(product_name);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
COMMENT ON TABLE products IS 'Product master data with pricing and inventory settings';

-- Product Price History
CREATE TABLE product_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    price_type VARCHAR(50) NOT NULL, -- cost, selling
    old_price DECIMAL(15,2),
    new_price DECIMAL(15,2) NOT NULL,
    effective_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_product_price_history_product ON product_price_history(product_id);
CREATE INDEX idx_product_price_history_date ON product_price_history(effective_date);
COMMENT ON TABLE product_price_history IS 'Track product price changes over time';

-- Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_code VARCHAR(50) UNIQUE NOT NULL,
    warehouse_name VARCHAR(255) NOT NULL,
    branch_id UUID REFERENCES branches(id),
    warehouse_type VARCHAR(50) DEFAULT 'main', -- main, satellite, distribution, cold_storage
    manager_id UUID REFERENCES users(id),
    address TEXT,
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Uganda',
    postal_code VARCHAR(20),
    capacity DECIMAL(15,2),
    capacity_unit VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_warehouses_code ON warehouses(warehouse_code);
CREATE INDEX idx_warehouses_branch ON warehouses(branch_id);
COMMENT ON TABLE warehouses IS 'Warehouse locations for inventory management';

-- Warehouse Locations (Zones/Aisles)
CREATE TABLE warehouse_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
    location_code VARCHAR(50) NOT NULL,
    location_name VARCHAR(255),
    location_type VARCHAR(50) DEFAULT 'zone', -- zone, aisle, rack, shelf
    parent_id UUID REFERENCES warehouse_locations(id),
    capacity DECIMAL(15,2),
    capacity_unit VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(warehouse_id, location_code)
);

CREATE INDEX idx_warehouse_locations_warehouse ON warehouse_locations(warehouse_id);
CREATE INDEX idx_warehouse_locations_parent ON warehouse_locations(parent_id);
COMMENT ON TABLE warehouse_locations IS 'Hierarchical warehouse location structure (zones, aisles, racks)';

-- Bins (Specific storage locations)
CREATE TABLE bins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bin_code VARCHAR(50) NOT NULL,
    warehouse_location_id UUID NOT NULL REFERENCES warehouse_locations(id) ON DELETE CASCADE,
    bin_type VARCHAR(50) DEFAULT 'standard', -- standard, picking, receiving, quarantine
    capacity DECIMAL(15,2),
    capacity_unit VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(warehouse_location_id, bin_code)
);

CREATE INDEX idx_bins_location ON bins(warehouse_location_id);
COMMENT ON TABLE bins IS 'Specific bin locations within warehouse zones';

-- Product Batches/Lots
CREATE TABLE product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES warehouses(id),
    quantity DECIMAL(15,2) NOT NULL,
    cost_per_unit DECIMAL(15,2) DEFAULT 0, -- UGX
    manufacture_date DATE,
    expiry_date DATE,
    received_date DATE,
    supplier_id UUID REFERENCES suppliers(id),
    status VARCHAR(50) DEFAULT 'active', -- active, quarantine, expired, depleted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_product_batches_number ON product_batches(batch_number);
CREATE INDEX idx_product_batches_product ON product_batches(product_id);
CREATE INDEX idx_product_batches_warehouse ON product_batches(warehouse_id);
CREATE INDEX idx_product_batches_expiry ON product_batches(expiry_date);
COMMENT ON TABLE product_batches IS 'Product batch/lot tracking for expiry and traceability';

-- Stock Movements
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movement_number VARCHAR(50) UNIQUE NOT NULL,
    movement_type VARCHAR(50) NOT NULL, -- receipt, issue, transfer, adjustment, return
    product_id UUID NOT NULL REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    from_warehouse_id UUID REFERENCES warehouses(id),
    to_warehouse_id UUID REFERENCES warehouses(id),
    from_bin_id UUID REFERENCES bins(id),
    to_bin_id UUID REFERENCES bins(id),
    quantity DECIMAL(15,2) NOT NULL,
    unit_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    movement_date TIMESTAMPTZ DEFAULT NOW(),
    reference_type VARCHAR(50), -- sale, purchase, transfer, adjustment
    reference_id UUID, -- ID of related document
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_stock_movements_number ON stock_movements(movement_number);
CREATE INDEX idx_stock_movements_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_from_warehouse ON stock_movements(from_warehouse_id);
CREATE INDEX idx_stock_movements_to_warehouse ON stock_movements(to_warehouse_id);
CREATE INDEX idx_stock_movements_date ON stock_movements(movement_date);
CREATE INDEX idx_stock_movements_type ON stock_movements(movement_type);
COMMENT ON TABLE stock_movements IS 'All inventory movements with full traceability';

-- Inventory Adjustments
CREATE TABLE inventory_adjustments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adjustment_number VARCHAR(50) UNIQUE NOT NULL,
    adjustment_date DATE NOT NULL,
    warehouse_id UUID REFERENCES warehouses(id),
    adjustment_type VARCHAR(50) NOT NULL, -- count, damage, theft, correction
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, cancelled
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_inventory_adjustments_number ON inventory_adjustments(adjustment_number);
CREATE INDEX idx_inventory_adjustments_date ON inventory_adjustments(adjustment_date);
CREATE INDEX idx_inventory_adjustments_warehouse ON inventory_adjustments(warehouse_id);
COMMENT ON TABLE inventory_adjustments IS 'Inventory adjustment headers for stock corrections';

-- Inventory Adjustment Items
CREATE TABLE inventory_adjustment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    adjustment_id UUID NOT NULL REFERENCES inventory_adjustments(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    current_quantity DECIMAL(15,2) NOT NULL,
    adjusted_quantity DECIMAL(15,2) NOT NULL,
    variance DECIMAL(15,2) GENERATED ALWAYS AS (adjusted_quantity - current_quantity) STORED,
    unit_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_adjustment_items_adjustment ON inventory_adjustment_items(adjustment_id);
CREATE INDEX idx_inventory_adjustment_items_product ON inventory_adjustment_items(product_id);

-- Inventory Transfers
CREATE TABLE inventory_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_number VARCHAR(50) UNIQUE NOT NULL,
    transfer_date DATE NOT NULL,
    from_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    to_warehouse_id UUID NOT NULL REFERENCES warehouses(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_transit, received, cancelled
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    shipped_by UUID REFERENCES users(id),
    received_by UUID REFERENCES users(id),
    shipped_at TIMESTAMPTZ,
    received_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_inventory_transfers_number ON inventory_transfers(transfer_number);
CREATE INDEX idx_inventory_transfers_from ON inventory_transfers(from_warehouse_id);
CREATE INDEX idx_inventory_transfers_to ON inventory_transfers(to_warehouse_id);
CREATE INDEX idx_inventory_transfers_status ON inventory_transfers(status);

-- Inventory Transfer Items
CREATE TABLE inventory_transfer_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_id UUID NOT NULL REFERENCES inventory_transfers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    quantity_requested DECIMAL(15,2) NOT NULL,
    quantity_shipped DECIMAL(15,2) DEFAULT 0,
    quantity_received DECIMAL(15,2) DEFAULT 0,
    unit_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_inventory_transfer_items_transfer ON inventory_transfer_items(transfer_id);
CREATE INDEX idx_inventory_transfer_items_product ON inventory_transfer_items(product_id);

-- =====================================================
-- SECTION 6: SALES MANAGEMENT
-- =====================================================

-- Sales Orders/Invoices
CREATE TABLE sales_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_type VARCHAR(50) DEFAULT 'invoice', -- invoice, quote, order, pos
    order_date DATE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id),
    branch_id UUID REFERENCES branches(id),
    warehouse_id UUID REFERENCES warehouses(id),
    salesperson_id UUID REFERENCES users(id),
    subtotal DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    shipping_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    total_amount DECIMAL(15,2) NOT NULL, -- UGX
    amount_paid DECIMAL(15,2) DEFAULT 0, -- UGX
    balance_due DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    status VARCHAR(50) DEFAULT 'draft', -- draft, confirmed, shipped, delivered, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid
    payment_terms INTEGER DEFAULT 30, -- days
    due_date DATE,
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_notes TEXT,
    internal_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sales_orders_number ON sales_orders(order_number);
CREATE INDEX idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_sales_orders_date ON sales_orders(order_date);
CREATE INDEX idx_sales_orders_status ON sales_orders(status);
CREATE INDEX idx_sales_orders_payment_status ON sales_orders(payment_status);
COMMENT ON TABLE sales_orders IS 'Sales orders, invoices, and POS transactions';

-- Sales Order Items
CREATE TABLE sales_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    description TEXT,
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL, -- UGX
    discount_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    line_total DECIMAL(15,2) NOT NULL, -- UGX
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sales_order_items_order ON sales_order_items(order_id);
CREATE INDEX idx_sales_order_items_product ON sales_order_items(product_id);

-- POS Cash Registers
CREATE TABLE pos_cash_registers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    register_code VARCHAR(50) UNIQUE NOT NULL,
    register_name VARCHAR(255) NOT NULL,
    branch_id UUID REFERENCES branches(id),
    assigned_user_id UUID REFERENCES users(id),
    opening_balance DECIMAL(15,2) DEFAULT 0, -- UGX
    closing_balance DECIMAL(15,2) DEFAULT 0, -- UGX
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'closed', -- open, closed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pos_cash_registers_code ON pos_cash_registers(register_code);
CREATE INDEX idx_pos_cash_registers_status ON pos_cash_registers(status);
COMMENT ON TABLE pos_cash_registers IS 'POS cash register sessions';

-- Sales Returns
CREATE TABLE sales_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_number VARCHAR(50) UNIQUE NOT NULL,
    return_date DATE NOT NULL,
    original_order_id UUID REFERENCES sales_orders(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    return_reason VARCHAR(255),
    refund_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    refund_method VARCHAR(50), -- cash, credit_note, exchange
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, refunded, rejected
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_sales_returns_number ON sales_returns(return_number);
CREATE INDEX idx_sales_returns_order ON sales_returns(original_order_id);
CREATE INDEX idx_sales_returns_customer ON sales_returns(customer_id);
COMMENT ON TABLE sales_returns IS 'Sales returns and refunds';

-- Sales Return Items
CREATE TABLE sales_return_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id UUID NOT NULL REFERENCES sales_returns(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    original_item_id UUID REFERENCES sales_order_items(id),
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL, -- UGX
    refund_amount DECIMAL(15,2) NOT NULL, -- UGX
    condition VARCHAR(50), -- new, damaged, defective
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sales_return_items_return ON sales_return_items(return_id);
CREATE INDEX idx_sales_return_items_product ON sales_return_items(product_id);

-- =====================================================
-- SECTION 7: PROCUREMENT & PURCHASING
-- =====================================================

-- Request for Quotations (RFQ)
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    rfq_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_by_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, received, closed
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_rfqs_number ON rfqs(rfq_number);
CREATE INDEX idx_rfqs_status ON rfqs(status);
COMMENT ON TABLE rfqs IS 'Request for Quotations sent to suppliers';

-- RFQ Items
CREATE TABLE rfq_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    description TEXT NOT NULL,
    quantity DECIMAL(15,2) NOT NULL,
    unit_of_measure VARCHAR(50),
    specifications TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rfq_items_rfq ON rfq_items(rfq_id);
CREATE INDEX idx_rfq_items_product ON rfq_items(product_id);

-- RFQ Suppliers (Many-to-Many)
CREATE TABLE rfq_suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES rfqs(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    sent_date DATE,
    response_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, received, declined
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rfq_id, supplier_id)
);

CREATE INDEX idx_rfq_suppliers_rfq ON rfq_suppliers(rfq_id);
CREATE INDEX idx_rfq_suppliers_supplier ON rfq_suppliers(supplier_id);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    branch_id UUID REFERENCES branches(id),
    warehouse_id UUID REFERENCES warehouses(id),
    rfq_id UUID REFERENCES rfqs(id),
    subtotal DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    shipping_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    total_amount DECIMAL(15,2) NOT NULL, -- UGX
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, confirmed, partial, received, cancelled
    payment_terms INTEGER DEFAULT 30, -- days
    expected_delivery_date DATE,
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_purchase_orders_number ON purchase_orders(po_number);
CREATE INDEX idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_date ON purchase_orders(po_date);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
COMMENT ON TABLE purchase_orders IS 'Purchase orders sent to suppliers';

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(15,2) NOT NULL,
    quantity_received DECIMAL(15,2) DEFAULT 0,
    unit_price DECIMAL(15,2) NOT NULL, -- UGX
    discount_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    line_total DECIMAL(15,2) NOT NULL, -- UGX
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_purchase_order_items_po ON purchase_order_items(po_id);
CREATE INDEX idx_purchase_order_items_product ON purchase_order_items(product_id);

-- Goods Received Notes (GRN)
CREATE TABLE goods_received_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    grn_date DATE NOT NULL,
    po_id UUID REFERENCES purchase_orders(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    warehouse_id UUID REFERENCES warehouses(id),
    received_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'draft', -- draft, partial, complete, cancelled
    delivery_note_number VARCHAR(100),
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_goods_received_notes_number ON goods_received_notes(grn_number);
CREATE INDEX idx_goods_received_notes_po ON goods_received_notes(po_id);
CREATE INDEX idx_goods_received_notes_supplier ON goods_received_notes(supplier_id);
COMMENT ON TABLE goods_received_notes IS 'Goods received from suppliers';

-- GRN Items
CREATE TABLE grn_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    grn_id UUID NOT NULL REFERENCES goods_received_notes(id) ON DELETE CASCADE,
    po_item_id UUID REFERENCES purchase_order_items(id),
    product_id UUID NOT NULL REFERENCES products(id),
    batch_number VARCHAR(100),
    quantity_ordered DECIMAL(15,2),
    quantity_received DECIMAL(15,2) NOT NULL,
    quantity_accepted DECIMAL(15,2) DEFAULT 0,
    quantity_rejected DECIMAL(15,2) DEFAULT 0,
    unit_cost DECIMAL(15,2) NOT NULL, -- UGX
    manufacture_date DATE,
    expiry_date DATE,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_grn_items_grn ON grn_items(grn_id);
CREATE INDEX idx_grn_items_product ON grn_items(product_id);

-- Supplier Invoices (Purchase Invoices)
CREATE TABLE supplier_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_invoice_number VARCHAR(100),
    invoice_date DATE NOT NULL,
    due_date DATE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    po_id UUID REFERENCES purchase_orders(id),
    grn_id UUID REFERENCES goods_received_notes(id),
    subtotal DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    total_amount DECIMAL(15,2) NOT NULL, -- UGX
    amount_paid DECIMAL(15,2) DEFAULT 0, -- UGX
    balance_due DECIMAL(15,2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, overdue, cancelled
    payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_supplier_invoices_number ON supplier_invoices(invoice_number);
CREATE INDEX idx_supplier_invoices_supplier ON supplier_invoices(supplier_id);
CREATE INDEX idx_supplier_invoices_date ON supplier_invoices(invoice_date);
CREATE INDEX idx_supplier_invoices_status ON supplier_invoices(status);
COMMENT ON TABLE supplier_invoices IS 'Invoices received from suppliers';

-- Supplier Invoice Items
CREATE TABLE supplier_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES supplier_invoices(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    description TEXT,
    quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL, -- UGX
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    line_total DECIMAL(15,2) NOT NULL, -- UGX
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_supplier_invoice_items_invoice ON supplier_invoice_items(invoice_id);
CREATE INDEX idx_supplier_invoice_items_product ON supplier_invoice_items(product_id);

-- Continue in next file...

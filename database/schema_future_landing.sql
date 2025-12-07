-- =====================================================
-- XHETON FUTURE MODULES & LANDING PAGE SCHEMA
-- Manufacturing, Quality Control, Assets, Landing CMS
-- =====================================================

-- =====================================================
-- SECTION 17: FUTURE MODULE SCAFFOLDS
-- =====================================================

-- ============ MANUFACTURING & PRODUCTION ============

-- Bill of Materials (BOM)
CREATE TABLE bom_headers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    bom_name VARCHAR(255) NOT NULL,
    bom_type VARCHAR(50) DEFAULT 'manufacturing', -- manufacturing, assembly, kit
    quantity DECIMAL(15,2) DEFAULT 1,
    unit_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    is_active BOOLEAN DEFAULT true,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_bom_headers_code ON bom_headers(bom_code);
CREATE INDEX idx_bom_headers_product ON bom_headers(product_id);
COMMENT ON TABLE bom_headers IS 'Bill of Materials for manufactured products';

-- BOM Items/Components
CREATE TABLE bom_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_id UUID NOT NULL REFERENCES bom_headers(id) ON DELETE CASCADE,
    component_product_id UUID NOT NULL REFERENCES products(id),
    quantity DECIMAL(15,2) NOT NULL,
    unit_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    scrap_percent DECIMAL(5,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bom_items_bom ON bom_items(bom_id);
CREATE INDEX idx_bom_items_component ON bom_items(component_product_id);

-- Work Orders
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_number VARCHAR(50) UNIQUE NOT NULL,
    work_order_date DATE NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id),
    bom_id UUID REFERENCES bom_headers(id),
    quantity_planned DECIMAL(15,2) NOT NULL,
    quantity_produced DECIMAL(15,2) DEFAULT 0,
    warehouse_id UUID REFERENCES warehouses(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, released, in_progress, completed, cancelled
    priority VARCHAR(50) DEFAULT 'medium',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_work_orders_number ON work_orders(work_order_number);
CREATE INDEX idx_work_orders_product ON work_orders(product_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
COMMENT ON TABLE work_orders IS 'Manufacturing work orders';

-- Machines/Equipment
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_code VARCHAR(50) UNIQUE NOT NULL,
    machine_name VARCHAR(255) NOT NULL,
    machine_type VARCHAR(100),
    manufacturer VARCHAR(255),
    model_number VARCHAR(100),
    serial_number VARCHAR(100),
    warehouse_id UUID REFERENCES warehouses(id),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2), -- UGX
    maintenance_interval INTEGER, -- days
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    status VARCHAR(50) DEFAULT 'operational', -- operational, maintenance, breakdown, retired
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_machines_code ON machines(machine_code);
COMMENT ON TABLE machines IS 'Manufacturing machines and equipment';

-- ============ QUALITY CONTROL ============

-- Quality Inspections
CREATE TABLE quality_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_number VARCHAR(50) UNIQUE NOT NULL,
    inspection_date DATE NOT NULL,
    inspection_type VARCHAR(50) NOT NULL, -- incoming, in_process, outgoing
    reference_type VARCHAR(50), -- grn, work_order, sales_order
    reference_id UUID,
    product_id UUID REFERENCES products(id),
    batch_id UUID REFERENCES product_batches(id),
    inspector_id UUID REFERENCES users(id),
    quantity_inspected DECIMAL(15,2) NOT NULL,
    quantity_passed DECIMAL(15,2) DEFAULT 0,
    quantity_failed DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- pending, passed, failed, partial
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quality_inspections_number ON quality_inspections(inspection_number);
CREATE INDEX idx_quality_inspections_reference ON quality_inspections(reference_type, reference_id);
COMMENT ON TABLE quality_inspections IS 'Quality control inspections';

-- Quality Defects
CREATE TABLE quality_defects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inspection_id UUID NOT NULL REFERENCES quality_inspections(id),
    defect_type VARCHAR(100) NOT NULL,
    defect_description TEXT,
    severity VARCHAR(50) DEFAULT 'medium', -- minor, medium, major, critical
    quantity_affected DECIMAL(15,2),
    action_taken TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quality_defects_inspection ON quality_defects(inspection_id);

-- ============ ASSET MANAGEMENT ============

-- Asset Categories
CREATE TABLE asset_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    depreciation_method VARCHAR(50), -- straight_line, declining_balance, units_of_production
    useful_life_years INTEGER,
    salvage_value_percent DECIMAL(5,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE asset_categories IS 'Fixed asset categories';

-- Fixed Assets
CREATE TABLE fixed_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES asset_categories(id),
    description TEXT,
    supplier_id UUID REFERENCES suppliers(id),
    purchase_date DATE,
    purchase_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    salvage_value DECIMAL(15,2) DEFAULT 0, -- UGX
    useful_life_years INTEGER,
    depreciation_method VARCHAR(50),
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0, -- UGX
    book_value DECIMAL(15,2) GENERATED ALWAYS AS (purchase_cost - accumulated_depreciation) STORED,
    location VARCHAR(255),
    custodian_id UUID REFERENCES users(id),
    serial_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, disposed, under_maintenance
    disposal_date DATE,
    disposal_amount DECIMAL(15,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_fixed_assets_code ON fixed_assets(asset_code);
CREATE INDEX idx_fixed_assets_category ON fixed_assets(category_id);
COMMENT ON TABLE fixed_assets IS 'Fixed asset register';

-- Asset Depreciation
CREATE TABLE asset_depreciation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES fixed_assets(id),
    period_date DATE NOT NULL,
    depreciation_amount DECIMAL(15,2) NOT NULL, -- UGX
    accumulated_depreciation DECIMAL(15,2) NOT NULL, -- UGX
    book_value DECIMAL(15,2) NOT NULL, -- UGX
    journal_entry_id UUID REFERENCES journal_entries(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_asset_depreciation_asset ON asset_depreciation(asset_id);

-- Asset Maintenance
CREATE TABLE asset_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES fixed_assets(id),
    maintenance_date DATE NOT NULL,
    maintenance_type VARCHAR(50), -- preventive, corrective, emergency
    description TEXT,
    cost DECIMAL(15,2) DEFAULT 0, -- UGX
    performed_by VARCHAR(255),
    next_maintenance_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_asset_maintenance_asset ON asset_maintenance(asset_id);

-- Asset Transfers
CREATE TABLE asset_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES fixed_assets(id),
    transfer_date DATE NOT NULL,
    from_location VARCHAR(255),
    to_location VARCHAR(255),
    from_custodian_id UUID REFERENCES users(id),
    to_custodian_id UUID REFERENCES users(id),
    reason TEXT,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_asset_transfers_asset ON asset_transfers(asset_id);

-- ============ ADVANCED FEATURES ============

-- Multi-Currency
CREATE TABLE currencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_code VARCHAR(10) UNIQUE NOT NULL,
    currency_name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    exchange_rate DECIMAL(15,6) DEFAULT 1.000000, -- Rate to UGX
    is_base_currency BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE currencies IS 'Multi-currency support (future)';

-- Exchange Rates History
CREATE TABLE exchange_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    currency_id UUID NOT NULL REFERENCES currencies(id),
    rate_date DATE NOT NULL,
    exchange_rate DECIMAL(15,6) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(currency_id, rate_date)
);

CREATE INDEX idx_exchange_rates_currency ON exchange_rates(currency_id);

-- Customer Loyalty/Rewards
CREATE TABLE loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_code VARCHAR(50) UNIQUE NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    description TEXT,
    points_per_ugx DECIMAL(10,4) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE loyalty_programs IS 'Customer loyalty and rewards programs (future)';

-- Loyalty Points
CREATE TABLE customer_loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id),
    program_id UUID NOT NULL REFERENCES loyalty_programs(id),
    points_earned DECIMAL(15,2) DEFAULT 0,
    points_redeemed DECIMAL(15,2) DEFAULT 0,
    points_balance DECIMAL(15,2) GENERATED ALWAYS AS (points_earned - points_redeemed) STORED,
    tier_level VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_loyalty_points_customer ON customer_loyalty_points(customer_id);

-- IoT/Warehouse Automation
CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_code VARCHAR(50) UNIQUE NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    device_type VARCHAR(100), -- rfid_reader, barcode_scanner, sensor, camera
    warehouse_id UUID REFERENCES warehouses(id),
    location VARCHAR(255),
    ip_address VARCHAR(50),
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, maintenance
    last_heartbeat TIMESTAMPTZ,
    firmware_version VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE iot_devices IS 'IoT devices for warehouse automation (future)';

-- Contracts Management
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_type VARCHAR(50) NOT NULL, -- customer, supplier, employee, service
    party_type VARCHAR(50), -- customer, supplier
    party_id UUID,
    contract_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    contract_value DECIMAL(15,2), -- UGX
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, expired, terminated
    renewal_terms TEXT,
    termination_terms TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

COMMENT ON TABLE contracts IS 'Contract management (future)';

-- =====================================================
-- SECTION 18: LANDING PAGE CMS TABLES
-- =====================================================

-- Site Settings
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255) DEFAULT 'XHETON',
    site_tagline TEXT,
    site_description TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    primary_color VARCHAR(50) DEFAULT '#3B82F6',
    secondary_color VARCHAR(50) DEFAULT '#10B981',
    accent_color VARCHAR(50) DEFAULT '#F59E0B',
    font_family VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    social_facebook VARCHAR(255),
    social_twitter VARCHAR(255),
    social_linkedin VARCHAR(255),
    social_instagram VARCHAR(255),
    google_analytics_id VARCHAR(100),
    meta_keywords TEXT,
    meta_description TEXT,
    maintenance_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE site_settings IS 'Landing page site-wide settings';

-- Landing Pages
CREATE TABLE landing_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_code VARCHAR(50) UNIQUE NOT NULL,
    page_name VARCHAR(255) NOT NULL,
    page_title VARCHAR(255),
    page_slug VARCHAR(255) UNIQUE NOT NULL,
    meta_description TEXT,
    meta_keywords TEXT,
    is_published BOOLEAN DEFAULT false,
    is_homepage BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_landing_pages_slug ON landing_pages(page_slug);
COMMENT ON TABLE landing_pages IS 'Landing page management';

-- Page Sections
CREATE TABLE page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    section_code VARCHAR(50) NOT NULL,
    section_type VARCHAR(50) NOT NULL, -- hero, features, pricing, testimonials, cta, faq, about
    section_title VARCHAR(255),
    section_subtitle TEXT,
    content JSONB, -- Flexible content storage
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    background_color VARCHAR(50),
    background_image VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_sections_page ON page_sections(page_id);
COMMENT ON TABLE page_sections IS 'Page sections with flexible content';

-- Hero Sections
CREATE TABLE hero_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID NOT NULL REFERENCES landing_pages(id),
    headline TEXT NOT NULL,
    subheadline TEXT,
    description TEXT,
    primary_cta_text VARCHAR(100),
    primary_cta_url VARCHAR(255),
    secondary_cta_text VARCHAR(100),
    secondary_cta_url VARCHAR(255),
    hero_image_url TEXT,
    background_video_url TEXT,
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_hero_sections_page ON hero_sections(page_id);
COMMENT ON TABLE hero_sections IS 'Hero section content management';

-- Features
CREATE TABLE features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_id UUID REFERENCES landing_pages(id),
    feature_title VARCHAR(255) NOT NULL,
    feature_description TEXT,
    icon VARCHAR(100), -- Icon name or SVG
    image_url TEXT,
    link_url VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_features_page ON features(page_id);
COMMENT ON TABLE features IS 'Feature highlights for landing pages';

-- Pricing Plans (Landing Page)
CREATE TABLE landing_pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_name VARCHAR(100) NOT NULL,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(15,2) DEFAULT 0, -- UGX
    price_annual DECIMAL(15,2) DEFAULT 0, -- UGX
    discount_label VARCHAR(100), -- "Save 15%", "Most Popular"
    features JSONB, -- Array of feature strings
    highlight_features JSONB, -- Features to highlight
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    cta_text VARCHAR(100) DEFAULT 'Get Started',
    cta_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_landing_pricing_plans_code ON landing_pricing_plans(plan_code);
COMMENT ON TABLE landing_pricing_plans IS 'Pricing plans displayed on landing page';

-- Testimonials
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_position VARCHAR(255),
    customer_company VARCHAR(255),
    customer_photo_url TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE testimonials IS 'Customer testimonials for landing pages';

-- Call-to-Action Banners
CREATE TABLE cta_banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    banner_code VARCHAR(50) UNIQUE NOT NULL,
    headline VARCHAR(255) NOT NULL,
    subheadline TEXT,
    button_text VARCHAR(100) NOT NULL,
    button_url VARCHAR(255) NOT NULL,
    background_color VARCHAR(50),
    text_color VARCHAR(50),
    placement VARCHAR(50) DEFAULT 'top', -- top, middle, bottom, popup
    is_active BOOLEAN DEFAULT true,
    display_from TIMESTAMPTZ,
    display_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE cta_banners IS 'Call-to-action banners and ribbons';

-- FAQ Items
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(100),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE faqs IS 'Frequently asked questions';

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    source VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255)
);

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter email subscribers';

-- Contact Form Submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    source_page VARCHAR(255),
    ip_address VARCHAR(50),
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, resolved, spam
    assigned_to UUID REFERENCES users(id),
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
COMMENT ON TABLE contact_submissions IS 'Contact form submissions from landing page';

-- Demo Requests
CREATE TABLE demo_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    preferred_date TIMESTAMPTZ,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, scheduled, completed, cancelled
    scheduled_at TIMESTAMPTZ,
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_demo_requests_status ON demo_requests(status);
COMMENT ON TABLE demo_requests IS 'Product demo requests';

-- Signup Flow Tracking
CREATE TABLE signup_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    email VARCHAR(255) NOT NULL,
    signup_step VARCHAR(50) NOT NULL, -- started, email_verified, profile_completed, plan_selected, onboarding_completed
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER DEFAULT 5,
    completion_percent INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_signup_tracking_user ON signup_tracking(user_id);
CREATE INDEX idx_signup_tracking_email ON signup_tracking(email);
COMMENT ON TABLE signup_tracking IS 'Track user signup and onboarding progress';

-- Onboarding Steps
CREATE TABLE onboarding_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_code VARCHAR(50) UNIQUE NOT NULL,
    step_name VARCHAR(255) NOT NULL,
    step_description TEXT,
    step_order INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE onboarding_steps IS 'Define onboarding steps for new users';

-- User Onboarding Progress
CREATE TABLE user_onboarding_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    step_id UUID NOT NULL REFERENCES onboarding_steps(id),
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    skipped BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, step_id)
);

CREATE INDEX idx_user_onboarding_progress_user ON user_onboarding_progress(user_id);

-- =====================================================
-- END OF FUTURE MODULES & LANDING PAGE SCHEMA
-- =====================================================

--
-- PostgreSQL database dump
--

\restrict ipsZe3GJQGcrox2RsyiYijM3DYDGRMirMsNp4pg9UaGV6bqMoTnV9WjgTrzqSMd

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: generate_document_number(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_document_number(prefix text, sequence_name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    next_id BIGINT;
    padded_id TEXT;
BEGIN
    EXECUTE format('SELECT nextval(%L)', sequence_name) INTO next_id;
    padded_id := LPAD(next_id::TEXT, 6, '0');
    RETURN prefix || '-' || padded_id;
END;
$$;


ALTER FUNCTION public.generate_document_number(prefix text, sequence_name text) OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: asset_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_code character varying(50) NOT NULL,
    category_name character varying(255) NOT NULL,
    depreciation_method character varying(50),
    useful_life_years integer,
    salvage_value_percent numeric(5,2),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asset_categories OWNER TO postgres;

--
-- Name: TABLE asset_categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.asset_categories IS 'Fixed asset categories';


--
-- Name: asset_depreciation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_depreciation (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_id uuid NOT NULL,
    period_date date NOT NULL,
    depreciation_amount numeric(15,2) NOT NULL,
    accumulated_depreciation numeric(15,2) NOT NULL,
    book_value numeric(15,2) NOT NULL,
    journal_entry_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asset_depreciation OWNER TO postgres;

--
-- Name: asset_maintenance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_maintenance (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_id uuid NOT NULL,
    maintenance_date date NOT NULL,
    maintenance_type character varying(50),
    description text,
    cost numeric(15,2) DEFAULT 0,
    performed_by character varying(255),
    next_maintenance_date date,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.asset_maintenance OWNER TO postgres;

--
-- Name: asset_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asset_transfers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_id uuid NOT NULL,
    transfer_date date NOT NULL,
    from_location character varying(255),
    to_location character varying(255),
    from_custodian_id uuid,
    to_custodian_id uuid,
    reason text,
    approved_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.asset_transfers OWNER TO postgres;

--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attendance_records (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_id uuid NOT NULL,
    attendance_date date NOT NULL,
    clock_in timestamp with time zone,
    clock_out timestamp with time zone,
    total_hours numeric(5,2),
    status character varying(50) DEFAULT 'present'::character varying,
    location character varying(255),
    ip_address character varying(50),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.attendance_records OWNER TO postgres;

--
-- Name: TABLE attendance_records; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.attendance_records IS 'Employee attendance tracking';


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    action character varying(100) NOT NULL,
    entity_type character varying(100),
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(50),
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: TABLE audit_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.audit_logs IS 'Complete audit trail of all system activities';


--
-- Name: bank_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    account_code character varying(50) NOT NULL,
    account_name character varying(255) NOT NULL,
    account_type character varying(50) DEFAULT 'bank'::character varying,
    bank_name character varying(255),
    account_number character varying(100),
    branch_name character varying(255),
    currency_code character varying(10) DEFAULT 'UGX'::character varying,
    current_balance numeric(15,2) DEFAULT 0,
    opening_balance numeric(15,2) DEFAULT 0,
    opening_balance_date date,
    gl_account_id uuid,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.bank_accounts OWNER TO postgres;

--
-- Name: TABLE bank_accounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.bank_accounts IS 'Bank and cash account management';


--
-- Name: billing_invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_invoice_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    description text NOT NULL,
    quantity numeric(10,2) DEFAULT 1,
    unit_price numeric(15,2) NOT NULL,
    total numeric(15,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.billing_invoice_items OWNER TO postgres;

--
-- Name: billing_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing_invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_number character varying(50) NOT NULL,
    user_id uuid NOT NULL,
    subscription_id uuid,
    invoice_date date NOT NULL,
    due_date date NOT NULL,
    subtotal numeric(15,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    discount_amount numeric(15,2) DEFAULT 0,
    total_amount numeric(15,2) NOT NULL,
    amount_paid numeric(15,2) DEFAULT 0,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_date date,
    payment_method_id uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.billing_invoices OWNER TO postgres;

--
-- Name: TABLE billing_invoices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.billing_invoices IS 'Subscription billing invoices with payment tracking';


--
-- Name: bins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bins (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    bin_code character varying(50) NOT NULL,
    warehouse_location_id uuid NOT NULL,
    bin_type character varying(50) DEFAULT 'standard'::character varying,
    capacity numeric(15,2),
    capacity_unit character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bins OWNER TO postgres;

--
-- Name: TABLE bins; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.bins IS 'Specific bin locations within warehouse zones';


--
-- Name: bom_headers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bom_headers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    bom_code character varying(50) NOT NULL,
    product_id uuid NOT NULL,
    bom_name character varying(255) NOT NULL,
    bom_type character varying(50) DEFAULT 'manufacturing'::character varying,
    quantity numeric(15,2) DEFAULT 1,
    unit_cost numeric(15,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    effective_from date,
    effective_to date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.bom_headers OWNER TO postgres;

--
-- Name: TABLE bom_headers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.bom_headers IS 'Bill of Materials for manufactured products';


--
-- Name: bom_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bom_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    bom_id uuid NOT NULL,
    component_product_id uuid NOT NULL,
    quantity numeric(15,2) NOT NULL,
    unit_cost numeric(15,2) DEFAULT 0,
    scrap_percent numeric(5,2) DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bom_items OWNER TO postgres;

--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    branch_code character varying(50) NOT NULL,
    branch_name character varying(255) NOT NULL,
    branch_type character varying(50) DEFAULT 'branch'::character varying,
    manager_id uuid,
    email character varying(255),
    phone character varying(50),
    address text,
    city character varying(100),
    state_province character varying(100),
    country character varying(100) DEFAULT 'Uganda'::character varying,
    postal_code character varying(20),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: TABLE branches; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.branches IS 'Branch/location management for multi-location businesses';


--
-- Name: budget_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budget_lines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    budget_id uuid NOT NULL,
    account_id uuid,
    category_id uuid,
    description text,
    budgeted_amount numeric(15,2) NOT NULL,
    actual_amount numeric(15,2) DEFAULT 0,
    variance numeric(15,2) GENERATED ALWAYS AS ((budgeted_amount - actual_amount)) STORED,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.budget_lines OWNER TO postgres;

--
-- Name: budgets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.budgets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    budget_code character varying(50) NOT NULL,
    budget_name character varying(255) NOT NULL,
    budget_type character varying(50) DEFAULT 'annual'::character varying,
    fiscal_year integer,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_amount numeric(15,2) DEFAULT 0,
    status character varying(50) DEFAULT 'draft'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.budgets OWNER TO postgres;

--
-- Name: TABLE budgets; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.budgets IS 'Budget planning and management';


--
-- Name: business_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.business_info (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    business_name character varying(255) NOT NULL,
    business_type character varying(100),
    registration_number character varying(100),
    tax_id character varying(100),
    email character varying(255),
    phone character varying(50),
    website character varying(255),
    address text,
    city character varying(100),
    state_province character varying(100),
    country character varying(100) DEFAULT 'Uganda'::character varying,
    postal_code character varying(20),
    logo_url text,
    currency_code character varying(10) DEFAULT 'UGX'::character varying,
    currency_symbol character varying(10) DEFAULT 'UGX'::character varying,
    fiscal_year_start date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.business_info OWNER TO postgres;

--
-- Name: TABLE business_info; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.business_info IS 'Main business/company information and settings';


--
-- Name: chart_of_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chart_of_accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    account_code character varying(50) NOT NULL,
    account_name character varying(255) NOT NULL,
    account_type character varying(50) NOT NULL,
    account_category character varying(100),
    parent_id uuid,
    currency_code character varying(10) DEFAULT 'UGX'::character varying,
    balance numeric(15,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    is_system_account boolean DEFAULT false,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.chart_of_accounts OWNER TO postgres;

--
-- Name: TABLE chart_of_accounts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.chart_of_accounts IS 'General ledger chart of accounts';


--
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    company character varying(255),
    subject character varying(255),
    message text NOT NULL,
    source_page character varying(255),
    ip_address character varying(50),
    status character varying(50) DEFAULT 'new'::character varying,
    assigned_to uuid,
    responded_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- Name: TABLE contact_submissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contact_submissions IS 'Contact form submissions from landing page';


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    contract_number character varying(50) NOT NULL,
    contract_type character varying(50) NOT NULL,
    party_type character varying(50),
    party_id uuid,
    contract_name character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date,
    contract_value numeric(15,2),
    status character varying(50) DEFAULT 'draft'::character varying,
    renewal_terms text,
    termination_terms text,
    file_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: TABLE contracts; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.contracts IS 'Contract management (future)';


--
-- Name: crm_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crm_activities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    activity_type character varying(50) NOT NULL,
    subject character varying(255) NOT NULL,
    description text,
    related_to_type character varying(50),
    related_to_id uuid,
    assigned_to uuid,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    status character varying(50) DEFAULT 'pending'::character varying,
    priority character varying(50) DEFAULT 'medium'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.crm_activities OWNER TO postgres;

--
-- Name: cta_banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cta_banners (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    banner_code character varying(50) NOT NULL,
    headline character varying(255) NOT NULL,
    subheadline text,
    button_text character varying(100) NOT NULL,
    button_url character varying(255) NOT NULL,
    background_color character varying(50),
    text_color character varying(50),
    placement character varying(50) DEFAULT 'top'::character varying,
    is_active boolean DEFAULT true,
    display_from timestamp with time zone,
    display_until timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.cta_banners OWNER TO postgres;

--
-- Name: TABLE cta_banners; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.cta_banners IS 'Call-to-action banners and ribbons';


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.currencies (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    currency_code character varying(10) NOT NULL,
    currency_name character varying(100) NOT NULL,
    symbol character varying(10),
    exchange_rate numeric(15,6) DEFAULT 1.000000,
    is_base_currency boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- Name: TABLE currencies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.currencies IS 'Multi-currency support (future)';


--
-- Name: customer_loyalty_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_loyalty_points (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_id uuid NOT NULL,
    program_id uuid NOT NULL,
    points_earned numeric(15,2) DEFAULT 0,
    points_redeemed numeric(15,2) DEFAULT 0,
    points_balance numeric(15,2) GENERATED ALWAYS AS ((points_earned - points_redeemed)) STORED,
    tier_level character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.customer_loyalty_points OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_code character varying(50) NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_type character varying(50) DEFAULT 'individual'::character varying,
    company_name character varying(255),
    tax_id character varying(100),
    email character varying(255),
    phone character varying(50),
    mobile character varying(50),
    website character varying(255),
    billing_address text,
    billing_city character varying(100),
    billing_state character varying(100),
    billing_country character varying(100) DEFAULT 'Uganda'::character varying,
    billing_postal_code character varying(20),
    shipping_address text,
    shipping_city character varying(100),
    shipping_state character varying(100),
    shipping_country character varying(100) DEFAULT 'Uganda'::character varying,
    shipping_postal_code character varying(20),
    credit_limit numeric(15,2) DEFAULT 0,
    current_balance numeric(15,2) DEFAULT 0,
    payment_terms integer DEFAULT 30,
    discount_percent numeric(5,2) DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: TABLE customers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.customers IS 'Customer master data with billing and credit information';


--
-- Name: delivery_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    delivery_id uuid NOT NULL,
    sales_order_item_id uuid,
    product_id uuid NOT NULL,
    quantity_ordered numeric(15,2) NOT NULL,
    quantity_delivered numeric(15,2) DEFAULT 0,
    quantity_rejected numeric(15,2) DEFAULT 0,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.delivery_order_items OWNER TO postgres;

--
-- Name: delivery_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    delivery_number character varying(50) NOT NULL,
    delivery_date date NOT NULL,
    sales_order_id uuid,
    customer_id uuid NOT NULL,
    warehouse_id uuid,
    delivery_address text,
    delivery_city character varying(100),
    delivery_contact_name character varying(255),
    delivery_contact_phone character varying(50),
    driver_id uuid,
    vehicle_number character varying(50),
    status character varying(50) DEFAULT 'pending'::character varying,
    scheduled_time timestamp with time zone,
    dispatched_time timestamp with time zone,
    delivered_time timestamp with time zone,
    delivery_notes text,
    signature_url text,
    photo_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.delivery_orders OWNER TO postgres;

--
-- Name: TABLE delivery_orders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.delivery_orders IS 'Delivery order management and tracking';


--
-- Name: delivery_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_tracking (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    delivery_id uuid NOT NULL,
    status character varying(50) NOT NULL,
    location character varying(255),
    latitude numeric(10,8),
    longitude numeric(11,8),
    notes text,
    recorded_at timestamp with time zone DEFAULT now(),
    recorded_by uuid
);


ALTER TABLE public.delivery_tracking OWNER TO postgres;

--
-- Name: TABLE delivery_tracking; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.delivery_tracking IS 'Real-time delivery status tracking';


--
-- Name: demo_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demo_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    company_name character varying(255),
    company_size character varying(50),
    industry character varying(100),
    preferred_date timestamp with time zone,
    message text,
    status character varying(50) DEFAULT 'pending'::character varying,
    scheduled_at timestamp with time zone,
    assigned_to uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.demo_requests OWNER TO postgres;

--
-- Name: TABLE demo_requests; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.demo_requests IS 'Product demo requests';


--
-- Name: document_audit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_audit (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    action character varying(50) NOT NULL,
    user_id uuid,
    ip_address character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.document_audit OWNER TO postgres;

--
-- Name: document_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_code character varying(50) NOT NULL,
    category_name character varying(255) NOT NULL,
    parent_id uuid,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.document_categories OWNER TO postgres;

--
-- Name: document_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.document_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_id uuid NOT NULL,
    permission_type character varying(50) NOT NULL,
    permission_id uuid NOT NULL,
    can_view boolean DEFAULT true,
    can_edit boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    can_share boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.document_permissions OWNER TO postgres;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    document_number character varying(50) NOT NULL,
    document_name character varying(255) NOT NULL,
    category_id uuid,
    file_url text NOT NULL,
    file_name character varying(255) NOT NULL,
    file_size integer,
    file_type character varying(100),
    mime_type character varying(100),
    version character varying(50) DEFAULT '1.0'::character varying,
    related_to_type character varying(50),
    related_to_id uuid,
    is_public boolean DEFAULT false,
    uploaded_by uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.documents OWNER TO postgres;

--
-- Name: TABLE documents; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.documents IS 'Document library and file management';


--
-- Name: employee_salary_structures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_salary_structures (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_id uuid NOT NULL,
    component_id uuid NOT NULL,
    amount numeric(15,2) DEFAULT 0,
    percentage numeric(5,2),
    effective_from date NOT NULL,
    effective_to date,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.employee_salary_structures OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    employee_number character varying(50) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    middle_name character varying(100),
    date_of_birth date,
    gender character varying(20),
    marital_status character varying(50),
    nationality character varying(100) DEFAULT 'Ugandan'::character varying,
    national_id character varying(100),
    passport_number character varying(100),
    tax_id character varying(100),
    phone character varying(50),
    email character varying(255),
    emergency_contact_name character varying(255),
    emergency_contact_phone character varying(50),
    address text,
    city character varying(100),
    branch_id uuid,
    department character varying(100),
    "position" character varying(100),
    employment_type character varying(50) DEFAULT 'full_time'::character varying,
    employment_status character varying(50) DEFAULT 'active'::character varying,
    hire_date date,
    probation_end_date date,
    termination_date date,
    termination_reason text,
    basic_salary numeric(15,2) DEFAULT 0,
    bank_account_name character varying(255),
    bank_account_number character varying(100),
    bank_name character varying(255),
    photo_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: TABLE employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employees IS 'Employee master data and HR information';


--
-- Name: error_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.error_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    error_type character varying(100) NOT NULL,
    error_code character varying(50),
    error_message text NOT NULL,
    stack_trace text,
    module character varying(100),
    user_id uuid,
    url text,
    http_method character varying(10),
    request_body text,
    ip_address character varying(50),
    severity character varying(50) DEFAULT 'error'::character varying,
    is_resolved boolean DEFAULT false,
    resolved_at timestamp with time zone,
    resolved_by uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.error_logs OWNER TO postgres;

--
-- Name: TABLE error_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.error_logs IS 'Application error tracking and monitoring';


--
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exchange_rates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    currency_id uuid NOT NULL,
    rate_date date NOT NULL,
    exchange_rate numeric(15,6) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_code character varying(50) NOT NULL,
    category_name character varying(255) NOT NULL,
    parent_id uuid,
    gl_account_id uuid,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- Name: TABLE expense_categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.expense_categories IS 'Expense categories for business expenses';


--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    expense_number character varying(50) NOT NULL,
    expense_date date NOT NULL,
    category_id uuid,
    supplier_id uuid,
    branch_id uuid,
    description text NOT NULL,
    amount numeric(15,2) NOT NULL,
    tax_amount numeric(15,2) DEFAULT 0,
    total_amount numeric(15,2) NOT NULL,
    payment_method character varying(50),
    bank_account_id uuid,
    reference_number character varying(100),
    receipt_url text,
    status character varying(50) DEFAULT 'pending'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    paid_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: TABLE expenses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.expenses IS 'Business expense tracking and management';


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faqs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category character varying(100),
    question text NOT NULL,
    answer text NOT NULL,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: TABLE faqs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.faqs IS 'Frequently asked questions';


--
-- Name: features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.features (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    page_id uuid,
    feature_title character varying(255) NOT NULL,
    feature_description text,
    icon character varying(100),
    image_url text,
    link_url character varying(255),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.features OWNER TO postgres;

--
-- Name: TABLE features; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.features IS 'Feature highlights for landing pages';


--
-- Name: fixed_assets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fixed_assets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    asset_code character varying(50) NOT NULL,
    asset_name character varying(255) NOT NULL,
    category_id uuid,
    description text,
    supplier_id uuid,
    purchase_date date,
    purchase_cost numeric(15,2) DEFAULT 0,
    salvage_value numeric(15,2) DEFAULT 0,
    useful_life_years integer,
    depreciation_method character varying(50),
    accumulated_depreciation numeric(15,2) DEFAULT 0,
    book_value numeric(15,2) GENERATED ALWAYS AS ((purchase_cost - accumulated_depreciation)) STORED,
    location character varying(255),
    custodian_id uuid,
    serial_number character varying(100),
    status character varying(50) DEFAULT 'active'::character varying,
    disposal_date date,
    disposal_amount numeric(15,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.fixed_assets OWNER TO postgres;

--
-- Name: TABLE fixed_assets; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.fixed_assets IS 'Fixed asset register';


--
-- Name: goods_received_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods_received_notes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grn_number character varying(50) NOT NULL,
    grn_date date NOT NULL,
    po_id uuid,
    supplier_id uuid NOT NULL,
    warehouse_id uuid,
    received_by uuid,
    status character varying(50) DEFAULT 'draft'::character varying,
    delivery_note_number character varying(100),
    vehicle_number character varying(50),
    driver_name character varying(255),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.goods_received_notes OWNER TO postgres;

--
-- Name: TABLE goods_received_notes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.goods_received_notes IS 'Goods received from suppliers';


--
-- Name: grn_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grn_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    grn_id uuid NOT NULL,
    po_item_id uuid,
    product_id uuid NOT NULL,
    batch_number character varying(100),
    quantity_ordered numeric(15,2),
    quantity_received numeric(15,2) NOT NULL,
    quantity_accepted numeric(15,2) DEFAULT 0,
    quantity_rejected numeric(15,2) DEFAULT 0,
    unit_cost numeric(15,2) NOT NULL,
    manufacture_date date,
    expiry_date date,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.grn_items OWNER TO postgres;

--
-- Name: hero_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hero_sections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    page_id uuid NOT NULL,
    headline text NOT NULL,
    subheadline text,
    description text,
    primary_cta_text character varying(100),
    primary_cta_url character varying(255),
    secondary_cta_text character varying(100),
    secondary_cta_url character varying(255),
    hero_image_url text,
    background_video_url text,
    background_color character varying(50),
    text_color character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.hero_sections OWNER TO postgres;

--
-- Name: TABLE hero_sections; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.hero_sections IS 'Hero section content management';


--
-- Name: inventory_adjustment_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_adjustment_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    adjustment_id uuid NOT NULL,
    product_id uuid NOT NULL,
    batch_id uuid,
    current_quantity numeric(15,2) NOT NULL,
    adjusted_quantity numeric(15,2) NOT NULL,
    variance numeric(15,2) GENERATED ALWAYS AS ((adjusted_quantity - current_quantity)) STORED,
    unit_cost numeric(15,2) DEFAULT 0,
    reason text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.inventory_adjustment_items OWNER TO postgres;

--
-- Name: inventory_adjustments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_adjustments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    adjustment_number character varying(50) NOT NULL,
    adjustment_date date NOT NULL,
    warehouse_id uuid,
    adjustment_type character varying(50) NOT NULL,
    status character varying(50) DEFAULT 'draft'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.inventory_adjustments OWNER TO postgres;

--
-- Name: TABLE inventory_adjustments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.inventory_adjustments IS 'Inventory adjustment headers for stock corrections';


--
-- Name: inventory_transfer_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transfer_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    transfer_id uuid NOT NULL,
    product_id uuid NOT NULL,
    batch_id uuid,
    quantity_requested numeric(15,2) NOT NULL,
    quantity_shipped numeric(15,2) DEFAULT 0,
    quantity_received numeric(15,2) DEFAULT 0,
    unit_cost numeric(15,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.inventory_transfer_items OWNER TO postgres;

--
-- Name: inventory_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_transfers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    transfer_number character varying(50) NOT NULL,
    transfer_date date NOT NULL,
    from_warehouse_id uuid NOT NULL,
    to_warehouse_id uuid NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    requested_by uuid,
    approved_by uuid,
    shipped_by uuid,
    received_by uuid,
    shipped_at timestamp with time zone,
    received_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.inventory_transfers OWNER TO postgres;

--
-- Name: iot_devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iot_devices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    device_code character varying(50) NOT NULL,
    device_name character varying(255) NOT NULL,
    device_type character varying(100),
    warehouse_id uuid,
    location character varying(255),
    ip_address character varying(50),
    status character varying(50) DEFAULT 'active'::character varying,
    last_heartbeat timestamp with time zone,
    firmware_version character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.iot_devices OWNER TO postgres;

--
-- Name: TABLE iot_devices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.iot_devices IS 'IoT devices for warehouse automation (future)';


--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    journal_number character varying(50) NOT NULL,
    journal_date date NOT NULL,
    journal_type character varying(50) DEFAULT 'general'::character varying,
    reference_type character varying(50),
    reference_id uuid,
    description text,
    total_debit numeric(15,2) DEFAULT 0,
    total_credit numeric(15,2) DEFAULT 0,
    status character varying(50) DEFAULT 'draft'::character varying,
    posted_at timestamp with time zone,
    posted_by uuid,
    reversed_at timestamp with time zone,
    reversed_by uuid,
    reversal_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.journal_entries OWNER TO postgres;

--
-- Name: TABLE journal_entries; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.journal_entries IS 'Journal entry headers for double-entry accounting';


--
-- Name: journal_entry_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.journal_entry_lines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    journal_id uuid NOT NULL,
    account_id uuid NOT NULL,
    line_type character varying(10) NOT NULL,
    amount numeric(15,2) NOT NULL,
    description text,
    reference_type character varying(50),
    reference_id uuid,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.journal_entry_lines OWNER TO postgres;

--
-- Name: landing_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landing_pages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    page_code character varying(50) NOT NULL,
    page_name character varying(255) NOT NULL,
    page_title character varying(255),
    page_slug character varying(255) NOT NULL,
    meta_description text,
    meta_keywords text,
    is_published boolean DEFAULT false,
    is_homepage boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.landing_pages OWNER TO postgres;

--
-- Name: TABLE landing_pages; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.landing_pages IS 'Landing page management';


--
-- Name: landing_pricing_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.landing_pricing_plans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    plan_name character varying(100) NOT NULL,
    plan_code character varying(50) NOT NULL,
    description text,
    price_monthly numeric(15,2) DEFAULT 0,
    price_annual numeric(15,2) DEFAULT 0,
    discount_label character varying(100),
    features jsonb,
    highlight_features jsonb,
    is_popular boolean DEFAULT false,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    cta_text character varying(100) DEFAULT 'Get Started'::character varying,
    cta_url character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.landing_pricing_plans OWNER TO postgres;

--
-- Name: TABLE landing_pricing_plans; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.landing_pricing_plans IS 'Pricing plans displayed on landing page';


--
-- Name: lead_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lead_sources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    source_code character varying(50) NOT NULL,
    source_name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.lead_sources OWNER TO postgres;

--
-- Name: TABLE lead_sources; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.lead_sources IS 'Lead source tracking (website, referral, event, etc.)';


--
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    lead_number character varying(50) NOT NULL,
    company_name character varying(255),
    contact_name character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(50),
    source_id uuid,
    status character varying(50) DEFAULT 'new'::character varying,
    rating character varying(50),
    estimated_value numeric(15,2),
    probability integer,
    expected_close_date date,
    assigned_to uuid,
    converted_to_customer_id uuid,
    converted_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- Name: TABLE leads; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leads IS 'Sales lead and opportunity management';


--
-- Name: leave_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_balances (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_id uuid NOT NULL,
    leave_type_id uuid NOT NULL,
    year integer NOT NULL,
    total_days numeric(5,2) DEFAULT 0,
    used_days numeric(5,2) DEFAULT 0,
    remaining_days numeric(5,2) GENERATED ALWAYS AS ((total_days - used_days)) STORED,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.leave_balances OWNER TO postgres;

--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_id uuid NOT NULL,
    leave_type_id uuid NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days integer NOT NULL,
    reason text,
    status character varying(50) DEFAULT 'pending'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- Name: TABLE leave_requests; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leave_requests IS 'Employee leave/time-off requests';


--
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    leave_code character varying(50) NOT NULL,
    leave_name character varying(255) NOT NULL,
    description text,
    default_days integer DEFAULT 0,
    is_paid boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- Name: TABLE leave_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leave_types IS 'Types of leave (annual, sick, maternity, etc.)';


--
-- Name: loyalty_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_programs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    program_code character varying(50) NOT NULL,
    program_name character varying(255) NOT NULL,
    description text,
    points_per_ugx numeric(10,4) DEFAULT 0,
    is_active boolean DEFAULT true,
    start_date date,
    end_date date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.loyalty_programs OWNER TO postgres;

--
-- Name: TABLE loyalty_programs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.loyalty_programs IS 'Customer loyalty and rewards programs (future)';


--
-- Name: machines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.machines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    machine_code character varying(50) NOT NULL,
    machine_name character varying(255) NOT NULL,
    machine_type character varying(100),
    manufacturer character varying(255),
    model_number character varying(100),
    serial_number character varying(100),
    warehouse_id uuid,
    purchase_date date,
    purchase_cost numeric(15,2),
    maintenance_interval integer,
    last_maintenance_date date,
    next_maintenance_date date,
    status character varying(50) DEFAULT 'operational'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.machines OWNER TO postgres;

--
-- Name: TABLE machines; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.machines IS 'Manufacturing machines and equipment';


--
-- Name: message_reactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_reactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    message_id uuid NOT NULL,
    user_id uuid NOT NULL,
    reaction_type character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.message_reactions OWNER TO postgres;

--
-- Name: message_recipients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.message_recipients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    message_id uuid NOT NULL,
    recipient_id uuid NOT NULL,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    is_delivered boolean DEFAULT false,
    delivered_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.message_recipients OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    conversation_id uuid,
    sender_id uuid NOT NULL,
    message_type character varying(50) DEFAULT 'text'::character varying,
    message_content text NOT NULL,
    file_url text,
    file_name character varying(255),
    file_size integer,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    is_deleted boolean DEFAULT false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: TABLE messages; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.messages IS 'Internal messaging system';


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    source character varying(100),
    is_active boolean DEFAULT true,
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone,
    email_verified boolean DEFAULT false,
    verification_token character varying(255)
);


ALTER TABLE public.newsletter_subscribers OWNER TO postgres;

--
-- Name: TABLE newsletter_subscribers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.newsletter_subscribers IS 'Newsletter email subscribers';


--
-- Name: notification_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_code character varying(50) NOT NULL,
    category_name character varying(100) NOT NULL,
    description text,
    icon character varying(50),
    color character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notification_categories OWNER TO postgres;

--
-- Name: TABLE notification_categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notification_categories IS 'Notification categories (System, Sales, Inventory, etc.)';


--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_preferences (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    category_id uuid,
    via_email boolean DEFAULT true,
    via_sms boolean DEFAULT false,
    via_in_app boolean DEFAULT true,
    via_push boolean DEFAULT true,
    quiet_hours_start time without time zone,
    quiet_hours_end time without time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notification_preferences OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    category_id uuid,
    notification_type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    action_url text,
    action_type character varying(50),
    priority character varying(50) DEFAULT 'normal'::character varying,
    is_read boolean DEFAULT false,
    read_at timestamp with time zone,
    sent_via_email boolean DEFAULT false,
    sent_via_sms boolean DEFAULT false,
    sent_via_push boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: TABLE notifications; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.notifications IS 'User notifications and alerts';


--
-- Name: onboarding_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.onboarding_steps (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    step_code character varying(50) NOT NULL,
    step_name character varying(255) NOT NULL,
    step_description text,
    step_order integer NOT NULL,
    is_required boolean DEFAULT true,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.onboarding_steps OWNER TO postgres;

--
-- Name: TABLE onboarding_steps; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.onboarding_steps IS 'Define onboarding steps for new users';


--
-- Name: page_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.page_sections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    page_id uuid NOT NULL,
    section_code character varying(50) NOT NULL,
    section_type character varying(50) NOT NULL,
    section_title character varying(255),
    section_subtitle text,
    content jsonb,
    display_order integer DEFAULT 0,
    is_visible boolean DEFAULT true,
    background_color character varying(50),
    background_image character varying(255),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.page_sections OWNER TO postgres;

--
-- Name: TABLE page_sections; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.page_sections IS 'Page sections with flexible content';


--
-- Name: payment_allocations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_allocations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payment_id uuid NOT NULL,
    invoice_type character varying(50) NOT NULL,
    invoice_id uuid NOT NULL,
    allocated_amount numeric(15,2) NOT NULL,
    allocation_date date NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.payment_allocations OWNER TO postgres;

--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_methods (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    method_type character varying(50) NOT NULL,
    provider character varying(100),
    account_number character varying(255),
    account_name character varying(255),
    is_default boolean DEFAULT false,
    is_verified boolean DEFAULT false,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone
);


ALTER TABLE public.payment_methods OWNER TO postgres;

--
-- Name: TABLE payment_methods; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.payment_methods IS 'User payment methods for subscription billing';


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payment_number character varying(50) NOT NULL,
    payment_date date NOT NULL,
    payment_type character varying(50) NOT NULL,
    party_type character varying(50) NOT NULL,
    party_id uuid NOT NULL,
    bank_account_id uuid,
    payment_method character varying(50) NOT NULL,
    reference_number character varying(100),
    amount numeric(15,2) NOT NULL,
    allocated_amount numeric(15,2) DEFAULT 0,
    unallocated_amount numeric(15,2) GENERATED ALWAYS AS ((amount - allocated_amount)) STORED,
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: TABLE payments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.payments IS 'All payments received from customers or made to suppliers';


--
-- Name: payroll_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll_periods (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    period_code character varying(50) NOT NULL,
    period_name character varying(255) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    payment_date date,
    status character varying(50) DEFAULT 'draft'::character varying,
    total_gross numeric(15,2) DEFAULT 0,
    total_deductions numeric(15,2) DEFAULT 0,
    total_net numeric(15,2) DEFAULT 0,
    approved_by uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.payroll_periods OWNER TO postgres;

--
-- Name: TABLE payroll_periods; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.payroll_periods IS 'Payroll processing periods';


--
-- Name: payslip_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payslip_lines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payslip_id uuid NOT NULL,
    component_id uuid NOT NULL,
    component_type character varying(50) NOT NULL,
    amount numeric(15,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.payslip_lines OWNER TO postgres;

--
-- Name: payslips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payslips (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payslip_number character varying(50) NOT NULL,
    period_id uuid NOT NULL,
    employee_id uuid NOT NULL,
    basic_salary numeric(15,2) DEFAULT 0,
    gross_salary numeric(15,2) DEFAULT 0,
    total_deductions numeric(15,2) DEFAULT 0,
    net_salary numeric(15,2) DEFAULT 0,
    payment_date date,
    payment_method character varying(50),
    bank_account_id uuid,
    status character varying(50) DEFAULT 'draft'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.payslips OWNER TO postgres;

--
-- Name: TABLE payslips; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.payslips IS 'Employee payslips';


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    permission_name character varying(100) NOT NULL,
    permission_code character varying(50) NOT NULL,
    module character varying(100),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: TABLE permissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.permissions IS 'System permissions/modules for granular access control';


--
-- Name: pos_cash_registers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pos_cash_registers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    register_code character varying(50) NOT NULL,
    register_name character varying(255) NOT NULL,
    branch_id uuid,
    assigned_user_id uuid,
    opening_balance numeric(15,2) DEFAULT 0,
    closing_balance numeric(15,2) DEFAULT 0,
    opened_at timestamp with time zone,
    closed_at timestamp with time zone,
    status character varying(50) DEFAULT 'closed'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.pos_cash_registers OWNER TO postgres;

--
-- Name: TABLE pos_cash_registers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.pos_cash_registers IS 'POS cash register sessions';


--
-- Name: product_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_batches (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    batch_number character varying(100) NOT NULL,
    product_id uuid NOT NULL,
    warehouse_id uuid,
    quantity numeric(15,2) NOT NULL,
    cost_per_unit numeric(15,2) DEFAULT 0,
    manufacture_date date,
    expiry_date date,
    received_date date,
    supplier_id uuid,
    status character varying(50) DEFAULT 'active'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.product_batches OWNER TO postgres;

--
-- Name: TABLE product_batches; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.product_batches IS 'Product batch/lot tracking for expiry and traceability';


--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_code character varying(50) NOT NULL,
    category_name character varying(255) NOT NULL,
    parent_id uuid,
    description text,
    image_url text,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- Name: TABLE product_categories; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.product_categories IS 'Hierarchical product categories';


--
-- Name: product_price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_price_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    price_type character varying(50) NOT NULL,
    old_price numeric(15,2),
    new_price numeric(15,2) NOT NULL,
    effective_date date NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.product_price_history OWNER TO postgres;

--
-- Name: TABLE product_price_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.product_price_history IS 'Track product price changes over time';


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_code character varying(50) NOT NULL,
    barcode character varying(100),
    product_name character varying(255) NOT NULL,
    category_id uuid,
    description text,
    product_type character varying(50) DEFAULT 'physical'::character varying,
    unit_of_measure character varying(50) DEFAULT 'piece'::character varying,
    cost_price numeric(15,2) DEFAULT 0,
    selling_price numeric(15,2) DEFAULT 0,
    tax_rate numeric(5,2) DEFAULT 0,
    reorder_level integer DEFAULT 0,
    reorder_quantity integer DEFAULT 0,
    min_stock_level integer DEFAULT 0,
    max_stock_level integer,
    current_stock integer DEFAULT 0,
    is_active boolean DEFAULT true,
    is_taxable boolean DEFAULT true,
    track_inventory boolean DEFAULT true,
    allow_backorder boolean DEFAULT false,
    image_url text,
    images jsonb,
    attributes jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: TABLE products; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.products IS 'Product master data with pricing and inventory settings';


--
-- Name: project_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_tasks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    task_code character varying(50) NOT NULL,
    project_id uuid NOT NULL,
    parent_task_id uuid,
    task_name character varying(255) NOT NULL,
    description text,
    assigned_to uuid,
    start_date date,
    end_date date,
    estimated_hours numeric(10,2),
    actual_hours numeric(10,2) DEFAULT 0,
    status character varying(50) DEFAULT 'todo'::character varying,
    priority character varying(50) DEFAULT 'medium'::character varying,
    completion_percent integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.project_tasks OWNER TO postgres;

--
-- Name: TABLE project_tasks; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.project_tasks IS 'Project task breakdown and assignment';


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    project_code character varying(50) NOT NULL,
    project_name character varying(255) NOT NULL,
    description text,
    project_type character varying(50),
    customer_id uuid,
    project_manager_id uuid,
    start_date date,
    end_date date,
    estimated_hours numeric(10,2),
    actual_hours numeric(10,2) DEFAULT 0,
    budget numeric(15,2) DEFAULT 0,
    actual_cost numeric(15,2) DEFAULT 0,
    status character varying(50) DEFAULT 'planning'::character varying,
    priority character varying(50) DEFAULT 'medium'::character varying,
    completion_percent integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: TABLE projects; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.projects IS 'Project management and tracking';


--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    po_id uuid NOT NULL,
    product_id uuid NOT NULL,
    description text,
    quantity numeric(15,2) NOT NULL,
    quantity_received numeric(15,2) DEFAULT 0,
    unit_price numeric(15,2) NOT NULL,
    discount_amount numeric(15,2) DEFAULT 0,
    tax_rate numeric(5,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    line_total numeric(15,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    po_number character varying(50) NOT NULL,
    po_date date NOT NULL,
    supplier_id uuid NOT NULL,
    branch_id uuid,
    warehouse_id uuid,
    rfq_id uuid,
    subtotal numeric(15,2) DEFAULT 0,
    discount_amount numeric(15,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    shipping_amount numeric(15,2) DEFAULT 0,
    total_amount numeric(15,2) NOT NULL,
    status character varying(50) DEFAULT 'draft'::character varying,
    payment_terms integer DEFAULT 30,
    expected_delivery_date date,
    delivery_address text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- Name: TABLE purchase_orders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.purchase_orders IS 'Purchase orders sent to suppliers';


--
-- Name: quality_defects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quality_defects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    inspection_id uuid NOT NULL,
    defect_type character varying(100) NOT NULL,
    defect_description text,
    severity character varying(50) DEFAULT 'medium'::character varying,
    quantity_affected numeric(15,2),
    action_taken text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.quality_defects OWNER TO postgres;

--
-- Name: quality_inspections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quality_inspections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    inspection_number character varying(50) NOT NULL,
    inspection_date date NOT NULL,
    inspection_type character varying(50) NOT NULL,
    reference_type character varying(50),
    reference_id uuid,
    product_id uuid,
    batch_id uuid,
    inspector_id uuid,
    quantity_inspected numeric(15,2) NOT NULL,
    quantity_passed numeric(15,2) DEFAULT 0,
    quantity_failed numeric(15,2) DEFAULT 0,
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.quality_inspections OWNER TO postgres;

--
-- Name: TABLE quality_inspections; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.quality_inspections IS 'Quality control inspections';


--
-- Name: rfq_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rfq_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    rfq_id uuid NOT NULL,
    product_id uuid,
    description text NOT NULL,
    quantity numeric(15,2) NOT NULL,
    unit_of_measure character varying(50),
    specifications text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rfq_items OWNER TO postgres;

--
-- Name: rfq_suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rfq_suppliers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    rfq_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    sent_date date,
    response_date date,
    status character varying(50) DEFAULT 'pending'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.rfq_suppliers OWNER TO postgres;

--
-- Name: rfqs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rfqs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    rfq_number character varying(50) NOT NULL,
    rfq_date date NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    required_by_date date,
    status character varying(50) DEFAULT 'draft'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.rfqs OWNER TO postgres;

--
-- Name: TABLE rfqs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rfqs IS 'Request for Quotations sent to suppliers';


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    can_create boolean DEFAULT false,
    can_read boolean DEFAULT false,
    can_update boolean DEFAULT false,
    can_delete boolean DEFAULT false,
    can_export boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: TABLE role_permissions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.role_permissions IS 'Permission matrix linking roles to modules with CRUD access levels';


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    role_name character varying(100) NOT NULL,
    role_code character varying(50) NOT NULL,
    description text,
    is_system_role boolean DEFAULT false,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: TABLE roles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.roles IS 'User roles for access control (Admin, Manager, Sales, Warehouse, etc.)';


--
-- Name: salary_components; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salary_components (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    component_code character varying(50) NOT NULL,
    component_name character varying(255) NOT NULL,
    component_type character varying(50) NOT NULL,
    calculation_type character varying(50) DEFAULT 'fixed'::character varying,
    is_taxable boolean DEFAULT true,
    is_statutory boolean DEFAULT false,
    is_active boolean DEFAULT true,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.salary_components OWNER TO postgres;

--
-- Name: TABLE salary_components; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.salary_components IS 'Salary components (allowances, deductions, etc.)';


--
-- Name: sales_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    batch_id uuid,
    description text,
    quantity numeric(15,2) NOT NULL,
    unit_price numeric(15,2) NOT NULL,
    discount_amount numeric(15,2) DEFAULT 0,
    discount_percent numeric(5,2) DEFAULT 0,
    tax_rate numeric(5,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    line_total numeric(15,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sales_order_items OWNER TO postgres;

--
-- Name: sales_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_number character varying(50) NOT NULL,
    order_type character varying(50) DEFAULT 'invoice'::character varying,
    order_date date NOT NULL,
    customer_id uuid NOT NULL,
    branch_id uuid,
    warehouse_id uuid,
    salesperson_id uuid,
    subtotal numeric(15,2) DEFAULT 0,
    discount_amount numeric(15,2) DEFAULT 0,
    discount_percent numeric(5,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    shipping_amount numeric(15,2) DEFAULT 0,
    total_amount numeric(15,2) NOT NULL,
    amount_paid numeric(15,2) DEFAULT 0,
    balance_due numeric(15,2) GENERATED ALWAYS AS ((total_amount - amount_paid)) STORED,
    status character varying(50) DEFAULT 'draft'::character varying,
    payment_status character varying(50) DEFAULT 'unpaid'::character varying,
    payment_terms integer DEFAULT 30,
    due_date date,
    delivery_address text,
    delivery_city character varying(100),
    delivery_notes text,
    internal_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.sales_orders OWNER TO postgres;

--
-- Name: TABLE sales_orders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.sales_orders IS 'Sales orders, invoices, and POS transactions';


--
-- Name: sales_return_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_return_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    return_id uuid NOT NULL,
    product_id uuid NOT NULL,
    original_item_id uuid,
    quantity numeric(15,2) NOT NULL,
    unit_price numeric(15,2) NOT NULL,
    refund_amount numeric(15,2) NOT NULL,
    condition character varying(50),
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sales_return_items OWNER TO postgres;

--
-- Name: sales_returns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_returns (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    return_number character varying(50) NOT NULL,
    return_date date NOT NULL,
    original_order_id uuid,
    customer_id uuid NOT NULL,
    return_reason character varying(255),
    refund_amount numeric(15,2) DEFAULT 0,
    refund_method character varying(50),
    status character varying(50) DEFAULT 'pending'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.sales_returns OWNER TO postgres;

--
-- Name: TABLE sales_returns; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.sales_returns IS 'Sales returns and refunds';


--
-- Name: seq_billing_invoice; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_billing_invoice
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_billing_invoice OWNER TO postgres;

--
-- Name: seq_contract; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_contract
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_contract OWNER TO postgres;

--
-- Name: seq_delivery_order; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_delivery_order
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_delivery_order OWNER TO postgres;

--
-- Name: seq_document; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_document
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_document OWNER TO postgres;

--
-- Name: seq_expense; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_expense
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_expense OWNER TO postgres;

--
-- Name: seq_grn; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_grn
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_grn OWNER TO postgres;

--
-- Name: seq_inventory_adjustment; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_inventory_adjustment
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_inventory_adjustment OWNER TO postgres;

--
-- Name: seq_inventory_transfer; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_inventory_transfer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_inventory_transfer OWNER TO postgres;

--
-- Name: seq_invoice; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_invoice
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_invoice OWNER TO postgres;

--
-- Name: seq_journal_entry; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_journal_entry
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_journal_entry OWNER TO postgres;

--
-- Name: seq_lead; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_lead
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_lead OWNER TO postgres;

--
-- Name: seq_payment; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_payment
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_payment OWNER TO postgres;

--
-- Name: seq_payroll_period; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_payroll_period
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_payroll_period OWNER TO postgres;

--
-- Name: seq_payslip; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_payslip
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_payslip OWNER TO postgres;

--
-- Name: seq_project; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_project
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_project OWNER TO postgres;

--
-- Name: seq_purchase_order; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_purchase_order
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_purchase_order OWNER TO postgres;

--
-- Name: seq_quality_inspection; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_quality_inspection
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_quality_inspection OWNER TO postgres;

--
-- Name: seq_rfq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_rfq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_rfq OWNER TO postgres;

--
-- Name: seq_sales_order; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_sales_order
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_sales_order OWNER TO postgres;

--
-- Name: seq_sales_return; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_sales_return
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_sales_return OWNER TO postgres;

--
-- Name: seq_stock_movement; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_stock_movement
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_stock_movement OWNER TO postgres;

--
-- Name: seq_supplier_invoice; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_supplier_invoice
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_supplier_invoice OWNER TO postgres;

--
-- Name: seq_work_order; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seq_work_order
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seq_work_order OWNER TO postgres;

--
-- Name: settings; Type: TABLE; Schema: public; Owner: xhenvolt
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key character varying(255) NOT NULL,
    value text,
    type character varying(50) DEFAULT 'string'::character varying,
    category character varying(100) DEFAULT 'general'::character varying,
    description text,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.settings OWNER TO xhenvolt;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: xhenvolt
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO xhenvolt;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: xhenvolt
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: signup_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signup_tracking (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    email character varying(255) NOT NULL,
    signup_step character varying(50) NOT NULL,
    current_step integer DEFAULT 1,
    total_steps integer DEFAULT 5,
    completion_percent integer DEFAULT 0,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    last_activity_at timestamp with time zone DEFAULT now(),
    metadata jsonb
);


ALTER TABLE public.signup_tracking OWNER TO postgres;

--
-- Name: TABLE signup_tracking; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.signup_tracking IS 'Track user signup and onboarding progress';


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.site_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    site_name character varying(255) DEFAULT 'XHETON'::character varying,
    site_tagline text,
    site_description text,
    logo_url text,
    favicon_url text,
    primary_color character varying(50) DEFAULT '#3B82F6'::character varying,
    secondary_color character varying(50) DEFAULT '#10B981'::character varying,
    accent_color character varying(50) DEFAULT '#F59E0B'::character varying,
    font_family character varying(100),
    contact_email character varying(255),
    contact_phone character varying(50),
    social_facebook character varying(255),
    social_twitter character varying(255),
    social_linkedin character varying(255),
    social_instagram character varying(255),
    google_analytics_id character varying(100),
    meta_keywords text,
    meta_description text,
    maintenance_mode boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: TABLE site_settings; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.site_settings IS 'Landing page site-wide settings';


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    movement_number character varying(50) NOT NULL,
    movement_type character varying(50) NOT NULL,
    product_id uuid NOT NULL,
    batch_id uuid,
    from_warehouse_id uuid,
    to_warehouse_id uuid,
    from_bin_id uuid,
    to_bin_id uuid,
    quantity numeric(15,2) NOT NULL,
    unit_cost numeric(15,2) DEFAULT 0,
    movement_date timestamp with time zone DEFAULT now(),
    reference_type character varying(50),
    reference_id uuid,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- Name: TABLE stock_movements; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.stock_movements IS 'All inventory movements with full traceability';


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    plan_name character varying(100) NOT NULL,
    plan_code character varying(50) NOT NULL,
    description text,
    price_monthly numeric(15,2) DEFAULT 0,
    price_annual numeric(15,2) DEFAULT 0,
    discount_annual_percent numeric(5,2) DEFAULT 15.00,
    max_users integer DEFAULT 1,
    max_branches integer DEFAULT 1,
    max_products integer,
    max_storage_gb integer DEFAULT 5,
    max_automations integer,
    features jsonb,
    is_active boolean DEFAULT true,
    is_popular boolean DEFAULT false,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.subscription_plans OWNER TO postgres;

--
-- Name: TABLE subscription_plans; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.subscription_plans IS 'Subscription pricing plans (Starter, Business, Enterprise)';


--
-- Name: supplier_evaluations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_evaluations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    supplier_id uuid NOT NULL,
    evaluation_date date NOT NULL,
    quality_score numeric(3,2),
    delivery_score numeric(3,2),
    price_score numeric(3,2),
    service_score numeric(3,2),
    overall_score numeric(3,2),
    comments text,
    evaluator_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.supplier_evaluations OWNER TO postgres;

--
-- Name: TABLE supplier_evaluations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.supplier_evaluations IS 'Supplier performance evaluations and ratings';


--
-- Name: supplier_invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_invoice_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_id uuid NOT NULL,
    product_id uuid,
    description text,
    quantity numeric(15,2) NOT NULL,
    unit_price numeric(15,2) NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    line_total numeric(15,2) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.supplier_invoice_items OWNER TO postgres;

--
-- Name: supplier_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_invoices (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    invoice_number character varying(50) NOT NULL,
    supplier_invoice_number character varying(100),
    invoice_date date NOT NULL,
    due_date date,
    supplier_id uuid NOT NULL,
    po_id uuid,
    grn_id uuid,
    subtotal numeric(15,2) DEFAULT 0,
    discount_amount numeric(15,2) DEFAULT 0,
    tax_amount numeric(15,2) DEFAULT 0,
    total_amount numeric(15,2) NOT NULL,
    amount_paid numeric(15,2) DEFAULT 0,
    balance_due numeric(15,2) GENERATED ALWAYS AS ((total_amount - amount_paid)) STORED,
    status character varying(50) DEFAULT 'pending'::character varying,
    payment_status character varying(50) DEFAULT 'unpaid'::character varying,
    approved_by uuid,
    approved_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.supplier_invoices OWNER TO postgres;

--
-- Name: TABLE supplier_invoices; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.supplier_invoices IS 'Invoices received from suppliers';


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    supplier_code character varying(50) NOT NULL,
    supplier_name character varying(255) NOT NULL,
    company_name character varying(255),
    tax_id character varying(100),
    email character varying(255),
    phone character varying(50),
    mobile character varying(50),
    website character varying(255),
    address text,
    city character varying(100),
    state_province character varying(100),
    country character varying(100) DEFAULT 'Uganda'::character varying,
    postal_code character varying(20),
    payment_terms integer DEFAULT 30,
    credit_limit numeric(15,2) DEFAULT 0,
    current_balance numeric(15,2) DEFAULT 0,
    rating numeric(3,2) DEFAULT 0,
    category character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: TABLE suppliers; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.suppliers IS 'Supplier master data with payment and rating information';


--
-- Name: system_health_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_health_metrics (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    metric_type character varying(50) NOT NULL,
    metric_value numeric(10,2) NOT NULL,
    metric_unit character varying(50),
    module character varying(100),
    recorded_at timestamp with time zone DEFAULT now(),
    metadata jsonb
);


ALTER TABLE public.system_health_metrics OWNER TO postgres;

--
-- Name: TABLE system_health_metrics; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.system_health_metrics IS 'System performance and health monitoring';


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_settings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text,
    setting_type character varying(50) DEFAULT 'string'::character varying,
    description text,
    is_public boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.system_settings OWNER TO postgres;

--
-- Name: TABLE system_settings; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.system_settings IS 'Global system configuration including business name, currency, timezone, etc.';


--
-- Name: task_time_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_time_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    task_id uuid NOT NULL,
    user_id uuid NOT NULL,
    log_date date NOT NULL,
    hours numeric(5,2) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.task_time_logs OWNER TO postgres;

--
-- Name: taxes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taxes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tax_code character varying(50) NOT NULL,
    tax_name character varying(255) NOT NULL,
    tax_type character varying(50) DEFAULT 'vat'::character varying,
    tax_rate numeric(5,2) NOT NULL,
    is_compound boolean DEFAULT false,
    is_active boolean DEFAULT true,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.taxes OWNER TO postgres;

--
-- Name: TABLE taxes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.taxes IS 'Tax codes and rates';


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.testimonials (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_position character varying(255),
    customer_company character varying(255),
    customer_photo_url text,
    testimonial_text text NOT NULL,
    rating integer,
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT testimonials_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.testimonials OWNER TO postgres;

--
-- Name: TABLE testimonials; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.testimonials IS 'Customer testimonials for landing pages';


--
-- Name: usage_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usage_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    metric_type character varying(50) NOT NULL,
    metric_value numeric(15,2) NOT NULL,
    recorded_at timestamp with time zone DEFAULT now(),
    metadata jsonb
);


ALTER TABLE public.usage_logs OWNER TO postgres;

--
-- Name: TABLE usage_logs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.usage_logs IS 'Track resource usage for billing and analytics';


--
-- Name: user_onboarding_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_onboarding_progress (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    step_id uuid NOT NULL,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    skipped boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_onboarding_progress OWNER TO postgres;

--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_sessions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    session_token text NOT NULL,
    ip_address character varying(50),
    user_agent text,
    device_type character varying(50),
    location character varying(255),
    login_at timestamp with time zone DEFAULT now(),
    logout_at timestamp with time zone,
    is_active boolean DEFAULT true,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_sessions OWNER TO postgres;

--
-- Name: TABLE user_sessions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_sessions IS 'Active user sessions for security monitoring and session management';


--
-- Name: user_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_subscriptions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    plan_id uuid NOT NULL,
    status character varying(50) DEFAULT 'active'::character varying,
    billing_cycle character varying(20) DEFAULT 'monthly'::character varying,
    amount numeric(15,2) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    auto_renew boolean DEFAULT true,
    trial_ends_at timestamp with time zone,
    cancelled_at timestamp with time zone,
    cancellation_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid
);


ALTER TABLE public.user_subscriptions OWNER TO postgres;

--
-- Name: TABLE user_subscriptions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_subscriptions IS 'Active user subscriptions with billing cycle and expiry tracking';


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    employee_code character varying(50),
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    phone character varying(50),
    avatar_url text,
    role_id uuid,
    branch_id uuid,
    department character varying(100),
    "position" character varying(100),
    is_active boolean DEFAULT true,
    last_login_at timestamp with time zone,
    email_verified_at timestamp with time zone,
    phone_verified_at timestamp with time zone,
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'System users with authentication and profile information';


--
-- Name: warehouse_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse_locations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    warehouse_id uuid NOT NULL,
    location_code character varying(50) NOT NULL,
    location_name character varying(255),
    location_type character varying(50) DEFAULT 'zone'::character varying,
    parent_id uuid,
    capacity numeric(15,2),
    capacity_unit character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.warehouse_locations OWNER TO postgres;

--
-- Name: TABLE warehouse_locations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.warehouse_locations IS 'Hierarchical warehouse location structure (zones, aisles, racks)';


--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    warehouse_code character varying(50) NOT NULL,
    warehouse_name character varying(255) NOT NULL,
    branch_id uuid,
    warehouse_type character varying(50) DEFAULT 'main'::character varying,
    manager_id uuid,
    address text,
    city character varying(100),
    state_province character varying(100),
    country character varying(100) DEFAULT 'Uganda'::character varying,
    postal_code character varying(20),
    capacity numeric(15,2),
    capacity_unit character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamp with time zone
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- Name: TABLE warehouses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.warehouses IS 'Warehouse locations for inventory management';


--
-- Name: work_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.work_orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    work_order_number character varying(50) NOT NULL,
    work_order_date date NOT NULL,
    product_id uuid NOT NULL,
    bom_id uuid,
    quantity_planned numeric(15,2) NOT NULL,
    quantity_produced numeric(15,2) DEFAULT 0,
    warehouse_id uuid,
    start_date date,
    end_date date,
    status character varying(50) DEFAULT 'draft'::character varying,
    priority character varying(50) DEFAULT 'medium'::character varying,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.work_orders OWNER TO postgres;

--
-- Name: TABLE work_orders; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.work_orders IS 'Manufacturing work orders';


--
-- Name: workflow_executions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_executions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    template_id uuid NOT NULL,
    execution_status character varying(50) DEFAULT 'running'::character varying,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    error_message text,
    input_data jsonb,
    output_data jsonb,
    triggered_by uuid
);


ALTER TABLE public.workflow_executions OWNER TO postgres;

--
-- Name: TABLE workflow_executions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.workflow_executions IS 'Workflow execution history and logs';


--
-- Name: workflow_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.workflow_templates (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    template_code character varying(50) NOT NULL,
    template_name character varying(255) NOT NULL,
    description text,
    trigger_type character varying(50) NOT NULL,
    trigger_config jsonb,
    module character varying(100),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid
);


ALTER TABLE public.workflow_templates OWNER TO postgres;

--
-- Name: TABLE workflow_templates; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.workflow_templates IS 'Automation workflow templates';


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: xhenvolt
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Data for Name: asset_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_categories (id, category_code, category_name, depreciation_method, useful_life_years, salvage_value_percent, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: asset_depreciation; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_depreciation (id, asset_id, period_date, depreciation_amount, accumulated_depreciation, book_value, journal_entry_id, created_at) FROM stdin;
\.


--
-- Data for Name: asset_maintenance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_maintenance (id, asset_id, maintenance_date, maintenance_type, description, cost, performed_by, next_maintenance_date, created_at) FROM stdin;
\.


--
-- Data for Name: asset_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.asset_transfers (id, asset_id, transfer_date, from_location, to_location, from_custodian_id, to_custodian_id, reason, approved_by, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attendance_records (id, employee_id, attendance_date, clock_in, clock_out, total_hours, status, location, ip_address, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: bank_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_accounts (id, account_code, account_name, account_type, bank_name, account_number, branch_name, currency_code, current_balance, opening_balance, opening_balance_date, gl_account_id, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: billing_invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing_invoice_items (id, invoice_id, description, quantity, unit_price, total, created_at) FROM stdin;
\.


--
-- Data for Name: billing_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing_invoices (id, invoice_number, user_id, subscription_id, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, amount_paid, status, payment_date, payment_method_id, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bins (id, bin_code, warehouse_location_id, bin_type, capacity, capacity_unit, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bom_headers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bom_headers (id, bom_code, product_id, bom_name, bom_type, quantity, unit_cost, is_active, effective_from, effective_to, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: bom_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bom_items (id, bom_id, component_product_id, quantity, unit_cost, scrap_percent, notes, created_at) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, branch_code, branch_name, branch_type, manager_id, email, phone, address, city, state_province, country, postal_code, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
91e4000f-1c53-4e1f-8ced-e332846bab31	ASTROTECHS-HQ	Astro Techs - Headquarters	headquarters	\N	\N	0741114147	\N	\N	\N	Uganda	\N	t	2025-12-07 20:32:22.926786+03	2025-12-07 20:32:22.926786+03	23e8f1d7-927a-434c-8ffa-020070708bb4	23e8f1d7-927a-434c-8ffa-020070708bb4	\N
0903f256-bdf1-4396-80e0-cc72fb14453d	XHENVOLTFA-HQ	Xhenvolt Farm - Headquarters	headquarters	\N	\N	0745726350	\N	\N	\N	Uganda	\N	t	2025-12-07 23:03:59.399507+03	2025-12-07 23:03:59.399507+03	06e0357d-658c-4add-aaf7-098d3eb5e917	06e0357d-658c-4add-aaf7-098d3eb5e917	\N
29bddb12-5885-4692-8513-35c3e77555b8	AISHA-HQ	aisha - Headquarters	headquarters	\N	\N	0774547788	\N	\N	\N	Uganda	\N	t	2025-12-13 14:24:11.95976+03	2025-12-13 14:24:11.95976+03	a811ecfa-105b-43c1-8019-8c924dff070c	a811ecfa-105b-43c1-8019-8c924dff070c	\N
\.


--
-- Data for Name: budget_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budget_lines (id, budget_id, account_id, category_id, description, budgeted_amount, actual_amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: budgets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.budgets (id, budget_code, budget_name, budget_type, fiscal_year, start_date, end_date, total_amount, status, approved_by, approved_at, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: business_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.business_info (id, business_name, business_type, registration_number, tax_id, email, phone, website, address, city, state_province, country, postal_code, logo_url, currency_code, currency_symbol, fiscal_year_start, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
360cc2a1-9979-4aff-ac70-d247300e6618	Astro Techs	Education	\N	\N	\N	0741114147	\N	\N	\N	\N	Uganda	\N	\N	UGX	UGX	\N	2025-12-07 20:32:22.907221+03	2025-12-07 20:32:22.907221+03	23e8f1d7-927a-434c-8ffa-020070708bb4	23e8f1d7-927a-434c-8ffa-020070708bb4	\N
1af32471-abd3-4692-884e-8bfca7a01fe2	Xhenvolt Farm	Other	\N	\N	\N	0745726350	\N	\N	\N	\N	Uganda	\N	\N	UGX	UGX	\N	2025-12-07 23:03:59.392372+03	2025-12-07 23:03:59.392372+03	06e0357d-658c-4add-aaf7-098d3eb5e917	06e0357d-658c-4add-aaf7-098d3eb5e917	\N
6d7ef647-2c62-46d5-b5aa-4f49129f01a1	aisha	Manufacturing	\N	\N	\N	0774547788	\N	\N	\N	\N	Uganda	\N	\N	UGX	UGX	\N	2025-12-13 14:24:11.95526+03	2025-12-13 14:24:11.95526+03	a811ecfa-105b-43c1-8019-8c924dff070c	a811ecfa-105b-43c1-8019-8c924dff070c	\N
\.


--
-- Data for Name: chart_of_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chart_of_accounts (id, account_code, account_name, account_type, account_category, parent_id, currency_code, balance, is_active, is_system_account, description, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: contact_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_submissions (id, full_name, email, phone, company, subject, message, source_page, ip_address, status, assigned_to, responded_at, created_at) FROM stdin;
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contracts (id, contract_number, contract_type, party_type, party_id, contract_name, start_date, end_date, contract_value, status, renewal_terms, termination_terms, file_url, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: crm_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crm_activities (id, activity_type, subject, description, related_to_type, related_to_id, assigned_to, due_date, completed_at, status, priority, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: cta_banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cta_banners (id, banner_code, headline, subheadline, button_text, button_url, background_color, text_color, placement, is_active, display_from, display_until, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.currencies (id, currency_code, currency_name, symbol, exchange_rate, is_base_currency, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customer_loyalty_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_loyalty_points (id, customer_id, program_id, points_earned, points_redeemed, tier_level, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, customer_code, customer_name, customer_type, company_name, tax_id, email, phone, mobile, website, billing_address, billing_city, billing_state, billing_country, billing_postal_code, shipping_address, shipping_city, shipping_state, shipping_country, shipping_postal_code, credit_limit, current_balance, payment_terms, discount_percent, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: delivery_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_order_items (id, delivery_id, sales_order_item_id, product_id, quantity_ordered, quantity_delivered, quantity_rejected, rejection_reason, created_at) FROM stdin;
\.


--
-- Data for Name: delivery_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_orders (id, delivery_number, delivery_date, sales_order_id, customer_id, warehouse_id, delivery_address, delivery_city, delivery_contact_name, delivery_contact_phone, driver_id, vehicle_number, status, scheduled_time, dispatched_time, delivered_time, delivery_notes, signature_url, photo_url, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: delivery_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_tracking (id, delivery_id, status, location, latitude, longitude, notes, recorded_at, recorded_by) FROM stdin;
\.


--
-- Data for Name: demo_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demo_requests (id, full_name, email, phone, company_name, company_size, industry, preferred_date, message, status, scheduled_at, assigned_to, created_at) FROM stdin;
\.


--
-- Data for Name: document_audit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_audit (id, document_id, action, user_id, ip_address, created_at) FROM stdin;
\.


--
-- Data for Name: document_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_categories (id, category_code, category_name, parent_id, description, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: document_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.document_permissions (id, document_id, permission_type, permission_id, can_view, can_edit, can_delete, can_share, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.documents (id, document_number, document_name, category_id, file_url, file_name, file_size, file_type, mime_type, version, related_to_type, related_to_id, is_public, uploaded_by, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: employee_salary_structures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_salary_structures (id, employee_id, component_id, amount, percentage, effective_from, effective_to, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, user_id, employee_number, first_name, last_name, middle_name, date_of_birth, gender, marital_status, nationality, national_id, passport_number, tax_id, phone, email, emergency_contact_name, emergency_contact_phone, address, city, branch_id, department, "position", employment_type, employment_status, hire_date, probation_end_date, termination_date, termination_reason, basic_salary, bank_account_name, bank_account_number, bank_name, photo_url, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: error_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.error_logs (id, error_type, error_code, error_message, stack_trace, module, user_id, url, http_method, request_body, ip_address, severity, is_resolved, resolved_at, resolved_by, created_at) FROM stdin;
\.


--
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exchange_rates (id, currency_id, rate_date, exchange_rate, created_at) FROM stdin;
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (id, category_code, category_name, parent_id, gl_account_id, description, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (id, expense_number, expense_date, category_id, supplier_id, branch_id, description, amount, tax_amount, total_amount, payment_method, bank_account_id, reference_number, receipt_url, status, approved_by, approved_at, paid_at, notes, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, category, question, answer, display_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: features; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.features (id, page_id, feature_title, feature_description, icon, image_url, link_url, display_order, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: fixed_assets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fixed_assets (id, asset_code, asset_name, category_id, description, supplier_id, purchase_date, purchase_cost, salvage_value, useful_life_years, depreciation_method, accumulated_depreciation, location, custodian_id, serial_number, status, disposal_date, disposal_amount, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: goods_received_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goods_received_notes (id, grn_number, grn_date, po_id, supplier_id, warehouse_id, received_by, status, delivery_note_number, vehicle_number, driver_name, notes, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: grn_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grn_items (id, grn_id, po_item_id, product_id, batch_number, quantity_ordered, quantity_received, quantity_accepted, quantity_rejected, unit_cost, manufacture_date, expiry_date, rejection_reason, created_at) FROM stdin;
\.


--
-- Data for Name: hero_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hero_sections (id, page_id, headline, subheadline, description, primary_cta_text, primary_cta_url, secondary_cta_text, secondary_cta_url, hero_image_url, background_video_url, background_color, text_color, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: inventory_adjustment_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_adjustment_items (id, adjustment_id, product_id, batch_id, current_quantity, adjusted_quantity, unit_cost, reason, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_adjustments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_adjustments (id, adjustment_number, adjustment_date, warehouse_id, adjustment_type, status, approved_by, approved_at, notes, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: inventory_transfer_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transfer_items (id, transfer_id, product_id, batch_id, quantity_requested, quantity_shipped, quantity_received, unit_cost, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_transfers (id, transfer_number, transfer_date, from_warehouse_id, to_warehouse_id, status, requested_by, approved_by, shipped_by, received_by, shipped_at, received_at, notes, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: iot_devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.iot_devices (id, device_code, device_name, device_type, warehouse_id, location, ip_address, status, last_heartbeat, firmware_version, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entries (id, journal_number, journal_date, journal_type, reference_type, reference_id, description, total_debit, total_credit, status, posted_at, posted_by, reversed_at, reversed_by, reversal_reason, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: journal_entry_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.journal_entry_lines (id, journal_id, account_id, line_type, amount, description, reference_type, reference_id, created_at) FROM stdin;
\.


--
-- Data for Name: landing_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landing_pages (id, page_code, page_name, page_title, page_slug, meta_description, meta_keywords, is_published, is_homepage, display_order, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: landing_pricing_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.landing_pricing_plans (id, plan_name, plan_code, description, price_monthly, price_annual, discount_label, features, highlight_features, is_popular, is_active, display_order, cta_text, cta_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lead_sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lead_sources (id, source_code, source_name, description, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leads (id, lead_number, company_name, contact_name, email, phone, source_id, status, rating, estimated_value, probability, expected_close_date, assigned_to, converted_to_customer_id, converted_at, notes, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: leave_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_balances (id, employee_id, leave_type_id, year, total_days, used_days, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_requests (id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, approved_by, approved_at, rejection_reason, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_types (id, leave_code, leave_name, description, default_days, is_paid, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_programs (id, program_code, program_name, description, points_per_ugx, is_active, start_date, end_date, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: machines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.machines (id, machine_code, machine_name, machine_type, manufacturer, model_number, serial_number, warehouse_id, purchase_date, purchase_cost, maintenance_interval, last_maintenance_date, next_maintenance_date, status, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: message_reactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_reactions (id, message_id, user_id, reaction_type, created_at) FROM stdin;
\.


--
-- Data for Name: message_recipients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.message_recipients (id, message_id, recipient_id, is_read, read_at, is_delivered, delivered_at, created_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, conversation_id, sender_id, message_type, message_content, file_url, file_name, file_size, is_read, read_at, is_deleted, deleted_at, created_at) FROM stdin;
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newsletter_subscribers (id, email, first_name, last_name, source, is_active, subscribed_at, unsubscribed_at, email_verified, verification_token) FROM stdin;
\.


--
-- Data for Name: notification_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_categories (id, category_code, category_name, description, icon, color, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notification_preferences (id, user_id, category_id, via_email, via_sms, via_in_app, via_push, quiet_hours_start, quiet_hours_end, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, category_id, notification_type, title, message, action_url, action_type, priority, is_read, read_at, sent_via_email, sent_via_sms, sent_via_push, created_at) FROM stdin;
\.


--
-- Data for Name: onboarding_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.onboarding_steps (id, step_code, step_name, step_description, step_order, is_required, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: page_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.page_sections (id, page_id, section_code, section_type, section_title, section_subtitle, content, display_order, is_visible, background_color, background_image, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: payment_allocations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_allocations (id, payment_id, invoice_type, invoice_id, allocated_amount, allocation_date, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_methods (id, user_id, method_type, provider, account_number, account_name, is_default, is_verified, verified_at, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, payment_number, payment_date, payment_type, party_type, party_id, bank_account_id, payment_method, reference_number, amount, allocated_amount, status, notes, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: payroll_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll_periods (id, period_code, period_name, start_date, end_date, payment_date, status, total_gross, total_deductions, total_net, approved_by, approved_at, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: payslip_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payslip_lines (id, payslip_id, component_id, component_type, amount, created_at) FROM stdin;
\.


--
-- Data for Name: payslips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payslips (id, payslip_number, period_id, employee_id, basic_salary, gross_salary, total_deductions, net_salary, payment_date, payment_method, bank_account_id, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, permission_name, permission_code, module, description, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: pos_cash_registers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pos_cash_registers (id, register_code, register_name, branch_id, assigned_user_id, opening_balance, closing_balance, opened_at, closed_at, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: product_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_batches (id, batch_number, product_id, warehouse_id, quantity, cost_per_unit, manufacture_date, expiry_date, received_date, supplier_id, status, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: product_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_categories (id, category_code, category_name, parent_id, description, image_url, is_active, display_order, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: product_price_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_price_history (id, product_id, price_type, old_price, new_price, effective_date, reason, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_code, barcode, product_name, category_id, description, product_type, unit_of_measure, cost_price, selling_price, tax_rate, reorder_level, reorder_quantity, min_stock_level, max_stock_level, current_stock, is_active, is_taxable, track_inventory, allow_backorder, image_url, images, attributes, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: project_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_tasks (id, task_code, project_id, parent_task_id, task_name, description, assigned_to, start_date, end_date, estimated_hours, actual_hours, status, priority, completion_percent, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, project_code, project_name, description, project_type, customer_id, project_manager_id, start_date, end_date, estimated_hours, actual_hours, budget, actual_cost, status, priority, completion_percent, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (id, po_id, product_id, description, quantity, quantity_received, unit_price, discount_amount, tax_rate, tax_amount, line_total, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, po_number, po_date, supplier_id, branch_id, warehouse_id, rfq_id, subtotal, discount_amount, tax_amount, shipping_amount, total_amount, status, payment_terms, expected_delivery_date, delivery_address, notes, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: quality_defects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quality_defects (id, inspection_id, defect_type, defect_description, severity, quantity_affected, action_taken, created_at) FROM stdin;
\.


--
-- Data for Name: quality_inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quality_inspections (id, inspection_number, inspection_date, inspection_type, reference_type, reference_id, product_id, batch_id, inspector_id, quantity_inspected, quantity_passed, quantity_failed, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: rfq_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rfq_items (id, rfq_id, product_id, description, quantity, unit_of_measure, specifications, created_at) FROM stdin;
\.


--
-- Data for Name: rfq_suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rfq_suppliers (id, rfq_id, supplier_id, sent_date, response_date, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: rfqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rfqs (id, rfq_number, rfq_date, title, description, required_by_date, status, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, role_id, permission_id, can_create, can_read, can_update, can_delete, can_export, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role_name, role_code, description, is_system_role, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: salary_components; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salary_components (id, component_code, component_name, component_type, calculation_type, is_taxable, is_statutory, is_active, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sales_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_order_items (id, order_id, product_id, batch_id, description, quantity, unit_price, discount_amount, discount_percent, tax_rate, tax_amount, line_total, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sales_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_orders (id, order_number, order_type, order_date, customer_id, branch_id, warehouse_id, salesperson_id, subtotal, discount_amount, discount_percent, tax_amount, shipping_amount, total_amount, amount_paid, status, payment_status, payment_terms, due_date, delivery_address, delivery_city, delivery_notes, internal_notes, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: sales_return_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_return_items (id, return_id, product_id, original_item_id, quantity, unit_price, refund_amount, condition, created_at) FROM stdin;
\.


--
-- Data for Name: sales_returns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_returns (id, return_number, return_date, original_order_id, customer_id, return_reason, refund_amount, refund_method, status, approved_by, approved_at, notes, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: xhenvolt
--

COPY public.settings (id, key, value, type, category, description, updated_by, created_at, updated_at) FROM stdin;
1	company_name	xhenonpro	string	branding	Company name displayed across the system	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.371065	2025-12-07 21:48:58.067727
2	company_tagline	Modern Business Management	string	branding	Company tagline	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.411526	2025-12-07 21:48:58.069644
4	currency_symbol	UGX	string	financial	Currency symbol	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.423427	2025-12-07 21:48:58.071297
3	default_currency	UGX	string	financial	Default currency code	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.421155	2025-12-07 21:48:58.072925
8	low_stock_threshold	10	number	inventory	Low stock alert threshold	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.432168	2025-12-07 21:48:58.074868
9	enable_landing_page	true	boolean	landing	Enable landing page	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.433606	2025-12-07 21:48:58.079237
10	show_pricing	true	boolean	landing	Show pricing on landing page	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.4355	2025-12-07 21:48:58.081956
11	show_testimonials	true	boolean	landing	Show testimonials on landing page	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.438424	2025-12-07 21:48:58.083503
7	enable_email_alerts	true	boolean	notifications	Enable email alerts	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.430665	2025-12-07 21:48:58.086655
5	enable_notifications	true	boolean	notifications	Enable system notifications	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.427076	2025-12-07 21:48:58.088844
6	notification_email		string	notifications	Email for system notifications	23e8f1d7-927a-434c-8ffa-020070708bb4	2025-12-07 21:48:33.428999	2025-12-07 21:48:58.090353
\.


--
-- Data for Name: signup_tracking; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signup_tracking (id, user_id, email, signup_step, current_step, total_steps, completion_percent, started_at, completed_at, last_activity_at, metadata) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, site_name, site_tagline, site_description, logo_url, favicon_url, primary_color, secondary_color, accent_color, font_family, contact_email, contact_phone, social_facebook, social_twitter, social_linkedin, social_instagram, google_analytics_id, meta_keywords, meta_description, maintenance_mode, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movements (id, movement_number, movement_type, product_id, batch_id, from_warehouse_id, to_warehouse_id, from_bin_id, to_bin_id, quantity, unit_cost, movement_date, reference_type, reference_id, notes, created_at, created_by) FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscription_plans (id, plan_name, plan_code, description, price_monthly, price_annual, discount_annual_percent, max_users, max_branches, max_products, max_storage_gb, max_automations, features, is_active, is_popular, display_order, created_at, updated_at, created_by, updated_by) FROM stdin;
aff09261-d957-4734-88a1-c34d34d99966	Starter	STARTER	Perfect for small businesses just getting started	150000.00	1500000.00	17.00	3	1	\N	5	\N	\N	t	f	1	2025-12-07 19:33:38.438363+03	2025-12-07 19:33:38.438363+03	\N	\N
5cc816f4-458c-4fd1-95d3-bc766b903090	Business	BUSINESS	Best for growing businesses with multiple users	350000.00	3500000.00	17.00	10	3	\N	25	\N	\N	t	t	2	2025-12-07 19:33:38.438363+03	2025-12-07 19:33:38.438363+03	\N	\N
c5394e25-7678-47bf-bcf0-ebf4f642cb67	Enterprise	ENTERPRISE	Advanced features for large organizations	750000.00	7500000.00	17.00	50	10	\N	100	\N	\N	t	f	3	2025-12-07 19:33:38.438363+03	2025-12-07 19:33:38.438363+03	\N	\N
dd6776c9-4473-4f4d-932b-b1ccddf9f010	Free Trial	FREE_TRIAL	30-day free trial with all features	0.00	0.00	0.00	5	1	\N	10	\N	\N	t	f	0	2025-12-07 19:33:38.438363+03	2025-12-07 19:33:38.438363+03	\N	\N
\.


--
-- Data for Name: supplier_evaluations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_evaluations (id, supplier_id, evaluation_date, quality_score, delivery_score, price_score, service_score, overall_score, comments, evaluator_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: supplier_invoice_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_invoice_items (id, invoice_id, product_id, description, quantity, unit_price, tax_rate, tax_amount, line_total, created_at) FROM stdin;
\.


--
-- Data for Name: supplier_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_invoices (id, invoice_number, supplier_invoice_number, invoice_date, due_date, supplier_id, po_id, grn_id, subtotal, discount_amount, tax_amount, total_amount, amount_paid, status, payment_status, approved_by, approved_at, notes, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, supplier_code, supplier_name, company_name, tax_id, email, phone, mobile, website, address, city, state_province, country, postal_code, payment_terms, credit_limit, current_balance, rating, category, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: system_health_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_health_metrics (id, metric_type, metric_value, metric_unit, module, recorded_at, metadata) FROM stdin;
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_settings (id, setting_key, setting_value, setting_type, description, is_public, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: task_time_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task_time_logs (id, task_id, user_id, log_date, hours, description, created_at) FROM stdin;
\.


--
-- Data for Name: taxes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taxes (id, tax_code, tax_name, tax_type, tax_rate, is_compound, is_active, description, created_at, updated_at, created_by, updated_by) FROM stdin;
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.testimonials (id, customer_name, customer_position, customer_company, customer_photo_url, testimonial_text, rating, is_featured, is_active, display_order, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: usage_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usage_logs (id, user_id, metric_type, metric_value, recorded_at, metadata) FROM stdin;
\.


--
-- Data for Name: user_onboarding_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_onboarding_progress (id, user_id, step_id, is_completed, completed_at, skipped, created_at) FROM stdin;
\.


--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_sessions (id, user_id, session_token, ip_address, user_agent, device_type, location, login_at, logout_at, is_active, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: user_subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_subscriptions (id, user_id, plan_id, status, billing_cycle, amount, start_date, end_date, auto_renew, trial_ends_at, cancelled_at, cancellation_reason, created_at, updated_at, created_by, updated_by) FROM stdin;
c17d6bdf-52a0-4876-8f9a-32cb4e65aeba	23e8f1d7-927a-434c-8ffa-020070708bb4	dd6776c9-4473-4f4d-932b-b1ccddf9f010	active	monthly	0.00	2025-12-07	2026-01-06	t	2026-01-06 20:32:59.722+03	\N	\N	2025-12-07 20:32:59.723787+03	2025-12-07 20:32:59.723787+03	\N	\N
b26f61e0-3c86-41a2-8b2a-59e0e0acfc6a	06e0357d-658c-4add-aaf7-098d3eb5e917	dd6776c9-4473-4f4d-932b-b1ccddf9f010	active	monthly	0.00	2025-12-07	2026-01-06	t	2026-01-06 23:04:02.813+03	\N	\N	2025-12-07 23:04:02.814776+03	2025-12-07 23:04:02.814776+03	\N	\N
7076452a-f1b0-4e54-ba6a-7ebd292d769b	a811ecfa-105b-43c1-8019-8c924dff070c	dd6776c9-4473-4f4d-932b-b1ccddf9f010	active	monthly	0.00	2025-12-13	2026-01-12	t	2026-01-12 14:24:14.627+03	\N	\N	2025-12-13 14:24:14.628759+03	2025-12-13 14:24:14.628759+03	\N	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, employee_code, username, email, password_hash, first_name, last_name, phone, avatar_url, role_id, branch_id, department, "position", is_active, last_login_at, email_verified_at, phone_verified_at, two_factor_enabled, two_factor_secret, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
23e8f1d7-927a-434c-8ffa-020070708bb4	\N	xhenopro	xhenopro@gmail.com	$2b$12$0fRI1S5m1HZFOre6TFjOI.gDqOTWklEy9P.zaueoz/Y/SKUKZo4W2	hamuza	ibrahim	0741114147	\N	\N	91e4000f-1c53-4e1f-8ced-e332846bab31	\N	\N	t	\N	\N	\N	f	\N	2025-12-07 20:31:30.636618+03	2025-12-07 21:52:24.385853+03	\N	\N	\N
06e0357d-658c-4add-aaf7-098d3eb5e917	\N	Xhenonprototype	Xhenonprototype@gmail.com	$2b$12$0ELhrTNGv/dX4.P8NXbNUuY1P7i5UVMmTaq2nZyPzb5wHISg/nF4W	Hermxher	Xhenonpro	0745726350	\N	\N	0903f256-bdf1-4396-80e0-cc72fb14453d	\N	\N	t	\N	\N	\N	f	\N	2025-12-07 23:02:00.402446+03	2025-12-07 23:03:59.403626+03	\N	\N	\N
a811ecfa-105b-43c1-8019-8c924dff070c	\N	aishana	aishana@gmail.com	$2b$12$EkRwZlR/j4OIPa/rYH.XvewSkF4YCpY7hPXwzDw24HH.YsajdaQgu	namuyaba 	aisha	0774547788	\N	\N	29bddb12-5885-4692-8513-35c3e77555b8	\N	\N	t	\N	\N	\N	f	\N	2025-12-13 14:23:44.983428+03	2025-12-13 14:24:25.672608+03	\N	\N	\N
\.


--
-- Data for Name: warehouse_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouse_locations (id, warehouse_id, location_code, location_name, location_type, parent_id, capacity, capacity_unit, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, warehouse_code, warehouse_name, branch_id, warehouse_type, manager_id, address, city, state_province, country, postal_code, capacity, capacity_unit, is_active, created_at, updated_at, created_by, updated_by, deleted_at) FROM stdin;
\.


--
-- Data for Name: work_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.work_orders (id, work_order_number, work_order_date, product_id, bom_id, quantity_planned, quantity_produced, warehouse_id, start_date, end_date, status, priority, notes, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Data for Name: workflow_executions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_executions (id, template_id, execution_status, started_at, completed_at, error_message, input_data, output_data, triggered_by) FROM stdin;
\.


--
-- Data for Name: workflow_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.workflow_templates (id, template_code, template_name, description, trigger_type, trigger_config, module, is_active, created_at, updated_at, created_by) FROM stdin;
\.


--
-- Name: seq_billing_invoice; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_billing_invoice', 1, false);


--
-- Name: seq_contract; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_contract', 1, false);


--
-- Name: seq_delivery_order; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_delivery_order', 1, false);


--
-- Name: seq_document; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_document', 1, false);


--
-- Name: seq_expense; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_expense', 1, false);


--
-- Name: seq_grn; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_grn', 1, false);


--
-- Name: seq_inventory_adjustment; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_inventory_adjustment', 1, false);


--
-- Name: seq_inventory_transfer; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_inventory_transfer', 1, false);


--
-- Name: seq_invoice; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_invoice', 1, false);


--
-- Name: seq_journal_entry; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_journal_entry', 1, false);


--
-- Name: seq_lead; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_lead', 1, false);


--
-- Name: seq_payment; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_payment', 1, false);


--
-- Name: seq_payroll_period; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_payroll_period', 1, false);


--
-- Name: seq_payslip; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_payslip', 1, false);


--
-- Name: seq_project; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_project', 1, false);


--
-- Name: seq_purchase_order; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_purchase_order', 1, false);


--
-- Name: seq_quality_inspection; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_quality_inspection', 1, false);


--
-- Name: seq_rfq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_rfq', 1, false);


--
-- Name: seq_sales_order; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_sales_order', 1, false);


--
-- Name: seq_sales_return; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_sales_return', 1, false);


--
-- Name: seq_stock_movement; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_stock_movement', 1, false);


--
-- Name: seq_supplier_invoice; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_supplier_invoice', 1, false);


--
-- Name: seq_work_order; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seq_work_order', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: xhenvolt
--

SELECT pg_catalog.setval('public.settings_id_seq', 11, true);


--
-- Name: asset_categories asset_categories_category_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_category_code_key UNIQUE (category_code);


--
-- Name: asset_categories asset_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_categories
    ADD CONSTRAINT asset_categories_pkey PRIMARY KEY (id);


--
-- Name: asset_depreciation asset_depreciation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_depreciation
    ADD CONSTRAINT asset_depreciation_pkey PRIMARY KEY (id);


--
-- Name: asset_maintenance asset_maintenance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_maintenance
    ADD CONSTRAINT asset_maintenance_pkey PRIMARY KEY (id);


--
-- Name: asset_transfers asset_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_employee_id_attendance_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_employee_id_attendance_date_key UNIQUE (employee_id, attendance_date);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bank_accounts bank_accounts_account_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_account_code_key UNIQUE (account_code);


--
-- Name: bank_accounts bank_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_pkey PRIMARY KEY (id);


--
-- Name: billing_invoice_items billing_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoice_items
    ADD CONSTRAINT billing_invoice_items_pkey PRIMARY KEY (id);


--
-- Name: billing_invoices billing_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: billing_invoices billing_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_pkey PRIMARY KEY (id);


--
-- Name: bins bins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bins
    ADD CONSTRAINT bins_pkey PRIMARY KEY (id);


--
-- Name: bins bins_warehouse_location_id_bin_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bins
    ADD CONSTRAINT bins_warehouse_location_id_bin_code_key UNIQUE (warehouse_location_id, bin_code);


--
-- Name: bom_headers bom_headers_bom_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_headers
    ADD CONSTRAINT bom_headers_bom_code_key UNIQUE (bom_code);


--
-- Name: bom_headers bom_headers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_headers
    ADD CONSTRAINT bom_headers_pkey PRIMARY KEY (id);


--
-- Name: bom_items bom_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_items
    ADD CONSTRAINT bom_items_pkey PRIMARY KEY (id);


--
-- Name: branches branches_branch_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_branch_code_key UNIQUE (branch_code);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: budget_lines budget_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_pkey PRIMARY KEY (id);


--
-- Name: budgets budgets_budget_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_budget_code_key UNIQUE (budget_code);


--
-- Name: budgets budgets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_pkey PRIMARY KEY (id);


--
-- Name: business_info business_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_info
    ADD CONSTRAINT business_info_pkey PRIMARY KEY (id);


--
-- Name: chart_of_accounts chart_of_accounts_account_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_account_code_key UNIQUE (account_code);


--
-- Name: chart_of_accounts chart_of_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_pkey PRIMARY KEY (id);


--
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_contract_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_contract_number_key UNIQUE (contract_number);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: crm_activities crm_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_pkey PRIMARY KEY (id);


--
-- Name: cta_banners cta_banners_banner_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cta_banners
    ADD CONSTRAINT cta_banners_banner_code_key UNIQUE (banner_code);


--
-- Name: cta_banners cta_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cta_banners
    ADD CONSTRAINT cta_banners_pkey PRIMARY KEY (id);


--
-- Name: currencies currencies_currency_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_currency_code_key UNIQUE (currency_code);


--
-- Name: currencies currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: customer_loyalty_points customer_loyalty_points_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_loyalty_points
    ADD CONSTRAINT customer_loyalty_points_pkey PRIMARY KEY (id);


--
-- Name: customers customers_customer_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_customer_code_key UNIQUE (customer_code);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: delivery_order_items delivery_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_order_items
    ADD CONSTRAINT delivery_order_items_pkey PRIMARY KEY (id);


--
-- Name: delivery_orders delivery_orders_delivery_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_orders
    ADD CONSTRAINT delivery_orders_delivery_number_key UNIQUE (delivery_number);


--
-- Name: delivery_orders delivery_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_orders
    ADD CONSTRAINT delivery_orders_pkey PRIMARY KEY (id);


--
-- Name: delivery_tracking delivery_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_tracking
    ADD CONSTRAINT delivery_tracking_pkey PRIMARY KEY (id);


--
-- Name: demo_requests demo_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_pkey PRIMARY KEY (id);


--
-- Name: document_audit document_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_audit
    ADD CONSTRAINT document_audit_pkey PRIMARY KEY (id);


--
-- Name: document_categories document_categories_category_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories
    ADD CONSTRAINT document_categories_category_code_key UNIQUE (category_code);


--
-- Name: document_categories document_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories
    ADD CONSTRAINT document_categories_pkey PRIMARY KEY (id);


--
-- Name: document_permissions document_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_permissions
    ADD CONSTRAINT document_permissions_pkey PRIMARY KEY (id);


--
-- Name: documents documents_document_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_document_number_key UNIQUE (document_number);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: employee_salary_structures employee_salary_structures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary_structures
    ADD CONSTRAINT employee_salary_structures_pkey PRIMARY KEY (id);


--
-- Name: employees employees_employee_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_number_key UNIQUE (employee_number);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: employees employees_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_key UNIQUE (user_id);


--
-- Name: error_logs error_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.error_logs
    ADD CONSTRAINT error_logs_pkey PRIMARY KEY (id);


--
-- Name: exchange_rates exchange_rates_currency_id_rate_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_currency_id_rate_date_key UNIQUE (currency_id, rate_date);


--
-- Name: exchange_rates exchange_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_pkey PRIMARY KEY (id);


--
-- Name: expense_categories expense_categories_category_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_category_code_key UNIQUE (category_code);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (id);


--
-- Name: expenses expenses_expense_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_expense_number_key UNIQUE (expense_number);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (id);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: fixed_assets fixed_assets_asset_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_asset_code_key UNIQUE (asset_code);


--
-- Name: fixed_assets fixed_assets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_pkey PRIMARY KEY (id);


--
-- Name: goods_received_notes goods_received_notes_grn_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_grn_number_key UNIQUE (grn_number);


--
-- Name: goods_received_notes goods_received_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_pkey PRIMARY KEY (id);


--
-- Name: grn_items grn_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_items
    ADD CONSTRAINT grn_items_pkey PRIMARY KEY (id);


--
-- Name: hero_sections hero_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero_sections
    ADD CONSTRAINT hero_sections_pkey PRIMARY KEY (id);


--
-- Name: inventory_adjustment_items inventory_adjustment_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_adjustments inventory_adjustments_adjustment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_adjustment_number_key UNIQUE (adjustment_number);


--
-- Name: inventory_adjustments inventory_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_pkey PRIMARY KEY (id);


--
-- Name: inventory_transfer_items inventory_transfer_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfer_items
    ADD CONSTRAINT inventory_transfer_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_transfers inventory_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_pkey PRIMARY KEY (id);


--
-- Name: inventory_transfers inventory_transfers_transfer_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_transfer_number_key UNIQUE (transfer_number);


--
-- Name: iot_devices iot_devices_device_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_device_code_key UNIQUE (device_code);


--
-- Name: iot_devices iot_devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_journal_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_journal_number_key UNIQUE (journal_number);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: journal_entry_lines journal_entry_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_pkey PRIMARY KEY (id);


--
-- Name: landing_pages landing_pages_page_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landing_pages
    ADD CONSTRAINT landing_pages_page_code_key UNIQUE (page_code);


--
-- Name: landing_pages landing_pages_page_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landing_pages
    ADD CONSTRAINT landing_pages_page_slug_key UNIQUE (page_slug);


--
-- Name: landing_pages landing_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landing_pages
    ADD CONSTRAINT landing_pages_pkey PRIMARY KEY (id);


--
-- Name: landing_pricing_plans landing_pricing_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landing_pricing_plans
    ADD CONSTRAINT landing_pricing_plans_pkey PRIMARY KEY (id);


--
-- Name: landing_pricing_plans landing_pricing_plans_plan_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.landing_pricing_plans
    ADD CONSTRAINT landing_pricing_plans_plan_code_key UNIQUE (plan_code);


--
-- Name: lead_sources lead_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_sources
    ADD CONSTRAINT lead_sources_pkey PRIMARY KEY (id);


--
-- Name: lead_sources lead_sources_source_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lead_sources
    ADD CONSTRAINT lead_sources_source_code_key UNIQUE (source_code);


--
-- Name: leads leads_lead_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_lead_number_key UNIQUE (lead_number);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: leave_balances leave_balances_employee_id_leave_type_id_year_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_employee_id_leave_type_id_year_key UNIQUE (employee_id, leave_type_id, year);


--
-- Name: leave_balances leave_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: leave_types leave_types_leave_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_leave_code_key UNIQUE (leave_code);


--
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- Name: loyalty_programs loyalty_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT loyalty_programs_pkey PRIMARY KEY (id);


--
-- Name: loyalty_programs loyalty_programs_program_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT loyalty_programs_program_code_key UNIQUE (program_code);


--
-- Name: machines machines_machine_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_machine_code_key UNIQUE (machine_code);


--
-- Name: machines machines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_pkey PRIMARY KEY (id);


--
-- Name: message_reactions message_reactions_message_id_user_id_reaction_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_message_id_user_id_reaction_type_key UNIQUE (message_id, user_id, reaction_type);


--
-- Name: message_reactions message_reactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_pkey PRIMARY KEY (id);


--
-- Name: message_recipients message_recipients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_recipients
    ADD CONSTRAINT message_recipients_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: notification_categories notification_categories_category_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_categories
    ADD CONSTRAINT notification_categories_category_code_key UNIQUE (category_code);


--
-- Name: notification_categories notification_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_categories
    ADD CONSTRAINT notification_categories_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_user_id_category_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_category_id_key UNIQUE (user_id, category_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: onboarding_steps onboarding_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_steps
    ADD CONSTRAINT onboarding_steps_pkey PRIMARY KEY (id);


--
-- Name: onboarding_steps onboarding_steps_step_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_steps
    ADD CONSTRAINT onboarding_steps_step_code_key UNIQUE (step_code);


--
-- Name: page_sections page_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_pkey PRIMARY KEY (id);


--
-- Name: payment_allocations payment_allocations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_allocations
    ADD CONSTRAINT payment_allocations_pkey PRIMARY KEY (id);


--
-- Name: payment_methods payment_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_pkey PRIMARY KEY (id);


--
-- Name: payments payments_payment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_number_key UNIQUE (payment_number);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: payroll_periods payroll_periods_period_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_period_code_key UNIQUE (period_code);


--
-- Name: payroll_periods payroll_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_pkey PRIMARY KEY (id);


--
-- Name: payslip_lines payslip_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslip_lines
    ADD CONSTRAINT payslip_lines_pkey PRIMARY KEY (id);


--
-- Name: payslips payslips_payslip_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_payslip_number_key UNIQUE (payslip_number);


--
-- Name: payslips payslips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_permission_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permission_code_key UNIQUE (permission_code);


--
-- Name: permissions permissions_permission_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permission_name_key UNIQUE (permission_name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pos_cash_registers pos_cash_registers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_cash_registers
    ADD CONSTRAINT pos_cash_registers_pkey PRIMARY KEY (id);


--
-- Name: pos_cash_registers pos_cash_registers_register_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_cash_registers
    ADD CONSTRAINT pos_cash_registers_register_code_key UNIQUE (register_code);


--
-- Name: product_batches product_batches_batch_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_batch_number_key UNIQUE (batch_number);


--
-- Name: product_batches product_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_category_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_category_code_key UNIQUE (category_code);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_price_history product_price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_price_history
    ADD CONSTRAINT product_price_history_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_product_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_product_code_key UNIQUE (product_code);


--
-- Name: project_tasks project_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_pkey PRIMARY KEY (id);


--
-- Name: project_tasks project_tasks_project_id_task_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_project_id_task_code_key UNIQUE (project_id, task_code);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: projects projects_project_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_project_code_key UNIQUE (project_code);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_po_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_po_number_key UNIQUE (po_number);


--
-- Name: quality_defects quality_defects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_defects
    ADD CONSTRAINT quality_defects_pkey PRIMARY KEY (id);


--
-- Name: quality_inspections quality_inspections_inspection_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_inspections
    ADD CONSTRAINT quality_inspections_inspection_number_key UNIQUE (inspection_number);


--
-- Name: quality_inspections quality_inspections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_inspections
    ADD CONSTRAINT quality_inspections_pkey PRIMARY KEY (id);


--
-- Name: rfq_items rfq_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_items
    ADD CONSTRAINT rfq_items_pkey PRIMARY KEY (id);


--
-- Name: rfq_suppliers rfq_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_suppliers
    ADD CONSTRAINT rfq_suppliers_pkey PRIMARY KEY (id);


--
-- Name: rfq_suppliers rfq_suppliers_rfq_id_supplier_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_suppliers
    ADD CONSTRAINT rfq_suppliers_rfq_id_supplier_id_key UNIQUE (rfq_id, supplier_id);


--
-- Name: rfqs rfqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfqs
    ADD CONSTRAINT rfqs_pkey PRIMARY KEY (id);


--
-- Name: rfqs rfqs_rfq_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfqs
    ADD CONSTRAINT rfqs_rfq_number_key UNIQUE (rfq_number);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_role_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_code_key UNIQUE (role_code);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: salary_components salary_components_component_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT salary_components_component_code_key UNIQUE (component_code);


--
-- Name: salary_components salary_components_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salary_components
    ADD CONSTRAINT salary_components_pkey PRIMARY KEY (id);


--
-- Name: sales_order_items sales_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_pkey PRIMARY KEY (id);


--
-- Name: sales_orders sales_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_order_number_key UNIQUE (order_number);


--
-- Name: sales_orders sales_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_pkey PRIMARY KEY (id);


--
-- Name: sales_return_items sales_return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_items
    ADD CONSTRAINT sales_return_items_pkey PRIMARY KEY (id);


--
-- Name: sales_returns sales_returns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_pkey PRIMARY KEY (id);


--
-- Name: sales_returns sales_returns_return_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_return_number_key UNIQUE (return_number);


--
-- Name: settings settings_key_key; Type: CONSTRAINT; Schema: public; Owner: xhenvolt
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_key_key UNIQUE (key);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: xhenvolt
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: signup_tracking signup_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signup_tracking
    ADD CONSTRAINT signup_tracking_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_movement_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_movement_number_key UNIQUE (movement_number);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_plan_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_plan_code_key UNIQUE (plan_code);


--
-- Name: subscription_plans subscription_plans_plan_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_plan_name_key UNIQUE (plan_name);


--
-- Name: supplier_evaluations supplier_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations
    ADD CONSTRAINT supplier_evaluations_pkey PRIMARY KEY (id);


--
-- Name: supplier_invoice_items supplier_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_pkey PRIMARY KEY (id);


--
-- Name: supplier_invoices supplier_invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: supplier_invoices supplier_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_supplier_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_supplier_code_key UNIQUE (supplier_code);


--
-- Name: system_health_metrics system_health_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_health_metrics
    ADD CONSTRAINT system_health_metrics_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_setting_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_setting_key_key UNIQUE (setting_key);


--
-- Name: task_time_logs task_time_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_time_logs
    ADD CONSTRAINT task_time_logs_pkey PRIMARY KEY (id);


--
-- Name: taxes taxes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxes
    ADD CONSTRAINT taxes_pkey PRIMARY KEY (id);


--
-- Name: taxes taxes_tax_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taxes
    ADD CONSTRAINT taxes_tax_code_key UNIQUE (tax_code);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: usage_logs usage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT usage_logs_pkey PRIMARY KEY (id);


--
-- Name: user_onboarding_progress user_onboarding_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_onboarding_progress
    ADD CONSTRAINT user_onboarding_progress_pkey PRIMARY KEY (id);


--
-- Name: user_onboarding_progress user_onboarding_progress_user_id_step_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_onboarding_progress
    ADD CONSTRAINT user_onboarding_progress_user_id_step_id_key UNIQUE (user_id, step_id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_session_token_key UNIQUE (session_token);


--
-- Name: user_subscriptions user_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_employee_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_code_key UNIQUE (employee_code);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: warehouse_locations warehouse_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_locations
    ADD CONSTRAINT warehouse_locations_pkey PRIMARY KEY (id);


--
-- Name: warehouse_locations warehouse_locations_warehouse_id_location_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_locations
    ADD CONSTRAINT warehouse_locations_warehouse_id_location_code_key UNIQUE (warehouse_id, location_code);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: warehouses warehouses_warehouse_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_warehouse_code_key UNIQUE (warehouse_code);


--
-- Name: work_orders work_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_pkey PRIMARY KEY (id);


--
-- Name: work_orders work_orders_work_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_work_order_number_key UNIQUE (work_order_number);


--
-- Name: workflow_executions workflow_executions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT workflow_executions_pkey PRIMARY KEY (id);


--
-- Name: workflow_templates workflow_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_templates
    ADD CONSTRAINT workflow_templates_pkey PRIMARY KEY (id);


--
-- Name: workflow_templates workflow_templates_template_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_templates
    ADD CONSTRAINT workflow_templates_template_code_key UNIQUE (template_code);


--
-- Name: idx_asset_depreciation_asset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_depreciation_asset ON public.asset_depreciation USING btree (asset_id);


--
-- Name: idx_asset_maintenance_asset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_maintenance_asset ON public.asset_maintenance USING btree (asset_id);


--
-- Name: idx_asset_transfers_asset; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asset_transfers_asset ON public.asset_transfers USING btree (asset_id);


--
-- Name: idx_attendance_records_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_records_date ON public.attendance_records USING btree (attendance_date);


--
-- Name: idx_attendance_records_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_attendance_records_employee ON public.attendance_records USING btree (employee_id);


--
-- Name: idx_audit_logs_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_logs_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type, entity_id);


--
-- Name: idx_audit_logs_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_bank_accounts_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bank_accounts_code ON public.bank_accounts USING btree (account_code);


--
-- Name: idx_bank_accounts_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bank_accounts_type ON public.bank_accounts USING btree (account_type);


--
-- Name: idx_billing_invoice_items_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_invoice_items_invoice ON public.billing_invoice_items USING btree (invoice_id);


--
-- Name: idx_billing_invoices_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_invoices_date ON public.billing_invoices USING btree (invoice_date);


--
-- Name: idx_billing_invoices_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_invoices_number ON public.billing_invoices USING btree (invoice_number);


--
-- Name: idx_billing_invoices_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_invoices_status ON public.billing_invoices USING btree (status);


--
-- Name: idx_billing_invoices_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_invoices_user ON public.billing_invoices USING btree (user_id);


--
-- Name: idx_bins_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bins_location ON public.bins USING btree (warehouse_location_id);


--
-- Name: idx_bom_headers_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bom_headers_code ON public.bom_headers USING btree (bom_code);


--
-- Name: idx_bom_headers_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bom_headers_product ON public.bom_headers USING btree (product_id);


--
-- Name: idx_bom_items_bom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bom_items_bom ON public.bom_items USING btree (bom_id);


--
-- Name: idx_bom_items_component; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bom_items_component ON public.bom_items USING btree (component_product_id);


--
-- Name: idx_branches_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_branches_active ON public.branches USING btree (is_active);


--
-- Name: idx_branches_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_branches_code ON public.branches USING btree (branch_code);


--
-- Name: idx_budget_lines_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budget_lines_account ON public.budget_lines USING btree (account_id);


--
-- Name: idx_budget_lines_budget; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budget_lines_budget ON public.budget_lines USING btree (budget_id);


--
-- Name: idx_budgets_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_code ON public.budgets USING btree (budget_code);


--
-- Name: idx_budgets_fiscal_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_budgets_fiscal_year ON public.budgets USING btree (fiscal_year);


--
-- Name: idx_chart_of_accounts_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chart_of_accounts_code ON public.chart_of_accounts USING btree (account_code);


--
-- Name: idx_chart_of_accounts_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chart_of_accounts_parent ON public.chart_of_accounts USING btree (parent_id);


--
-- Name: idx_chart_of_accounts_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chart_of_accounts_type ON public.chart_of_accounts USING btree (account_type);


--
-- Name: idx_contact_submissions_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_submissions_email ON public.contact_submissions USING btree (email);


--
-- Name: idx_contact_submissions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status);


--
-- Name: idx_crm_activities_assigned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crm_activities_assigned ON public.crm_activities USING btree (assigned_to);


--
-- Name: idx_crm_activities_related; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crm_activities_related ON public.crm_activities USING btree (related_to_type, related_to_id);


--
-- Name: idx_crm_activities_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_crm_activities_type ON public.crm_activities USING btree (activity_type);


--
-- Name: idx_customer_loyalty_points_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customer_loyalty_points_customer ON public.customer_loyalty_points USING btree (customer_id);


--
-- Name: idx_customers_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customers_active ON public.customers USING btree (is_active);


--
-- Name: idx_customers_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customers_code ON public.customers USING btree (customer_code);


--
-- Name: idx_customers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customers_email ON public.customers USING btree (email);


--
-- Name: idx_customers_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_customers_name ON public.customers USING btree (customer_name);


--
-- Name: idx_delivery_order_items_delivery; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_order_items_delivery ON public.delivery_order_items USING btree (delivery_id);


--
-- Name: idx_delivery_order_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_order_items_product ON public.delivery_order_items USING btree (product_id);


--
-- Name: idx_delivery_orders_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_orders_customer ON public.delivery_orders USING btree (customer_id);


--
-- Name: idx_delivery_orders_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_orders_date ON public.delivery_orders USING btree (delivery_date);


--
-- Name: idx_delivery_orders_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_orders_number ON public.delivery_orders USING btree (delivery_number);


--
-- Name: idx_delivery_orders_sales_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_orders_sales_order ON public.delivery_orders USING btree (sales_order_id);


--
-- Name: idx_delivery_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_orders_status ON public.delivery_orders USING btree (status);


--
-- Name: idx_delivery_tracking_delivery; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_tracking_delivery ON public.delivery_tracking USING btree (delivery_id);


--
-- Name: idx_delivery_tracking_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_delivery_tracking_time ON public.delivery_tracking USING btree (recorded_at);


--
-- Name: idx_demo_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_demo_requests_status ON public.demo_requests USING btree (status);


--
-- Name: idx_document_audit_document; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_audit_document ON public.document_audit USING btree (document_id);


--
-- Name: idx_document_audit_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_audit_user ON public.document_audit USING btree (user_id);


--
-- Name: idx_document_permissions_document; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_permissions_document ON public.document_permissions USING btree (document_id);


--
-- Name: idx_document_permissions_permission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_document_permissions_permission ON public.document_permissions USING btree (permission_type, permission_id);


--
-- Name: idx_documents_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_category ON public.documents USING btree (category_id);


--
-- Name: idx_documents_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_number ON public.documents USING btree (document_number);


--
-- Name: idx_documents_related; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documents_related ON public.documents USING btree (related_to_type, related_to_id);


--
-- Name: idx_employee_salary_structures_component; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_salary_structures_component ON public.employee_salary_structures USING btree (component_id);


--
-- Name: idx_employee_salary_structures_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_salary_structures_employee ON public.employee_salary_structures USING btree (employee_id);


--
-- Name: idx_employees_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_branch ON public.employees USING btree (branch_id);


--
-- Name: idx_employees_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_number ON public.employees USING btree (employee_number);


--
-- Name: idx_employees_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_status ON public.employees USING btree (employment_status);


--
-- Name: idx_employees_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_user ON public.employees USING btree (user_id);


--
-- Name: idx_error_logs_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_error_logs_created ON public.error_logs USING btree (created_at);


--
-- Name: idx_error_logs_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_error_logs_module ON public.error_logs USING btree (module);


--
-- Name: idx_error_logs_severity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_error_logs_severity ON public.error_logs USING btree (severity);


--
-- Name: idx_error_logs_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_error_logs_type ON public.error_logs USING btree (error_type);


--
-- Name: idx_exchange_rates_currency; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_exchange_rates_currency ON public.exchange_rates USING btree (currency_id);


--
-- Name: idx_expense_categories_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expense_categories_code ON public.expense_categories USING btree (category_code);


--
-- Name: idx_expenses_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_category ON public.expenses USING btree (category_id);


--
-- Name: idx_expenses_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_date ON public.expenses USING btree (expense_date);


--
-- Name: idx_expenses_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_number ON public.expenses USING btree (expense_number);


--
-- Name: idx_expenses_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_status ON public.expenses USING btree (status);


--
-- Name: idx_features_page; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_features_page ON public.features USING btree (page_id);


--
-- Name: idx_fixed_assets_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fixed_assets_category ON public.fixed_assets USING btree (category_id);


--
-- Name: idx_fixed_assets_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fixed_assets_code ON public.fixed_assets USING btree (asset_code);


--
-- Name: idx_goods_received_notes_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_number ON public.goods_received_notes USING btree (grn_number);


--
-- Name: idx_goods_received_notes_po; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_po ON public.goods_received_notes USING btree (po_id);


--
-- Name: idx_goods_received_notes_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_supplier ON public.goods_received_notes USING btree (supplier_id);


--
-- Name: idx_grn_items_grn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grn_items_grn ON public.grn_items USING btree (grn_id);


--
-- Name: idx_grn_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_grn_items_product ON public.grn_items USING btree (product_id);


--
-- Name: idx_hero_sections_page; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hero_sections_page ON public.hero_sections USING btree (page_id);


--
-- Name: idx_inventory_adjustment_items_adjustment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_adjustment ON public.inventory_adjustment_items USING btree (adjustment_id);


--
-- Name: idx_inventory_adjustment_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_product ON public.inventory_adjustment_items USING btree (product_id);


--
-- Name: idx_inventory_adjustments_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_date ON public.inventory_adjustments USING btree (adjustment_date);


--
-- Name: idx_inventory_adjustments_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_number ON public.inventory_adjustments USING btree (adjustment_number);


--
-- Name: idx_inventory_adjustments_warehouse; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_warehouse ON public.inventory_adjustments USING btree (warehouse_id);


--
-- Name: idx_inventory_transfer_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transfer_items_product ON public.inventory_transfer_items USING btree (product_id);


--
-- Name: idx_inventory_transfer_items_transfer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transfer_items_transfer ON public.inventory_transfer_items USING btree (transfer_id);


--
-- Name: idx_inventory_transfers_from; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transfers_from ON public.inventory_transfers USING btree (from_warehouse_id);


--
-- Name: idx_inventory_transfers_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transfers_number ON public.inventory_transfers USING btree (transfer_number);


--
-- Name: idx_inventory_transfers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transfers_status ON public.inventory_transfers USING btree (status);


--
-- Name: idx_inventory_transfers_to; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_transfers_to ON public.inventory_transfers USING btree (to_warehouse_id);


--
-- Name: idx_journal_entries_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entries_date ON public.journal_entries USING btree (journal_date);


--
-- Name: idx_journal_entries_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entries_number ON public.journal_entries USING btree (journal_number);


--
-- Name: idx_journal_entries_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entries_status ON public.journal_entries USING btree (status);


--
-- Name: idx_journal_entries_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entries_type ON public.journal_entries USING btree (journal_type);


--
-- Name: idx_journal_entry_lines_account; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entry_lines_account ON public.journal_entry_lines USING btree (account_id);


--
-- Name: idx_journal_entry_lines_journal; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entry_lines_journal ON public.journal_entry_lines USING btree (journal_id);


--
-- Name: idx_journal_entry_lines_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entry_lines_type ON public.journal_entry_lines USING btree (line_type);


--
-- Name: idx_landing_pages_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_landing_pages_slug ON public.landing_pages USING btree (page_slug);


--
-- Name: idx_landing_pricing_plans_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_landing_pricing_plans_code ON public.landing_pricing_plans USING btree (plan_code);


--
-- Name: idx_leads_assigned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_assigned ON public.leads USING btree (assigned_to);


--
-- Name: idx_leads_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_number ON public.leads USING btree (lead_number);


--
-- Name: idx_leads_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leads_status ON public.leads USING btree (status);


--
-- Name: idx_leave_balances_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_balances_employee ON public.leave_balances USING btree (employee_id);


--
-- Name: idx_leave_requests_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_dates ON public.leave_requests USING btree (start_date, end_date);


--
-- Name: idx_leave_requests_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_employee ON public.leave_requests USING btree (employee_id);


--
-- Name: idx_leave_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_status ON public.leave_requests USING btree (status);


--
-- Name: idx_machines_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_machines_code ON public.machines USING btree (machine_code);


--
-- Name: idx_message_reactions_message; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_message_reactions_message ON public.message_reactions USING btree (message_id);


--
-- Name: idx_message_recipients_message; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_message_recipients_message ON public.message_recipients USING btree (message_id);


--
-- Name: idx_message_recipients_recipient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_message_recipients_recipient ON public.message_recipients USING btree (recipient_id);


--
-- Name: idx_messages_conversation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_conversation ON public.messages USING btree (conversation_id);


--
-- Name: idx_messages_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_created ON public.messages USING btree (created_at);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: idx_newsletter_subscribers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers USING btree (email);


--
-- Name: idx_notification_preferences_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notification_preferences_user ON public.notification_preferences USING btree (user_id);


--
-- Name: idx_notifications_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_created ON public.notifications USING btree (created_at);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notifications_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_type ON public.notifications USING btree (notification_type);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_page_sections_page; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_page_sections_page ON public.page_sections USING btree (page_id);


--
-- Name: idx_payment_allocations_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_allocations_invoice ON public.payment_allocations USING btree (invoice_type, invoice_id);


--
-- Name: idx_payment_allocations_payment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_allocations_payment ON public.payment_allocations USING btree (payment_id);


--
-- Name: idx_payment_methods_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_methods_type ON public.payment_methods USING btree (method_type);


--
-- Name: idx_payment_methods_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payment_methods_user ON public.payment_methods USING btree (user_id);


--
-- Name: idx_payments_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_date ON public.payments USING btree (payment_date);


--
-- Name: idx_payments_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_number ON public.payments USING btree (payment_number);


--
-- Name: idx_payments_party; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_party ON public.payments USING btree (party_type, party_id);


--
-- Name: idx_payments_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_type ON public.payments USING btree (payment_type);


--
-- Name: idx_payroll_periods_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payroll_periods_code ON public.payroll_periods USING btree (period_code);


--
-- Name: idx_payroll_periods_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payroll_periods_dates ON public.payroll_periods USING btree (start_date, end_date);


--
-- Name: idx_payslip_lines_payslip; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payslip_lines_payslip ON public.payslip_lines USING btree (payslip_id);


--
-- Name: idx_payslips_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payslips_employee ON public.payslips USING btree (employee_id);


--
-- Name: idx_payslips_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payslips_number ON public.payslips USING btree (payslip_number);


--
-- Name: idx_payslips_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payslips_period ON public.payslips USING btree (period_id);


--
-- Name: idx_permissions_module; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_permissions_module ON public.permissions USING btree (module);


--
-- Name: idx_pos_cash_registers_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pos_cash_registers_code ON public.pos_cash_registers USING btree (register_code);


--
-- Name: idx_pos_cash_registers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pos_cash_registers_status ON public.pos_cash_registers USING btree (status);


--
-- Name: idx_product_batches_expiry; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_batches_expiry ON public.product_batches USING btree (expiry_date);


--
-- Name: idx_product_batches_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_batches_number ON public.product_batches USING btree (batch_number);


--
-- Name: idx_product_batches_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_batches_product ON public.product_batches USING btree (product_id);


--
-- Name: idx_product_batches_warehouse; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_batches_warehouse ON public.product_batches USING btree (warehouse_id);


--
-- Name: idx_product_categories_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_code ON public.product_categories USING btree (category_code);


--
-- Name: idx_product_categories_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_parent ON public.product_categories USING btree (parent_id);


--
-- Name: idx_product_price_history_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_price_history_date ON public.product_price_history USING btree (effective_date);


--
-- Name: idx_product_price_history_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_price_history_product ON public.product_price_history USING btree (product_id);


--
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active);


--
-- Name: idx_products_barcode; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_barcode ON public.products USING btree (barcode);


--
-- Name: idx_products_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category ON public.products USING btree (category_id);


--
-- Name: idx_products_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_code ON public.products USING btree (product_code);


--
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_name ON public.products USING btree (product_name);


--
-- Name: idx_project_tasks_assigned; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_project_tasks_assigned ON public.project_tasks USING btree (assigned_to);


--
-- Name: idx_project_tasks_project; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_project_tasks_project ON public.project_tasks USING btree (project_id);


--
-- Name: idx_project_tasks_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_project_tasks_status ON public.project_tasks USING btree (status);


--
-- Name: idx_projects_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_code ON public.projects USING btree (project_code);


--
-- Name: idx_projects_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_customer ON public.projects USING btree (customer_id);


--
-- Name: idx_projects_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_projects_status ON public.projects USING btree (status);


--
-- Name: idx_purchase_order_items_po; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_order_items_po ON public.purchase_order_items USING btree (po_id);


--
-- Name: idx_purchase_order_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_order_items_product ON public.purchase_order_items USING btree (product_id);


--
-- Name: idx_purchase_orders_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_date ON public.purchase_orders USING btree (po_date);


--
-- Name: idx_purchase_orders_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_number ON public.purchase_orders USING btree (po_number);


--
-- Name: idx_purchase_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_status ON public.purchase_orders USING btree (status);


--
-- Name: idx_purchase_orders_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_supplier ON public.purchase_orders USING btree (supplier_id);


--
-- Name: idx_quality_defects_inspection; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quality_defects_inspection ON public.quality_defects USING btree (inspection_id);


--
-- Name: idx_quality_inspections_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quality_inspections_number ON public.quality_inspections USING btree (inspection_number);


--
-- Name: idx_quality_inspections_reference; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quality_inspections_reference ON public.quality_inspections USING btree (reference_type, reference_id);


--
-- Name: idx_rfq_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfq_items_product ON public.rfq_items USING btree (product_id);


--
-- Name: idx_rfq_items_rfq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfq_items_rfq ON public.rfq_items USING btree (rfq_id);


--
-- Name: idx_rfq_suppliers_rfq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfq_suppliers_rfq ON public.rfq_suppliers USING btree (rfq_id);


--
-- Name: idx_rfq_suppliers_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfq_suppliers_supplier ON public.rfq_suppliers USING btree (supplier_id);


--
-- Name: idx_rfqs_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfqs_number ON public.rfqs USING btree (rfq_number);


--
-- Name: idx_rfqs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rfqs_status ON public.rfqs USING btree (status);


--
-- Name: idx_role_permissions_permission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_permissions_permission ON public.role_permissions USING btree (permission_id);


--
-- Name: idx_role_permissions_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_role_permissions_role ON public.role_permissions USING btree (role_id);


--
-- Name: idx_roles_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_roles_code ON public.roles USING btree (role_code);


--
-- Name: idx_sales_order_items_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_order_items_order ON public.sales_order_items USING btree (order_id);


--
-- Name: idx_sales_order_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_order_items_product ON public.sales_order_items USING btree (product_id);


--
-- Name: idx_sales_orders_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_orders_customer ON public.sales_orders USING btree (customer_id);


--
-- Name: idx_sales_orders_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_orders_date ON public.sales_orders USING btree (order_date);


--
-- Name: idx_sales_orders_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_orders_number ON public.sales_orders USING btree (order_number);


--
-- Name: idx_sales_orders_payment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_orders_payment_status ON public.sales_orders USING btree (payment_status);


--
-- Name: idx_sales_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_orders_status ON public.sales_orders USING btree (status);


--
-- Name: idx_sales_return_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_return_items_product ON public.sales_return_items USING btree (product_id);


--
-- Name: idx_sales_return_items_return; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_return_items_return ON public.sales_return_items USING btree (return_id);


--
-- Name: idx_sales_returns_customer; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_returns_customer ON public.sales_returns USING btree (customer_id);


--
-- Name: idx_sales_returns_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_returns_number ON public.sales_returns USING btree (return_number);


--
-- Name: idx_sales_returns_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sales_returns_order ON public.sales_returns USING btree (original_order_id);


--
-- Name: idx_signup_tracking_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signup_tracking_email ON public.signup_tracking USING btree (email);


--
-- Name: idx_signup_tracking_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_signup_tracking_user ON public.signup_tracking USING btree (user_id);


--
-- Name: idx_stock_movements_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_date ON public.stock_movements USING btree (movement_date);


--
-- Name: idx_stock_movements_from_warehouse; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_from_warehouse ON public.stock_movements USING btree (from_warehouse_id);


--
-- Name: idx_stock_movements_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_number ON public.stock_movements USING btree (movement_number);


--
-- Name: idx_stock_movements_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_product ON public.stock_movements USING btree (product_id);


--
-- Name: idx_stock_movements_to_warehouse; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_to_warehouse ON public.stock_movements USING btree (to_warehouse_id);


--
-- Name: idx_stock_movements_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_type ON public.stock_movements USING btree (movement_type);


--
-- Name: idx_subscription_plans_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscription_plans_code ON public.subscription_plans USING btree (plan_code);


--
-- Name: idx_supplier_evaluations_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_evaluations_date ON public.supplier_evaluations USING btree (evaluation_date);


--
-- Name: idx_supplier_evaluations_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_evaluations_supplier ON public.supplier_evaluations USING btree (supplier_id);


--
-- Name: idx_supplier_invoice_items_invoice; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_invoice ON public.supplier_invoice_items USING btree (invoice_id);


--
-- Name: idx_supplier_invoice_items_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_product ON public.supplier_invoice_items USING btree (product_id);


--
-- Name: idx_supplier_invoices_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_date ON public.supplier_invoices USING btree (invoice_date);


--
-- Name: idx_supplier_invoices_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_number ON public.supplier_invoices USING btree (invoice_number);


--
-- Name: idx_supplier_invoices_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_status ON public.supplier_invoices USING btree (status);


--
-- Name: idx_supplier_invoices_supplier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_supplier ON public.supplier_invoices USING btree (supplier_id);


--
-- Name: idx_suppliers_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_active ON public.suppliers USING btree (is_active);


--
-- Name: idx_suppliers_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_code ON public.suppliers USING btree (supplier_code);


--
-- Name: idx_suppliers_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_name ON public.suppliers USING btree (supplier_name);


--
-- Name: idx_system_health_metrics_recorded; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_health_metrics_recorded ON public.system_health_metrics USING btree (recorded_at);


--
-- Name: idx_system_health_metrics_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_health_metrics_type ON public.system_health_metrics USING btree (metric_type);


--
-- Name: idx_system_settings_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_settings_key ON public.system_settings USING btree (setting_key);


--
-- Name: idx_task_time_logs_task; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_time_logs_task ON public.task_time_logs USING btree (task_id);


--
-- Name: idx_task_time_logs_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_task_time_logs_user ON public.task_time_logs USING btree (user_id);


--
-- Name: idx_taxes_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_taxes_code ON public.taxes USING btree (tax_code);


--
-- Name: idx_usage_logs_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_logs_date ON public.usage_logs USING btree (recorded_at);


--
-- Name: idx_usage_logs_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_logs_type ON public.usage_logs USING btree (metric_type);


--
-- Name: idx_usage_logs_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usage_logs_user ON public.usage_logs USING btree (user_id);


--
-- Name: idx_user_onboarding_progress_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_onboarding_progress_user ON public.user_onboarding_progress USING btree (user_id);


--
-- Name: idx_user_sessions_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_active ON public.user_sessions USING btree (is_active);


--
-- Name: idx_user_sessions_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_token ON public.user_sessions USING btree (session_token);


--
-- Name: idx_user_sessions_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_sessions_user ON public.user_sessions USING btree (user_id);


--
-- Name: idx_user_subscriptions_end_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_subscriptions_end_date ON public.user_subscriptions USING btree (end_date);


--
-- Name: idx_user_subscriptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions USING btree (status);


--
-- Name: idx_user_subscriptions_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_subscriptions_user ON public.user_subscriptions USING btree (user_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active);


--
-- Name: idx_users_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_branch ON public.users USING btree (branch_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role_id);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_warehouse_locations_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouse_locations_parent ON public.warehouse_locations USING btree (parent_id);


--
-- Name: idx_warehouse_locations_warehouse; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouse_locations_warehouse ON public.warehouse_locations USING btree (warehouse_id);


--
-- Name: idx_warehouses_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouses_branch ON public.warehouses USING btree (branch_id);


--
-- Name: idx_warehouses_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_warehouses_code ON public.warehouses USING btree (warehouse_code);


--
-- Name: idx_work_orders_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_number ON public.work_orders USING btree (work_order_number);


--
-- Name: idx_work_orders_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_product ON public.work_orders USING btree (product_id);


--
-- Name: idx_work_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_work_orders_status ON public.work_orders USING btree (status);


--
-- Name: idx_workflow_executions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_workflow_executions_status ON public.workflow_executions USING btree (execution_status);


--
-- Name: idx_workflow_executions_template; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_workflow_executions_template ON public.workflow_executions USING btree (template_id);


--
-- Name: asset_depreciation asset_depreciation_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_depreciation
    ADD CONSTRAINT asset_depreciation_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.fixed_assets(id);


--
-- Name: asset_depreciation asset_depreciation_journal_entry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_depreciation
    ADD CONSTRAINT asset_depreciation_journal_entry_id_fkey FOREIGN KEY (journal_entry_id) REFERENCES public.journal_entries(id);


--
-- Name: asset_maintenance asset_maintenance_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_maintenance
    ADD CONSTRAINT asset_maintenance_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.fixed_assets(id);


--
-- Name: asset_transfers asset_transfers_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: asset_transfers asset_transfers_asset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.fixed_assets(id);


--
-- Name: asset_transfers asset_transfers_from_custodian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_from_custodian_id_fkey FOREIGN KEY (from_custodian_id) REFERENCES public.users(id);


--
-- Name: asset_transfers asset_transfers_to_custodian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asset_transfers
    ADD CONSTRAINT asset_transfers_to_custodian_id_fkey FOREIGN KEY (to_custodian_id) REFERENCES public.users(id);


--
-- Name: attendance_records attendance_records_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bank_accounts bank_accounts_gl_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_accounts
    ADD CONSTRAINT bank_accounts_gl_account_id_fkey FOREIGN KEY (gl_account_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: billing_invoice_items billing_invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoice_items
    ADD CONSTRAINT billing_invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE CASCADE;


--
-- Name: billing_invoices billing_invoices_payment_method_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id);


--
-- Name: billing_invoices billing_invoices_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.user_subscriptions(id);


--
-- Name: billing_invoices billing_invoices_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bins bins_warehouse_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bins
    ADD CONSTRAINT bins_warehouse_location_id_fkey FOREIGN KEY (warehouse_location_id) REFERENCES public.warehouse_locations(id) ON DELETE CASCADE;


--
-- Name: bom_headers bom_headers_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_headers
    ADD CONSTRAINT bom_headers_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: bom_items bom_items_bom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_items
    ADD CONSTRAINT bom_items_bom_id_fkey FOREIGN KEY (bom_id) REFERENCES public.bom_headers(id) ON DELETE CASCADE;


--
-- Name: bom_items bom_items_component_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bom_items
    ADD CONSTRAINT bom_items_component_product_id_fkey FOREIGN KEY (component_product_id) REFERENCES public.products(id);


--
-- Name: budget_lines budget_lines_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: budget_lines budget_lines_budget_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_budget_id_fkey FOREIGN KEY (budget_id) REFERENCES public.budgets(id) ON DELETE CASCADE;


--
-- Name: budget_lines budget_lines_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budget_lines
    ADD CONSTRAINT budget_lines_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id);


--
-- Name: budgets budgets_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.budgets
    ADD CONSTRAINT budgets_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: chart_of_accounts chart_of_accounts_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chart_of_accounts
    ADD CONSTRAINT chart_of_accounts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: contact_submissions contact_submissions_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: crm_activities crm_activities_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crm_activities
    ADD CONSTRAINT crm_activities_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: customer_loyalty_points customer_loyalty_points_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_loyalty_points
    ADD CONSTRAINT customer_loyalty_points_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: customer_loyalty_points customer_loyalty_points_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_loyalty_points
    ADD CONSTRAINT customer_loyalty_points_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.loyalty_programs(id);


--
-- Name: delivery_order_items delivery_order_items_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_order_items
    ADD CONSTRAINT delivery_order_items_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.delivery_orders(id) ON DELETE CASCADE;


--
-- Name: delivery_order_items delivery_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_order_items
    ADD CONSTRAINT delivery_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: delivery_order_items delivery_order_items_sales_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_order_items
    ADD CONSTRAINT delivery_order_items_sales_order_item_id_fkey FOREIGN KEY (sales_order_item_id) REFERENCES public.sales_order_items(id);


--
-- Name: delivery_orders delivery_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_orders
    ADD CONSTRAINT delivery_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: delivery_orders delivery_orders_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_orders
    ADD CONSTRAINT delivery_orders_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.users(id);


--
-- Name: delivery_orders delivery_orders_sales_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_orders
    ADD CONSTRAINT delivery_orders_sales_order_id_fkey FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id);


--
-- Name: delivery_orders delivery_orders_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_orders
    ADD CONSTRAINT delivery_orders_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: delivery_tracking delivery_tracking_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_tracking
    ADD CONSTRAINT delivery_tracking_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.delivery_orders(id) ON DELETE CASCADE;


--
-- Name: delivery_tracking delivery_tracking_recorded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_tracking
    ADD CONSTRAINT delivery_tracking_recorded_by_fkey FOREIGN KEY (recorded_by) REFERENCES public.users(id);


--
-- Name: demo_requests demo_requests_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo_requests
    ADD CONSTRAINT demo_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: document_audit document_audit_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_audit
    ADD CONSTRAINT document_audit_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: document_audit document_audit_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_audit
    ADD CONSTRAINT document_audit_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: document_categories document_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_categories
    ADD CONSTRAINT document_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.document_categories(id);


--
-- Name: document_permissions document_permissions_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.document_permissions
    ADD CONSTRAINT document_permissions_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: documents documents_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.document_categories(id);


--
-- Name: documents documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- Name: employee_salary_structures employee_salary_structures_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary_structures
    ADD CONSTRAINT employee_salary_structures_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.salary_components(id);


--
-- Name: employee_salary_structures employee_salary_structures_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_salary_structures
    ADD CONSTRAINT employee_salary_structures_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: employees employees_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: employees employees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: error_logs error_logs_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.error_logs
    ADD CONSTRAINT error_logs_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.users(id);


--
-- Name: error_logs error_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.error_logs
    ADD CONSTRAINT error_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: exchange_rates exchange_rates_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exchange_rates
    ADD CONSTRAINT exchange_rates_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES public.currencies(id);


--
-- Name: expense_categories expense_categories_gl_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_gl_account_id_fkey FOREIGN KEY (gl_account_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: expense_categories expense_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.expense_categories(id);


--
-- Name: expenses expenses_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: expenses expenses_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id);


--
-- Name: expenses expenses_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: expenses expenses_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.expense_categories(id);


--
-- Name: expenses expenses_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: features features_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.landing_pages(id);


--
-- Name: fixed_assets fixed_assets_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.asset_categories(id);


--
-- Name: fixed_assets fixed_assets_custodian_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_custodian_id_fkey FOREIGN KEY (custodian_id) REFERENCES public.users(id);


--
-- Name: fixed_assets fixed_assets_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fixed_assets
    ADD CONSTRAINT fixed_assets_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: goods_received_notes goods_received_notes_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(id);


--
-- Name: goods_received_notes goods_received_notes_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(id);


--
-- Name: goods_received_notes goods_received_notes_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: goods_received_notes goods_received_notes_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: grn_items grn_items_grn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_items
    ADD CONSTRAINT grn_items_grn_id_fkey FOREIGN KEY (grn_id) REFERENCES public.goods_received_notes(id) ON DELETE CASCADE;


--
-- Name: grn_items grn_items_po_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_items
    ADD CONSTRAINT grn_items_po_item_id_fkey FOREIGN KEY (po_item_id) REFERENCES public.purchase_order_items(id);


--
-- Name: grn_items grn_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grn_items
    ADD CONSTRAINT grn_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: hero_sections hero_sections_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero_sections
    ADD CONSTRAINT hero_sections_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.landing_pages(id);


--
-- Name: inventory_adjustment_items inventory_adjustment_items_adjustment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_adjustment_id_fkey FOREIGN KEY (adjustment_id) REFERENCES public.inventory_adjustments(id) ON DELETE CASCADE;


--
-- Name: inventory_adjustment_items inventory_adjustment_items_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(id);


--
-- Name: inventory_adjustment_items inventory_adjustment_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory_adjustments inventory_adjustments_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: inventory_adjustments inventory_adjustments_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: inventory_transfer_items inventory_transfer_items_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfer_items
    ADD CONSTRAINT inventory_transfer_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(id);


--
-- Name: inventory_transfer_items inventory_transfer_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfer_items
    ADD CONSTRAINT inventory_transfer_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: inventory_transfer_items inventory_transfer_items_transfer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfer_items
    ADD CONSTRAINT inventory_transfer_items_transfer_id_fkey FOREIGN KEY (transfer_id) REFERENCES public.inventory_transfers(id) ON DELETE CASCADE;


--
-- Name: inventory_transfers inventory_transfers_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: inventory_transfers inventory_transfers_from_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_from_warehouse_id_fkey FOREIGN KEY (from_warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: inventory_transfers inventory_transfers_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.users(id);


--
-- Name: inventory_transfers inventory_transfers_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- Name: inventory_transfers inventory_transfers_shipped_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_shipped_by_fkey FOREIGN KEY (shipped_by) REFERENCES public.users(id);


--
-- Name: inventory_transfers inventory_transfers_to_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_transfers
    ADD CONSTRAINT inventory_transfers_to_warehouse_id_fkey FOREIGN KEY (to_warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: iot_devices iot_devices_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iot_devices
    ADD CONSTRAINT iot_devices_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: journal_entries journal_entries_posted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.users(id);


--
-- Name: journal_entries journal_entries_reversed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_reversed_by_fkey FOREIGN KEY (reversed_by) REFERENCES public.users(id);


--
-- Name: journal_entry_lines journal_entry_lines_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.chart_of_accounts(id);


--
-- Name: journal_entry_lines journal_entry_lines_journal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.journal_entry_lines
    ADD CONSTRAINT journal_entry_lines_journal_id_fkey FOREIGN KEY (journal_id) REFERENCES public.journal_entries(id) ON DELETE CASCADE;


--
-- Name: leads leads_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: leads leads_converted_to_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_converted_to_customer_id_fkey FOREIGN KEY (converted_to_customer_id) REFERENCES public.customers(id);


--
-- Name: leads leads_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.lead_sources(id);


--
-- Name: leave_balances leave_balances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: leave_balances leave_balances_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: leave_requests leave_requests_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: leave_requests leave_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: leave_requests leave_requests_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: machines machines_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.machines
    ADD CONSTRAINT machines_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: message_reactions message_reactions_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- Name: message_reactions message_reactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_reactions
    ADD CONSTRAINT message_reactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: message_recipients message_recipients_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_recipients
    ADD CONSTRAINT message_recipients_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.messages(id) ON DELETE CASCADE;


--
-- Name: message_recipients message_recipients_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.message_recipients
    ADD CONSTRAINT message_recipients_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: notification_preferences notification_preferences_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.notification_categories(id);


--
-- Name: notification_preferences notification_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notifications notifications_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.notification_categories(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: page_sections page_sections_page_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.page_sections
    ADD CONSTRAINT page_sections_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.landing_pages(id) ON DELETE CASCADE;


--
-- Name: payment_allocations payment_allocations_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_allocations
    ADD CONSTRAINT payment_allocations_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE CASCADE;


--
-- Name: payment_methods payment_methods_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT payment_methods_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id);


--
-- Name: payroll_periods payroll_periods_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_periods
    ADD CONSTRAINT payroll_periods_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: payslip_lines payslip_lines_component_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslip_lines
    ADD CONSTRAINT payslip_lines_component_id_fkey FOREIGN KEY (component_id) REFERENCES public.salary_components(id);


--
-- Name: payslip_lines payslip_lines_payslip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslip_lines
    ADD CONSTRAINT payslip_lines_payslip_id_fkey FOREIGN KEY (payslip_id) REFERENCES public.payslips(id) ON DELETE CASCADE;


--
-- Name: payslips payslips_bank_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_bank_account_id_fkey FOREIGN KEY (bank_account_id) REFERENCES public.bank_accounts(id);


--
-- Name: payslips payslips_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: payslips payslips_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payslips
    ADD CONSTRAINT payslips_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.payroll_periods(id);


--
-- Name: pos_cash_registers pos_cash_registers_assigned_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_cash_registers
    ADD CONSTRAINT pos_cash_registers_assigned_user_id_fkey FOREIGN KEY (assigned_user_id) REFERENCES public.users(id);


--
-- Name: pos_cash_registers pos_cash_registers_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pos_cash_registers
    ADD CONSTRAINT pos_cash_registers_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: product_batches product_batches_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_batches product_batches_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: product_batches product_batches_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_batches
    ADD CONSTRAINT product_batches_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: product_categories product_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.product_categories(id);


--
-- Name: product_price_history product_price_history_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_price_history
    ADD CONSTRAINT product_price_history_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id);


--
-- Name: project_tasks project_tasks_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.users(id);


--
-- Name: project_tasks project_tasks_parent_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_parent_task_id_fkey FOREIGN KEY (parent_task_id) REFERENCES public.project_tasks(id);


--
-- Name: project_tasks project_tasks_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_tasks
    ADD CONSTRAINT project_tasks_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects projects_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: projects projects_project_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_project_manager_id_fkey FOREIGN KEY (project_manager_id) REFERENCES public.users(id);


--
-- Name: purchase_order_items purchase_order_items_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: purchase_orders purchase_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: purchase_orders purchase_orders_rfq_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id);


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: purchase_orders purchase_orders_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: quality_defects quality_defects_inspection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_defects
    ADD CONSTRAINT quality_defects_inspection_id_fkey FOREIGN KEY (inspection_id) REFERENCES public.quality_inspections(id);


--
-- Name: quality_inspections quality_inspections_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_inspections
    ADD CONSTRAINT quality_inspections_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(id);


--
-- Name: quality_inspections quality_inspections_inspector_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_inspections
    ADD CONSTRAINT quality_inspections_inspector_id_fkey FOREIGN KEY (inspector_id) REFERENCES public.users(id);


--
-- Name: quality_inspections quality_inspections_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_inspections
    ADD CONSTRAINT quality_inspections_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: rfq_items rfq_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_items
    ADD CONSTRAINT rfq_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: rfq_items rfq_items_rfq_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_items
    ADD CONSTRAINT rfq_items_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id) ON DELETE CASCADE;


--
-- Name: rfq_suppliers rfq_suppliers_rfq_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_suppliers
    ADD CONSTRAINT rfq_suppliers_rfq_id_fkey FOREIGN KEY (rfq_id) REFERENCES public.rfqs(id) ON DELETE CASCADE;


--
-- Name: rfq_suppliers rfq_suppliers_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rfq_suppliers
    ADD CONSTRAINT rfq_suppliers_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: sales_order_items sales_order_items_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(id);


--
-- Name: sales_order_items sales_order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.sales_orders(id) ON DELETE CASCADE;


--
-- Name: sales_order_items sales_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: sales_orders sales_orders_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: sales_orders sales_orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: sales_orders sales_orders_salesperson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_salesperson_id_fkey FOREIGN KEY (salesperson_id) REFERENCES public.users(id);


--
-- Name: sales_orders sales_orders_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: sales_return_items sales_return_items_original_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_items
    ADD CONSTRAINT sales_return_items_original_item_id_fkey FOREIGN KEY (original_item_id) REFERENCES public.sales_order_items(id);


--
-- Name: sales_return_items sales_return_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_items
    ADD CONSTRAINT sales_return_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: sales_return_items sales_return_items_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_return_items
    ADD CONSTRAINT sales_return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.sales_returns(id) ON DELETE CASCADE;


--
-- Name: sales_returns sales_returns_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: sales_returns sales_returns_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: sales_returns sales_returns_original_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_returns
    ADD CONSTRAINT sales_returns_original_order_id_fkey FOREIGN KEY (original_order_id) REFERENCES public.sales_orders(id);


--
-- Name: settings settings_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: xhenvolt
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: signup_tracking signup_tracking_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signup_tracking
    ADD CONSTRAINT signup_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: stock_movements stock_movements_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.product_batches(id);


--
-- Name: stock_movements stock_movements_from_bin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_from_bin_id_fkey FOREIGN KEY (from_bin_id) REFERENCES public.bins(id);


--
-- Name: stock_movements stock_movements_from_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_from_warehouse_id_fkey FOREIGN KEY (from_warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: stock_movements stock_movements_to_bin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_to_bin_id_fkey FOREIGN KEY (to_bin_id) REFERENCES public.bins(id);


--
-- Name: stock_movements stock_movements_to_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_to_warehouse_id_fkey FOREIGN KEY (to_warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: supplier_evaluations supplier_evaluations_evaluator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations
    ADD CONSTRAINT supplier_evaluations_evaluator_id_fkey FOREIGN KEY (evaluator_id) REFERENCES public.users(id);


--
-- Name: supplier_evaluations supplier_evaluations_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_evaluations
    ADD CONSTRAINT supplier_evaluations_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_invoice_items supplier_invoice_items_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES public.supplier_invoices(id) ON DELETE CASCADE;


--
-- Name: supplier_invoice_items supplier_invoice_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: supplier_invoices supplier_invoices_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id);


--
-- Name: supplier_invoices supplier_invoices_grn_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_grn_id_fkey FOREIGN KEY (grn_id) REFERENCES public.goods_received_notes(id);


--
-- Name: supplier_invoices supplier_invoices_po_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_po_id_fkey FOREIGN KEY (po_id) REFERENCES public.purchase_orders(id);


--
-- Name: supplier_invoices supplier_invoices_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- Name: task_time_logs task_time_logs_task_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_time_logs
    ADD CONSTRAINT task_time_logs_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.project_tasks(id) ON DELETE CASCADE;


--
-- Name: task_time_logs task_time_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_time_logs
    ADD CONSTRAINT task_time_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: usage_logs usage_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT usage_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_onboarding_progress user_onboarding_progress_step_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_onboarding_progress
    ADD CONSTRAINT user_onboarding_progress_step_id_fkey FOREIGN KEY (step_id) REFERENCES public.onboarding_steps(id);


--
-- Name: user_onboarding_progress user_onboarding_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_onboarding_progress
    ADD CONSTRAINT user_onboarding_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_sessions user_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_subscriptions user_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: user_subscriptions user_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_subscriptions
    ADD CONSTRAINT user_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: warehouse_locations warehouse_locations_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_locations
    ADD CONSTRAINT warehouse_locations_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.warehouse_locations(id);


--
-- Name: warehouse_locations warehouse_locations_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse_locations
    ADD CONSTRAINT warehouse_locations_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON DELETE CASCADE;


--
-- Name: warehouses warehouses_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id);


--
-- Name: warehouses warehouses_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id);


--
-- Name: work_orders work_orders_bom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_bom_id_fkey FOREIGN KEY (bom_id) REFERENCES public.bom_headers(id);


--
-- Name: work_orders work_orders_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: work_orders work_orders_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.work_orders
    ADD CONSTRAINT work_orders_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- Name: workflow_executions workflow_executions_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT workflow_executions_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.workflow_templates(id);


--
-- Name: workflow_executions workflow_executions_triggered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.workflow_executions
    ADD CONSTRAINT workflow_executions_triggered_by_fkey FOREIGN KEY (triggered_by) REFERENCES public.users(id);


--
-- Name: TABLE asset_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asset_categories TO xhenvolt;


--
-- Name: TABLE asset_depreciation; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asset_depreciation TO xhenvolt;


--
-- Name: TABLE asset_maintenance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asset_maintenance TO xhenvolt;


--
-- Name: TABLE asset_transfers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.asset_transfers TO xhenvolt;


--
-- Name: TABLE attendance_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.attendance_records TO xhenvolt;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO xhenvolt;


--
-- Name: TABLE bank_accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bank_accounts TO xhenvolt;


--
-- Name: TABLE billing_invoice_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.billing_invoice_items TO xhenvolt;


--
-- Name: TABLE billing_invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.billing_invoices TO xhenvolt;


--
-- Name: TABLE bins; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bins TO xhenvolt;


--
-- Name: TABLE bom_headers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bom_headers TO xhenvolt;


--
-- Name: TABLE bom_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bom_items TO xhenvolt;


--
-- Name: TABLE branches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.branches TO xhenvolt;


--
-- Name: TABLE budget_lines; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.budget_lines TO xhenvolt;


--
-- Name: TABLE budgets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.budgets TO xhenvolt;


--
-- Name: TABLE business_info; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.business_info TO xhenvolt;


--
-- Name: TABLE chart_of_accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.chart_of_accounts TO xhenvolt;


--
-- Name: TABLE contact_submissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contact_submissions TO xhenvolt;


--
-- Name: TABLE contracts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.contracts TO xhenvolt;


--
-- Name: TABLE crm_activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.crm_activities TO xhenvolt;


--
-- Name: TABLE cta_banners; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cta_banners TO xhenvolt;


--
-- Name: TABLE currencies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.currencies TO xhenvolt;


--
-- Name: TABLE customer_loyalty_points; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customer_loyalty_points TO xhenvolt;


--
-- Name: TABLE customers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customers TO xhenvolt;


--
-- Name: TABLE delivery_order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.delivery_order_items TO xhenvolt;


--
-- Name: TABLE delivery_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.delivery_orders TO xhenvolt;


--
-- Name: TABLE delivery_tracking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.delivery_tracking TO xhenvolt;


--
-- Name: TABLE demo_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.demo_requests TO xhenvolt;


--
-- Name: TABLE document_audit; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_audit TO xhenvolt;


--
-- Name: TABLE document_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_categories TO xhenvolt;


--
-- Name: TABLE document_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.document_permissions TO xhenvolt;


--
-- Name: TABLE documents; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.documents TO xhenvolt;


--
-- Name: TABLE employee_salary_structures; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employee_salary_structures TO xhenvolt;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.employees TO xhenvolt;


--
-- Name: TABLE error_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.error_logs TO xhenvolt;


--
-- Name: TABLE exchange_rates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.exchange_rates TO xhenvolt;


--
-- Name: TABLE expense_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expense_categories TO xhenvolt;


--
-- Name: TABLE expenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expenses TO xhenvolt;


--
-- Name: TABLE faqs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.faqs TO xhenvolt;


--
-- Name: TABLE features; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.features TO xhenvolt;


--
-- Name: TABLE fixed_assets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fixed_assets TO xhenvolt;


--
-- Name: TABLE goods_received_notes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.goods_received_notes TO xhenvolt;


--
-- Name: TABLE grn_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.grn_items TO xhenvolt;


--
-- Name: TABLE hero_sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.hero_sections TO xhenvolt;


--
-- Name: TABLE inventory_adjustment_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_adjustment_items TO xhenvolt;


--
-- Name: TABLE inventory_adjustments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_adjustments TO xhenvolt;


--
-- Name: TABLE inventory_transfer_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_transfer_items TO xhenvolt;


--
-- Name: TABLE inventory_transfers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inventory_transfers TO xhenvolt;


--
-- Name: TABLE iot_devices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.iot_devices TO xhenvolt;


--
-- Name: TABLE journal_entries; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.journal_entries TO xhenvolt;


--
-- Name: TABLE journal_entry_lines; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.journal_entry_lines TO xhenvolt;


--
-- Name: TABLE landing_pages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.landing_pages TO xhenvolt;


--
-- Name: TABLE landing_pricing_plans; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.landing_pricing_plans TO xhenvolt;


--
-- Name: TABLE lead_sources; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lead_sources TO xhenvolt;


--
-- Name: TABLE leads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leads TO xhenvolt;


--
-- Name: TABLE leave_balances; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leave_balances TO xhenvolt;


--
-- Name: TABLE leave_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leave_requests TO xhenvolt;


--
-- Name: TABLE leave_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leave_types TO xhenvolt;


--
-- Name: TABLE loyalty_programs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.loyalty_programs TO xhenvolt;


--
-- Name: TABLE machines; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.machines TO xhenvolt;


--
-- Name: TABLE message_reactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.message_reactions TO xhenvolt;


--
-- Name: TABLE message_recipients; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.message_recipients TO xhenvolt;


--
-- Name: TABLE messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.messages TO xhenvolt;


--
-- Name: TABLE newsletter_subscribers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.newsletter_subscribers TO xhenvolt;


--
-- Name: TABLE notification_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_categories TO xhenvolt;


--
-- Name: TABLE notification_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_preferences TO xhenvolt;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO xhenvolt;


--
-- Name: TABLE onboarding_steps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.onboarding_steps TO xhenvolt;


--
-- Name: TABLE page_sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.page_sections TO xhenvolt;


--
-- Name: TABLE payment_allocations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_allocations TO xhenvolt;


--
-- Name: TABLE payment_methods; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payment_methods TO xhenvolt;


--
-- Name: TABLE payments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payments TO xhenvolt;


--
-- Name: TABLE payroll_periods; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payroll_periods TO xhenvolt;


--
-- Name: TABLE payslip_lines; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payslip_lines TO xhenvolt;


--
-- Name: TABLE payslips; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.payslips TO xhenvolt;


--
-- Name: TABLE permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.permissions TO xhenvolt;


--
-- Name: TABLE pos_cash_registers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pos_cash_registers TO xhenvolt;


--
-- Name: TABLE product_batches; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_batches TO xhenvolt;


--
-- Name: TABLE product_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_categories TO xhenvolt;


--
-- Name: TABLE product_price_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.product_price_history TO xhenvolt;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO xhenvolt;


--
-- Name: TABLE project_tasks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.project_tasks TO xhenvolt;


--
-- Name: TABLE projects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.projects TO xhenvolt;


--
-- Name: TABLE purchase_order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.purchase_order_items TO xhenvolt;


--
-- Name: TABLE purchase_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.purchase_orders TO xhenvolt;


--
-- Name: TABLE quality_defects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quality_defects TO xhenvolt;


--
-- Name: TABLE quality_inspections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quality_inspections TO xhenvolt;


--
-- Name: TABLE rfq_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rfq_items TO xhenvolt;


--
-- Name: TABLE rfq_suppliers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rfq_suppliers TO xhenvolt;


--
-- Name: TABLE rfqs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.rfqs TO xhenvolt;


--
-- Name: TABLE role_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.role_permissions TO xhenvolt;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO xhenvolt;


--
-- Name: TABLE salary_components; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.salary_components TO xhenvolt;


--
-- Name: TABLE sales_order_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales_order_items TO xhenvolt;


--
-- Name: TABLE sales_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales_orders TO xhenvolt;


--
-- Name: TABLE sales_return_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales_return_items TO xhenvolt;


--
-- Name: TABLE sales_returns; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales_returns TO xhenvolt;


--
-- Name: SEQUENCE seq_billing_invoice; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_billing_invoice TO xhenvolt;


--
-- Name: SEQUENCE seq_contract; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_contract TO xhenvolt;


--
-- Name: SEQUENCE seq_delivery_order; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_delivery_order TO xhenvolt;


--
-- Name: SEQUENCE seq_document; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_document TO xhenvolt;


--
-- Name: SEQUENCE seq_expense; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_expense TO xhenvolt;


--
-- Name: SEQUENCE seq_grn; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_grn TO xhenvolt;


--
-- Name: SEQUENCE seq_inventory_adjustment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_inventory_adjustment TO xhenvolt;


--
-- Name: SEQUENCE seq_inventory_transfer; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_inventory_transfer TO xhenvolt;


--
-- Name: SEQUENCE seq_invoice; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_invoice TO xhenvolt;


--
-- Name: SEQUENCE seq_journal_entry; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_journal_entry TO xhenvolt;


--
-- Name: SEQUENCE seq_lead; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_lead TO xhenvolt;


--
-- Name: SEQUENCE seq_payment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_payment TO xhenvolt;


--
-- Name: SEQUENCE seq_payroll_period; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_payroll_period TO xhenvolt;


--
-- Name: SEQUENCE seq_payslip; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_payslip TO xhenvolt;


--
-- Name: SEQUENCE seq_project; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_project TO xhenvolt;


--
-- Name: SEQUENCE seq_purchase_order; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_purchase_order TO xhenvolt;


--
-- Name: SEQUENCE seq_quality_inspection; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_quality_inspection TO xhenvolt;


--
-- Name: SEQUENCE seq_rfq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_rfq TO xhenvolt;


--
-- Name: SEQUENCE seq_sales_order; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_sales_order TO xhenvolt;


--
-- Name: SEQUENCE seq_sales_return; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_sales_return TO xhenvolt;


--
-- Name: SEQUENCE seq_stock_movement; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_stock_movement TO xhenvolt;


--
-- Name: SEQUENCE seq_supplier_invoice; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_supplier_invoice TO xhenvolt;


--
-- Name: SEQUENCE seq_work_order; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seq_work_order TO xhenvolt;


--
-- Name: TABLE signup_tracking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.signup_tracking TO xhenvolt;


--
-- Name: TABLE site_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.site_settings TO xhenvolt;


--
-- Name: TABLE stock_movements; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.stock_movements TO xhenvolt;


--
-- Name: TABLE subscription_plans; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscription_plans TO xhenvolt;


--
-- Name: TABLE supplier_evaluations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.supplier_evaluations TO xhenvolt;


--
-- Name: TABLE supplier_invoice_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.supplier_invoice_items TO xhenvolt;


--
-- Name: TABLE supplier_invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.supplier_invoices TO xhenvolt;


--
-- Name: TABLE suppliers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.suppliers TO xhenvolt;


--
-- Name: TABLE system_health_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.system_health_metrics TO xhenvolt;


--
-- Name: TABLE system_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.system_settings TO xhenvolt;


--
-- Name: TABLE task_time_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.task_time_logs TO xhenvolt;


--
-- Name: TABLE taxes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.taxes TO xhenvolt;


--
-- Name: TABLE testimonials; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.testimonials TO xhenvolt;


--
-- Name: TABLE usage_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.usage_logs TO xhenvolt;


--
-- Name: TABLE user_onboarding_progress; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_onboarding_progress TO xhenvolt;


--
-- Name: TABLE user_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_sessions TO xhenvolt;


--
-- Name: TABLE user_subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_subscriptions TO xhenvolt;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO xhenvolt;


--
-- Name: TABLE warehouse_locations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.warehouse_locations TO xhenvolt;


--
-- Name: TABLE warehouses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.warehouses TO xhenvolt;


--
-- Name: TABLE work_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.work_orders TO xhenvolt;


--
-- Name: TABLE workflow_executions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.workflow_executions TO xhenvolt;


--
-- Name: TABLE workflow_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.workflow_templates TO xhenvolt;


--
-- PostgreSQL database dump complete
--

\unrestrict ipsZe3GJQGcrox2RsyiYijM3DYDGRMirMsNp4pg9UaGV6bqMoTnV9WjgTrzqSMd


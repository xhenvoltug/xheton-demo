-- =====================================================
-- XHETON ADDITIONAL MODULES SCHEMA
-- Accounting, Finance, HR, Payroll, Delivery, Projects, etc.
-- =====================================================

-- =====================================================
-- SECTION 8: ACCOUNTING & FINANCE
-- =====================================================

-- Chart of Accounts
CREATE TABLE chart_of_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, revenue, expense
    account_category VARCHAR(100), -- current_asset, fixed_asset, current_liability, etc.
    parent_id UUID REFERENCES chart_of_accounts(id),
    currency_code VARCHAR(10) DEFAULT 'UGX',
    balance DECIMAL(15,2) DEFAULT 0, -- UGX
    is_active BOOLEAN DEFAULT true,
    is_system_account BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_chart_of_accounts_code ON chart_of_accounts(account_code);
CREATE INDEX idx_chart_of_accounts_type ON chart_of_accounts(account_type);
CREATE INDEX idx_chart_of_accounts_parent ON chart_of_accounts(parent_id);
COMMENT ON TABLE chart_of_accounts IS 'General ledger chart of accounts';

-- Bank & Cash Accounts
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) DEFAULT 'bank', -- bank, cash, mobile_money
    bank_name VARCHAR(255),
    account_number VARCHAR(100),
    branch_name VARCHAR(255),
    currency_code VARCHAR(10) DEFAULT 'UGX',
    current_balance DECIMAL(15,2) DEFAULT 0, -- UGX
    opening_balance DECIMAL(15,2) DEFAULT 0, -- UGX
    opening_balance_date DATE,
    gl_account_id UUID REFERENCES chart_of_accounts(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_bank_accounts_code ON bank_accounts(account_code);
CREATE INDEX idx_bank_accounts_type ON bank_accounts(account_type);
COMMENT ON TABLE bank_accounts IS 'Bank and cash account management';

-- Journal Entries
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_number VARCHAR(50) UNIQUE NOT NULL,
    journal_date DATE NOT NULL,
    journal_type VARCHAR(50) DEFAULT 'general', -- general, sales, purchase, cash, bank
    reference_type VARCHAR(50), -- sales_order, purchase_order, payment, expense
    reference_id UUID,
    description TEXT,
    total_debit DECIMAL(15,2) DEFAULT 0, -- UGX
    total_credit DECIMAL(15,2) DEFAULT 0, -- UGX
    status VARCHAR(50) DEFAULT 'draft', -- draft, posted, reversed
    posted_at TIMESTAMPTZ,
    posted_by UUID REFERENCES users(id),
    reversed_at TIMESTAMPTZ,
    reversed_by UUID REFERENCES users(id),
    reversal_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_journal_entries_number ON journal_entries(journal_number);
CREATE INDEX idx_journal_entries_date ON journal_entries(journal_date);
CREATE INDEX idx_journal_entries_type ON journal_entries(journal_type);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
COMMENT ON TABLE journal_entries IS 'Journal entry headers for double-entry accounting';

-- Journal Entry Lines
CREATE TABLE journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journal_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES chart_of_accounts(id),
    line_type VARCHAR(10) NOT NULL, -- debit, credit
    amount DECIMAL(15,2) NOT NULL, -- UGX
    description TEXT,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_entry_lines_journal ON journal_entry_lines(journal_id);
CREATE INDEX idx_journal_entry_lines_account ON journal_entry_lines(account_id);
CREATE INDEX idx_journal_entry_lines_type ON journal_entry_lines(line_type);

-- Payments (Customer & Supplier)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    payment_date DATE NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- customer_payment, supplier_payment
    party_type VARCHAR(50) NOT NULL, -- customer, supplier
    party_id UUID NOT NULL, -- customer_id or supplier_id
    bank_account_id UUID REFERENCES bank_accounts(id),
    payment_method VARCHAR(50) NOT NULL, -- cash, bank_transfer, mobile_money, cheque, card
    reference_number VARCHAR(100),
    amount DECIMAL(15,2) NOT NULL, -- UGX
    allocated_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    unallocated_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - allocated_amount) STORED,
    status VARCHAR(50) DEFAULT 'pending', -- pending, cleared, bounced, cancelled
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_payments_number ON payments(payment_number);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_type ON payments(payment_type);
CREATE INDEX idx_payments_party ON payments(party_type, party_id);
COMMENT ON TABLE payments IS 'All payments received from customers or made to suppliers';

-- Payment Allocations (Linking payments to invoices)
CREATE TABLE payment_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    invoice_type VARCHAR(50) NOT NULL, -- sales_order, supplier_invoice
    invoice_id UUID NOT NULL, -- sales_order_id or supplier_invoice_id
    allocated_amount DECIMAL(15,2) NOT NULL, -- UGX
    allocation_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_payment_allocations_payment ON payment_allocations(payment_id);
CREATE INDEX idx_payment_allocations_invoice ON payment_allocations(invoice_type, invoice_id);

-- Expenses
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES expense_categories(id),
    gl_account_id UUID REFERENCES chart_of_accounts(id),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_expense_categories_code ON expense_categories(category_code);
COMMENT ON TABLE expense_categories IS 'Expense categories for business expenses';

CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    expense_date DATE NOT NULL,
    category_id UUID REFERENCES expense_categories(id),
    supplier_id UUID REFERENCES suppliers(id),
    branch_id UUID REFERENCES branches(id),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL, -- UGX
    tax_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    total_amount DECIMAL(15,2) NOT NULL, -- UGX
    payment_method VARCHAR(50), -- cash, bank_transfer, mobile_money, cheque, card
    bank_account_id UUID REFERENCES bank_accounts(id),
    reference_number VARCHAR(100),
    receipt_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, paid, rejected
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_expenses_number ON expenses(expense_number);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_status ON expenses(status);
COMMENT ON TABLE expenses IS 'Business expense tracking and management';

-- Taxes
CREATE TABLE taxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_code VARCHAR(50) UNIQUE NOT NULL,
    tax_name VARCHAR(255) NOT NULL,
    tax_type VARCHAR(50) DEFAULT 'vat', -- vat, sales_tax, withholding_tax, excise
    tax_rate DECIMAL(5,2) NOT NULL,
    is_compound BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_taxes_code ON taxes(tax_code);
COMMENT ON TABLE taxes IS 'Tax codes and rates';

-- Budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_code VARCHAR(50) UNIQUE NOT NULL,
    budget_name VARCHAR(255) NOT NULL,
    budget_type VARCHAR(50) DEFAULT 'annual', -- annual, quarterly, monthly, project
    fiscal_year INTEGER,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, closed
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

CREATE INDEX idx_budgets_code ON budgets(budget_code);
CREATE INDEX idx_budgets_fiscal_year ON budgets(fiscal_year);
COMMENT ON TABLE budgets IS 'Budget planning and management';

-- Budget Lines
CREATE TABLE budget_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    account_id UUID REFERENCES chart_of_accounts(id),
    category_id UUID REFERENCES expense_categories(id),
    description TEXT,
    budgeted_amount DECIMAL(15,2) NOT NULL, -- UGX
    actual_amount DECIMAL(15,2) DEFAULT 0, -- UGX
    variance DECIMAL(15,2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budget_lines_budget ON budget_lines(budget_id);
CREATE INDEX idx_budget_lines_account ON budget_lines(account_id);

-- =====================================================
-- SECTION 9: HUMAN RESOURCES & PAYROLL
-- =====================================================

-- Employees (extending users table)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id),
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(50),
    nationality VARCHAR(100) DEFAULT 'Ugandan',
    national_id VARCHAR(100),
    passport_number VARCHAR(100),
    tax_id VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    branch_id UUID REFERENCES branches(id),
    department VARCHAR(100),
    position VARCHAR(100),
    employment_type VARCHAR(50) DEFAULT 'full_time', -- full_time, part_time, contract, intern
    employment_status VARCHAR(50) DEFAULT 'active', -- active, probation, suspended, terminated
    hire_date DATE,
    probation_end_date DATE,
    termination_date DATE,
    termination_reason TEXT,
    basic_salary DECIMAL(15,2) DEFAULT 0, -- UGX
    bank_account_name VARCHAR(255),
    bank_account_number VARCHAR(100),
    bank_name VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_employees_number ON employees(employee_number);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_branch ON employees(branch_id);
CREATE INDEX idx_employees_status ON employees(employment_status);
COMMENT ON TABLE employees IS 'Employee master data and HR information';

-- Attendance
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    attendance_date DATE NOT NULL,
    clock_in TIMESTAMPTZ,
    clock_out TIMESTAMPTZ,
    total_hours DECIMAL(5,2),
    status VARCHAR(50) DEFAULT 'present', -- present, absent, late, half_day, leave
    location VARCHAR(255),
    ip_address VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, attendance_date)
);

CREATE INDEX idx_attendance_records_employee ON attendance_records(employee_id);
CREATE INDEX idx_attendance_records_date ON attendance_records(attendance_date);
COMMENT ON TABLE attendance_records IS 'Employee attendance tracking';

-- Leave Types
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leave_code VARCHAR(50) UNIQUE NOT NULL,
    leave_name VARCHAR(255) NOT NULL,
    description TEXT,
    default_days INTEGER DEFAULT 0,
    is_paid BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE leave_types IS 'Types of leave (annual, sick, maternity, etc.)';

-- Leave Requests
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
COMMENT ON TABLE leave_requests IS 'Employee leave/time-off requests';

-- Leave Balances
CREATE TABLE leave_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    leave_type_id UUID NOT NULL REFERENCES leave_types(id),
    year INTEGER NOT NULL,
    total_days DECIMAL(5,2) DEFAULT 0,
    used_days DECIMAL(5,2) DEFAULT 0,
    remaining_days DECIMAL(5,2) GENERATED ALWAYS AS (total_days - used_days) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, leave_type_id, year)
);

CREATE INDEX idx_leave_balances_employee ON leave_balances(employee_id);

-- Salary Components
CREATE TABLE salary_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_code VARCHAR(50) UNIQUE NOT NULL,
    component_name VARCHAR(255) NOT NULL,
    component_type VARCHAR(50) NOT NULL, -- earning, deduction
    calculation_type VARCHAR(50) DEFAULT 'fixed', -- fixed, percentage, formula
    is_taxable BOOLEAN DEFAULT true,
    is_statutory BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE salary_components IS 'Salary components (allowances, deductions, etc.)';

-- Employee Salary Structure
CREATE TABLE employee_salary_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    component_id UUID NOT NULL REFERENCES salary_components(id),
    amount DECIMAL(15,2) DEFAULT 0, -- UGX
    percentage DECIMAL(5,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employee_salary_structures_employee ON employee_salary_structures(employee_id);
CREATE INDEX idx_employee_salary_structures_component ON employee_salary_structures(component_id);

-- Payroll Periods
CREATE TABLE payroll_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_code VARCHAR(50) UNIQUE NOT NULL,
    period_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_date DATE,
    status VARCHAR(50) DEFAULT 'draft', -- draft, processing, approved, paid
    total_gross DECIMAL(15,2) DEFAULT 0, -- UGX
    total_deductions DECIMAL(15,2) DEFAULT 0, -- UGX
    total_net DECIMAL(15,2) DEFAULT 0, -- UGX
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_payroll_periods_code ON payroll_periods(period_code);
CREATE INDEX idx_payroll_periods_dates ON payroll_periods(start_date, end_date);
COMMENT ON TABLE payroll_periods IS 'Payroll processing periods';

-- Payslips
CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payslip_number VARCHAR(50) UNIQUE NOT NULL,
    period_id UUID NOT NULL REFERENCES payroll_periods(id),
    employee_id UUID NOT NULL REFERENCES employees(id),
    basic_salary DECIMAL(15,2) DEFAULT 0, -- UGX
    gross_salary DECIMAL(15,2) DEFAULT 0, -- UGX
    total_deductions DECIMAL(15,2) DEFAULT 0, -- UGX
    net_salary DECIMAL(15,2) DEFAULT 0, -- UGX
    payment_date DATE,
    payment_method VARCHAR(50),
    bank_account_id UUID REFERENCES bank_accounts(id),
    status VARCHAR(50) DEFAULT 'draft', -- draft, approved, paid
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payslips_number ON payslips(payslip_number);
CREATE INDEX idx_payslips_period ON payslips(period_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
COMMENT ON TABLE payslips IS 'Employee payslips';

-- Payslip Lines
CREATE TABLE payslip_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payslip_id UUID NOT NULL REFERENCES payslips(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES salary_components(id),
    component_type VARCHAR(50) NOT NULL, -- earning, deduction
    amount DECIMAL(15,2) NOT NULL, -- UGX
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payslip_lines_payslip ON payslip_lines(payslip_id);

-- =====================================================
-- SECTION 10: DELIVERY MANAGEMENT
-- =====================================================

-- Delivery Orders
CREATE TABLE delivery_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_number VARCHAR(50) UNIQUE NOT NULL,
    delivery_date DATE NOT NULL,
    sales_order_id UUID REFERENCES sales_orders(id),
    customer_id UUID NOT NULL REFERENCES customers(id),
    warehouse_id UUID REFERENCES warehouses(id),
    delivery_address TEXT,
    delivery_city VARCHAR(100),
    delivery_contact_name VARCHAR(255),
    delivery_contact_phone VARCHAR(50),
    driver_id UUID REFERENCES users(id),
    vehicle_number VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_transit, delivered, failed, cancelled
    scheduled_time TIMESTAMPTZ,
    dispatched_time TIMESTAMPTZ,
    delivered_time TIMESTAMPTZ,
    delivery_notes TEXT,
    signature_url TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_delivery_orders_number ON delivery_orders(delivery_number);
CREATE INDEX idx_delivery_orders_sales_order ON delivery_orders(sales_order_id);
CREATE INDEX idx_delivery_orders_customer ON delivery_orders(customer_id);
CREATE INDEX idx_delivery_orders_status ON delivery_orders(status);
CREATE INDEX idx_delivery_orders_date ON delivery_orders(delivery_date);
COMMENT ON TABLE delivery_orders IS 'Delivery order management and tracking';

-- Delivery Order Items
CREATE TABLE delivery_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
    sales_order_item_id UUID REFERENCES sales_order_items(id),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_ordered DECIMAL(15,2) NOT NULL,
    quantity_delivered DECIMAL(15,2) DEFAULT 0,
    quantity_rejected DECIMAL(15,2) DEFAULT 0,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_delivery_order_items_delivery ON delivery_order_items(delivery_id);
CREATE INDEX idx_delivery_order_items_product ON delivery_order_items(product_id);

-- Delivery Tracking
CREATE TABLE delivery_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delivery_id UUID NOT NULL REFERENCES delivery_orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    recorded_by UUID REFERENCES users(id)
);

CREATE INDEX idx_delivery_tracking_delivery ON delivery_tracking(delivery_id);
CREATE INDEX idx_delivery_tracking_time ON delivery_tracking(recorded_at);
COMMENT ON TABLE delivery_tracking IS 'Real-time delivery status tracking';

-- =====================================================
-- SECTION 11: PROJECT MANAGEMENT
-- =====================================================

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(50),
    customer_id UUID REFERENCES customers(id),
    project_manager_id UUID REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    estimated_hours DECIMAL(10,2),
    actual_hours DECIMAL(10,2) DEFAULT 0,
    budget DECIMAL(15,2) DEFAULT 0, -- UGX
    actual_cost DECIMAL(15,2) DEFAULT 0, -- UGX
    status VARCHAR(50) DEFAULT 'planning', -- planning, active, on_hold, completed, cancelled
    priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
    completion_percent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    updated_by UUID,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_code ON projects(project_code);
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_status ON projects(status);
COMMENT ON TABLE projects IS 'Project management and tracking';

-- Project Tasks
CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_code VARCHAR(50) NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES project_tasks(id),
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id),
    start_date DATE,
    end_date DATE,
    estimated_hours DECIMAL(10,2),
    actual_hours DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'todo', -- todo, in_progress, review, completed, cancelled
    priority VARCHAR(50) DEFAULT 'medium',
    completion_percent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID,
    UNIQUE(project_id, task_code)
);

CREATE INDEX idx_project_tasks_project ON project_tasks(project_id);
CREATE INDEX idx_project_tasks_assigned ON project_tasks(assigned_to);
CREATE INDEX idx_project_tasks_status ON project_tasks(status);
COMMENT ON TABLE project_tasks IS 'Project task breakdown and assignment';

-- Task Time Logs
CREATE TABLE task_time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES project_tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    log_date DATE NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_task_time_logs_task ON task_time_logs(task_id);
CREATE INDEX idx_task_time_logs_user ON task_time_logs(user_id);

-- =====================================================
-- SECTION 12: NOTIFICATIONS & MESSAGING
-- =====================================================

-- Notification Categories
CREATE TABLE notification_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE notification_categories IS 'Notification categories (System, Sales, Inventory, etc.)';

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES notification_categories(id),
    notification_type VARCHAR(50) NOT NULL, -- system, sales, inventory, delivery, finance, workflow
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_type VARCHAR(50),
    priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    sent_via_email BOOLEAN DEFAULT false,
    sent_via_sms BOOLEAN DEFAULT false,
    sent_via_push BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
COMMENT ON TABLE notifications IS 'User notifications and alerts';

-- Notification Preferences
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    category_id UUID REFERENCES notification_categories(id),
    via_email BOOLEAN DEFAULT true,
    via_sms BOOLEAN DEFAULT false,
    via_in_app BOOLEAN DEFAULT true,
    via_push BOOLEAN DEFAULT true,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category_id)
);

CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);

-- Messages (Internal Messaging)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID,
    sender_id UUID NOT NULL REFERENCES users(id),
    message_type VARCHAR(50) DEFAULT 'text', -- text, file, image, voice
    message_content TEXT NOT NULL,
    file_url TEXT,
    file_name VARCHAR(255),
    file_size INTEGER,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);
COMMENT ON TABLE messages IS 'Internal messaging system';

-- Message Recipients
CREATE TABLE message_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    is_delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_message_recipients_message ON message_recipients(message_id);
CREATE INDEX idx_message_recipients_recipient ON message_recipients(recipient_id);

-- Message Reactions
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    reaction_type VARCHAR(50) NOT NULL, -- like, love, laugh, wow, sad, angry
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id, reaction_type)
);

CREATE INDEX idx_message_reactions_message ON message_reactions(message_id);

-- =====================================================
-- SECTION 13: AUDIT & SYSTEM MONITORING
-- =====================================================

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, etc.
    entity_type VARCHAR(100), -- users, products, sales_orders, etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
COMMENT ON TABLE audit_logs IS 'Complete audit trail of all system activities';

-- System Health Metrics
CREATE TABLE system_health_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(50) NOT NULL, -- cpu, memory, storage, api_response, errors
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit VARCHAR(50),
    module VARCHAR(100),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_system_health_metrics_type ON system_health_metrics(metric_type);
CREATE INDEX idx_system_health_metrics_recorded ON system_health_metrics(recorded_at);
COMMENT ON TABLE system_health_metrics IS 'System performance and health monitoring';

-- Error Logs
CREATE TABLE error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_type VARCHAR(100) NOT NULL,
    error_code VARCHAR(50),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    module VARCHAR(100),
    user_id UUID REFERENCES users(id),
    url TEXT,
    http_method VARCHAR(10),
    request_body TEXT,
    ip_address VARCHAR(50),
    severity VARCHAR(50) DEFAULT 'error', -- info, warning, error, critical
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_module ON error_logs(module);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_created ON error_logs(created_at);
COMMENT ON TABLE error_logs IS 'Application error tracking and monitoring';

-- =====================================================
-- SECTION 14: AUTOMATION & WORKFLOWS
-- =====================================================

-- Workflow Templates
CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_code VARCHAR(50) UNIQUE NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) NOT NULL, -- manual, scheduled, event, webhook
    trigger_config JSONB,
    module VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

COMMENT ON TABLE workflow_templates IS 'Automation workflow templates';

-- Workflow Executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES workflow_templates(id),
    execution_status VARCHAR(50) DEFAULT 'running', -- running, completed, failed, cancelled
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    input_data JSONB,
    output_data JSONB,
    triggered_by UUID REFERENCES users(id)
);

CREATE INDEX idx_workflow_executions_template ON workflow_executions(template_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(execution_status);
COMMENT ON TABLE workflow_executions IS 'Workflow execution history and logs';

-- =====================================================
-- SECTION 15: CRM & LEAD MANAGEMENT
-- =====================================================

-- Lead Sources
CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_code VARCHAR(50) UNIQUE NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE lead_sources IS 'Lead source tracking (website, referral, event, etc.)';

-- Leads
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_number VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255),
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    source_id UUID REFERENCES lead_sources(id),
    status VARCHAR(50) DEFAULT 'new', -- new, contacted, qualified, proposal, negotiation, won, lost
    rating VARCHAR(50), -- hot, warm, cold
    estimated_value DECIMAL(15,2), -- UGX
    probability INTEGER, -- 0-100
    expected_close_date DATE,
    assigned_to UUID REFERENCES users(id),
    converted_to_customer_id UUID REFERENCES customers(id),
    converted_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_leads_number ON leads(lead_number);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
COMMENT ON TABLE leads IS 'Sales lead and opportunity management';

-- CRM Activities
CREATE TABLE crm_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type VARCHAR(50) NOT NULL, -- call, email, meeting, task, note
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    related_to_type VARCHAR(50), -- lead, customer, opportunity
    related_to_id UUID,
    assigned_to UUID REFERENCES users(id),
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
    priority VARCHAR(50) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_crm_activities_type ON crm_activities(activity_type);
CREATE INDEX idx_crm_activities_related ON crm_activities(related_to_type, related_to_id);
CREATE INDEX idx_crm_activities_assigned ON crm_activities(assigned_to);

-- =====================================================
-- SECTION 16: DOCUMENTS & FILE MANAGEMENT
-- =====================================================

-- Document Categories
CREATE TABLE document_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES document_categories(id),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_number VARCHAR(50) UNIQUE NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES document_categories(id),
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    version VARCHAR(50) DEFAULT '1.0',
    related_to_type VARCHAR(50), -- sales_order, purchase_order, customer, supplier, etc.
    related_to_id UUID,
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_number ON documents(document_number);
CREATE INDEX idx_documents_category ON documents(category_id);
CREATE INDEX idx_documents_related ON documents(related_to_type, related_to_id);
COMMENT ON TABLE documents IS 'Document library and file management';

-- Document Permissions
CREATE TABLE document_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    permission_type VARCHAR(50) NOT NULL, -- user, role
    permission_id UUID NOT NULL, -- user_id or role_id
    can_view BOOLEAN DEFAULT true,
    can_edit BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    can_share BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX idx_document_permissions_document ON document_permissions(document_id);
CREATE INDEX idx_document_permissions_permission ON document_permissions(permission_type, permission_id);

-- Document Audit
CREATE TABLE document_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- upload, view, download, edit, delete, share
    user_id UUID REFERENCES users(id),
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_document_audit_document ON document_audit(document_id);
CREATE INDEX idx_document_audit_user ON document_audit(user_id);

-- =====================================================
-- END OF ADDITIONAL MODULES SCHEMA
-- =====================================================

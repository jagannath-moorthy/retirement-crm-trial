-- SQL script to create tables for SaaS CRM for Retirement Communities
-- Place this in Supabase SQL editor or migrations folder

-- 1. Client
CREATE TABLE client (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    contact_info jsonb,
    status text CHECK (status IN ('Lead', 'In Discussion', 'Confirmed', 'Active', 'Inactive')) NOT NULL,
    subscription_plan_id uuid,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 2. Community
CREATE TABLE community (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES client(id),
    name text NOT NULL,
    location jsonb,
    manager_id uuid,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 3. Unit
CREATE TABLE unit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES community(id),
    unit_number text NOT NULL,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 4. Facility
CREATE TABLE facility (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES community(id),
    name text NOT NULL,
    type text CHECK (type IN ('Public', 'Private', 'Special Access')) NOT NULL,
    capacity integer,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 5. Service
CREATE TABLE service (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES community(id),
    name text NOT NULL,
    description text,
    cost_structure text CHECK (cost_structure IN ('Flat fee', 'per-use', 'included in plan')) NOT NULL,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 6. Community_User
CREATE TABLE community_user (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES community(id),
    user_id uuid,
    unit_id uuid REFERENCES unit(id),
    role_type text CHECK (role_type IN ('Resident', 'Owner', 'Manager', 'Staff', 'Interested Party')) NOT NULL,
    relationship_type text CHECK (relationship_type IN ('Primary Resident', 'Co-Resident', 'Emergency Contact', 'Vendor')),
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 7. Role-Based Access
CREATE TABLE role_based_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES community(id),
    user_id uuid REFERENCES community_user(id),
    role_type text CHECK (role_type IN ('Owner', 'Manager', 'Staff', 'Resident', 'Interested Party')) NOT NULL,
    permissions jsonb,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- 8. Requests
CREATE TABLE requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id uuid REFERENCES community(id),
    user_id uuid REFERENCES community_user(id),
    request_type text CHECK (request_type IN ('Maintenance', 'Medical', 'General')) NOT NULL,
    status text CHECK (status IN ('Open', 'In Progress', 'Completed')) NOT NULL,
    assigned_staff_id uuid,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

-- SQL script to create the 'community' table for Retirement Communities CRM
CREATE TABLE community (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES client(id),
    name text NOT NULL,
    address_line1 text NOT NULL,
    address_line2 text,
    address_line3 text,
    locality text NOT NULL,
    country_subdivision text NOT NULL,
    postal_code text NOT NULL,
    country text NOT NULL,
    geo_location jsonb, -- {latitude, longitude}
    status text CHECK (status IN ('Active', 'Inactive')) NOT NULL,
    onboarding_status text CHECK (onboarding_status IN ('Setup Required', 'Data Import', 'Staff Training', 'Live')) NOT NULL,
    manager_id uuid, -- References community_user(id)
    timezone text,
    contact_email text,
    contact_phone text,
    logo_url text,
    onboarding_date date,
    created_datetime timestamptz DEFAULT now(),
    modified_datetime timestamptz DEFAULT now(),
    created_by uuid,
    modified_by uuid
);

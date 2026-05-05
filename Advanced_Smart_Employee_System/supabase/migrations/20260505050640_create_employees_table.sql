/*
  # Smart Employee Attrition & Performance Management System - Initial Schema

  ## Overview
  Creates the core employees table and supporting structures for the HR management system.

  ## New Tables

  ### employees
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, FK to auth.users) - Owner/creator of the record
  - `name` (text) - Full name of employee
  - `role` (text) - Job role (Developer, Manager, etc.)
  - `department` (text) - Department name
  - `salary` (numeric) - Monthly salary
  - `attendance` (numeric) - Attendance percentage (0-100)
  - `performance_rating` (numeric) - Rating 1-5
  - `date_of_joining` (date) - Start date
  - `experience` (numeric) - Years of experience
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled on employees table
  - Authenticated users can read all employees (HR visibility)
  - Authenticated users can insert employees
  - Authenticated users can update employees
  - Authenticated users can delete employees

  ## Notes
  - Attrition risk is computed client-side using rule-based logic
  - All authenticated users share visibility of employee data (single-org model)
*/

CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  salary numeric NOT NULL DEFAULT 0,
  attendance numeric NOT NULL DEFAULT 100 CHECK (attendance >= 0 AND attendance <= 100),
  performance_rating numeric NOT NULL DEFAULT 3 CHECK (performance_rating >= 1 AND performance_rating <= 5),
  date_of_joining date NOT NULL DEFAULT CURRENT_DATE,
  experience numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

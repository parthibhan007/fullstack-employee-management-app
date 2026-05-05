/*
  # Seed Admin User and Sample Employees

  ## Overview
  Creates the default admin account (admin@gmail.com / 123456) and populates
  the employees table with realistic sample data for demonstration purposes.

  ## Changes
  - Inserts default admin user into auth.users with confirmed email
  - Inserts 15 sample employees across various departments covering all
    three attrition risk levels (High, Medium, Low)
*/

DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud
    ) VALUES (
      admin_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@gmail.com',
      crypt('123456', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"name":"Admin"}',
      false,
      'authenticated',
      'authenticated'
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_id,
      'admin@gmail.com',
      jsonb_build_object('sub', admin_id::text, 'email', 'admin@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM employees LIMIT 1) THEN
    INSERT INTO employees (name, role, department, salary, attendance, performance_rating, date_of_joining, experience) VALUES
      ('Alice Johnson', 'Developer', 'Engineering', 95000, 95, 5, '2021-03-15', 5),
      ('Bob Martinez', 'Manager', 'Engineering', 120000, 88, 4, '2020-07-01', 8),
      ('Carol White', 'Designer', 'Design', 78000, 92, 4, '2022-01-10', 3),
      ('David Lee', 'Finance Analyst', 'Finance', 82000, 90, 4, '2021-09-20', 4),
      ('Emma Chen', 'HR Specialist', 'HR', 68000, 85, 3, '2023-02-28', 2),
      ('Frank Brown', 'Sales Rep', 'Sales', 60000, 45, 1, '2022-06-15', 3),
      ('Grace Wilson', 'Developer', 'Engineering', 88000, 60, 2, '2021-11-05', 4),
      ('Henry Davis', 'Marketing Specialist', 'Marketing', 72000, 78, 3, '2022-04-18', 3),
      ('Isabelle Taylor', 'DevOps Engineer', 'Engineering', 105000, 97, 5, '2020-02-14', 7),
      ('James Anderson', 'Product Manager', 'Product', 115000, 91, 4, '2019-08-25', 9),
      ('Karen Thomas', 'QA Engineer', 'Engineering', 80000, 65, 2, '2023-05-12', 2),
      ('Liam Jackson', 'Finance Analyst', 'Finance', 85000, 88, 4, '2021-12-01', 4),
      ('Mia Harris', 'Data Scientist', 'Engineering', 110000, 93, 5, '2022-09-07', 5),
      ('Noah Clark', 'Sales Rep', 'Sales', 58000, 40, 1, '2023-01-15', 1),
      ('Olivia Lewis', 'HR Specialist', 'HR', 70000, 82, 3, '2022-07-30', 3);
  END IF;
END $$;

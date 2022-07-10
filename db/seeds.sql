-- Inserts fake values into departments table
INSERT INTO departments
    (name)
VALUES
    ('Marketing'),
    ('Sales'),
    ('Customer Service'),
    ('IT');

-- Inserts fake values into roles table
INSERT INTO roles 
    (title, salary, department_id)
VALUES
    ('Marketing Manager', 150000, 1),
    ('Marketing Director', 100000, 1),
    ('Marketing Intern', 50000, 1),
    ('Sales Manager', 150000, 2),
    ('Sales Director', 100000, 2),
    ('Sales Intern', 50000, 2),
    ('Customer Service Manager', 150000, 3),
    ('Customer Service Director', 100000, 3),
    ('Customer Service Intern', 50000, 3),
    ('IT Manager', 150000, 4),
    ('IT Director', 100000, 4),
    ('IT Intern', 50000, 4);

-- Inserts fake values into employees table
INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('James', 'McAvoy', 4, NULL),
    ('Barbara', 'Platt', 7, NULL),
    ('Lakelon', 'Bailey', 10, NULL),
    ('Johhny', 'Dayton', 2, 1),
    ('Becky', 'Dalton', 3, 1),
    ('Emma', 'Poindexter', 5, 2),
    ('Sarah', 'Smith', 6, 2),
    ('Davis', 'Pfeifer', 8, 3),
    ('Grant', 'Duke', 9, 3),
    ('Remy', 'Newton', 11, 4),
    ('Raymond', 'Wysmierski', 12, 4)


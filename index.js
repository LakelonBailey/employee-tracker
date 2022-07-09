const db = require('./db/connection.js');
const inquirer = require('inquirer');
const table = require('console.table');

const promptActions = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Please select an action from the following choices:',
            choices: [
                'View Departments',
                'View Roles',
                'View Employees',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Quit'
            ],
            validate: actionInput => {
                if (actionInput) {
                    return true;
                }
                else {
                    console.log('Please choose an action before proceeding!');
                    return false;
                }
            }
        }
    ])
}


const promptNewDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: 'Please enter a name for the new department:'
        }
    ])
}

const promptNewRole = (departments) => {
    departmentNames = []
    for (var x of departments) {
        departmentNames.push(x.name)
    }
    return inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "Please enter the new role's title:"
        },
        {
            type: 'input',
            name: 'salary',
            message: "Please enter the new role's salary",
            validate: salaryInput => {
                let isnum = /^\d+$/.test(salaryInput);
                if (isnum) {
                    return true;
                }
                else {
                    console.log('\nInvalid Input: Please enter only numbers!')
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'department',
            message: 'Please select the department the role falls under:',
            choices: departmentNames
        }
    ])
}

const promptNewEmployee = (roles, managers) => {
    let roleTitles = [];
    let managerNames = [];
    for (let x of roles) {
        roleTitles.push(x.title)
    }
    for (let x of managers) {
        managerNames.push(x.first_name + ' ' + x.last_name)
    }
    managerNames.push('null')

    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "Please enter the employee's first name: ",
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                }
                else {
                    console.log("Please enter the employee's first name!")
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Please enter the employee's last name: ",
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                }
                else {
                    console.log("Please enter the employee's last name!")
                }
            }
        },
        {
            type: 'list',
            name: 'role',
            message: 'Please select a role for the employee:',
            choices: roleTitles
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Please select a manager for the employee (select null if the employee is a manager):',
            choices: managerNames
        }
    ])
}

const promptUpdateEmp = (emps, roles) => {
    let empNames = []
    for (let x of emps) {
        let empName = x.first_name + ' ' + x.last_name
        empNames.push(empName)
    }

    let roleTitles = []
    for (let x of roles) {
        roleTitles.push(x.title)
    }
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Please select an employee to update:',
            choices: empNames
        },
        {
            type: 'list',
            name: 'role',
            message: "Please select the employee's new role:",
            choices: roleTitles
        }
    ])
}


const viewDepartments = () => {
    const sql = 
    `
    SELECT * FROM departments
    `
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            process.exit();
        }
        console.table(rows);
        runProgram();
    })
}


const viewRoles = () => {
    const sql = 
    `
    SELECT roles.title, roles.id, departments.name as department, roles.salary
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
    `
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            process.exit();
        }
        console.table(rows);
        runProgram();
    })
}

const viewEmployees = () => {
    const sql = 
    `
    SELECT
        A.id,
        A.first_name,
        A.last_name,
        roles.title AS role,
        departments.name AS department,
        B.first_name AS manager_first_name,
        B.last_name AS manager_last_name
    FROM employees A
    LEFT JOIN roles ON A.role_id = roles.id
    LEFT JOIN employees B ON A.manager_id = B.id
    LEFT JOIN departments ON roles.department_id = departments.id
    `
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            process.exit();
        }
        console.table(rows)
        runProgram();
    })
}

const addDepartment = () => {
    promptNewDepartment()
    .then(data => {
        const name = data.department_name
        const sql = `
        INSERT INTO departments (name) VALUES (?)
        `
        const params = [name]
        db.query(sql, params, (err, result) => {
            if (err) {
                console.log(err);
                process.exit();
            }
            console.log("New department created with the name '" + name + "'")
            runProgram();
        })
    })
}

const addRole = () => {
    const departmentSQL = 
    `
    SELECT * FROM departments
    `
    db.query(departmentSQL, (err, departments) => {
        if (err) {
            console.log(err);
            process.exit();
        }
        
        promptNewRole(departments)
        .then(data => {
            let title = data.title;
            let salary = parseFloat(data.salary);
            let departmentID;
            for (let x of departments) {
                if (x.name == data.department) {
                    departmentID = x.id
                }
            }
            const params = [title, salary, departmentID]
            const sql = 
            `
            INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)
            `
            db.query(sql, params, (err, result) => {
                console.log("New role has been created with the title'" + title + "'")
                runProgram();
            })
        })
    })
}

const addEmployee = () => {
    const rolesSQL = 
    `
    SELECT * FROM roles
    `
    db.query(rolesSQL, (err, roles) => {
        if (err) {
            console.log(err);
            process.exit();
        }

        const managersSQL = 
        `
        SELECT * FROM employees WHERE manager_id IS NULL
        `
        db.query(managersSQL, (err, managers) => {
            if (err) {
                console.log(err);
                process.exit();
            }
            promptNewEmployee(roles, managers)
            .then(data => {
                let first_name = data.first_name;
                let last_name = data.last_name;
                let roleTitle = data.role;

                let manager_id;
                if (data.manager == 'null') {
                    manager_id = null;
                }
                else {
                    let managerFirstName = data.manager.split(' ')[0];
                    for (let x of managers) {
                        if (x.first_name == managerFirstName) {
                            manager_id = x.id;
                        }
                    }

                }

                let role_id;
                for (let x of roles) {
                    if (x.title == roleTitle) {
                        role_id = x.id
                    }
                }
                const params = [first_name, last_name, role_id, manager_id]
                const sql = 
                `
                INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)
                `
                db.query(sql, params, (err, result) => {
                    if (err) {
                        console.log(err);
                        process.exit();
                    }
                    console.log("New employee named '" + first_name + ' ' + last_name + "' has been created")
                    runProgram();
                })
            })
        })
    })
}

const updateEmployee = () => {
    const employeeSQL = 
    `
    SELECT * FROM employees
    `
    const roleSQl = 
    `
    SELECT * FROM roles
    `
    db.query(employeeSQL, (err, emps) => {
        if (err) {
            console.log(err);
            process.exit();
        }
        db.query(roleSQl, (err, roles) => {
            if (err) {
                console.log(err);
                process.exit();
            }

            promptUpdateEmp(emps, roles)
            .then (data => {
                let id;
                let role_id;
                let empFirstName = data.employee.split(' ')[0]
                for (let x of emps) {
                    if (x.first_name == empFirstName) {
                        id = x.id
                    }
                }
                for (let x of roles) {
                    if (x.title == data.role) {
                        role_id = x.id
                    }
                }

                const sql = 
                `
                UPDATE employees SET role_id = ?
                WHERE id = ?
                `
                const params = [role_id, id]

                db.query(sql, params, (err, result) => {
                    console.log('Successfully changed ' + data.employee + "'s role")
                    runProgram();
                })
            })
        })
    })
}

const runProgram = () => {
    promptActions()
    .then(data => {
        action = data.action;
        if (action == 'View Departments') {
            viewDepartments();
        }
        else if (action == 'View Roles') {
            viewRoles();
        }
        else if (action == 'View Employees') {
            viewEmployees();
        }
        else if (action == 'Add Department') {
            addDepartment();
        }
        else if (action == 'Add Role') {
            addRole();
        }
        else if (action == 'Add Employee') {
            addEmployee();
        }
        else if (action == 'Update Employee Role') {
            updateEmployee();
        }
        else {
            process.exit();
        }
    });
}

runProgram();

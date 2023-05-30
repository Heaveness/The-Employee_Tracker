// Variables for the required packages.
const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');

// Variables to initialize and set up express server.
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// MySQL Connection.
const connection = mysql.createConnection(
	{
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: '',
		database: 'employee_db',
	},
	console.log(`Connected to the employee_db database.`)
);

// Function to start the employee tracker application.
function startTracker() {
	// Title text box.
	const title = 'Employee Tracker';

	const line = '─'.repeat(title.length + 4);
	const spaces = ' '.repeat(title.length + 2);
  
	console.log(`┌${line}┐`);
	console.log(`│${spaces}  │`);
	console.log(`│  ${title}  │`);
	console.log(`│${spaces}  │`);
	console.log(`└${line}┘`);
	console.log('\nWelcome to the Employee Tracker application!\n');

  	// Prompts the user with options through inquirer.
	inquirer
		.prompt([
		{
			// List type to allow user for choosing between options.
			type: 'list',
			name: 'action',
			message: 'What would you like to do?',
			choices: [
			'View all departments.',
			'View all roles.',
			'View all employees.',
			'Add a department.',
			'Add a role.',
			'Add an employee.',
			'Update an employee role.',
			'Exit.',
			],
		},
		])
    	// Then function to pass user inputs as answer param.
		.then((answer) => {
		// Call respective functions based on user's choice through param.
		switch (answer.action) {
			case 'View all departments.':
			viewAllDepartments();
			break;
			case 'View all roles.':
			viewAllRoles();
			break;
			case 'View all employees.':
			viewAllEmployees();
			break;
			case 'Add a department.':
			addDepartment();
			break;
			case 'Add a role.':
			addRole();
			break;
			case 'Add an employee.':
			addEmployee();
			break;
			case 'Update an employee role.':
			updateEmployeeRole();
			break;
			case 'Exit.':
			connection.end();
			break;
			default:
			console.log('Invalid choice! Please select again...');
			startTracker();
		}
		})
		// Catch function for any potential errors.
		.catch((error) => {
			console.log('An error occurred:', error);
			connection.end();
		});
}

// Function to view all departments from the database.
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, departments) => {
		if (err) {
		  	console.error('Error retrieving departments:', err);
		  	startTracker();
		  	return;
		}

		console.log('Departments:');
		console.table(departments);
	
		startTracker();
	});
}

// Function to view all roles from the database.
function viewAllRoles() {
	connection.query(
		'SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id',
		(err, roles) => {
			// If statement for any potential errors.
			if (err) {
				console.error('Error retrieving roles:', err);
				startTracker();
				return;
			}
		
			console.log('Roles:');
			console.table(roles);
		
			startTracker();
		}
	);
}

// Function to view all employees from the database.
function viewAllEmployees() {
	const query =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager ' +
    'FROM employee ' +
    'LEFT JOIN role ON employee.role_id = role.id ' +
    'LEFT JOIN department ON role.department_id = department.id ' +
    'LEFT JOIN employee AS manager ON employee.manager_id = manager.id';

  	connection.query(query, (err, employees) => {
		// If statement for any potential errors.
		if (err) {
			console.error('Error retrieving employees:', err);
			startTracker();
			return;
		}

    	console.log('Employees:');
    	console.table(employees);

    	startTracker();
    });
}

// Function to add a department into the database.
function addDepartment() {
	inquirer
    .prompt([
		{
			type: 'input',
			name: 'departmentName',
			message: 'Enter the name of the department:',
		},
    ])
    .then((answer) => {
		const query = 'INSERT INTO department (name) VALUES (?)';
		connection.query(query, answer.departmentName, (err, res) => {
		  if (err) throw err;
		  console.log('Department added successfully!');
		  startTracker();
		});
	})
	// Catch function for any potential errors.
    .catch((error) => {
		console.log('An error occurred:', error);
		startTracker();
    });
}

// Function to add a role into the database.
function addRole() {
	inquirer
    .prompt([
		{
			type: 'input',
			name: 'title',
			message: "Enter the role's title:",
		},
		{
			type: 'number',
			name: 'salary',
			message: "Enter the role's salary:",
		},
		{
			type: 'input',
			name: 'department',
			message: "Enter the role's department:",
		},
    ])
    .then((answers) => {
		const { title, salary, department } = answers;

		connection.query(
			'SELECT id FROM department WHERE name = ?',
			[department],
			(err, results) => {
			// If statement for any potential errors.
			if (err) {
				console.error('Error retrieving department:', err);
				startTracker();
				return;
			}
			// If statement for any potential errors.
			if (results.length === 0) {
				console.log('Department not found. Please add the department first.');
				startTracker();
				return;
			}

			const departmentId = results[0].id;

			connection.query(
				'INSERT INTO role SET ?',
				{ title, salary, department_id: departmentId },
				(err) => {
				// If statement for any potential errors.
				if (err) {
					console.error('Error adding role:', err);
				} 
				else {
					console.log('Role added successfully!');
				}

				startTracker();
				}
			);
			}
		);
    })
	// Catch function for any potential errors.
    .catch((error) => {
		console.log('An error occurred:', error);
		startTracker();
    });
}

// Function to add an employee into the database.
function addEmployee() {
	inquirer
    .prompt([
		{
			type: 'input',
			name: 'firstName',
			message: "Enter the employee's first name:",
		},
		{
			type: 'input',
			name: 'lastName',
			message: "Enter the employee's last name:",
		},
		{
			type: 'number',
			name: 'roleId',
			message: "Enter the employee's role ID:",
		},
		{
			type: 'number',
			name: 'managerId',
			message: "Enter the employee's manager ID:",
		},
    ])
    .then((answers) => {
		const { firstName, lastName, roleId, managerId } = answers;

		connection.query(
			'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
			[firstName, lastName, roleId, managerId],
			(err) => {
			// If statement for any potential errors.
			if (err) {
				console.error('Error adding employee:', err);
			} 
			else {
				console.log('Employee added successfully!');
			}

			startTracker();
			}
		);
    })
	// Catch function for any potential errors.
    .catch((error) => {
		console.log('An error occurred:', error);
		startTracker();
    });
}

// Function to update employee role from the database.
function updateEmployeeRole() {
	inquirer
    .prompt([
		{
			type: 'number',
			name: 'employeeId',
			message: "Enter the ID of the employee you want to update:",
		},
		{
			type: 'number',
			name: 'roleId',
			message: "Enter the new role ID for the employee:",
		},
    ])
    .then((answers) => {
		const { employeeId, roleId } = answers;

		connection.query(
			'UPDATE employee SET role_id = ? WHERE id = ?',
			[roleId, employeeId],
			(err) => {
			// If statement for any potential errors.
			if (err) {
				console.error('Error updating employee role:', err);
			} 
			else {
				console.log('Employee role updated successfully!');
			}
			startTracker();
			}
		);
    })
	// Catch function for any potential errors.
    .catch((error) => {
		console.log('An error occurred:', error);
		startTracker();
    });
}

// Establish database connection.
connection.connect((err) => {
	// If statement for any potential errors.
	if (err) {
		console.error('Error connecting to the database:', err);
		return;
	}
	console.log('Connected to the database.');
  
	// Call the startTracker() function to prompt the user with options.
	startTracker();
});

// Start the server.
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
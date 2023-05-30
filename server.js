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

}

// Function to add a role into the database.
function addRole() {

}

// Function to add an employee into the database.
function addEmployee() {

}

// Function to update employee role from the database.
function updateEmployeeRole() {

}
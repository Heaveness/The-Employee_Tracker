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
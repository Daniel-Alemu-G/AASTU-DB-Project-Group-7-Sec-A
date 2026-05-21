Project Title

YISAKAL Saving and Credit Cooperative Organization Database Management System

Group Members
Full Name	           ID Number
Anael Mulugeta	     ETS0176/17
Betelhem Hailu	     ETS0298/17
Betelhem Sefiw	    ETS0285/17
Bontu Bekele	      ETS0361/17
Daniel Alemu	      ETS0406/17
Dilayehu Dessalegn 	ETS0445/17

Description
The YISAKAL SACCO Database Management System is a hybrid database project developed for the hypothetical YISAKAL Saving and Credit Cooperative Organization (YISAKAL SACCO). The system is designed to improve the management of member information, savings, loans, repayments, and reporting activities.
The project integrates both relational and NoSQL database technologies to overcome the limitations of traditional database systems. MySQL is used for structured transactional data such as member registration, savings accounts, loan applications, and repayment records, while MongoDB is used for semi-structured and high-volume data including audit logs, notifications, repayment incidents, and document-like records.

The system aims to:
Improve data consistency and integrity
Reduce duplication and manual data handling
Support scalable and flexible data storage
Enhance reporting and decision-making processes
Provide efficient management of SACCO operations

Technologies Used
-MySQL
-MongoDB
-MySQL Workbench
-MongoDB Compass
-JavaScript
-JSON
-GitHub
-draw.io

How to Run the Project
Prerequisites
Before running the project, make sure the following tools are installed:
-MySQL Community Server
- MongoDB Community Edition
- MySQL Workbench
- MongoDB Compass

Steps to run
  1. Clone the Repository
git clone <repository-link>

2. Open the Project
Navigate into the project folder:
cd YISAKAL-SACCO-DBMS

4. Setup MySQL Database
Open MySQL Workbench
Create a new database
Import or run the provided SQL scripts
Execute the schema and table creation scripts

Example:

CREATE DATABASE yisakal_sacco;
USE yisakal_sacco;
4. Setup MongoDB Collections
Open MongoDB Compass or Mongo Shell
Create a database named:
yisakal_sacco
Import the provided JSON collections or create collections manually

5. Run Queries and Test the System
Execute SQL queries for transactional operations
Execute MongoDB queries for logs and document-based records
Test member registration, loan processing, savings transactions, and reporting functionalities
Project Scope

The project covers:
Member Management
Savings Management
Loan Management
Repayment Tracking
Basic Reporting
Audit and Log Management

This project is developed for educational and academic purposes only.

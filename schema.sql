CREATE DATABASE Yisakal_SACCO;
USE Yisakal_SACCO;

CREATE TABLE Branch (
branch_id int PRIMARY KEY AUTO_INCREMENT,
name varchar(100) NOT NULL,
region varchar(100) NOT NULL,
city varchar(100) NOT NULL,
subcity varchar(100) NOT NULL,
kebele varchar(100),
street varchar(150),
phone_number varchar(50),
manager_id int,
created_date date DEFAULT (CURRENT_DATE),
status enum('Active', 'Inactive') DEFAULT 'Active'
);

CREATE TABLE Employee (
employee_id int PRIMARY KEY AUTO_INCREMENT,
branch_id int,
first_name varchar(60) NOT NULL,
middle_name varchar(60) NOT NULL,
last_name varchar(60) NOT NULL,
email varchar(150),
phone_number varchar(50),
role enum('Admin', 'Manager', 'Officer', 'Teller') NOT NULL,
hire_date date DEFAULT (CURRENT_DATE),
status enum('Active', 'Inactive', 'Terminated') DEFAULT 'Active',
FOREIGN KEY (branch_id)
REFERENCES Branch(branch_id)
);

CREATE TABLE Member (
member_id int PRIMARY KEY AUTO_INCREMENT,
first_name varchar(60) NOT NULL,
middle_name varchar(60) NOT NULL,
last_name varchar(60) NOT NULL,
branch_id int,
gender enum('Male', 'Female'),
date_of_birth date,
national_id_number varchar(50) NOT NULL,
kebele_id_number varchar(50) NOT NULL,
email varchar(150),
phone_number varchar(50),
region varchar(100) NOT NULL,
city varchar(100) NOT NULL,
subcity varchar(100) NOT NULL,
kebele varchar(100),
street varchar(150),
house_number varchar(50),
occupation varchar(100),
credit_score int,
membership_date date DEFAULT (CURRENT_DATE),
status enum('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
FOREIGN KEY (branch_id)
REFERENCES Branch(branch_id),
UNIQUE KEY UK_national_id (national_id_number),
UNIQUE KEY UK_kebele_id (kebele_id_number)
);

CREATE TABLE SavingAccountProduct (
product_id int PRIMARY KEY AUTO_INCREMENT,
name varchar(100) NOT NULL,
description varchar(255),
min_balance decimal(18,2) DEFAULT 0.00,
interest_rate decimal(5,2) NOT NULL,
posting_frequency enum('Daily', 'Weekly', 'Monthly', 'Yearly') NOT NULL,
status enum('Active', 'Inactive') DEFAULT 'Active'
);

CREATE TABLE LoanProduct (
product_id int PRIMARY KEY AUTO_INCREMENT,
name varchar(100) NOT NULL,
description varchar(255),
min_amount decimal(18,2),
max_amount decimal(18,2),
min_tenure_months int,
max_tenure_months int,
base_interest_rate decimal(5,2),
interest_type enum('Flat', 'Reducing') NOT NULL,
requires_guarantor bool DEFAULT false,
requires_collateral bool DEFAULT false,
status enum('Active', 'Inactive') DEFAULT 'Active'
);

CREATE TABLE SavingAccount (
account_id int PRIMARY KEY AUTO_INCREMENT,
member_id int NOT NULL,
account_number varchar(50) UNIQUE NOT NULL,
branch_id int,
product_id int NOT NULL,
current_balance decimal(18,2) DEFAULT 0.00,
open_date date DEFAULT (CURRENT_DATE),
status enum('Active', 'Inactive', 'Closed') DEFAULT 'Active',
FOREIGN KEY (product_id)
REFERENCES SavingAccountProduct(product_id),
FOREIGN KEY (member_id)
REFERENCES Member(member_id),
FOREIGN KEY (branch_id)
REFERENCES Branch(branch_id)
);

CREATE TABLE Loan (
loan_id int PRIMARY KEY AUTO_INCREMENT,
member_id int NOT NULL,
product_id int NOT NULL,
loan_officer_id int,
principal_amount decimal(18,2) NOT NULL,
interest_rate decimal(5,2) NOT NULL,
term_months int NOT NULL,
disbursement_date date,
maturity_date date,
outstanding_principal decimal(18,2),
outstanding_interest decimal(18,2),
outstanding_fees decimal(18,2),
status enum('Applied', 'Approved', 'Disbursed', 'Active', 'Closed', 'Defaulted') DEFAULT 'Applied',
FOREIGN KEY (member_id)
REFERENCES Member(member_id),
FOREIGN KEY (loan_officer_id)
REFERENCES Employee(employee_id),
FOREIGN KEY (product_id)
REFERENCES LoanProduct(product_id)
);
CREATE TABLE LoanSchedule (
schedule_id int PRIMARY KEY AUTO_INCREMENT,
loan_id int NOT NULL,
installment_number int NOT NULL,
due_date date NOT NULL,
principal_due decimal(18,2) DEFAULT 0.00,
interest_due decimal(18,2) DEFAULT 0.00,
fees_due decimal(18,2) DEFAULT 0.00,
principal_paid decimal(18,2) DEFAULT 0.00,
interest_paid decimal(18,2) DEFAULT 0.00,
fees_paid decimal(18,2) DEFAULT 0.00,
status enum('Pending', 'Paid', 'Partial', 'Overdue') DEFAULT 'Pending',
FOREIGN KEY (loan_id)
REFERENCES Loan(loan_id)
);

CREATE TABLE SavingsTransaction (
transaction_id int PRIMARY KEY AUTO_INCREMENT,
account_id int NOT NULL,
transaction_type enum('Deposit', 'Withdrawal', 'Interest', 'Fee') NOT NULL,
amount decimal(18,2) NOT NULL,
transaction_date datetime DEFAULT CURRENT_TIMESTAMP,
balance_after_transaction decimal(18,2),
reference_number varchar(100),
employee_id int,
FOREIGN KEY (account_id)
REFERENCES SavingAccount(account_id),
FOREIGN KEY (employee_id)
REFERENCES Employee(employee_id)
);

CREATE TABLE LoanTransaction (
transaction_id int PRIMARY KEY AUTO_INCREMENT,
loan_id int NOT NULL,
loan_schedule_id int,
transaction_type enum('Disbursement', 'Repayment', 'Interest', 'Fee') NOT NULL,
amount decimal(18,2) NOT NULL,
transaction_date datetime DEFAULT CURRENT_TIMESTAMP,
payment_method enum('Cash', 'Transfer', 'Check') NOT NULL,
reference_number varchar(100),
employee_id int,
reversal_status enum('None', 'Reversed', 'Correction') DEFAULT 'None',
FOREIGN KEY (loan_id)
REFERENCES Loan(loan_id),
FOREIGN KEY (employee_id)
REFERENCES Employee(employee_id),
FOREIGN KEY (loan_schedule_id)
REFERENCES LoanSchedule(schedule_id)
);

CREATE TABLE Guaranty (
loan_id int,
member_id int,
guarantee_amount decimal(18,2) NOT NULL,
status enum('Active', 'Released', 'Claimed') DEFAULT 'Active',
PRIMARY KEY (loan_id, member_id),
FOREIGN KEY (loan_id)
REFERENCES Loan(loan_id),
FOREIGN KEY (member_id)
REFERENCES Member(member_id)
);

CREATE TABLE Collateral (
collateral_id int PRIMARY KEY AUTO_INCREMENT,
loan_id int NOT NULL,
collateral_type varchar(100) NOT NULL,
description varchar(255),
estimated_value decimal(18,2),
ownership_document_ref varchar(150),
status enum('Pledged', 'Released', 'Liquidated') DEFAULT 'Pledged',
FOREIGN KEY (loan_id)
REFERENCES Loan(loan_id)
);

CREATE TABLE Audit (
audit_id int PRIMARY KEY AUTO_INCREMENT,
entity_name enum('Member', 'Loan', 'SavingAccount', 'Employee', 'Branch') NOT NULL,
entity_id varchar(100) NOT NULL,
action_type enum('Create', 'Update', 'Delete', 'Login') NOT NULL,
old_values json,
new_values json,
employee_id int,
created_at datetime DEFAULT CURRENT_TIMESTAMP,
ip_address varchar(45),
FOREIGN KEY (employee_id)
REFERENCES Employee(employee_id)
);

CREATE TABLE FeeType (
fee_type_id int PRIMARY KEY AUTO_INCREMENT,
name varchar(100) NOT NULL,
description varchar(255),
calculation_method enum('Flat', 'Percentage') NOT NULL,
amount_or_rate decimal(18,2) NOT NULL,
is_active bool DEFAULT true
);

CREATE TABLE FeeEvent (
fee_event_id int PRIMARY KEY AUTO_INCREMENT,
fee_type_id int NOT NULL,
loan_id int,
saving_transaction_id int,
paid bool DEFAULT false,
FOREIGN KEY (saving_transaction_id)
REFERENCES SavingsTransaction(transaction_id),
FOREIGN KEY (fee_type_id)
REFERENCES FeeType(fee_type_id),
FOREIGN KEY (loan_id)
REFERENCES Loan(loan_id)
);

CREATE TABLE FeeTransaction (
fee_transaction_id int PRIMARY KEY AUTO_INCREMENT,
fee_event_id int NOT NULL,
amount decimal(18,2) NOT NULL,
reference varchar(100),
transaction_date datetime DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (fee_event_id)
REFERENCES FeeEvent(fee_event_id)
);

ALTER TABLE Branch 
ADD FOREIGN KEY (manager_id) 
REFERENCES Employee(employee_id);
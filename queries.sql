-- BRANCH
INSERT INTO Branch (branch_id, name, region, city, subcity, kebele, street, phone_number, created_date, status) VALUES
(1,'Merkato Branch','Addis Ababa','Addis Ababa','Addis Ketema','05','Merkato Ave','0111234567','2020-01-15','Active'),
(2,'Bole Branch','Addis Ababa','Addis Ababa','Bole','03','Bole Rd','0119876543','2020-06-01','Active'),
(3,'Bahir Dar Branch','Amhara','Bahir Dar','Fasilo','01','Lake Tana St','0581234567','2021-03-10','Active'),
(4,'Jimma Branch','Oromia','Jimma','Jimma','02','Main St','0471112233','2021-08-12','Active'),
(5,'Hawassa Branch','SNNPR','Hawassa','Tabor','04','Unity St','0462223344','2022-02-10','Active');
-- EMPLOYEE
INSERT INTO Employee (employee_id, branch_id, first_name,middle_name, last_name, email, phone_number, role, hire_date, status) VALUES
(101,1,'Abebe','Kebede','Demeke','abebe@yisakal.com','0911111111','Manager','2020-01-20','Active'),
(102,1,'Sara','Tesfaye','Megersa','sara@yisakal.com','0922222222','Officer','2020-03-15','Active'),
(103,2,'Dawit','Haile','Serawit','dawit@yisakal.com','0933333333','Teller','2021-01-10','Active'),
(104,2,'Meron','Alemu','Bereket','meron@yisakal.com','0944444444','Manager','2020-06-05','Active'),
(105,3,'Yonas','Girma','Mitku','yonas@yisakal.com','0955555555','Officer','2021-04-01','Active');
-- MEMBER
INSERT INTO Member (member_id, first_name, middle_name, last_name, branch_id, gender, date_of_birth, national_id_number, kebele_id_number, email, phone_number, region, city, subcity, kebele, street, house_number, occupation, credit_score, membership_date, status) VALUES
(201,'Tigist','Bekele','Debebe',1,'Female','1990-05-12','NID1001','KID1001','tigist@gmail.com','0966666666','Addis Ababa','Addis Ababa','Addis Ketema','05','Merkato Ave','12A','Trader',720,'2021-01-10','Active'),
(202,'Kebede','Desta','Ayele',1,'Male','1985-11-03','NID1002','KID1002','kebede@gmail.com','0977777777','Addis Ababa','Addis Ababa','Arada','02','Piassa Rd','5','Teacher',680,'2021-02-20','Active'),
(203,'Helen','Tadesse','Alemu',2,'Female','1992-08-25','NID1003','KID1003','helen@gmail.com','0988888888','Addis Ababa','Addis Ababa','Bole','07','Cameroon St','33','Nurse',750,'2021-06-15','Active'),
(204,'Solomon','Gebre','Alazar',2,'Male','1988-02-14','NID1004','KID1004','solomon@gmail.com','0912345678','Addis Ababa','Addis Ababa','Yeka','10','Megenagna Rd','8B','Engineer',790,'2022-01-05','Active'),
(205,'Fatuma','Ahmed','Jemal',3,'Female','1995-12-30','NID1005','KID1005','fatuma@gmail.com','0923456789','Amhara','Bahir Dar','Fasilo','01','University Ave','15','Accountant',710,'2022-03-20','Active');
-- SAVING ACCOUNT PRODUCT
INSERT INTO SavingAccountProduct (product_id,name,description,min_balance,interest_rate,posting_frequency,status) VALUES
(301,'Regular Savings','Standard account',100,7,'Yearly','Active'),
(302,'Youth Savings','Youth account',50,8.5,'Monthly','Active'),
(303,'Fixed Deposit','12 months deposit',5000,10,'Yearly','Active'),
(304,'Business Savings','Business account',1000,9,'Monthly','Active'),
(305,'Women Savings','Women empowerment account',200,8,'Monthly','Active');
-- LOAN PRODUCT
INSERT INTO LoanProduct (product_id,name,description,min_amount,max_amount,min_tenure_months,max_tenure_months,base_interest_rate,interest_type,requires_guarantor,requires_collateral,status) VALUES
(401,'Personal Loan','Personal needs',5000,100000,6,36,15,'Reducing',true,false,'Active'),
(402,'Business Loan','Business support',50000,500000,12,60,12.5,'Flat',true,true,'Active'),
(403,'Emergency Loan','Short term',1000,20000,1,6,18,'Flat',false,false,'Active'),
(404,'Education Loan','School fees',2000,50000,6,24,10,'Reducing',true,false,'Active'),
(405,'Agriculture Loan','Farm support',3000,150000,6,48,11,'Reducing',true,true,'Active');
-- SAVING ACCOUNT
INSERT INTO SavingAccount (account_id,member_id,account_number,branch_id,product_id,current_balance,open_date,status) VALUES
(501,201,'SA1001',1,301,25000,'2021-01-10','Active'),
(502,202,'SA1002',1,301,12500,'2021-02-20','Active'),
(503,203,'SA1003',2,302,8000,'2021-06-15','Active'),
(504,204,'SA1004',2,303,50000,'2022-01-05','Active'),
(505,205,'SA1005',3,304,15000,'2022-03-20','Active');
-- LOAN
INSERT INTO Loan (loan_id,member_id,product_id,loan_officer_id,principal_amount,interest_rate,term_months,disbursement_date,maturity_date,outstanding_principal,outstanding_interest,outstanding_fees,status) VALUES
(601,201,401,102,50000,15,24,'2023-01-15','2025-01-15',30000,4500,0,'Active'),
(602,203,403,103,10000,18,3,'2024-06-01','2024-09-01',0,0,0,'Closed'),
(603,204,402,104,200000,12.5,36,'2024-03-10','2027-03-10',170000,21250,500,'Active'),
(604,205,401,105,30000,15,12,NULL,NULL,30000,0,0,'Approved'),
(605,202,404,101,20000,10,18,'2024-01-10','2025-07-10',12000,1800,0,'Active');
-- LOAN SCHEDULE
INSERT INTO LoanSchedule (schedule_id,loan_id,installment_number,due_date,principal_due,interest_due,fees_due,principal_paid,interest_paid,fees_paid,status) VALUES
(701,601,1,'2023-02-15',2083,625,0,2083,625,0,'Paid'),
(702,601,2,'2023-03-15',2083,598,0,2083,598,0,'Paid'),
(703,601,3,'2023-04-15',2083,572,0,0,0,0,'Overdue'),
(704,603,1,'2024-04-10',5555,2083,0,5555,2083,0,'Paid'),
(705,605,1,'2024-02-10',1111,166,0,1111,166,0,'Paid');
-- SAVINGS TRANSACTION
INSERT INTO SavingsTransaction (transaction_id,account_id,transaction_type,amount,transaction_date,balance_after_transaction,reference_number,employee_id) VALUES
(801,501,'Deposit',10000,'2021-01-10 09:00:00',10000,'STX1',103),
(802,501,'Deposit',15000,'2021-06-15 10:30:00',25000,'STX2',103),
(803,502,'Deposit',20000,'2021-02-20 11:00:00',20000,'STX3',103),
(804,502,'Withdrawal',7500,'2022-08-10 14:15:00',12500,'STX4',103),
(805,503,'Deposit',8000,'2021-06-15 09:45:00',8000,'STX5',103);
-- LOAN TRANSACTION
INSERT INTO LoanTransaction (transaction_id,loan_id,loan_schedule_id,transaction_type,amount,transaction_date,payment_method,reference_number,employee_id,reversal_status) VALUES
(901,601,NULL,'Disbursement',50000,'2023-01-15 08:00:00','Transfer','LTX1',102,'None'),
(902,601,701,'Repayment',2708,'2023-02-15 09:30:00','Cash','LTX2',103,'None'),
(903,603,NULL,'Disbursement',200000,'2024-03-10 08:30:00','Transfer','LTX3',104,'None'),
(904,603,704,'Repayment',7638,'2024-04-10 11:00:00','Transfer','LTX4',103,'None'),
(905,605,NULL,'Disbursement',20000,'2024-01-10 10:00:00','Transfer','LTX5',101,'None');

-- GUARANTY
INSERT INTO Guaranty (loan_id,member_id,guarantee_amount,status) VALUES
(601,202,25000,'Active'),
(603,203,100000,'Active'),
(604,201,15000,'Active'),
(605,204,10000,'Active');
-- COLLATERAL
INSERT INTO Collateral (collateral_id,loan_id,collateral_type,description,estimated_value,ownership_document_ref,status) VALUES
(1101,603,'Vehicle','Toyota Vitz',350000,'DOC1','Pledged'),
(1102,603,'Property','Land 200sqm',500000,'DOC2','Pledged'),
(1103,605,'House','Small house',300000,'DOC3','Pledged'),
(1104,602,'Equipment','Office equipment',50000,'DOC4','Released');
-- AUDIT
INSERT INTO Audit (audit_id, entity_name, entity_id, action_type, old_values, new_values, employee_id, created_at, ip_address) VALUES
(1201,'Loan','601','Create',NULL,'{"status":"Applied"}',102,'2023-01-15 08:00:00','192.168.1.10'),
(1202,'Loan','601','Update','{"status":"Applied"}','{"status":"Disbursed"}',101,'2023-01-15 08:05:00','192.168.1.11'),
(1203,'Member','201','Create',NULL,'{"status":"Created"}',102,'2021-01-10 09:00:00','192.168.1.10'),
(1204,'Loan','603','Update','{"status":"Approved"}','{"status":"Active"}',104,'2024-03-10 09:00:00','192.168.1.12');
-- FEE TYPE
INSERT INTO FeeType (fee_type_id,name,description,calculation_method,amount_or_rate,is_active) VALUES
(1301,'Processing Fee','Loan fee','Percentage',2,true),
(1302,'Late Fee','Penalty','Percentage',5,true),
(1303,'Service Fee','Monthly fee','Flat',25,true),
(1304,'Registration Fee','Joining fee','Flat',100,true);
-- FEE EVENT 
INSERT INTO FeeEvent (fee_event_id,fee_type_id,loan_id,saving_transaction_id,paid) VALUES
(1401,1301,601,NULL,true),
(1402,1302,601,NULL,false),
(1403,1301,603,NULL,true),
(1404,1304,605,NULL,true);
-- FEE TRANSACTION 
INSERT INTO FeeTransaction (fee_transaction_id,fee_event_id,amount,reference,transaction_date) VALUES
(1501,1401,1000,'FTX1','2023-01-15 08:10:00'),
(1502,1403,4000,'FTX2','2024-03-10 08:40:00'),
(1503,1404,500,'FTX3','2024-01-10 08:20:00');



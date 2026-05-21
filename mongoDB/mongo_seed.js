// MongoDB Seed Data For Yisakal_SACCO
// Run after mongo_schema.js with mongosh mongo_seed.js

use("Yisakal_SACCO");

// Branches
db.Branch.insertMany([
  { _id: "Branch-1", name: "Merkato Branch", address: { region: "Addis Ababa", city: "Addis Ababa", subcity: "Addis Ketema", kebele: "05", street: "Merkato Ave" }, phone_number: "0111234567", created_date: new Date("2020-01-15"), status: "Active" },
  { _id: "Branch-2", name: "Bole Branch", address: { region: "Addis Ababa", city: "Addis Ababa", subcity: "Bole", kebele: "03", street: "Bole Rd" }, phone_number: "0119876543", created_date: new Date("2020-06-01"), status: "Active" },
  { _id: "Branch-3", name: "Bahir Dar Branch", address: { region: "Amhara", city: "Bahir Dar", subcity: "Fasilo", kebele: "01", street: "Lake Tana St" }, phone_number: "0581234567", created_date: new Date("2021-03-10"), status: "Active" },
])


// Employees
db.Employee.insertMany([
  { _id: "Employee-101", branch_id: "Branch-1", name: { first_name: "Abebe", middle_name: "Kebede", last_name: "Desta" }, email: "abebe@yisakal.com", phone_number: "0911111111", role: "Manager", hire_date: new Date("2020-01-20"), status: "Active" },
  { _id: "Employee-102", branch_id: "Branch-1", name: { first_name: "Sara", middle_name: "Tesfaye", last_name: "Alemu" }, email: "sara@yisakal.com", phone_number: "0922222222", role: "Officer", hire_date: new Date("2020-03-15"), status: "Active" },
  { _id: "Employee-103", branch_id: "Branch-2", name: { first_name: "Dawit", middle_name: "Haile", last_name: "Girma" }, email: "dawit@yisakal.com", phone_number: "0933333333", role: "Teller", hire_date: new Date("2021-01-10"), status: "Active" },
  { _id: "Employee-104", branch_id: "Branch-2", name: { first_name: "Meron", middle_name: "Alemu", last_name: "Bekele" }, email: "meron@yisakal.com", phone_number: "0944444444", role: "Manager", hire_date: new Date("2020-06-05"), status: "Active" },
  { _id: "Employee-105", branch_id: "Branch-3", name: { first_name: "Yonas", middle_name: "Girma", last_name: "Tadesse" }, email: "yonas@yisakal.com", phone_number: "0955555555", role: "Officer", hire_date: new Date("2021-04-01"), status: "Active" },
]);

// Link managers to branches
db.Branch.updateOne({ _id: "Branch-1" }, { $set: { manager_id: "Employee-101" } });
db.Branch.updateOne({ _id: "Branch-2" }, { $set: { manager_id: "Employee-104" } });
db.Branch.updateOne({ _id: "Branch-3" }, { $set: { manager_id: "Employee-105" } });

// Members
db.Member.insertMany([
  { _id: "Member-201", name: { first_name: "Tigist", middle_name: "Bekele", last_name: "Ahmed" }, branch_id: "Branch-1", gender: "Female", date_of_birth: new Date("1990-05-12"), identity: { national_id_number: "ETH-NID-1001", kebele_id_number: "KEB-1001" }, contact: { email: "tigist@gmail.com", phone_number: "0966666666" }, address: { region: "Addis Ababa", city: "Addis Ababa", subcity: "Addis Ketema", kebele: "05", street: "Merkato Ave", house_number: "12A" }, occupation: "Trader", credit_score: 720, membership_date: new Date("2021-01-10"), status: "Active" },
  { _id: "Member-202", name: { first_name: "Kebede", middle_name: "Desta", last_name: "Haile" }, branch_id: "Branch-1", gender: "Male", date_of_birth: new Date("1985-11-03"), identity: { national_id_number: "ETH-NID-1002", kebele_id_number: "KEB-1002" }, contact: { email: "kebede@gmail.com", phone_number: "0977777777" }, address: { region: "Addis Ababa", city: "Addis Ababa", subcity: "Arada", kebele: "02", street: "Piassa Rd", house_number: "5" }, occupation: "Teacher", credit_score: 680, membership_date: new Date("2021-02-20"), status: "Active" },
  { _id: "Member-203", name: { first_name: "Helen", middle_name: "Tadesse", last_name: "Solomon" }, branch_id: "Branch-2", gender: "Female", date_of_birth: new Date("1992-08-25"), identity: { national_id_number: "ETH-NID-1003", kebele_id_number: "KEB-1003" }, contact: { email: "helen@gmail.com", phone_number: "0988888888" }, address: { region: "Addis Ababa", city: "Addis Ababa", subcity: "Bole", kebele: "07", street: "Cameroon St", house_number: "33" }, occupation: "Nurse", credit_score: 750, membership_date: new Date("2021-06-15"), status: "Active" },
  { _id: "Member-204", name: { first_name: "Solomon", middle_name: "Gebre", last_name: "Helen" }, branch_id: "Branch-2", gender: "Male", date_of_birth: new Date("1988-02-14"), identity: { national_id_number: "ETH-NID-1004", kebele_id_number: "KEB-1004" }, contact: { email: "solomon@gmail.com", phone_number: "0912345678" }, address: { region: "Addis Ababa", city: "Addis Ababa", subcity: "Yeka", kebele: "10", street: "Megenagna Rd", house_number: "8B" }, occupation: "Engineer", credit_score: 790, membership_date: new Date("2022-01-05"), status: "Active" },
  { _id: "Member-205", name: { first_name: "Fatuma", middle_name: "Ahmed", last_name: "Tigist" }, branch_id: "Branch-3", gender: "Female", date_of_birth: new Date("1995-12-30"), identity: { national_id_number: "ETH-NID-1005", kebele_id_number: "KEB-1005" }, contact: { email: "fatuma@gmail.com", phone_number: "0923456789" }, address: { region: "Amhara", city: "Bahir Dar", subcity: "Fasilo", kebele: "01", street: "University Ave", house_number: "15" }, occupation: "Accountant", credit_score: 710, membership_date: new Date("2022-03-20"), status: "Active" },
]);


// SavingAccountProduct

db.SavingAccountProduct.insertMany([
  { _id: "SavingAccountProduct-301", name: "Regular Savings", description: "Standard savings account", min_balance: 100, interest_rate: 7.0, posting_frequency: "Yearly", status: "Active" },
  { _id: "SavingAccountProduct-302", name: "Youth Savings", description: "Savings for members under 30", min_balance: 50, interest_rate: 8.5, posting_frequency: "Monthly", status: "Active" },
  { _id: "SavingAccountProduct-303", name: "Fixed Deposit", description: "12-month fixed deposit", min_balance: 5000, interest_rate: 10.0, posting_frequency: "Yearly", status: "Active" },
]);


// LoanProduct
db.LoanProduct.insertMany([
  { _id: "LoanProduct-401", name: "Personal Loan", description: "General purpose personal loan", amount: { min: 5000, max: 100000 }, tenure: { min_months: 6, max_months: 36 }, base_interest_rate: 15.0, interest_type: "Reducing", requires_guarantor: true, requires_collateral: false, status: "Active" },
  { _id: "LoanProduct-402", name: "Business Loan", description: "Small business expansion loan", amount: { min: 50000, max: 500000 }, tenure: { min_months: 12, max_months: 60 }, base_interest_rate: 12.5, interest_type: "Flat", requires_guarantor: true, requires_collateral: true, status: "Active" },
  { _id: "LoanProduct-403", name: "Emergency Loan", description: "Short-term emergency loan", amount: { min: 1000, max: 20000 }, tenure: { min_months: 1, max_months: 6 }, base_interest_rate: 18.0, interest_type: "Flat", requires_guarantor: false, requires_collateral: false, status: "Active" },
]);


// SavingAccount
db.SavingAccount.insertMany([
  { _id: "SavingAccount-501", member_id: "Member-201", account_number: "SAV-2021-0001", branch_id: "Branch-1", product_id: "SavingAccountProduct-301", current_balance: 25000, open_date: new Date("2021-01-10"), status: "Active" },
  { _id: "SavingAccount-502", member_id: "Member-202", account_number: "SAV-2021-0002", branch_id: "Branch-1", product_id: "SavingAccountProduct-301", current_balance: 12500, open_date: new Date("2021-02-20"), status: "Active" },
  { _id: "SavingAccount-503", member_id: "Member-203", account_number: "SAV-2021-0003", branch_id: "Branch-2", product_id: "SavingAccountProduct-302", current_balance: 8000, open_date: new Date("2021-06-15"), status: "Active" },
  { _id: "SavingAccount-504", member_id: "Member-204", account_number: "SAV-2022-0004", branch_id: "Branch-2", product_id: "SavingAccountProduct-303", current_balance: 50000, open_date: new Date("2022-01-05"), status: "Active" },
  { _id: "SavingAccount-505", member_id: "Member-205", account_number: "SAV-2022-0005", branch_id: "Branch-3", product_id: "SavingAccountProduct-301", current_balance: 15000, open_date: new Date("2022-03-20"), status: "Active" },
]);


// Loan
db.Loan.insertMany([
  { _id: "Loan-601", member_id: "Member-201", product_id: "LoanProduct-401", loan_officer_id: "Employee-102", principal_amount: 50000, interest_rate: 15.0, term_months: 24, disbursement_date: new Date("2023-01-15"), maturity_date: new Date("2025-01-15"), outstanding: { principal: 30000, interest: 4500, fees: 0 }, status: "Active" },
  { _id: "Loan-602", member_id: "Member-203", product_id: "LoanProduct-403", loan_officer_id: "Employee-103", principal_amount: 10000, interest_rate: 18.0, term_months: 3, disbursement_date: new Date("2024-06-01"), maturity_date: new Date("2024-09-01"), outstanding: { principal: 0, interest: 0, fees: 0 }, status: "Closed" },
  { _id: "Loan-603", member_id: "Member-204", product_id: "LoanProduct-402", loan_officer_id: "Employee-104", principal_amount: 200000, interest_rate: 12.5, term_months: 36, disbursement_date: new Date("2024-03-10"), maturity_date: new Date("2027-03-10"), outstanding: { principal: 170000, interest: 21250, fees: 500 }, status: "Active" },
  { _id: "Loan-604", member_id: "Member-205", product_id: "LoanProduct-401", loan_officer_id: "Employee-105", principal_amount: 30000, interest_rate: 15.0, term_months: 12, disbursement_date: null, maturity_date: null, outstanding: { principal: 30000, interest: 0, fees: 0 }, status: "Approved" },
]);


// LoanSchedule
db.LoanSchedule.insertMany([
  { _id: "LoanSchedule-701", loan_id: "Loan-601", installment_number: 1, due_date: new Date("2023-02-15"), due: { principal: 2083.33, interest: 625, fees: 0 }, paid: { principal: 2083.33, interest: 625, fees: 0 }, status: "Paid" },
  { _id: "LoanSchedule-702", loan_id: "Loan-601", installment_number: 2, due_date: new Date("2023-03-15"), due: { principal: 2083.33, interest: 598.96, fees: 0 }, paid: { principal: 2083.33, interest: 598.96, fees: 0 }, status: "Paid" },
  { _id: "LoanSchedule-703", loan_id: "Loan-601", installment_number: 3, due_date: new Date("2023-04-15"), due: { principal: 2083.33, interest: 572.92, fees: 0 }, paid: { principal: 0, interest: 0, fees: 0 }, status: "Overdue" },
  { _id: "LoanSchedule-704", loan_id: "Loan-603", installment_number: 1, due_date: new Date("2024-04-10"), due: { principal: 5555.56, interest: 2083.33, fees: 0 }, paid: { principal: 5555.56, interest: 2083.33, fees: 0 }, status: "Paid" },
  { _id: "LoanSchedule-705", loan_id: "Loan-603", installment_number: 2, due_date: new Date("2024-05-10"), due: { principal: 5555.56, interest: 2083.33, fees: 0 }, paid: { principal: 5555.56, interest: 2083.33, fees: 0 }, status: "Paid" },
]);


// SavingsTransaction
db.SavingsTransaction.insertMany([
  { _id: "SavingsTransaction-801", account_id: "SavingAccount-501", transaction_type: "Deposit", amount: 10000, balance_after_transaction: 10000, transaction_date: new Date("2021-01-10"), reference_number: "STX-0001", employee_id: "Employee-103" },
  { _id: "SavingsTransaction-802", account_id: "SavingAccount-501", transaction_type: "Deposit", amount: 15000, balance_after_transaction: 25000, transaction_date: new Date("2021-06-15"), reference_number: "STX-0002", employee_id: "Employee-103" },
  { _id: "SavingsTransaction-803", account_id: "SavingAccount-502", transaction_type: "Deposit", amount: 20000, balance_after_transaction: 20000, transaction_date: new Date("2021-02-20"), reference_number: "STX-0003", employee_id: "Employee-103" },
  { _id: "SavingsTransaction-804", account_id: "SavingAccount-502", transaction_type: "Withdrawal", amount: 7500, balance_after_transaction: 12500, transaction_date: new Date("2022-08-10"), reference_number: "STX-0004", employee_id: "Employee-103" },
  { _id: "SavingsTransaction-805", account_id: "SavingAccount-503", transaction_type: "Deposit", amount: 8000, balance_after_transaction: 8000, transaction_date: new Date("2021-06-15"), reference_number: "STX-0005", employee_id: "Employee-103" },
  { _id: "SavingsTransaction-806", account_id: "SavingAccount-504", transaction_type: "Deposit", amount: 50000, balance_after_transaction: 50000, transaction_date: new Date("2022-01-05"), reference_number: "STX-0006", employee_id: "Employee-103" },
]);


// LoanTransaction
db.LoanTransaction.insertMany([
  { _id: "LoanTransaction-901", loan_id: "Loan-601", loan_schedule_id: null, transaction_type: "Disbursement", amount: 50000, transaction_date: new Date("2023-01-15"), payment_method: "Transfer", reference_number: "LTX-0001", employee_id: "Employee-102", reversal_status: "None" },
  { _id: "LoanTransaction-902", loan_id: "Loan-601", loan_schedule_id: "LoanSchedule-701", transaction_type: "Repayment", amount: 2708.33, transaction_date: new Date("2023-02-15"), payment_method: "Cash", reference_number: "LTX-0002", employee_id: "Employee-103", reversal_status: "None" },
  { _id: "LoanTransaction-903", loan_id: "Loan-601", loan_schedule_id: "LoanSchedule-702", transaction_type: "Repayment", amount: 2682.29, transaction_date: new Date("2023-03-15"), payment_method: "Cash", reference_number: "LTX-0003", employee_id: "Employee-103", reversal_status: "None" },
  { _id: "LoanTransaction-904", loan_id: "Loan-603", loan_schedule_id: null, transaction_type: "Disbursement", amount: 200000, transaction_date: new Date("2024-03-10"), payment_method: "Transfer", reference_number: "LTX-0004", employee_id: "Employee-104", reversal_status: "None" },
  { _id: "LoanTransaction-905", loan_id: "Loan-603", loan_schedule_id: "LoanSchedule-704", transaction_type: "Repayment", amount: 7638.89, transaction_date: new Date("2024-04-10"), payment_method: "Transfer", reference_number: "LTX-0005", employee_id: "Employee-103", reversal_status: "None" },
]);


// Guaranty
db.Guaranty.insertMany([
  { _id: "Guaranty-1001", loan_id: "Loan-601", member_id: "Member-202", guarantee_amount: 25000, status: "Active" },
  { _id: "Guaranty-1002", loan_id: "Loan-603", member_id: "Member-203", guarantee_amount: 100000, status: "Active" },
  { _id: "Guaranty-1003", loan_id: "Loan-604", member_id: "Member-201", guarantee_amount: 15000, status: "Active" },
]);


// Collateral
db.Collateral.insertMany([
  { _id: "Collateral-1101", loan_id: "Loan-603", collateral_type: "Vehicle", description: "2018 Toyota Vitz, white", estimated_value: 350000, ownership_document_ref: "DOC-VEH-2024-001", status: "Pledged" },
  { _id: "Collateral-1102", loan_id: "Loan-603", collateral_type: "Property Title", description: "Land deed in Bole subcity, 200sqm", estimated_value: 500000, ownership_document_ref: "DOC-PROP-2024-002", status: "Pledged" },
]);


// Audit
db.Audit.insertMany([
  { _id: "Audit-1201", entity_name: "Loan", entity_id: "Loan-601", action_type: "Create", employee_id: "Employee-102", created_at: new Date("2023-01-15"), ip_address: "192.168.1.10", changes: { old_values: null, new_values: { principal_amount: 50000, status: "Applied" } } },
  { _id: "Audit-1202", entity_name: "Loan", entity_id: "Loan-601", action_type: "Update", employee_id: "Employee-101", created_at: new Date("2023-01-15"), ip_address: "192.168.1.11", changes: { old_values: { status: "Applied" }, new_values: { status: "Disbursed" } } },
  { _id: "Audit-1203", entity_name: "Member", entity_id: "Member-201", action_type: "Create", employee_id: "Employee-102", created_at: new Date("2021-01-10"), ip_address: "192.168.1.10", changes: { old_values: null, new_values: { name: { first_name: "Tigist", middle_name: "Bekele", last_name: "Ahmed" } } } },
]);


// FeeType
db.FeeType.insertMany([
  { _id: "FeeType-1301", name: "Loan Processing Fee", description: "One-time fee on loan approval", calculation_method: "Percentage", amount_or_rate: 2.0, is_active: true },
  { _id: "FeeType-1302", name: "Late Payment Penalty", description: "Charged on overdue installments", calculation_method: "Percentage", amount_or_rate: 5.0, is_active: true },
  { _id: "FeeType-1303", name: "Account Maintenance Fee", description: "Monthly account maintenance", calculation_method: "Flat", amount_or_rate: 25, is_active: true },
]);


// FeeEvent
db.FeeEvent.insertMany([
  { _id: "FeeEvent-1401", fee_type_id: "FeeType-1301", loan_id: "Loan-601", saving_transaction_id: null, paid: true },
  { _id: "FeeEvent-1402", fee_type_id: "FeeType-1302", loan_id: "Loan-601", saving_transaction_id: null, paid: false },
  { _id: "FeeEvent-1403", fee_type_id: "FeeType-1301", loan_id: "Loan-603", saving_transaction_id: null, paid: true },
]);


// FeeTransaction
db.FeeTransaction.insertMany([
  { _id: "FeeTransaction-1501", fee_event_id: "FeeEvent-1401", amount: 1000, reference: "FTX-0001", transaction_date: new Date("2023-01-15") },
  { _id: "FeeTransaction-1502", fee_event_id: "FeeEvent-1403", amount: 4000, reference: "FTX-0002", transaction_date: new Date("2024-03-10") },
]);


print("   Seed data inserted successfully.");
print(`   Branches: ${db.Branch.countDocuments()}`);
print(`   Employees: ${db.Employee.countDocuments()}`);
print(`   Members: ${db.Member.countDocuments()}`);
print(`   SavingAccountProducts: ${db.SavingAccountProduct.countDocuments()}`);
print(`   LoanProducts: ${db.LoanProduct.countDocuments()}`);
print(`   SavingAccounts: ${db.SavingAccount.countDocuments()}`);
print(`   Loans: ${db.Loan.countDocuments()}`);
print(`   LoanSchedules: ${db.LoanSchedule.countDocuments()}`);
print(`   SavingsTransactions: ${db.SavingsTransaction.countDocuments()}`);
print(`   LoanTransactions: ${db.LoanTransaction.countDocuments()}`);
print(`   Guarantees: ${db.Guaranty.countDocuments()}`);
print(`   Collaterals: ${db.Collateral.countDocuments()}`);
print(`   Audits: ${db.Audit.countDocuments()}`);
print(`   FeeTypes: ${db.FeeType.countDocuments()}`);
print(`   FeeEvents: ${db.FeeEvent.countDocuments()}`);
print(`   FeeTransactions: ${db.FeeTransaction.countDocuments()}`);

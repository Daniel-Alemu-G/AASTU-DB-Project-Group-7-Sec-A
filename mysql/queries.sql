-- REPORT QUERIES FOR SACCO CORE BANKING SYSTEM

-- 1. Member Loan Statement
-- Shows all loans for a specific member with current balance
SELECT 
    l.loan_id,
    lp.product_name,
    l.principal_amount,
    l.disbursement_date,
    COALESCE(SUM(CASE WHEN t.txn_type = 'Repayment' THEN t.amount ELSE 0 END), 0) AS total_paid,
    l.principal_amount - COALESCE(SUM(CASE WHEN t.txn_type = 'Repayment' THEN t.amount ELSE 0 END), 0) AS balance,
    l.status
FROM LOAN l
JOIN LOAN_PRODUCT lp ON l.product_id = lp.product_id
LEFT JOIN LOAN_TRANSACTION t ON l.loan_id = t.reference_no
WHERE l.member_id = 10045   -- Replace with actual member_id
GROUP BY l.loan_id, lp.product_name, l.principal_amount, l.disbursement_date, l.status
ORDER BY l.disbursement_date DESC;



-- 2. Overdue Loans Report
-- Lists all loans with missed repayment installments
SELECT 
    l.loan_id,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    rs.due_date,
    rs.installment_no,
    rs.total_due AS amount_due,
    DATEDIFF(CURDATE(), rs.due_date) AS days_overdue
FROM LOAN_REPAYMENT_SCHEDULE rs
JOIN LOAN l ON rs.loan_id = l.loan_id
JOIN MEMBER m ON l.member_id = m.member_id
WHERE rs.due_date < CURDATE() 
  AND rs.status != 'Paid'
ORDER BY days_overdue DESC;



-- 3. Branch Performance Summary
-- Total loans disbursed and repayments collected per branch
SELECT 
    b.branch_name,
    COUNT(DISTINCT l.loan_id) AS total_loans,
    COALESCE(SUM(CASE WHEN t.txn_type = 'Disbursement' THEN t.amount ELSE 0 END), 0) AS total_disbursed,
    COALESCE(SUM(CASE WHEN t.txn_type = 'Repayment' THEN t.amount ELSE 0 END), 0) AS total_repaid,
    COALESCE(SUM(CASE WHEN t.txn_type = 'Disbursement' THEN t.amount ELSE 0 END), 0) -
    COALESCE(SUM(CASE WHEN t.txn_type = 'Repayment' THEN t.amount ELSE 0 END), 0) AS net_outstanding
FROM BRANCH b
LEFT JOIN LOAN l ON b.branch_id = l.branch_id
LEFT JOIN LOAN_TRANSACTION t ON l.loan_id = t.reference_no
GROUP BY b.branch_id, b.branch_name
ORDER BY total_disbursed DESC;



-- 4. Guarantor Summary
-- Shows all members who are guarantors and total amounts
SELECT 
    CONCAT(m.first_name, ' ', m.last_name) AS guarantor_name,
    m.member_id,
    COUNT(DISTINCT lg.loan_id) AS loans_guaranteed,
    SUM(lg.guarantee_amount) AS total_guarantee_amount
FROM LOAN_GUARANTOR lg
JOIN MEMBER m ON lg.guarantor_member_id = m.member_id
GROUP BY m.member_id, m.first_name, m.last_name
ORDER BY total_guarantee_amount DESC;



-- 5. Repayment Schedule for a Specific Loan
-- Detailed monthly schedule (uses declining balance calculation preview)
SELECT 
    installment_no,
    due_date,
    principal_due,
    interest_due,
    total_due,
    status
FROM LOAN_REPAYMENT_SCHEDULE
WHERE loan_id = 101   -- Replace with actual loan_id
ORDER BY installment_no;



-- 6. Member Active Loans Summary (Additional useful report)
-- Counts active loans per member with total outstanding
SELECT 
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    COUNT(l.loan_id) AS active_loans,
    SUM(l.principal_amount - COALESCE(
        (SELECT SUM(amount) FROM LOAN_TRANSACTION 
         WHERE reference_no = l.loan_id AND txn_type = 'Repayment'), 0)) AS total_outstanding
FROM MEMBER m
JOIN LOAN l ON m.member_id = l.member_id
WHERE l.status = 'Active'
GROUP BY m.member_id, m.first_name, m.last_name
HAVING total_outstanding > 0
ORDER BY total_outstanding DESC;



-- 7. Loan Product Popularity Report
-- Shows which products are most applied for
SELECT 
    lp.product_name,
    COUNT(l.loan_id) AS total_applications,
    AVG(l.principal_amount) AS avg_loan_amount,
    SUM(l.principal_amount) AS total_disbursed
FROM LOAN_PRODUCT lp
LEFT JOIN LOAN l ON lp.product_id = l.product_id
GROUP BY lp.product_id, lp.product_name
ORDER BY total_applications DESC;
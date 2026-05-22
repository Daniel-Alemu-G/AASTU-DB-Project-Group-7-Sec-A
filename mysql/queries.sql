USE Yisakal_SACCO;


-- MEMBER QUERIES
-- ============================================================

-- Full member profile with branch and account summary
SELECT
    m.member_id,
    CONCAT(m.first_name, ' ', m.middle_name, ' ', m.last_name) AS full_name,
    m.gender,
    m.phone_number,
    m.email,
    m.occupation,
    m.credit_score,
    m.status,
    m.membership_date,
    b.name AS branch_name,
    COUNT(DISTINCT sa.account_id) AS savings_accounts,
    COUNT(DISTINCT l.loan_id) AS total_loans,
    COALESCE(SUM(sa.current_balance), 0) AS total_savings_balance
FROM Member m
LEFT JOIN Branch b ON m.branch_id = b.branch_id
LEFT JOIN SavingAccount sa ON m.member_id = sa.member_id AND sa.status = 'Active'
LEFT JOIN Loan l ON m.member_id = l.member_id
WHERE m.status = 'Active'
GROUP BY m.member_id, b.name;

-- Members with active loans and their outstanding totals
SELECT
    m.member_id,
    CONCAT(m.first_name, ' ', m.last_name) AS full_name,
    m.phone_number,
    m.credit_score,
    l.loan_id,
    lp.name AS loan_product,
    l.principal_amount,
    l.outstanding_principal,
    l.outstanding_interest,
    l.outstanding_fees,
    (l.outstanding_principal + l.outstanding_interest + l.outstanding_fees) AS total_outstanding,
    l.maturity_date,
    l.status AS loan_status
FROM Member m
JOIN Loan l ON m.member_id = l.member_id
JOIN LoanProduct lp ON l.product_id = lp.product_id
WHERE l.status IN ('Active', 'Disbursed')
ORDER BY total_outstanding DESC;

-- Members with no savings accounts (potential upsell)
SELECT
    m.member_id,
    CONCAT(m.first_name, ' ', m.last_name) AS full_name,
    m.phone_number,
    m.membership_date,
    b.name AS branch_name
FROM Member m
LEFT JOIN SavingAccount sa ON m.member_id = sa.member_id
LEFT JOIN Branch b ON m.branch_id = b.branch_id
WHERE sa.account_id IS NULL AND m.status = 'Active';

-- Members by age group
SELECT
    CASE
        WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) < 25 THEN 'Under 25'
        WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 25 AND 34 THEN '25-34'
        WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 35 AND 49 THEN '35-49'
        WHEN TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) BETWEEN 50 AND 64 THEN '50-64'
        ELSE '65+'
    END AS age_group,
    gender,
    COUNT(*) AS member_count
FROM Member
WHERE status = 'Active'
GROUP BY age_group, gender
ORDER BY age_group, gender;


-- SAVINGS QUERIES
-- ============================================================

-- Savings account balances with product and member info
SELECT
    sa.account_number,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    sap.name AS product_name,
    sap.interest_rate,
    sa.current_balance,
    sa.open_date,
    sa.status,
    b.name AS branch_name
FROM SavingAccount sa
JOIN Member m ON sa.member_id = m.member_id
JOIN SavingAccountProduct sap ON sa.product_id = sap.product_id
LEFT JOIN Branch b ON sa.branch_id = b.branch_id
ORDER BY sa.current_balance DESC;

-- Monthly savings deposit and withdrawal summary
SELECT
    DATE_FORMAT(transaction_date, '%Y-%m') AS month,
    transaction_type,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM SavingsTransaction
WHERE transaction_type IN ('Deposit', 'Withdrawal')
GROUP BY month, transaction_type
ORDER BY month DESC, transaction_type;

-- Top 10 savers by current balance
SELECT
    sa.account_number,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    sap.name AS product,
    sa.current_balance,
    b.name AS branch
FROM SavingAccount sa
JOIN Member m ON sa.member_id = m.member_id
JOIN SavingAccountProduct sap ON sa.product_id = sap.product_id
LEFT JOIN Branch b ON sa.branch_id = b.branch_id
WHERE sa.status = 'Active'
ORDER BY sa.current_balance DESC
LIMIT 10;

-- Accounts with no transactions in the last 90 days (dormant)
SELECT
    sa.account_number,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    m.phone_number,
    sa.current_balance,
    MAX(st.transaction_date) AS last_transaction_date,
    DATEDIFF(CURDATE(), MAX(st.transaction_date)) AS days_inactive
FROM SavingAccount sa
JOIN Member m ON sa.member_id = m.member_id
LEFT JOIN SavingsTransaction st ON sa.account_id = st.account_id
WHERE sa.status = 'Active'
GROUP BY sa.account_id, m.member_id
HAVING last_transaction_date IS NULL OR days_inactive > 90
ORDER BY days_inactive DESC;


-- LOAN QUERIES
-- ============================================================

-- Active loan portfolio overview
SELECT
    l.loan_id,
    CONCAT(m.first_name, ' ', m.last_name) AS borrower,
    m.credit_score,
    lp.name AS product,
    l.principal_amount,
    l.interest_rate,
    l.term_months,
    l.disbursement_date,
    l.maturity_date,
    l.outstanding_principal,
    l.outstanding_interest,
    l.outstanding_fees,
    (l.outstanding_principal + l.outstanding_interest + l.outstanding_fees) AS total_due,
    l.status,
    CONCAT(e.first_name, ' ', e.last_name) AS loan_officer
FROM Loan l
JOIN Member m ON l.member_id = m.member_id
JOIN LoanProduct lp ON l.product_id = lp.product_id
LEFT JOIN Employee e ON l.loan_officer_id = e.employee_id
WHERE l.status IN ('Active', 'Disbursed')
ORDER BY total_due DESC;

-- Overdue installments (loans at risk)
SELECT
    l.loan_id,
    CONCAT(m.first_name, ' ', m.last_name) AS borrower,
    m.phone_number,
    lp.name AS product,
    ls.installment_number,
    ls.due_date,
    DATEDIFF(CURDATE(), ls.due_date) AS days_overdue,
    (ls.principal_due - ls.principal_paid) AS principal_remaining,
    (ls.interest_due - ls.interest_paid) AS interest_remaining,
    ls.status
FROM LoanSchedule ls
JOIN Loan l ON ls.loan_id = l.loan_id
JOIN Member m ON l.member_id = m.member_id
JOIN LoanProduct lp ON l.product_id = lp.product_id
WHERE ls.status = 'Overdue'
ORDER BY days_overdue DESC;

-- Loan repayment performance per member
SELECT
    m.member_id,
    CONCAT(m.first_name, ' ', m.last_name) AS member_name,
    COUNT(ls.schedule_id) AS total_installments,
    SUM(CASE WHEN ls.status = 'Paid' THEN 1 ELSE 0 END) AS paid_on_time,
    SUM(CASE WHEN ls.status = 'Overdue' THEN 1 ELSE 0 END) AS overdue_count,
    SUM(CASE WHEN ls.status = 'Partial' THEN 1 ELSE 0 END) AS partial_count,
    ROUND(
        SUM(CASE WHEN ls.status = 'Paid' THEN 1 ELSE 0 END) * 100.0 / COUNT(ls.schedule_id), 2
    ) AS repayment_rate_pct,
    m.credit_score
FROM Member m
JOIN Loan l ON m.member_id = l.member_id
JOIN LoanSchedule ls ON l.loan_id = ls.loan_id
GROUP BY m.member_id
ORDER BY overdue_count DESC;

-- Defaulted loans with collateral and guarantor details
SELECT
    l.loan_id,
    CONCAT(m.first_name, ' ', m.last_name) AS borrower,
    m.phone_number,
    l.principal_amount,
    l.outstanding_principal,
    c.collateral_type,
    c.estimated_value,
    c.status AS collateral_status,
    CONCAT(gm.first_name, ' ', gm.last_name) AS guarantor_name,
    gm.phone_number AS guarantor_phone,
    g.guarantee_amount,
    g.status AS guarantor_status
FROM Loan l
JOIN Member m ON l.member_id = m.member_id
LEFT JOIN Collateral c ON l.loan_id = c.loan_id
LEFT JOIN Guaranty g ON l.loan_id = g.loan_id
LEFT JOIN Member gm ON g.member_id = gm.member_id
WHERE l.status = 'Defaulted';

-- Loan application pipeline (not yet disbursed)
SELECT
    l.loan_id,
    CONCAT(m.first_name, ' ', m.last_name) AS applicant,
    m.credit_score,
    lp.name AS product,
    l.principal_amount,
    l.term_months,
    l.status,
    CONCAT(e.first_name, ' ', e.last_name) AS assigned_officer
FROM Loan l
JOIN Member m ON l.member_id = m.member_id
JOIN LoanProduct lp ON l.product_id = lp.product_id
LEFT JOIN Employee e ON l.loan_officer_id = e.employee_id
WHERE l.status IN ('Applied', 'Approved')
ORDER BY l.loan_id;


-- BRANCH PERFORMANCE QUERIES
-- ============================================================

-- Branch-level portfolio summary
SELECT
    b.branch_id,
    b.name AS branch_name,
    b.region,
    b.city,
    CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager,
    COUNT(DISTINCT m.member_id) AS total_members,
    COUNT(DISTINCT sa.account_id) AS saving_accounts,
    COALESCE(SUM(sa.current_balance), 0) AS total_deposits,
    COUNT(DISTINCT l.loan_id) AS active_loans,
    COALESCE(SUM(l.outstanding_principal), 0) AS total_loan_outstanding
FROM Branch b
LEFT JOIN Employee mgr ON b.manager_id = mgr.employee_id
LEFT JOIN Member m ON b.branch_id = m.branch_id AND m.status = 'Active'
LEFT JOIN SavingAccount sa ON b.branch_id = sa.branch_id AND sa.status = 'Active'
LEFT JOIN Loan l ON m.member_id = l.member_id AND l.status IN ('Active', 'Disbursed')
WHERE b.status = 'Active'
GROUP BY b.branch_id, mgr.employee_id
ORDER BY total_deposits DESC;

-- Employee loan officer performance
SELECT
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS officer_name,
    e.role,
    b.name AS branch,
    COUNT(l.loan_id) AS loans_handled,
    SUM(l.principal_amount) AS total_disbursed,
    SUM(CASE WHEN l.status = 'Defaulted' THEN 1 ELSE 0 END) AS defaulted_loans,
    ROUND(
        SUM(CASE WHEN l.status = 'Defaulted' THEN 1 ELSE 0 END) * 100.0 / COUNT(l.loan_id), 2
    ) AS default_rate_pct
FROM Employee e
JOIN Branch b ON e.branch_id = b.branch_id
LEFT JOIN Loan l ON e.employee_id = l.loan_officer_id
WHERE e.role = 'Officer' AND e.status = 'Active'
GROUP BY e.employee_id, b.name
ORDER BY default_rate_pct ASC;


-- FEE QUERIES
-- ============================================================

-- Unpaid fees summary by type
SELECT
    ft.name AS fee_type,
    ft.calculation_method,
    ft.amount_or_rate,
    COUNT(fe.fee_event_id) AS unpaid_count,
    SUM(ft.amount_or_rate) AS estimated_total_unpaid
FROM FeeEvent fe
JOIN FeeType ft ON fe.fee_type_id = ft.fee_type_id
WHERE fe.paid = false
GROUP BY ft.fee_type_id
ORDER BY unpaid_count DESC;

-- Fee revenue collected per month
SELECT
    DATE_FORMAT(ft_txn.transaction_date, '%Y-%m') AS month,
    ftype.name AS fee_type,
    COUNT(*) AS transactions,
    SUM(ft_txn.amount) AS revenue_collected
FROM FeeTransaction ft_txn
JOIN FeeEvent fe ON ft_txn.fee_event_id = fe.fee_event_id
JOIN FeeType ftype ON fe.fee_type_id = ftype.fee_type_id
GROUP BY month, ftype.name
ORDER BY month DESC;

-- ============================================================
-- AUDIT / COMPLIANCE QUERIES
-- ============================================================

-- Recent audit trail for sensitive entities
SELECT
    a.audit_id,
    a.entity_name,
    a.entity_id,
    a.action_type,
    CONCAT(e.first_name, ' ', e.last_name) AS performed_by,
    e.role,
    a.ip_address,
    a.created_at
FROM Audit a
LEFT JOIN Employee e ON a.employee_id = e.employee_id
ORDER BY a.created_at DESC
LIMIT 100;

-- Employees with the most system actions (activity monitor)
SELECT
    CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
    e.role,
    b.name AS branch,
    COUNT(a.audit_id) AS total_actions,
    SUM(CASE WHEN a.action_type = 'Delete' THEN 1 ELSE 0 END) AS delete_actions,
    MAX(a.created_at) AS last_action_at
FROM Audit a
JOIN Employee e ON a.employee_id = e.employee_id
LEFT JOIN Branch b ON e.branch_id = b.branch_id
GROUP BY e.employee_id, b.name
ORDER BY total_actions DESC;


-- FINANCIAL SUMMARY / DASHBOARD QUERIES
-- ============================================================

-- Overall SACCO health snapshot
SELECT
    (SELECT COUNT(*) FROM Member WHERE status = 'Active')                           AS active_members,
    (SELECT COUNT(*) FROM SavingAccount WHERE status = 'Active')                    AS active_saving_accounts,
    (SELECT COALESCE(SUM(current_balance), 0) FROM SavingAccount WHERE status = 'Active') AS total_deposits,
    (SELECT COUNT(*) FROM Loan WHERE status IN ('Active', 'Disbursed'))             AS active_loans,
    (SELECT COALESCE(SUM(outstanding_principal), 0) FROM Loan WHERE status IN ('Active', 'Disbursed')) AS total_loan_book,
    (SELECT COUNT(*) FROM Loan WHERE status = 'Defaulted')                          AS defaulted_loans,
    (SELECT COUNT(*) FROM LoanSchedule WHERE status = 'Overdue')                    AS overdue_installments,
    (SELECT COUNT(*) FROM Member WHERE status = 'Active' AND DATEDIFF(CURDATE(), membership_date) <= 30) AS new_members_this_month;

-- Portfolio At Risk (PAR) — loans with any overdue installment
SELECT
    COUNT(DISTINCT l.loan_id) AS par_loan_count,
    SUM(l.outstanding_principal) AS par_outstanding_principal,
    ROUND(
        SUM(l.outstanding_principal) * 100.0 /
        (SELECT SUM(outstanding_principal) FROM Loan WHERE status IN ('Active', 'Disbursed')),
        2
    ) AS par_ratio_pct
FROM Loan l
WHERE l.loan_id IN (
    SELECT DISTINCT loan_id FROM LoanSchedule WHERE status = 'Overdue'
);

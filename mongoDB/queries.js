//  Yisakal_SACCO — Useful Queries
//  Run with: mongosh  queries.js after running both the schema and the seed


use("Yisakal_SACCO");


// 1. Members

print("\n========== [1] ALL ACTIVE MEMBERS ==========");

db.Member.find({ status: "Active" }, {
  _id: 1,
  "name.first_name": 1,
  "name.last_name": 1,
  branch_id: 1,
  occupation: 1,
  credit_score: 1,
  membership_date: 1
}).forEach(doc => printjson(doc));


print("\n========== [2] MEMBERS BY BRANCH ==========");
db.Member.aggregate([
  {
    $group: {
      _id: "$branch_id",
      total_members: { $sum: 1 },
      avg_credit_score: { $avg: "$credit_score" },
      genders: { $push: "$gender" }
    }
  },
  {
    $lookup: {
      from: "Branch",
      localField: "_id",
      foreignField: "_id",
      as: "branch"
    }
  },
  { $unwind: "$branch" },
  {
    $project: {
      branch_name: "$branch.name",
      total_members: 1,
      avg_credit_score: { $round: ["$avg_credit_score", 0] }
    }
  },
  { $sort: { total_members: -1 } }
]).forEach(doc => printjson(doc));


print("\n========== [3] MEMBER-201 FULL PROFILE (with savings & loans) ==========");

db.Member.aggregate([
  { $match: { _id: "Member-201" } },
  {
    $lookup: {
      from: "SavingAccount",
      localField: "_id",
      foreignField: "member_id",
      as: "saving_accounts"
    }
  },
  {
    $lookup: {
      from: "Loan",
      localField: "_id",
      foreignField: "member_id",
      as: "loans"
    }
  },
  {
    $project: {
      full_name: {
        $concat: ["$name.first_name", " ", "$name.middle_name", " ", "$name.last_name"]
      },
      contact: 1,
      address: 1,
      occupation: 1,
      credit_score: 1,
      status: 1,
      total_saving_accounts: { $size: "$saving_accounts" },
      total_savings_balance: { $sum: "$saving_accounts.current_balance" },
      total_loans: { $size: "$loans" },
      active_loans: {
        $size: {
          $filter: {
            input: "$loans",
            as: "l",
            cond: { $eq: ["$$l.status", "Active"] }
          }
        }
      }
    }
  }
]).forEach(doc => printjson(doc));



// 2. Savings

print("\n========== [4] TOTAL SAVINGS BALANCE PER BRANCH ==========");

db.SavingAccount.aggregate([
  { $match: { status: "Active" } },
  {
    $group: {
      _id: "$branch_id",
      total_balance: { $sum: "$current_balance" },
      account_count: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "Branch",
      localField: "_id",
      foreignField: "_id",
      as: "branch"
    }
  },
  { $unwind: "$branch" },
  {
    $project: {
      branch_name: "$branch.name",
      total_balance: 1,
      account_count: 1
    }
  },
  { $sort: { total_balance: -1 } }
]).forEach(doc => printjson(doc));


print("\n========== [5] SAVINGS ACCOUNT SUMMARY BY PRODUCT ==========");
db.SavingAccount.aggregate([
  {
    $group: {
      _id: "$product_id",
      num_accounts: { $sum: 1 },
      total_balance: { $sum: "$current_balance" },
      avg_balance: { $avg: "$current_balance" }
    }
  },
  {
    $lookup: {
      from: "SavingAccountProduct",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      product_name: "$product.name",
      interest_rate: "$product.interest_rate",
      num_accounts: 1,
      total_balance: 1,
      avg_balance: { $round: ["$avg_balance", 2] }
    }
  },
  { $sort: { total_balance: -1 } }
]).forEach(doc => printjson(doc));


print("\n========== [6] RECENT SAVINGS TRANSACTIONS (last 10) ==========");

db.SavingsTransaction.aggregate([
  { $sort: { transaction_date: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "SavingAccount",
      localField: "account_id",
      foreignField: "_id",
      as: "account"
    }
  },
  { $unwind: "$account" },
  {
    $lookup: {
      from: "Member",
      localField: "account.member_id",
      foreignField: "_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $project: {
      reference_number: 1,
      transaction_type: 1,
      amount: 1,
      balance_after_transaction: 1,
      transaction_date: 1,
      account_number: "$account.account_number",
      member_name: {
        $concat: ["$member.name.first_name", " ", "$member.name.last_name"]
      }
    }
  }
]).forEach(doc => printjson(doc));


print("\n========== [7] DEPOSITS VS WITHDRAWALS SUMMARY ==========");

db.SavingsTransaction.aggregate([
  {
    $group: {
      _id: "$transaction_type",
      count: { $sum: 1 },
      total_amount: { $sum: "$amount" }
    }
  },
  { $sort: { total_amount: -1 } }
]).forEach(doc => printjson(doc));



// 3. LOANS


print("\n========== [8] ALL ACTIVE LOANS WITH MEMBER & PRODUCT INFO ==========");

db.Loan.aggregate([
  { $match: { status: { $in: ["Active", "Disbursed"] } } },
  {
    $lookup: {
      from: "Member",
      localField: "member_id",
      foreignField: "_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $lookup: {
      from: "LoanProduct",
      localField: "product_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      borrower: {
        $concat: ["$member.name.first_name", " ", "$member.name.last_name"]
      },
      product_name: "$product.name",
      interest_type: "$product.interest_type",
      principal_amount: 1,
      interest_rate: 1,
      term_months: 1,
      disbursement_date: 1,
      maturity_date: 1,
      "outstanding.principal": 1,
      "outstanding.interest": 1,
      "outstanding.fees": 1,
      total_outstanding: {
        $add: ["$outstanding.principal", "$outstanding.interest", "$outstanding.fees"]
      },
      status: 1
    }
  },
  { $sort: { total_outstanding: -1 } }
]).forEach(doc => printjson(doc));


print("\n========== [9] LOAN PORTFOLIO SUMMARY BY STATUS ==========");
db.Loan.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      total_principal: { $sum: "$principal_amount" },
      total_outstanding_principal: { $sum: "$outstanding.principal" },
      total_outstanding_interest: { $sum: "$outstanding.interest" }
    }
  },
  { $sort: { total_principal: -1 } }
]).forEach(doc => printjson(doc));


print("\n========== [10] LOAN PORTFOLIO SUMMARY BY PRODUCT ==========");
db.Loan.aggregate([
  {
    $group: {
      _id: "$product_id",
      loan_count: { $sum: 1 },
      total_disbursed: { $sum: "$principal_amount" },
      total_outstanding: {
        $sum: { $add: ["$outstanding.principal", "$outstanding.interest", "$outstanding.fees"] }
      },
      avg_interest_rate: { $avg: "$interest_rate" }
    }
  },
  {
    $lookup: {
      from: "LoanProduct",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      product_name: "$product.name",
      loan_count: 1,
      total_disbursed: 1,
      total_outstanding: 1,
      avg_interest_rate: { $round: ["$avg_interest_rate", 2] }
    }
  },
  { $sort: { total_disbursed: -1 } }
]).forEach(doc => printjson(doc));



// 4. REPAYMENT & SCHEDULE

print("\n========== [11] OVERDUE INSTALLMENTS ==========");

db.LoanSchedule.aggregate([
  { $match: { status: "Overdue" } },
  {
    $lookup: {
      from: "Loan",
      localField: "loan_id",
      foreignField: "_id",
      as: "loan"
    }
  },
  { $unwind: "$loan" },
  {
    $lookup: {
      from: "Member",
      localField: "loan.member_id",
      foreignField: "_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $project: {
      loan_id: 1,
      installment_number: 1,
      due_date: 1,
      status: 1,
      amount_due: {
        $add: ["$due.principal", "$due.interest", "$due.fees"]
      },
      amount_paid: {
        $add: ["$paid.principal", "$paid.interest", "$paid.fees"]
      },
      borrower: {
        $concat: ["$member.name.first_name", " ", "$member.name.last_name"]
      },
      member_phone: "$member.contact.phone_number"
    }
  },
  { $sort: { due_date: 1 } }
]).forEach(doc => printjson(doc));


print("\n========== [12] REPAYMENT RATE BY LOAN ==========");
db.LoanSchedule.aggregate([
  {
    $group: {
      _id: "$loan_id",
      total_installments: { $sum: 1 },
      paid_installments: {
        $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] }
      },
      overdue_installments: {
        $sum: { $cond: [{ $eq: ["$status", "Overdue"] }, 1, 0] }
      },
      total_due: {
        $sum: { $add: ["$due.principal", "$due.interest", "$due.fees"] }
      },
      total_collected: {
        $sum: { $add: ["$paid.principal", "$paid.interest", "$paid.fees"] }
      }
    }
  },
  {
    $project: {
      total_installments: 1,
      paid_installments: 1,
      overdue_installments: 1,
      total_due: 1,
      total_collected: 1,
      repayment_rate_pct: {
        $round: [
          { $multiply: [{ $divide: ["$total_collected", "$total_due"] }, 100] },
          1
        ]
      }
    }
  },
  { $sort: { repayment_rate_pct: 1 } }
]).forEach(doc => printjson(doc));



// 5. GUARANTORS & COLLATERAL

print("\n========== [13] GUARANTORS WITH THEIR GUARANTEED LOANS ==========");

db.Guaranty.aggregate([
  { $match: { status: "Active" } },
  {
    $lookup: {
      from: "Member",
      localField: "member_id",
      foreignField: "_id",
      as: "guarantor"
    }
  },
  { $unwind: "$guarantor" },
  {
    $lookup: {
      from: "Loan",
      localField: "loan_id",
      foreignField: "_id",
      as: "loan"
    }
  },
  { $unwind: "$loan" },
  {
    $lookup: {
      from: "Member",
      localField: "loan.member_id",
      foreignField: "_id",
      as: "borrower"
    }
  },
  { $unwind: "$borrower" },
  {
    $project: {
      guarantor_name: {
        $concat: ["$guarantor.name.first_name", " ", "$guarantor.name.last_name"]
      },
      borrower_name: {
        $concat: ["$borrower.name.first_name", " ", "$borrower.name.last_name"]
      },
      loan_id: 1,
      loan_status: "$loan.status",
      principal_amount: "$loan.principal_amount",
      guarantee_amount: 1
    }
  }
]).forEach(doc => printjson(doc));


print("\n========== [14] MEMBERS WHO ARE BOTH BORROWER & GUARANTOR ==========");
db.Guaranty.aggregate([
  {
    $lookup: {
      from: "Loan",
      localField: "loan_id",
      foreignField: "_id",
      as: "guaranteed_loan"
    }
  },
  { $unwind: "$guaranteed_loan" },
  {
    $lookup: {
      from: "Loan",
      localField: "member_id",
      foreignField: "member_id",
      as: "own_loans"
    }
  },
  {
    $match: {
      $expr: { $gt: [{ $size: "$own_loans" }, 0] }
    }
  },
  {
    $lookup: {
      from: "Member",
      localField: "member_id",
      foreignField: "_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $project: {
      member_name: {
        $concat: ["$member.name.first_name", " ", "$member.name.last_name"]
      },
      guaranteeing_loan: "$loan_id",
      own_loan_count: { $size: "$own_loans" }
    }
  }
]).forEach(doc => printjson(doc));


print("\n========== [15] COLLATERAL BY LOAN ==========");
db.Collateral.aggregate([
  {
    $lookup: {
      from: "Loan",
      localField: "loan_id",
      foreignField: "_id",
      as: "loan"
    }
  },
  { $unwind: "$loan" },
  {
    $lookup: {
      from: "Member",
      localField: "loan.member_id",
      foreignField: "_id",
      as: "member"
    }
  },
  { $unwind: "$member" },
  {
    $project: {
      loan_id: 1,
      borrower_name: {
        $concat: ["$member.name.first_name", " ", "$member.name.last_name"]
      },
      collateral_type: 1,
      description: 1,
      estimated_value: 1,
      status: 1,
      loan_outstanding: {
        $add: [
          "$loan.outstanding.principal",
          "$loan.outstanding.interest",
          "$loan.outstanding.fees"
        ]
      },
      coverage_ratio: {
        $round: [
          {
            $multiply: [
              {
                $divide: [
                  "$estimated_value",
                  {
                    $add: [
                      "$loan.outstanding.principal",
                      "$loan.outstanding.interest"
                    ]
                  }
                ]
              },
              100
            ]
          },
          1
        ]
      }
    }
  }
]).forEach(doc => printjson(doc));



// 6. EMPLOYEE PERFORMANCE

print("\n========== [16] LOANS MANAGED PER LOAN OFFICER ==========");
db.Loan.aggregate([
  {
    $group: {
      _id: "$loan_officer_id",
      total_loans: { $sum: 1 },
      total_portfolio: { $sum: "$principal_amount" },
      active_loans: {
        $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
      },
      defaulted_loans: {
        $sum: { $cond: [{ $eq: ["$status", "Defaulted"] }, 1, 0] }
      }
    }
  },
  {
    $lookup: {
      from: "Employee",
      localField: "_id",
      foreignField: "_id",
      as: "officer"
    }
  },
  { $unwind: "$officer" },
  {
    $project: {
      officer_name: {
        $concat: [
          "$officer.name.first_name", " ", "$officer.name.last_name"
        ]
      },
      role: "$officer.role",
      branch_id: "$officer.branch_id",
      total_loans: 1,
      total_portfolio: 1,
      active_loans: 1,
      defaulted_loans: 1
    }
  },
  { $sort: { total_portfolio: -1 } }
]).forEach(doc => printjson(doc));


print("\n========== [17] TRANSACTIONS PROCESSED PER EMPLOYEE ==========");
db.SavingsTransaction.aggregate([
  {
    $group: {
      _id: "$employee_id",
      transactions_processed: { $sum: 1 },
      total_volume: { $sum: "$amount" }
    }
  },
  {
    $lookup: {
      from: "Employee",
      localField: "_id",
      foreignField: "_id",
      as: "employee"
    }
  },
  { $unwind: "$employee" },
  {
    $project: {
      employee_name: {
        $concat: [
          "$employee.name.first_name", " ", "$employee.name.last_name"
        ]
      },
      role: "$employee.role",
      transactions_processed: 1,
      total_volume: 1
    }
  },
  { $sort: { total_volume: -1 } }
]).forEach(doc => printjson(doc));



// 7. FEES & CHARGES

print("\n========== [18] UNPAID FEE EVENTS WITH DETAILS ==========");

db.FeeEvent.aggregate([
  { $match: { paid: false } },
  {
    $lookup: {
      from: "FeeType",
      localField: "fee_type_id",
      foreignField: "_id",
      as: "fee_type"
    }
  },
  { $unwind: "$fee_type" },
  {
    $lookup: {
      from: "Loan",
      localField: "loan_id",
      foreignField: "_id",
      as: "loan"
    }
  },
  { $unwind: "$loan" },
  {
    $project: {
      fee_name: "$fee_type.name",
      calculation_method: "$fee_type.calculation_method",
      amount_or_rate: "$fee_type.amount_or_rate",
      loan_id: 1,
      loan_principal: "$loan.principal_amount",
      paid: 1
    }
  }
]).forEach(doc => printjson(doc));


print("\n========== [19] TOTAL FEES COLLECTED ==========");
db.FeeTransaction.aggregate([
  {
    $group: {
      _id: 1,
      total_fee_revenue: { $sum: "$amount" },
      num_transactions: { $sum: 1 }
    }
  }
]).forEach(doc => printjson(doc));



// 8. DASHBOARD KPIs

print("\n========== [20] OVERALL SACCO KPIs ==========");

const kpi = {
  total_members: db.Member.countDocuments({ status: "Active" }),
  total_branches: db.Branch.countDocuments({ status: "Active" }),
  total_employees: db.Employee.countDocuments({ status: "Active" }),
  total_saving_accounts: db.SavingAccount.countDocuments({ status: "Active" }),
  total_savings_balance: db.SavingAccount.aggregate([
    { $match: { status: "Active" } },
    { $group: { _id: null, total: { $sum: "$current_balance" } } }
  ]).toArray()[0]?.total ?? 0,
  total_active_loans: db.Loan.countDocuments({ status: "Active" }),
  total_loan_portfolio: db.Loan.aggregate([
    { $group: { _id: null, total: { $sum: "$principal_amount" } } }
  ]).toArray()[0]?.total ?? 0,
  total_outstanding: db.Loan.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: {
            $add: ["$outstanding.principal", "$outstanding.interest", "$outstanding.fees"]
          }
        }
      }
    }
  ]).toArray()[0]?.total ?? 0,
  overdue_installments: db.LoanSchedule.countDocuments({ status: "Overdue" }),
  unpaid_fees: db.FeeEvent.countDocuments({ paid: false })
};

printjson(kpi);

print("\n========== QUERIES COMPLETE ==========\n");

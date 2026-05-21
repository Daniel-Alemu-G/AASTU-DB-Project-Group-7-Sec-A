// MongoDB Schema Validation & Initialization for Yisakal_SACCO database
// run with mongosh < mongo_schema.js


use("Yisakal_SACCO");

// 1. Branch 
db.createCollection("Branch", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        _id: { bsonType: "string" },
        name: { bsonType: "string", maxLength: 100 },
        phone_number: { bsonType: "string", maxLength: 50 },
        manager_id: { bsonType: "string", description: "ref: Employee" },
        created_date: { bsonType: "date" },
        status: { bsonType: "string", enum: ["Active", "Inactive"] },
        address: {
          bsonType: "object",
          properties: {
            region: { bsonType: "string", maxLength: 100 },
            city: { bsonType: "string", maxLength: 100 },
            subcity: { bsonType: "string", maxLength: 100 },
            kebele: { bsonType: "string", maxLength: 100 },
            street: { bsonType: "string", maxLength: 150 }
          }
        }
      }
    }
  }
});



// 2. Employee
db.createCollection("Employee", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "role"],
      properties: {
        _id: { bsonType: "string" },
        branch_id: { bsonType: "string", description: "ref: Branch" },
        name: {
          bsonType: "object",
          required: ["first_name", "middle_name", "last_name"],
          properties: {
            first_name: { bsonType: "string", maxLength: 100 },
            middle_name: { bsonType: "string", maxLength: 100 },
            last_name: { bsonType: "string", maxLength: 100 }
          }
        },
        email: { bsonType: "string", maxLength: 150 },
        phone_number: { bsonType: "string", maxLength: 50 },
        role: { bsonType: "string", enum: ["Admin", "Manager", "Officer", "Teller"] },
        hire_date: { bsonType: "date" },
        status: { bsonType: "string", enum: ["Active", "Inactive", "Terminated"] }
      }
    }
  }
});

db.Employee.createIndex({ branch_id: 1 });



// 3. Member
db.createCollection("Member", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name"],
      properties: {
        _id: { bsonType: "string" },
        name: {
          bsonType: "object",
          required: ["first_name", "middle_name", "last_name"],
          properties: {
            first_name: { bsonType: "string", maxLength: 100 },
            middle_name: { bsonType: "string", maxLength: 100 },
            last_name: { bsonType: "string", maxLength: 100 }
          }
        },
        branch_id: { bsonType: "string", description: "ref: Branch" },
        gender: { bsonType: "string", enum: ["Male", "Female"] },
        date_of_birth: { bsonType: "date" },
        occupation: { bsonType: "string", maxLength: 100 },
        credit_score: { bsonType: "int" },
        membership_date: { bsonType: "date" },
        status: { bsonType: "string", enum: ["Active", "Inactive", "Suspended"] },
        identity: {
          bsonType: "object",
          description: "Government-issued identification documents",
          properties: {
            national_id_number: { bsonType: "string", maxLength: 50 },
            kebele_id_number: { bsonType: "string", maxLength: 50 }
          }
        },
        contact: {
          bsonType: "object",
          properties: {
            email: { bsonType: "string", maxLength: 150 },
            phone_number: { bsonType: "string", maxLength: 50 }
          }
        },
        address: {
          bsonType: "object",
          properties: {
            region: { bsonType: "string", maxLength: 100 },
            city: { bsonType: "string", maxLength: 100 },
            subcity: { bsonType: "string", maxLength: 100 },
            kebele: { bsonType: "string", maxLength: 100 },
            street: { bsonType: "string", maxLength: 150 },
            house_number: { bsonType: "string", maxLength: 50 }
          }
        }
      }
    }
  }
});

db.Member.createIndex({ branch_id: 1 });
db.Member.createIndex({ "identity.national_id_number": 1 }, { unique: true, sparse: true });
db.Member.createIndex({ "identity.kebele_id_number": 1 }, { unique: true, sparse: true });



// 4. SavingAccountProduct
db.createCollection("SavingAccountProduct", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "interest_rate", "posting_frequency"],
      properties: {
        _id: { bsonType: "string" },
        name: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string", maxLength: 255 },
        min_balance: { bsonType: ["double", "int"] },
        interest_rate: { bsonType: ["double", "int"] },
        posting_frequency: { bsonType: "string", enum: ["Daily", "Weekly", "Monthly", "Yearly"] },
        status: { bsonType: "string", enum: ["Active", "Inactive"] }
      }
    }
  }
});



// 5. LoanProduct
db.createCollection("LoanProduct", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "interest_type"],
      properties: {
        _id: { bsonType: "string" },
        name: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string", maxLength: 255 },
        base_interest_rate: { bsonType: ["double", "int"] },
        interest_type: { bsonType: "string", enum: ["Flat", "Reducing"] },
        requires_guarantor: { bsonType: "bool" },
        requires_collateral: { bsonType: "bool" },
        status: { bsonType: "string", enum: ["Active", "Inactive"] },
        amount: {
          bsonType: "object",
          description: "Eligible loan amount range",
          properties: {
            min: { bsonType: ["double", "int"] },
            max: { bsonType: ["double", "int"] }
          }
        },
        tenure: {
          bsonType: "object",
          description: "Loan tenure range in months",
          properties: {
            min_months: { bsonType: "int" },
            max_months: { bsonType: "int" }
          }
        }
      }
    }
  }
});



// 6. SavingAccount
db.createCollection("SavingAccount", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["member_id", "account_number", "product_id"],
      properties: {
        _id: { bsonType: "string" },
        member_id: { bsonType: "string", description: "ref: Member" },
        account_number: { bsonType: "string", maxLength: 50 },
        branch_id: { bsonType: "string", description: "ref: Branch" },
        product_id: { bsonType: "string", description: "ref: SavingAccountProduct" },
        current_balance: { bsonType: ["double", "int"] },
        open_date: { bsonType: "date" },
        status: { bsonType: "string", enum: ["Active", "Inactive", "Closed"] }
      }
    }
  }
});

db.SavingAccount.createIndex({ account_number: 1 }, { unique: true });
db.SavingAccount.createIndex({ member_id: 1 });
db.SavingAccount.createIndex({ product_id: 1 });
db.SavingAccount.createIndex({ branch_id: 1 });



// 7. Loan
db.createCollection("Loan", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["member_id", "product_id", "principal_amount", "interest_rate", "term_months"],
      properties: {
        _id: { bsonType: "string" },
        member_id: { bsonType: "string", description: "ref: Member" },
        product_id: { bsonType: "string", description: "ref: LoanProduct" },
        loan_officer_id: { bsonType: "string", description: "ref: Employee" },
        principal_amount: { bsonType: ["double", "int"] },
        interest_rate: { bsonType: ["double", "int"] },
        term_months: { bsonType: "int" },
        disbursement_date: { bsonType: ["date", "null"] },
        maturity_date: { bsonType: ["date", "null"] },
        status: { bsonType: "string", enum: ["Applied", "Approved", "Disbursed", "Active", "Closed", "Defaulted"] },
        outstanding: {
          bsonType: "object",
          description: "Running balances of amounts still owed",
          properties: {
            principal: { bsonType: ["double", "int"] },
            interest: { bsonType: ["double", "int"] },
            fees: { bsonType: ["double", "int"] }
          }
        }
      }
    }
  }
});

db.Loan.createIndex({ member_id: 1 });
db.Loan.createIndex({ product_id: 1 });
db.Loan.createIndex({ loan_officer_id: 1 });
db.Loan.createIndex({ status: 1 });



// 8. LoanSchedule
db.createCollection("LoanSchedule", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["loan_id", "installment_number", "due_date"],
      properties: {
        _id: { bsonType: "string" },
        loan_id: { bsonType: "string", description: "ref: Loan" },
        installment_number: { bsonType: "int" },
        due_date: { bsonType: "date" },
        status: { bsonType: "string", enum: ["Pending", "Paid", "Partial", "Overdue"] },
        due: {
          bsonType: "object",
          description: "Amounts due on this installment",
          properties: {
            principal: { bsonType: ["double", "int"] },
            interest: { bsonType: ["double", "int"] },
            fees: { bsonType: ["double", "int"] }
          }
        },
        paid: {
          bsonType: "object",
          description: "Amounts already paid on this installment",
          properties: {
            principal: { bsonType: ["double", "int"] },
            interest: { bsonType: ["double", "int"] },
            fees: { bsonType: ["double", "int"] }
          }
        }
      }
    }
  }
});

db.LoanSchedule.createIndex({ loan_id: 1 });
db.LoanSchedule.createIndex({ loan_id: 1, installment_number: 1 }, { unique: true });
db.LoanSchedule.createIndex({ due_date: 1, status: 1 });



// 9. SavingsTransaction
db.createCollection("SavingsTransaction", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["account_id", "transaction_type", "amount"],
      properties: {
        _id: { bsonType: "string" },
        account_id: { bsonType: "string", description: "ref: SavingAccount" },
        employee_id: { bsonType: "string", description: "ref: Employee" },
        transaction_type: { bsonType: "string", enum: ["Deposit", "Withdrawal", "Interest", "Fee"] },
        amount: { bsonType: ["double", "int"] },
        balance_after_transaction: { bsonType: ["double", "int"] },
        transaction_date: { bsonType: "date" },
        reference_number: { bsonType: "string", maxLength: 100 }
      }
    }
  }
});

db.SavingsTransaction.createIndex({ account_id: 1 });
db.SavingsTransaction.createIndex({ employee_id: 1 });
db.SavingsTransaction.createIndex({ transaction_date: -1 });



// 10. LoanTransaction
db.createCollection("LoanTransaction", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["loan_id", "transaction_type", "amount", "payment_method"],
      properties: {
        _id: { bsonType: "string" },
        loan_id: { bsonType: "string", description: "ref: Loan" },
        loan_schedule_id: { bsonType: ["string", "null"], description: "ref: LoanSchedule (nullable for disbursements)" },
        employee_id: { bsonType: "string", description: "ref: Employee" },
        transaction_type: { bsonType: "string", enum: ["Disbursement", "Repayment", "Interest", "Fee"] },
        amount: { bsonType: ["double", "int"] },
        transaction_date: { bsonType: "date" },
        payment_method: { bsonType: "string", enum: ["Cash", "Transfer", "Check"] },
        reference_number: { bsonType: "string", maxLength: 100 },
        reversal_status: { bsonType: "string", enum: ["None", "Reversed", "Correction"] }
      }
    }
  }
});

db.LoanTransaction.createIndex({ loan_id: 1 });
db.LoanTransaction.createIndex({ loan_schedule_id: 1 });
db.LoanTransaction.createIndex({ employee_id: 1 });
db.LoanTransaction.createIndex({ transaction_date: -1 });



// 11. Guaranty
db.createCollection("Guaranty", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["loan_id", "member_id", "guarantee_amount"],
      properties: {
        _id: { bsonType: "string" },
        loan_id: { bsonType: "string", description: "ref: Loan" },
        member_id: { bsonType: "string", description: "ref: Member (the guarantor)" },
        guarantee_amount: { bsonType: ["double", "int"] },
        status: { bsonType: "string", enum: ["Active", "Released", "Claimed"] }
      }
    }
  }
});

db.Guaranty.createIndex({ loan_id: 1, member_id: 1 }, { unique: true });
db.Guaranty.createIndex({ member_id: 1 });


// 12. Collateral
db.createCollection("Collateral", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["loan_id", "collateral_type"],
      properties: {
        _id: { bsonType: "string" },
        loan_id: { bsonType: "string", description: "ref: Loan" },
        collateral_type: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string", maxLength: 255 },
        estimated_value: { bsonType: ["double", "int"] },
        ownership_document_ref: { bsonType: "string", maxLength: 150 },
        status: { bsonType: "string", enum: ["Pledged", "Released", "Liquidated"] }
      }
    }
  }
});

db.Collateral.createIndex({ loan_id: 1 });



// 13. Audit
db.createCollection("Audit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["entity_name", "entity_id", "action_type"],
      properties: {
        _id: { bsonType: "string" },
        entity_name: { bsonType: "string", enum: ["Member", "Loan", "SavingAccount", "Employee", "Branch"] },
        entity_id: { bsonType: "string" },
        action_type: { bsonType: "string", enum: ["Create", "Update", "Delete", "Login"] },
        employee_id: { bsonType: "string", description: "ref: Employee" },
        created_at: { bsonType: "date" },
        ip_address: { bsonType: "string", maxLength: 45 },
        changes: {
          bsonType: "object",
          description: "Snapshot of what changed",
          properties: {
            old_values: { bsonType: ["object", "null"] },
            new_values: { bsonType: ["object", "null"] }
          }
        }
      }
    }
  }
});

db.Audit.createIndex({ entity_name: 1, entity_id: 1 });
db.Audit.createIndex({ employee_id: 1 });
db.Audit.createIndex({ created_at: -1 });



// 14. FeeType
db.createCollection("FeeType", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "calculation_method", "amount_or_rate"],
      properties: {
        _id: { bsonType: "string" },
        name: { bsonType: "string", maxLength: 100 },
        description: { bsonType: "string", maxLength: 255 },
        calculation_method: { bsonType: "string", enum: ["Flat", "Percentage"] },
        amount_or_rate: { bsonType: ["double", "int"] },
        is_active: { bsonType: "bool" }
      }
    }
  }
});


// 15. FeeEvent
db.createCollection("FeeEvent", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fee_type_id"],
      properties: {
        _id: { bsonType: "string" },
        fee_type_id: { bsonType: "string", description: "ref: FeeType" },
        loan_id: { bsonType: ["string", "null"], description: "ref: Loan (nullable)" },
        saving_transaction_id: { bsonType: ["string", "null"], description: "ref: SavingsTransaction (nullable)" },
        paid: { bsonType: "bool" }
      }
    }
  }
});

db.FeeEvent.createIndex({ fee_type_id: 1 });
db.FeeEvent.createIndex({ loan_id: 1 });
db.FeeEvent.createIndex({ saving_transaction_id: 1 });



// 16. FeeTransaction
db.createCollection("FeeTransaction", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["fee_event_id", "amount"],
      properties: {
        _id: { bsonType: "string" },
        fee_event_id: { bsonType: "string", description: "ref: FeeEvent" },
        amount: { bsonType: ["double", "int"] },
        reference: { bsonType: "string", maxLength: 100 },
        transaction_date: { bsonType: "date" }
      }
    }
  }
});

db.FeeTransaction.createIndex({ fee_event_id: 1 });
db.FeeTransaction.createIndex({ transaction_date: -1 });


print("   Yisakal_SACCO MongoDB schema initialized successfully.");
print(`   Collections created: ${db.getCollectionNames().length}`);

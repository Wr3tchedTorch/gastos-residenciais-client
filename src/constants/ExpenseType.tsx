const Expense = {
  Despesa: 1,
  Receita: 2,
  Ambas: 3
} as const;

export type ExpenseType = keyof typeof Expense;
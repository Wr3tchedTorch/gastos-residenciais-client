const UniqueExpense = {
  Despesa: 1,
  Receita: 2
} as const;

export type UniqueExpenseType = keyof typeof UniqueExpense;
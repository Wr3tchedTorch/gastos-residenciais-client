import type { ExpenseType } from "../constants/ExpenseType";
import type Transaction from "./Transaction";

export default class Category {
    id?: number;
    description: string;
    transactions?: Transaction[];
    expenseType: ExpenseType;

    constructor(description: string, expenseType: ExpenseType, id?: number, transactions?: Transaction[]) {
        this.description = description;
        this.expenseType = expenseType;
        this.id = id;
        this.transactions = transactions;
    }
}
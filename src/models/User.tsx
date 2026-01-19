import type Transaction from "./Transaction";

export default class User {
        id?: number;
        name: string;
        age: number;
        transactions?: Transaction[];
        totalExpenses: number = 0;
        totalIncome: number = 0;
        totalBalance: number = 0;

        constructor(name: string, age: number, id?: number, transactions?: Transaction[]) {
                this.id   = id;
                this.name = name;
                this.age  = age;
                this.transactions = transactions;
        }
}
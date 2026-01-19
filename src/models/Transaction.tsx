import type { UniqueExpenseType } from "../constants/UniqueExpenseType";
import type User from "./User";
import Category from './Category';

export default class Transaction {
    id?: number;
    description: string;
    value: number;
    expenseType: UniqueExpenseType;
    user: User;
    category: Category;

    constructor(
        description: string,
        value: number,
        uniqueExpenseType: UniqueExpenseType,
        user: User,
        category: Category,
        id?: number
    ) {
        this.description = description;
        this.value = value;
        this.expenseType = uniqueExpenseType;
        this.user = user;
        this.category = category;
        this.id = id;
    }
}
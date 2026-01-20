import { Typography, Paper, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/index.js";
import CustomTextField from './CustomTextField';
import useAxios from "../hooks/useAxios";
import type { AxiosResponse } from "axios";
import { useEffect } from "react";
import CustomDropDownField from "./CustomDropDown";
import type Category from "../models/Category";
import type { TransactionsResponse } from "../Pages/TransactionManagement";
import type Transaction from "../models/Transaction";
import type { UsersResponse } from "../Pages/UserManagement";
import GenericDynamicDropdown from "./GenericDynamicDropdown";
import type User from "../models/User";
import type { UniqueExpenseType } from "../constants/UniqueExpenseType";

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: "#ffffff",
    padding: 30,
    textAlign: "center",
    boxShadow: theme.shadows[3],
}));

const FormContainer = styled('form')({
    display: "flex",
    flexDirection: "column",
    gap: "10px",
});

const Title = styled(Typography)({
    marginBottom: "20px",
});

const SubmitButton = styled(Button)({
    marginTop: "20px",
});

interface TransactionFormProps {
    setTransactions: React.Dispatch<React.SetStateAction<TransactionsResponse[] | undefined>>;
}

const TransactionsForm = ({ setTransactions }: TransactionFormProps) => {
    const createTransactionFormSchema = z.object({
        description: z.string()
            .trim()
            .min(2, "A descrição é obrigatória e deve ter pelo menos 2 caracteres")
            .max(200, "A descrição deve ter no máximo 200 caracteres"),
        value: z.string()
            .refine((value) => parseInt(value, 10) > 0, {
                message: "O valor deve ser um número positivo",
            })
            .refine((value) => !Number.isNaN(parseInt(value, 10) || value != undefined), {
                message: "O valor deve ser um número válido",
            }),
        expenseType: z.string()
            .trim()
            .refine((val) => ["Despesa", "Receita"].includes(val), {
                message: "Tipo de despesa é obrigatório"
            }),
        category: z.string()
            .min(1, "A categoria é obrigatória")
            .refine((val) => !Number.isNaN(Number(val)), {
                message: "O ID da categoria deve ser um número válido"
            }),
        user: z.string()
            .min(1, "O usuário é obrigatório")
            .refine((val) => !Number.isNaN(Number(val)), {
                message: "O ID do usuário deve ser um número válido"
            }),
    })

    type createTransactionFormData = z.infer<typeof createTransactionFormSchema>

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitSuccessful },
        setError,
        clearErrors
    } = useForm<createTransactionFormData>({
        resolver: zodResolver
            (createTransactionFormSchema),
        defaultValues: {
            description: "",
            value: "",
            expenseType: "",
            category: "",
            user: ""
        }
    })

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const { fetchData } = useAxios<Transaction>({
        url: "transactions",
        method: "post",
        manual: true
    });

    const { response: categoriesResponse } = useAxios<Category[]>({
        url: "categories",
        method: "get",
        manual: false
    });

    const { response: usersResponse } = useAxios<UsersResponse>({
        url: "users",
        method: "get",
        manual: false
    });

    interface TransactionForCreation {
        Description: string;
        Value: number;
        ExpenseType: string;
        CategoryId: number;
        UserId: number;
    }

    const checkCategory = (categoryId: number, transactionExpenseType: UniqueExpenseType): boolean => {
        let category: Category | undefined = categoriesResponse?.find(x => x.id == categoryId);
        if (category == undefined) {
            console.error("Categoria não encontrada");
            return false;
        }

        if (category.expenseType != "Ambas" &&
            category.expenseType != transactionExpenseType) {
            setError("expenseType", { type: "custom", message: "A categoria selecionada não permite esse tipo de despesa." })
            return false;
        }

        clearErrors("expenseType");
        return true;
    }

    const checkUser = (userId: number, transactionExpenseType: UniqueExpenseType): boolean => {
        let user: User | undefined = usersResponse?.users?.find(x => x.id == userId);
        if (user == undefined) {
            console.error("Usuário não encontrado");
            return false;
        }

        if (user.age < 18 && transactionExpenseType == "Receita")
        {
            setError("user", { type: "custom", message: "Usuários menores de 18 anos só podem ter despesas." })
            return false;
        }

        clearErrors("user");
        return true;
    }

    const onSubmit = async (data: any) => {
        if (!checkCategory(data.category, data.expenseType)) {
            return;
        }

        if (!checkUser(data.user, data.expenseType)) {
            return;
        }

        console.log(data)

        const dataForCreation: TransactionForCreation = {
            Description: data.description,
            Value: parseFloat(data.value),
            ExpenseType: data.expenseType,
            CategoryId: data.category,
            UserId: data.user
        };

        let response: AxiosResponse = await fetchData(null, JSON.stringify(dataForCreation));

        let newTransaction: TransactionsResponse = response.data as TransactionsResponse;
        setTransactions(prev => [... (prev || []), newTransaction]);

        console.log(response);
    }

    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                marginBottom={5}
                marginTop={0}>
                <Grid size={6}>
                    <StyledPaper>
                        <Title>Criar nova transação</Title>
                        <FormContainer onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <CustomTextField
                                        {...field}
                                        label="Descrição"
                                        errorText={error?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="value"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <CustomTextField
                                        {...field}
                                        label="Valor (R$)"
                                        type="number"
                                        errorText={error?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="expenseType"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <CustomDropDownField
                                        {...field}
                                        label="Finalidade"
                                        errorText={error?.message}
                                        values={[
                                            { value: "Despesa", label: "Despesa" },
                                            { value: "Receita", label: "Receita" }
                                        ]
                                        }
                                    />
                                )}
                            />

                            <GenericDynamicDropdown<Category>
                                items={categoriesResponse ?? []}
                                getValue={(item) => {
                                    if (item.id == undefined) {
                                        return "ID inválido";
                                    }
                                    return item.id.toString();
                                }}
                                getLabel={(item) => `${item.description} (${item.expenseType})`}
                                control={control}
                                inputName="category"
                                inputLabel="Categoria"
                            />

                            <GenericDynamicDropdown<User>
                                items={usersResponse?.users ?? []}
                                getValue={(item) => {
                                    if (item.id == undefined) {
                                        return "ID inválido";
                                    }
                                    return item.id.toString();
                                }}
                                getLabel={(item) => `${item.name} (Idade: ${item.age})`}
                                control={control}
                                inputName="user"
                                inputLabel="Usuário"
                            />
                            <SubmitButton type="submit" variant="contained">Criar usuário</SubmitButton>
                        </FormContainer>
                    </StyledPaper>
                </Grid>
            </Grid>
        </>
    );
}

export default TransactionsForm
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

interface CategoriesFormProps {
  setCategories: React.Dispatch<React.SetStateAction<Category[] | undefined>>;
}

const CategoriesForm = ({setCategories}: CategoriesFormProps) => {  
  const createCategoriesFormSchema = z.object({
    description: z.string()
      .trim()
      .regex(/^[ \p{L}\s]+$/u, "Somente letras e espaços são permitidos na descrição")      
      .min(2, "A descrição é obrigatória e deve ter pelo menos 2 caracteres")
      .max(200, "A descrição deve ter no máximo 200 caracteres"),
    expenseType: z.string()
        .trim()
        .refine((val) => ["Despesa", "Receita", "Ambas"].includes(val), {
          message: "Tipo de despesa é obrigatório"
        })
  });

  type createCategoriesFormData = z.infer<typeof createCategoriesFormSchema>

  const { 
    handleSubmit,
    control,
    reset,    
    formState: { errors, isSubmitSuccessful }
  } = useForm<createCategoriesFormData>({
      resolver: zodResolver(createCategoriesFormSchema),
      defaultValues: {
        description: "",
        expenseType: ""
      }
  })

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);
  
  const {fetchData} = useAxios<Category>({
    url: "categories",
    method: "post",
    manual: true
  });

  interface CategoriesForCreation {
    Description: string;
    ExpenseType: string;
  }
  
  const onSubmit = async (data: any) => {
    console.log(data)

    const dataForCreation: CategoriesForCreation = {
      Description: data.description,
      ExpenseType: data.expenseType
    };

    let response: AxiosResponse = await fetchData(null, JSON.stringify(dataForCreation));

    let newCategory: Category = response.data as Category;
    setCategories(prev => [... (prev || []), newCategory]);

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
            <Title>Criar nova categoria</Title>
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
                name="expenseType"
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <CustomDropDownField
                      {...field}
                      label="Finalidade"
                      errorText={error?.message}
                      values={[
                        { value: "Ambas", label: "Ambas" },
                        { value: "Despesa", label: "Despesa" },
                        { value: "Receita", label: "Receita" }
                      ]                      
                    }
                    />
                )}
              />
              <SubmitButton type="submit" variant="contained">Criar categoria</SubmitButton>
            </FormContainer>
            </StyledPaper>
        </Grid>
      </Grid>
    </>
  );
}

export default CategoriesForm;
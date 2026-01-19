import { Typography, Paper, Button, Container, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";

import z from "zod";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/index.js";
import CustomTextField from './CustomTextField';
import useAxios from "../hooks/useAxios";
import type User from "../models/User";
import type { AxiosResponse } from "axios";

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

const Form = () => {  
  const createUserFormSchema = z.object({
    name: z.string()
      .trim()
      .regex(/^[A-Za-z\s]+$/i, "Somente letras e espaços são permitidos no nome")
      .min(2, "O nome é obrigatório e deve ter pelo menos 2 caracteres")
      .max(200, "O nome deve ter no máximo 200 caracteres"),
    age: z.string()
    .refine((age) => parseInt(age, 10) > 0, {
      message: "A idade deve ser um número positivo", 
    })
    .refine(( age ) => parseInt(age, 10) < 120, {
      message: "Puxa vida! Ninguém vive tanto assim",
    })
    .refine(( age ) => !Number.isNaN(parseInt(age, 10) || age != undefined), {
      message: "A idade deve ser um número válido",
    })
  })  

  type createUserFormData = z.infer<typeof createUserFormSchema>

  const { 
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors }
  } = useForm<createUserFormData>({
      resolver: zodResolver(createUserFormSchema),
      defaultValues: {
        name: "",
        age: ""
      }
  })
  
  const {fetchData} = useAxios<User>({
    url: "users",
    method: "post",
    manual: true
  });  

  interface UserForCreation {
    Name: string;
    Age:  number;
  }
  
  const onSubmit = async (data: any) => {
    console.log(data)

    const dataForCreation: UserForCreation = {
      Name: data.name,
      Age:  parseInt(data.age, 10)
    };

    let response: AxiosResponse = await fetchData(null, JSON.stringify(dataForCreation));

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
            <Title>Criar novo usuário</Title>
            <FormContainer onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="Nome"
                    errorText={error?.message}
                  />
                )}
              />

              <Controller
                name="age"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="Idade"
                    type="number"
                    errorText={error?.message}
                  />
                )}
              />
              <SubmitButton type="submit" variant="contained">Criar usuário</SubmitButton>
            </FormContainer>
            </StyledPaper>
        </Grid>
      </Grid>
    </>
  );
}

export default Form;
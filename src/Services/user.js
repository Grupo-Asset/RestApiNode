import { z } from 'zod';


const userSchema = z.object({
    nombre: z.string({
        invalid_type_error: 'El nombre debe ser texto',
        required_error: 'El nombre de usuario es requerido.'
    }),
    email: z.string().email(
        {
            message: "Direccion de email invalida" 
        }
    ),
    mobile: z.string(),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(20, "La contraseña no puede tener más de 20 caracteres").refine(
    (password) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/.test(password),
    { message: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula y  número." }
),
});

export function validateUser (userDTO){
    return userSchema.safeParse(userDTO)
}

export function validatePartialUser(userDTO){
    return userSchema.partial().safeParse(userDTO);
}

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FaUser } from "react-icons/fa"
import { loginApi } from "@/api/Auth/authApi"
import { Link, useNavigate, useLocation, type Location } from "react-router-dom"
import { useAuth } from "@/features/context/tokenContext"
import { motion } from "framer-motion"

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;


export function Login() {
    const { token, isAuthenticated, login } = useAuth();

console.log(token);
console.log(isAuthenticated);


 const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: "",
    password: "",
  },
});
const navigate = useNavigate();
const location = useLocation();
const onSubmit = async (values: LoginFormData) => {
 const response: any = await loginApi(values.email, values.password);
 // console.log(response);
 
 
 login(response.token);
 
 // Redirect to the page the user was trying to access, or home if none
 const from = (location.state as { from?: Location })?.from?.pathname || "/";
 navigate(from, { replace: true });
};

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="w-full max-w-md rounded-2xl border-0 shadow-xl">
                <CardHeader className="space-y-5 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg">
                        <FaUser className="text-3xl text-white" />
                    </div>

                    <div>
                        <CardTitle className="text-3xl font-bold">
                            Welcome Back
                        </CardTitle>

                        <CardDescription className="mt-2 text-base text-slate-500">
                            Sign in to continue to your account
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="space-y-5">
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-demo-title">
                                            Email
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your email"
                                            autoComplete="off"

                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex items-center justify-between">
                                            <FieldLabel>Password</FieldLabel>

                                            <button
                                                type="button"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Password"
                                            autoComplete="off"
                                            type="password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        <Button
                            type="submit"
                            form="form-rhf-demo"
                            className="w-full h-11"
                        >
                            Sign In
                        </Button>
                    </motion.div>

                    <p className="text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-blue-600 hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    )
}

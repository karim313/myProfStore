"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { FaUser, FaUserPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/features/context/tokenContext";

import { loginApi, registerApi } from "@/api/Auth/authApi";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

// Schemas
const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

const registerSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { userName: "", email: "", password: "" },
  });

  const onLoginSubmit = async (values: LoginFormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response: any = await loginApi(values.email, values.password);
      login(response.token);
      
      // Redirect to the page the user was trying to access, or home if none
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormData) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await registerApi(values);
      setSuccess("Account created successfully! Please log in.");
      // Switch to login after successful registration
      setTimeout(() => {
        setIsLogin(true);
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setError("");
    setSuccess("");
    loginForm.reset();
    registerForm.reset();
    setIsLogin(!isLogin);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-3xl border-0 shadow-2xl overflow-hidden">
          {/* Header with Toggle */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-center">
            <motion.div
              key={isLogin ? "login" : "register"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-lg mb-4">
                {isLogin ? (
                  <FaUser className="text-3xl text-white" />
                ) : (
                  <FaUserPlus className="text-3xl text-white" />
                )}
              </div>
              <CardTitle className="text-3xl font-bold text-white">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-white/80 mt-2">
                {isLogin 
                  ? "Sign in to continue to your account" 
                  : "Join us and start shopping today"}
              </CardDescription>
            </motion.div>
          </div>

          <CardContent className="p-8">
            {/* Mode Toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <motion.button
                type="button"
                onClick={() => switchMode()}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-white text-emerald-700 shadow-md"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
              <motion.button
                type="button"
                onClick={() => switchMode()}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-white text-emerald-700 shadow-md"
                    : "text-slate-600 hover:text-slate-800"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Up
              </motion.button>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    id="login-form"
                    onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  >
                    <FieldGroup className="space-y-5">
                      <Controller
                        name="email"
                        control={loginForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              autoComplete="email"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="password"
                        control={loginForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <div className="flex items-center justify-between">
                              <FieldLabel>Password</FieldLabel>
                              <button
                                type="button"
                                className="text-sm text-emerald-600 hover:underline"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Enter your password"
                              autoComplete="current-password"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form
                    id="register-form"
                    onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  >
                    <FieldGroup className="space-y-5">
                      <Controller
                        name="userName"
                        control={registerForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Username</FieldLabel>
                            <Input
                              {...field}
                              placeholder="Enter your username"
                              autoComplete="username"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="email"
                        control={registerForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your email"
                              autoComplete="email"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="password"
                        control={registerForm.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel>Password</FieldLabel>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Create a password"
                              autoComplete="new-password"
                            />
                            {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 p-8 pt-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Button
                form={isLogin ? "login-form" : "register-form"}
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </motion.div>

            <p className="text-center text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={switchMode}
                className="font-medium text-emerald-600 hover:underline ml-1"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
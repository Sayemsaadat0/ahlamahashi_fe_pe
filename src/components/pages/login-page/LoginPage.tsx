"use client";

import Link from "next/link";
// import Image from "next/image";
import { useFormik } from "formik";
// import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TextInput from "@/components/core/TextInput";
import { Label } from "@/components/ui/label";
// import { useRegister } from "@/hooks/auth.hook";
// import { RegisterValidation } from "@/validate/auth.validate";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/auth.hooks";
import { toast } from "sonner";
import { LoginValidation } from "@/validate/auth.validate";
import Logo from "@/components/core/Logo";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect } from "react";

const SignUpForm = () => {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    // const { mutateAsync, isPending: isRegisterLoading } = useRegister();
    const { mutateAsync, isPending: isLoginLoading } = useLogin();

    const { handleChange, values, touched, errors, handleSubmit, resetForm } =
        useFormik({
            initialValues: {

                email: "",
                password: "",
            },
            validationSchema: LoginValidation,
            onSubmit: async (data) => {
                try {
                    const payload = {
                        email: data.email,
                        password: data.password,
                    };
                    const result = await mutateAsync(payload);
                    if (result.success) {
                        toast.success(`${result.message}`);
                        resetForm();

                        // Store auth data
                        setAuth({ user: result.data.user, access_token: result.data.access_token });

                        // Navigate based on role
                        if (result.data.user.role === "admin") {
                            router.push("/admin");
                        } else {
                            router.push("/");
                        }
                    } else {
                        toast.error(result.message);
                    }
                } catch (error: any) {
                    error.errors.forEach((key: { attr: string; detail: string }) => {
                        toast.error(`${key?.attr} - ${key?.detail}`);
                    });
                }
            },
        });

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-1">

                <Label htmlFor="email" className="text-sm mx-3 text-white/60">
                    Email
                </Label>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={values.email}
                    error={
                        Boolean(errors.email) && touched.email ? errors.email : undefined
                    }
                    placeholder="Your email"
                />
                <Label htmlFor="password" className="text-sm mx-3 text-white/60">
                    Password
                </Label>
                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={values.password}
                    error={
                        Boolean(errors.password) && touched.password
                            ? errors.password
                            : undefined
                    }
                    placeholder="Password"
                />

                <div className="mt-4">
                    <Button
                        type="submit"
                        disabled={isLoginLoading}
                        className="w-full h-11 cursor-pointer rounded-full bg-white text-black hover:bg-custom-button-color font-semibold"
                    >
                        {isLoginLoading ? "Login in..." : "Login"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

const LoginPage = () => {
    const router = useRouter();
    const { token } = useAuthStore();

    useEffect(() => {
        if (token) {
            router.replace("/");
        }
    }, [token, router]);

    // Show nothing while redirecting
    if (token) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen  px-4">
            <div className="w-full max-w-sm rounded-[32px] bg-a-green-600 p-8 text-white shadow-[1px_-1px_0px_5px_rgba(0,0,0,0.1)] border-4 border-white">
                <div className=" space-y-6">
                    <div className="flex flex-col items-center justify-center">
                        <Link href="/">
                            <Logo />
                        </Link>
                        <p className="text-2xl font-semibold text-center">
                            Welcome Back
                        </p>
                    </div>
                    <SignUpForm />
                    <div className="tex-center  w-full ">
                        <p className="text-center text-white/60">or</p>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-center text-white/60">
                            {`Don't have an account?`}
                            <Link
                                href="/sign-up"
                                className="mx-1 font-semibold cursor-pointer text-custom-button-color"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

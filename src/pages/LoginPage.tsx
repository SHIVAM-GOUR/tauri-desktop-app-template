import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const onSubmit = (data: LoginForm) => {
        alert(`Logged in as: ${data.email}`);
    };

    return (
        <div>
            <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-96 p-6 border border-border rounded-lg bg-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                <h2 className="text-lg font-semibold text-card-foreground">Login</h2>

                <div className="flex flex-col gap-1">
                    <input
                        {...register('email')}
                        type="text"
                        placeholder="Email"
                        className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.email && (
                        <span className="text-destructive text-xs">{errors.email.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <input
                        {...register('password')}
                        type="password"
                        placeholder="Password"
                        className="px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                    {errors.password && (
                        <span className="text-destructive text-xs">{errors.password.message}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-primary text-primary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Submit
                </button>
            </motion.form>
        </div>
    );
}

export default LoginPage

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export type EmailForm = z.infer<typeof emailSchema>;

interface EmailStepProps {
    onSubmit: (data: EmailForm) => Promise<void>;
}

const EmailStep = ({ onSubmit }: EmailStepProps) => {
    const form = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Sign in</CardTitle>
                <CardDescription>
                    Enter your email to receive a one-time passcode.
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-foreground"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            {...form.register("email")}
                            className={cn(
                                "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:ring-2 focus:ring-ring",
                                form.formState.errors.email &&
                                    "border-destructive focus:ring-destructive"
                            )}
                        />
                        {form.formState.errors.email && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        Continue
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default EmailStep;

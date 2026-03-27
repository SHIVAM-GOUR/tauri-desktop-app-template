import { useRef, useState } from "react";
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

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export type OtpForm = z.infer<typeof otpSchema>;

interface OtpStepProps {
    email: string;
    onSubmit: (data: OtpForm) => Promise<void>;
    onBack: () => void;
}

const OtpStep = ({ email, onSubmit, onBack }: OtpStepProps) => {
    const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
    const form = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });

    const handleChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, "").slice(-1);
        const newDigits = [...otpDigits];
        newDigits[index] = digit;
        setOtpDigits(newDigits);
        form.setValue("otp", newDigits.join(""), { shouldValidate: true });

        if (digit && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        const newDigits = Array(6).fill("");
        pasted.split("").forEach((ch, i) => (newDigits[i] = ch));
        setOtpDigits(newDigits);
        form.setValue("otp", newDigits.join(""), { shouldValidate: true });
        const nextEmpty = pasted.length < 6 ? pasted.length : 5;
        otpRefs.current[nextEmpty]?.focus();
    };

    const handleBack = () => {
        setOtpDigits(Array(6).fill(""));
        form.reset();
        onBack();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Check your inbox</CardTitle>
                <CardDescription>
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
            </CardHeader>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                            One-time passcode
                        </label>
                        <div className="flex gap-2 justify-between">
                            {otpDigits.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        otpRefs.current[i] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    onPaste={i === 0 ? handlePaste : undefined}
                                    className={cn(
                                        "h-11 w-11 rounded-md border border-input bg-background text-center text-base font-semibold shadow-sm outline-none transition-colors focus:ring-2 focus:ring-ring",
                                        form.formState.errors.otp &&
                                            "border-destructive focus:ring-destructive"
                                    )}
                                />
                            ))}
                        </div>
                        {form.formState.errors.otp && (
                            <p className="text-xs text-destructive">
                                {form.formState.errors.otp.message}
                            </p>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.formState.isSubmitting}
                    >
                        Verify
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default OtpStep;

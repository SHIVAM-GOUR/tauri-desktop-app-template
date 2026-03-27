import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmailStep, { type EmailForm } from "./EmailStep";
import OtpStep, { type OtpForm } from "./OtpStep";

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 40 : -40,
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
        x: direction > 0 ? -40 : 40,
        opacity: 0,
    }),
};

const LoginPage = () => {
    const [step, setStep] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState<string>("");

    const onEmailSubmit = async (data: EmailForm) => {
        // await sendOtp(data.email); // Tauri command to call /otp-send API
        setEmail(data.email);
        setStep("otp");
    };

    const onOtpSubmit = async (data: OtpForm) => {
        // await verifyEmail(data.otp); // Tauri command to call /verify-api call
        // window.location.hash = "#/dashboard"; // redirect to dashboard page
        console.log("OTP submitted:", data.otp);
    };

    return (
        <div className="bg-linear-to-br from-gray-400 to-orange-500 w-screen h-screen grid place-items-center">
            <div className="w-full max-w-sm px-4">
                <AnimatePresence mode="wait" custom={step === "otp" ? 1 : -1}>
                    {step === "email" ? (
                        <motion.div
                            key="email"
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            <EmailStep onSubmit={onEmailSubmit} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="otp"
                            custom={1}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            <OtpStep
                                email={email}
                                onSubmit={onOtpSubmit}
                                onBack={() => setStep("email")}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LoginPage;

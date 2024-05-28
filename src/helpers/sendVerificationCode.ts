import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry Message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: false,
      message: "Verification email send successfully",
    };
  } catch (emailError) {
    console.log("Error Sending Verification Email", emailError);
    return {
      success: false,
      message: "Failed to send message",
    };
  }
}

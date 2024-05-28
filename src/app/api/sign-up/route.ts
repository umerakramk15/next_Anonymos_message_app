import { sendVerificationEmail } from "@/helpers/sendVerificationCode";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();
  } catch (error) {
    console.error("Error Registering the user", error);
    return Response.json(
      {
        success: false,
        message: "Error Registering the user",
      },
      { status: 500 }
    );
  }
}

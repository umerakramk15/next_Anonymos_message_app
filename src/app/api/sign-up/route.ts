import { sendVerificationEmail } from "@/helpers/sendVerificationCode";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    const exisitingUserVerifiedUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitingUserVerifiedUsername) {
      return Response.json(
        {
          success: false,
          message: "Error Registering the user , username already exsist",
        },
        { status: 400 }
      );
    }
    const exisitingUserVerifiedEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (exisitingUserVerifiedEmail) {
      if (exisitingUserVerifiedEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User Already Exsist this email",
          },
          { status: 500 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        exisitingUserVerifiedEmail.password = hashedPassword;
        exisitingUserVerifiedEmail.verifyCode = verifyCode;
        exisitingUserVerifiedEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await exisitingUserVerifiedEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Register Successfully . please verifiy your email",
      },
      { status: 200 }
    );
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

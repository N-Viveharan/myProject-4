import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/config/db";
import EmailModel from "@/lib/models/EmailModel";

// Ensure DB connection
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

export async function POST(request) {
  try {
    const formData = await request.formData();
    const email = formData.get("email");

    // Validate
    if (!email) {
      return NextResponse.json(
        { success: false, msg: "Email is required" },
        { status: 400 }
      );
    }

    // Save to DB
    await EmailModel.create({ email });

    // Return success response
    return NextResponse.json(
      { success: true, msg: "Email subscribed successfully!" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error saving email:", error);
    return NextResponse.json(
      { success: false, msg: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}


export async function GET(request) {
  const emails = await EmailModel.find({});
  return NextResponse.json({ emails });
}

export async function DELETE(request) {
  const id = request.nextUrl.searchParams.get("id");
  await EmailModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true, msg: "Email Deleted" });
}

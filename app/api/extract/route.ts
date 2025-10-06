import { NextRequest } from "next/server";
import { processPDFWithSchema } from "@/app/(extraction)/extraction/agent";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const schema = (form.get("schema") as string | null) || undefined;

    if (!file) {
      return Response.json({ success: false, error: "Missing file" }, { status: 400 });
    }

    const result = await processPDFWithSchema(file, schema);
    return Response.json(result, { status: result.success ? 200 : 500 });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}



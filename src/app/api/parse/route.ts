import { NextResponse } from "next/server";
import { z } from "zod";
import { parseTaskInput } from "@/lib/ai/parse-task";

const parseRequestSchema = z.object({
  input: z.string().trim().min(1).max(2000),
  existingTaskCount: z.number().int().min(0).max(200).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedBody = parseRequestSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: {
          code: "validation_error",
          message: "Invalid parse request.",
          details: parsedBody.error.flatten()
        }
      },
      { status: 400 }
    );
  }

  const result = await parseTaskInput(parsedBody.data.input, parsedBody.data.existingTaskCount ?? 0);
  return NextResponse.json(result);
}

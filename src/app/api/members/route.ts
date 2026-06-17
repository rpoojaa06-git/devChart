import connectDB from "@/lib/mongodb";
import Member from "@/models/Member";

export async function GET() {
  await connectDB();

  return Response.json(
    await Member.find()
  );
}

export async function POST(
  request: Request
) {
  await connectDB();

  const body = await request.json();

  const member =
    await Member.create(body);

  return Response.json(member);
}
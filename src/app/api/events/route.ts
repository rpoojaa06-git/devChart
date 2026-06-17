import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET() {
  await connectDB();
  return Response.json(await Event.find());
}

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();

  const event =
    await Event.create(body);

  return Response.json(event);
}
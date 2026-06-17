import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET() {
  await connectDB();

  return Response.json(
    await Announcement.find()
      .sort({ createdAt: -1 })
  );
}

export async function POST(
  request: Request
) {
  await connectDB();

  const body = await request.json();

  const announcement =
    await Announcement.create(body);

  return Response.json(announcement);
}
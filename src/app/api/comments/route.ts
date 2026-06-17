import connectDB from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Task from "@/models/Tasks";
import { validateComment } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/comments?taskId=X - Get all comments for a task
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { message: "taskId parameter is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ taskId }).sort({ timestamp: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments - Create a new comment
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = validateComment(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { message: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Check if task exists
    const task = await Task.findById(body.taskId);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Create comment
    const comment = await Comment.create({
      taskId: body.taskId,
      userId: body.userId,
      userName: body.userName || "Anonymous",
      text: body.text,
      timestamp: new Date(),
    });

    // Update task comment count
    const updatedTask = await Task.findByIdAndUpdate(
      body.taskId,
      { $inc: { commentCount: 1 }, updatedAt: new Date() },
      { returnDocument: "after" }
    );

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
}

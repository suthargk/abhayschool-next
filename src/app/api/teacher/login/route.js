import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { id: data.user.id } });

  if (!profile || profile.role !== "TEACHER") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "This account isn't a teacher account." },
      { status: 403 },
    );
  }

  if (profile.status === "REJECTED") {
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "This account no longer has access. Contact the school office." },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, status: profile.status });
}

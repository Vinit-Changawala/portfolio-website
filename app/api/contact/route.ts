import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  // This is a stub: it validates the input and logs it on the server,
  // but does not send an email yet. To actually deliver messages, plug
  // in an email provider here, for example Resend:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "Portfolio <onboarding@resend.dev>",
  //     to: "you@example.com",
  //     subject: `New message from ${body.name}`,
  //     text: body.message,
  //     reply_to: body.email,
  //   });
  //
  // Then set RESEND_API_KEY as an environment variable, both locally
  // (in .env.local) and in your Render dashboard.
  console.log("Contact form submission:", body);

  return NextResponse.json({ ok: true });
}

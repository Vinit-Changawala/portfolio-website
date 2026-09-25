import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !toEmail) {
    // Not configured yet — log it so nothing is silently lost, but tell
    // the visitor it failed rather than falsely claiming success.
    console.error(
      "Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is missing — email not sent.",
      body
    );
    return NextResponse.json(
      { ok: false, error: "Email sending is not configured" },
      { status: 500 }
    );
  }

  const name: string = body.name;
  const email: string = body.email;
  const phone: string | undefined = body.phone?.trim() || undefined;
  const message: string = body.message;

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Portfolio Contact Form <onboarding@resend.dev>",
      to: toEmail,
      replyTo: email,
      subject: `New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json({ ok: false, error: "Send failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ ok: false, error: "Send failed" }, { status: 500 });
  }
}

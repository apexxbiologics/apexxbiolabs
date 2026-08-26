import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeReplySubject(subject: string, hasConversation: boolean) {
  if (!hasConversation) return subject;
  return /^re:/i.test(subject) ? subject : `Re: ${subject}`;
}

export async function POST(request: Request) {
  try {
    const { orderId, subject, message } = await request.json();

    const cleanedOrderId = String(orderId || "").trim();
    const cleanedSubject = String(subject || "").trim();
    const cleanedMessage = String(message || "").trim();

    if (!cleanedOrderId || !cleanedSubject || !cleanedMessage) {
      return NextResponse.json(
        { success: false, error: "Order ID, subject, and message are required." },
        { status: 400 }
      );
    }

    if (cleanedSubject.length > 180 || cleanedMessage.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Subject or message is too long." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_email, first_name, last_name, status")
      .eq("id", cleanedOrderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: "The order could not be found." },
        { status: 404 }
      );
    }

    const customerEmail = String(order.customer_email || "").trim().toLowerCase();
    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "This order does not have a valid customer email address." },
        { status: 400 }
      );
    }

    const { data: previousMessages, error: messagesError } = await supabaseAdmin
      .from("order_customer_messages")
      .select("id, subject, message_id, created_at")
      .eq("order_id", cleanedOrderId)
      .order("created_at", { ascending: true });

    if (messagesError) {
      console.error("Conversation lookup error:", messagesError);
      return NextResponse.json(
        { success: false, error: "The conversation history could not be loaded." },
        { status: 500 }
      );
    }

    const messages = previousMessages || [];
    const messageIds = messages
      .map((item) => String(item.message_id || "").trim())
      .filter(Boolean);
    const lastMessageId = messageIds.length ? messageIds[messageIds.length - 1] : null;

    const finalSubject = normalizeReplySubject(cleanedSubject, messages.length > 0);
    const safeFirstName = escapeHtml(String(order.first_name || "Customer").trim() || "Customer");
    const safeOrderNumber = escapeHtml(String(order.order_number || "").trim());
    const safeSubject = escapeHtml(finalSubject);
    const safeMessage = escapeHtml(cleanedMessage).replace(/\r?\n/g, "<br/>");

    const replyTo = String(process.env.CUSTOMER_REPLY_TO_EMAIL || "").trim();

    const headers: Record<string, string> = {};
    if (lastMessageId) {
      headers["In-Reply-To"] = lastMessageId;
      headers["References"] = messageIds.slice(-20).join(" ");
    }

    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Apexx Biolabs <orders@apexxbiolabs.com>",
      to: customerEmail,
      ...(replyTo ? { replyTo } : {}),
      subject: finalSubject,
      ...(Object.keys(headers).length ? { headers } : {}),
      html: `
        <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
          <div style="max-width:700px;margin:0 auto;padding:28px 16px;">
            <div style="background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;box-shadow:0 18px 45px rgba(30,58,138,0.12);">
              <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:36px 24px;text-align:center;border-bottom:1px solid #dbeafe;">
                <p style="margin:0 0 14px;color:#3b82f6;font-size:13px;letter-spacing:4px;text-transform:uppercase;">Research. Quality. Confidence.</p>
                <h1 style="margin:0;color:#06111f;font-size:34px;letter-spacing:3px;">APEXX BIOLABS</h1>
                <p style="margin:12px 0 0;color:#475569;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Premium Research Materials</p>
              </div>

              <div style="padding:32px 24px;color:#0f172a;">
                <div style="background:#ffffff;border:1px solid #bfdbfe;border-radius:22px;padding:28px 24px;margin-bottom:28px;">
                  <p style="margin:0 0 10px;color:#3b82f6;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">Order Communication</p>
                  <h2 style="margin:0;color:#06111f;font-size:28px;font-weight:800;line-height:1.25;">${safeSubject}</h2>
                  <p style="margin:14px 0 0;color:#64748b;font-size:14px;">Regarding order <strong style="color:#1e3a8a;">${safeOrderNumber}</strong></p>
                </div>

                <div style="padding:4px 4px 12px;">
                  <p style="margin:0 0 18px;color:#334155;font-size:16px;line-height:1.8;">Hi ${safeFirstName},</p>
                  <div style="color:#334155;font-size:16px;line-height:1.85;word-break:break-word;">${safeMessage}</div>
                </div>

                <div style="margin-top:30px;background:linear-gradient(135deg,#eaf4ff,#f8fbff);border:1px solid #bfdbfe;border-radius:20px;padding:22px;">
                  <p style="margin:0;color:#475569;font-size:14px;line-height:1.7;">This message was sent directly by Apexx Biolabs regarding your order. Reply directly to this email if you need assistance.</p>
                </div>

                <div style="border-top:1px solid #dbeafe;margin-top:30px;padding-top:22px;">
                  <p style="font-size:12px;color:#64748b;line-height:1.6;margin:0;">Products sold by Apexx Biolabs are intended strictly for lawful laboratory research use only. Not for human consumption, medical use, veterinary use, diagnosis, treatment, cure, or prevention of disease.</p>
                  <p style="margin:22px 0 0;color:#334155;line-height:1.6;">Apexx Biolabs<br/>orders@apexxbiolabs.com<br/>apexxbiolabs.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
    });

    if (emailError || !emailData?.id) {
      console.error("Contact customer email error:", emailError);
      return NextResponse.json(
        { success: false, error: "The customer email could not be sent." },
        { status: 500 }
      );
    }

    let sentMessageId: string | null = null;
    try {
      const { data: sentEmail } = await resend.emails.get(emailData.id);
      sentMessageId = String((sentEmail as any)?.message_id || "").trim() || null;
    } catch (lookupError) {
      console.error("Sent email Message-ID lookup error:", lookupError);
    }

    const { error: insertError } = await supabaseAdmin
      .from("order_customer_messages")
      .insert({
        order_id: order.id,
        direction: "outbound",
        subject: finalSubject,
        body_text: cleanedMessage,
        from_email: "orders@apexxbiolabs.com",
        to_email: customerEmail,
        resend_email_id: emailData.id,
        message_id: sentMessageId,
        in_reply_to: lastMessageId,
      });

    if (insertError) {
      console.error("Conversation save error:", insertError);
      return NextResponse.json(
        {
          success: true,
          emailId: emailData.id,
          recipient: customerEmail,
          warning: "Email sent, but the conversation copy could not be saved.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: emailData.id,
      recipient: customerEmail,
      messageId: sentMessageId,
    });
  } catch (error) {
    console.error("Contact customer route error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send the customer email." },
      { status: 500 }
    );
  }
}
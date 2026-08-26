import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
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

function headerValue(headers: Record<string, unknown> | null | undefined, name: string) {
  if (!headers) return "";
  const direct = headers[name];
  if (typeof direct === "string") return direct.trim();

  const key = Object.keys(headers).find((item) => item.toLowerCase() === name.toLowerCase());
  const value = key ? headers[key] : undefined;
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmailAddress(value: string) {
  const angleMatch = value.match(/<([^>]+)>/);
  return String(angleMatch?.[1] || value).trim().toLowerCase();
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("RESEND_WEBHOOK_SECRET is missing.");
      return new NextResponse("Webhook is not configured", { status: 500 });
    }

    const payload = await req.text();
    const id = req.headers.get("svix-id");
    const timestamp = req.headers.get("svix-timestamp");
    const signature = req.headers.get("svix-signature");

    if (!id || !timestamp || !signature) {
      return new NextResponse("Missing webhook signature headers", { status: 400 });
    }

    const event = resend.webhooks.verify({
      payload,
      headers: { id, timestamp, signature },
      webhookSecret,
    }) as any;

    if (event.type !== "email.received") {
      return NextResponse.json({ success: true, ignored: true });
    }

    const receivedEmailId = String(event.data?.email_id || "").trim();
    const inboundMessageId = String(event.data?.message_id || "").trim();

    if (!receivedEmailId) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const { data: receivedEmail, error: receivedError } =
      await resend.emails.receiving.get(receivedEmailId);

    if (receivedError || !receivedEmail) {
      console.error("Received email retrieve error:", receivedError);
      return new NextResponse("Could not retrieve inbound email", { status: 500 });
    }

    const headers = ((receivedEmail as any).headers || {}) as Record<string, unknown>;
    const inReplyTo = headerValue(headers, "in-reply-to");
    const references = headerValue(headers, "references")
      .split(/\s+/)
      .map((value) => value.trim())
      .filter(Boolean);

    const candidateMessageIds = [inReplyTo, ...references].filter(Boolean).reverse();

    let matchedOrderId: string | null = null;

    for (const messageId of candidateMessageIds) {
      const { data: matchedMessage } = await supabaseAdmin
        .from("order_customer_messages")
        .select("order_id")
        .eq("message_id", messageId)
        .maybeSingle();

      if (matchedMessage?.order_id) {
        matchedOrderId = matchedMessage.order_id;
        break;
      }
    }

    if (!matchedOrderId) {
      // Safe fallback: only match a customer if the subject contains a known order number.
      const subject = String((receivedEmail as any).subject || "");
      const sender = normalizeEmailAddress(String((receivedEmail as any).from || ""));

      const { data: possibleOrders } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, customer_email")
        .ilike("customer_email", sender)
        .order("created_at", { ascending: false })
        .limit(20);

      const subjectMatch = (possibleOrders || []).find((order) =>
        subject.toLowerCase().includes(String(order.order_number || "").toLowerCase())
      );

      matchedOrderId = subjectMatch?.id || null;
    }

    if (!matchedOrderId) {
      console.warn("Inbound email could not be matched to an order:", receivedEmailId);
      return NextResponse.json({ success: true, unmatched: true });
    }

    const bodyText = String((receivedEmail as any).text || "").trim() ||
      "Customer replied with an HTML-only message. Open the message in Resend if the text is not visible here.";

    const { error: insertError } = await supabaseAdmin
      .from("order_customer_messages")
      .upsert(
        {
          order_id: matchedOrderId,
          direction: "inbound",
          subject: String((receivedEmail as any).subject || "Customer reply"),
          body_text: bodyText,
          from_email: normalizeEmailAddress(String((receivedEmail as any).from || "")),
          to_email: Array.isArray((receivedEmail as any).to)
            ? String((receivedEmail as any).to[0] || "")
            : String((receivedEmail as any).to || ""),
          resend_email_id: receivedEmailId,
          message_id: inboundMessageId || String((receivedEmail as any).message_id || "").trim() || null,
          in_reply_to: inReplyTo || null,
        },
        { onConflict: "resend_email_id" }
      );

    if (insertError) {
      console.error("Inbound conversation save error:", insertError);
      return new NextResponse("Could not save inbound email", { status: 500 });
    }

    // Send a separate phone/inbox notification to Apexx after the reply is safely saved.
    // Notification failures do NOT block or remove the saved customer reply.
    try {
      const { data: orderForNotification } = await supabaseAdmin
        .from("orders")
        .select("order_number, first_name, last_name, customer_email")
        .eq("id", matchedOrderId)
        .maybeSingle();

      const customerName = `${String(orderForNotification?.first_name || "").trim()} ${String(
        orderForNotification?.last_name || ""
      ).trim()}`.trim() || "Customer";

      const orderNumber = String(orderForNotification?.order_number || "Unknown Order");
      const customerEmail = normalizeEmailAddress(
        String(orderForNotification?.customer_email || (receivedEmail as any).from || "")
      );
      const inboundSubject = String((receivedEmail as any).subject || "Customer reply");

      const { error: notificationError } = await resend.emails.send({
        from: "Apexx Biolabs <orders@apexxbiolabs.com>",
        to: "orders@apexxbiolabs.com",
        subject: `Customer Reply • ${orderNumber}`,
        html: `
          <div style="margin:0;padding:0;background:#f8fbff;font-family:Arial,Helvetica,sans-serif;">
            <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
              <div style="overflow:hidden;border:1px solid #dbeafe;border-radius:26px;background:#ffffff;box-shadow:0 18px 45px rgba(30,58,138,0.10);">
                <div style="background:linear-gradient(135deg,#eef7ff,#dbeafe,#ffffff);padding:30px 24px;text-align:center;border-bottom:1px solid #dbeafe;">
                  <p style="margin:0 0 10px;color:#3b82f6;font-size:12px;letter-spacing:4px;text-transform:uppercase;">
                    Customer Reply Notification
                  </p>
                  <h1 style="margin:0;color:#06111f;font-size:30px;letter-spacing:2px;">
                    APEXX BIOLABS
                  </h1>
                </div>

                <div style="padding:30px 24px;color:#0f172a;">
                  <h2 style="margin:0 0 8px;color:#06111f;font-size:25px;">
                    New reply for ${escapeHtml(orderNumber)}
                  </h2>

                  <p style="margin:0 0 24px;color:#64748b;line-height:1.7;">
                    ${escapeHtml(customerName)} replied to an Apexx order conversation.
                  </p>

                  <div style="margin-bottom:22px;border:1px solid #bfdbfe;border-radius:18px;background:#eff6ff;padding:20px;">
                    <p style="margin:0 0 8px;color:#1e3a8a;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">
                      Customer
                    </p>
                    <p style="margin:0;color:#06111f;font-weight:800;">
                      ${escapeHtml(customerName)}
                    </p>
                    <p style="margin:5px 0 0;color:#475569;font-size:14px;">
                      ${escapeHtml(customerEmail)}
                    </p>
                  </div>

                  <div style="margin-bottom:22px;border:1px solid #e2e8f0;border-radius:18px;padding:20px;">
                    <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">
                      Subject
                    </p>
                    <p style="margin:0;color:#0f172a;font-weight:800;">
                      ${escapeHtml(inboundSubject)}
                    </p>
                  </div>

                  <div style="border:1px solid #e2e8f0;border-radius:18px;padding:20px;">
                    <p style="margin:0 0 10px;color:#64748b;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;">
                      Message
                    </p>
                    <div style="color:#334155;font-size:15px;line-height:1.75;white-space:pre-wrap;">
                      ${escapeHtml(bodyText)}
                    </div>
                  </div>

                  <p style="margin:24px 0 0;color:#64748b;font-size:13px;line-height:1.7;">
                    Open Apexx Admin → Orders → Conversation / Email to send the branded reply.
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });

      if (notificationError) {
        console.error("Customer reply notification email error:", notificationError);
      }
    } catch (notificationError) {
      console.error("Customer reply notification failed:", notificationError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Inbound webhook error:", error);
    return new NextResponse("Invalid or failed webhook", { status: 400 });
  }
}
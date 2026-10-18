import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// nodemailer requires the Node.js runtime (no SMTP support on edge).
export const runtime = "nodejs";

const MAX_LENGTHS = {
  name: 100,
  contact: 200,
  product: 100,
  comment: 1000,
} as const;

function readField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный формат запроса" },
      { status: 400 },
    );
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const name = readField(raw.name);
  const contact = readField(raw.contact);
  const product = readField(raw.product);
  const comment = readField(raw.comment);
  const consent = raw.consent === true;

  if (!name || !contact) {
    return NextResponse.json(
      { error: "Имя и контакт обязательны" },
      { status: 400 },
    );
  }

  if (
    name.length > MAX_LENGTHS.name ||
    contact.length > MAX_LENGTHS.contact ||
    product.length > MAX_LENGTHS.product ||
    comment.length > MAX_LENGTHS.comment
  ) {
    return NextResponse.json(
      { error: "Слишком длинные данные" },
      { status: 400 },
    );
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.MAIL_TO;
  const from = process.env.MAIL_FROM || user;

  if (!host || !user || !pass || !to) {
    console.error("[lead] SMTP configuration is missing");
    return NextResponse.json(
      { error: "Сервис временно недоступен" },
      { status: 503 },
    );
  }

  const safeProduct = product.replace(/[\r\n]+/g, " ").slice(0, 80);

  const text = [
    "Новая заявка с сайта TERRA CORIUM",
    "",
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    `Товар: ${product || "—"}`,
    `Комментарий: ${comment || "—"}`,
    `Согласие на обработку данных: ${consent ? "да" : "нет"}`,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#2b2b2b;line-height:1.6">
      <h2 style="color:#3e2c23;margin:0 0 16px;font-weight:600">TERRA CORIUM — новая заявка</h2>
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr>
          <td style="padding:8px 0;color:#8c5622;white-space:nowrap;vertical-align:top">Имя</td>
          <td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8c5622;white-space:nowrap;vertical-align:top">Контакт</td>
          <td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(contact)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8c5622;white-space:nowrap;vertical-align:top">Товар</td>
          <td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${escapeHtml(product || "—")}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8c5622;white-space:nowrap;vertical-align:top">Согласие</td>
          <td style="padding:8px 0 8px 16px;border-bottom:1px solid #eee">${consent ? "да" : "нет"}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8c5622;white-space:nowrap;vertical-align:top">Комментарий</td>
          <td style="padding:8px 0 0 16px">${escapeHtml(comment || "—")}</td>
        </tr>
      </table>
    </div>
  `;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"TERRA CORIUM" <${from}>`,
      to,
      subject: `Заявка с сайта — ${safeProduct || "товар не выбран"}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[lead] failed to send email:", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку" },
      { status: 500 },
    );
  }
}

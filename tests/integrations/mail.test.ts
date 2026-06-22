import assert from "node:assert/strict";
import test from "node:test";
import { mailSink } from "../../lib/integrations/mail.ts";

test("mailSink sends notifications and auto-replies via Resend", async () => {
  const originalFetch = global.fetch;
  const originalEnvProvider = process.env.MAIL_PROVIDER;
  const originalEnvKey = process.env.RESEND_API_KEY;
  const originalEnvFrom = process.env.MAIL_FROM;

  process.env.MAIL_PROVIDER = "resend";
  process.env.RESEND_API_KEY = "mock-resend-key";
  process.env.MAIL_FROM = "Bartez <ventas@bartez.com.ar>";

  const calls: { url: string; body: unknown }[] = [];

  try {
    global.fetch = async (url, options) => {
      calls.push({ url: url.toString(), body: JSON.parse(options?.body as string) });
      return new Response(JSON.stringify({ id: "mail_sent" }), { status: 200 });
    };

    const result = await mailSink.handle({
      empresa: "Test Company",
      nombre: "Test User",
      email: "test@company.com",
      telefono: "12345678",
      tipoConsulta: "cotizacion",
      mensaje: "Hello Mail",
      agendarReunion: false,
    });

    assert.equal(result.ok, true);
    assert.equal(calls.length, 2);
    // Notification mail
    assert.equal(calls[0].url, "https://api.resend.com/emails");
    assert.equal((calls[0].body as { to: string }).to, "ventas@bartez.com.ar");
    assert.match((calls[0].body as { subject: string }).subject, /Nuevo lead web/);
    // Auto-reply mail
    assert.equal(calls[1].url, "https://api.resend.com/emails");
    assert.equal((calls[1].body as { to: string }).to, "test@company.com");
    assert.match((calls[1].body as { subject: string }).subject, /Recibimos tu consulta/);
  } finally {
    global.fetch = originalFetch;
    process.env.MAIL_PROVIDER = originalEnvProvider;
    process.env.RESEND_API_KEY = originalEnvKey;
    process.env.MAIL_FROM = originalEnvFrom;
  }
});

test("mailSink sends notifications via Brevo", async () => {
  const originalFetch = global.fetch;
  const originalEnvProvider = process.env.MAIL_PROVIDER;
  const originalEnvKey = process.env.BREVO_API_KEY;
  const originalEnvFrom = process.env.MAIL_FROM;

  process.env.MAIL_PROVIDER = "brevo";
  process.env.BREVO_API_KEY = "mock-brevo-key";
  process.env.MAIL_FROM = "Bartez <ventas@bartez.com.ar>";

  const calls: { url: string; body: unknown }[] = [];

  try {
    global.fetch = async (url, options) => {
      calls.push({ url: url.toString(), body: JSON.parse(options?.body as string) });
      return new Response(JSON.stringify({ messageId: "brevo_sent" }), { status: 200 });
    };

    const result = await mailSink.handle({
      empresa: "Test Company",
      nombre: "Test User",
      email: "test@company.com",
      telefono: "12345678",
      tipoConsulta: "cotizacion",
      mensaje: "Hello Brevo",
      agendarReunion: false,
    });

    assert.equal(result.ok, true);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].url, "https://api.brevo.com/v3/smtp/email");
    assert.equal((calls[0].body as { to: Array<{ email: string }> }).to[0].email, "ventas@bartez.com.ar");
    assert.equal(calls[1].url, "https://api.brevo.com/v3/smtp/email");
    assert.equal((calls[1].body as { to: Array<{ email: string }> }).to[0].email, "test@company.com");
  } finally {
    global.fetch = originalFetch;
    process.env.MAIL_PROVIDER = originalEnvProvider;
    process.env.BREVO_API_KEY = originalEnvKey;
    process.env.MAIL_FROM = originalEnvFrom;
  }
});

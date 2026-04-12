import "dotenv/config";
import { Resend } from "resend";

const resend = new Resend(process.env.re_9aJsbZ8H_9UPPmYapuHQ1qMLCmo5wBzeW);

const from = process.env.EMAIL_FROM || "Acme <noreply@tempclassproject.xyz>";

const { data, error } = await resend.emails.send({
  from,
  to: ["julian.j.poston@gmail.com"],
  subject: "Hello from Resend!",
  html: "<h1>Welcome!</h1><p>This email was sent using Resend's Node.js SDK.</p>",
  text: "Welcome! This email was sent using Resend's Node.js SDK."
});

if (error) {
  console.error("Error sending email:", error);
  process.exit(1);
}

console.log("Email sent successfully!");
console.log("Email ID:", data?.id);

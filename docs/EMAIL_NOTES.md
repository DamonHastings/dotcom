# SendGrid Integration (Developer Notes)

This project includes a minimal `SendGridService` implementation in the API that will send notification emails when enabled.

How it works

- The service tries to `require('@sendgrid/mail')` at runtime and will be a no-op when the package isn't installed.
- For real email sending you must set the `SENDGRID_API_KEY` environment variable and install the `@sendgrid/mail` package.

Enable SendGrid (local dev)

1. Install the package for the API workspace (from repo root):

```bash
npm --workspace @apps/api install @sendgrid/mail
```

2. Add environment variables (example `.env` / local shell):

```env
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM="Your Name <no-reply@example.com>"
NOTIFY_EMAIL=admin@example.com
```

3. Restart the API dev server:

```bash
npm --workspace @apps/api run start:dev
```

Notes

- The service logs whether it's initialized; if you see "SendGrid API key not found" or "@sendgrid/mail not installed" the service will not attempt to send emails.
- Messages are sent from the address configured in `EMAIL_FROM` (default `no-reply@example.com`).
- We intentionally make the dependency optional to keep developer setup simple; installing the package and setting `SENDGRID_API_KEY` enables real sends.

Security

- Never commit real API keys to repository. Use a secrets manager or CI environment variables for production deployments.

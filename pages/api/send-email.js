import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, caseNumber } = req.body;

  if (!email || !caseNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const kontaktLink = `https://elraad.no/kontakt-oss?case=${caseNumber}`;

    const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h2 style="color: #1a73e8;">Takk for at du kontaktet Elråd!</h2>
          <p>Ditt saksnummer er:</p>
          <p style="font-size: 24px; font-weight: bold; color: #1a73e8;">#${caseNumber}</p>

          <hr style="margin: 20px 0;">

          <p>Hva skjer videre?</p>
          <ul>
            <li>Vi har mottatt forespørselen din.</li>
            <li>En AI-basert vurdering blir sendt til deg snarlig.</li>
            <li>Hvis du trenger mer hjelp, kan du legge til informasjon via lenken under.</li>
          </ul>

          <p>
            <a href="${kontaktLink}"
               style="background-color: #1a73e8; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
               Legg til mer informasjon
            </a>
          </p>

          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Elråd – Din digitale elektrikerhjelp<br>
            E-post: post@elraad.no | Telefon: 46414304
          </p>
        </div>
      </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"Elråd.no" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Elråd – Ditt saksnummer: ${caseNumber}`,
      html: htmlContent,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

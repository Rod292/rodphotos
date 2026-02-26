import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // TODO: Connecter a un service d'email (Resend, SendGrid, etc.)
    // Exemple avec Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@rod-photos.com',
    //   to: 'contact@rod-photos.com',
    //   subject: `Nouveau message de ${name}`,
    //   text: `De: ${name} (${email})\n\n${message}`,
    // });

    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

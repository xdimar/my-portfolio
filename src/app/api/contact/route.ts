import { NextRequest, NextResponse } from 'next/server';
import { sendContactMessage } from '@/lib/portfolio-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Nama, email, dan pesan wajib diisi' },
        { status: 400 }
      );
    }

    const result = await sendContactMessage({
      name,
      email,
      subject: subject || 'Pesan dari Portofolio Web',
      message,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || 'Gagal menyimpan pesan' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan berhasil dikirim dan tersimpan di database',
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}

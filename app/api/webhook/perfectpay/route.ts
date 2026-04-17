import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const PERFECT_PAY_TOKEN = process.env.PERFECT_PAY_TOKEN || 'c9ce8c526ce94314e4e451a7f01914a4';

export async function POST(req: NextRequest) {
  try {
    let data: any = {};
    
    // Tentamos parsear como JSON ou form-urlencoded
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        data[key] = value;
      });
    }

    // Na Perfect Pay o token vem no payload para validação de segurança
    const { token, sale_status_enum, xcod } = data;

    if (token !== PERFECT_PAY_TOKEN) {
      console.error('Perfect Pay Webhook: Token inválido');
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    // A Perfect Pay as vezes envia o status no campo 'transaction.status', 'sale_status_enum' ou similar
    const status = sale_status_enum || data['transaction.status'] || data.transaction_status || data.status || data.sale_status;

    // Identificador 'xcod' contém o userId que passamos na URL de checkout
    const userId = xcod || data['metadata.xcod'] || data['metadata[xcod]'];

    // O status "2" significa aprovado na tipificação da Perfect Pay, ou strings de aprovação dependendo da versão
    const isApproved = status === 2 || status === '2' || status === 'approved' || status === 'Approved' || status === 'paid' || status === 'Completed' || status === 'Aprovada';

    if (isApproved && userId) {
      // Atitiva o usuário no banco
      const { error } = await supabaseAdmin
        .from('usuarios')
        .update({ status: 'ativo' })
        .eq('id', userId);

      if (error) {
        console.error('Falha ao ativar o usuário via Perfect Pay:', error);
        return NextResponse.json({ error: 'Erro no Banco de Dados' }, { status: 500 });
      }

      console.log(`✅ Perfect Pay: Conta do Usuário ID ${userId} Ativada com Sucesso.`);
    } else {
      console.log(`⚠️ Perfect Pay: Evento (Status: ${status}) (UserId: ${userId}). Não exigiu ativação.`);
    }

    // Devemos retornar OK (200) logo para a Perfect Pay não ficar re-enviando chamadas
    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Erro global no webhook perfect pay:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

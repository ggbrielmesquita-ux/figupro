/**
 * Script para criar usuários no banco de dados
 * Uso: node scripts/criar-usuario.js
 *
 * Requer: npm install @supabase/supabase-js bcryptjs dotenv
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pergunta = (q) => new Promise((resolve) => rl.question(q, resolve));

async function main() {
  console.log('\n🔥 FIGURINHAS PRO - Criar Usuário\n');

  const email = await pergunta('Email: ');
  const senha = await pergunta('Senha: ');
  const nome = await pergunta('Nome (opcional): ');
  const expiracao = await pergunta('Data de expiração (YYYY-MM-DD, Enter para nunca): ');
  const role = await pergunta('Role (user/admin, padrão: user): ') || 'user';

  const senhaHash = await bcrypt.hash(senha, 12);

  const { data, error } = await supabase.from('usuarios').insert({
    email: email.toLowerCase().trim(),
    senha_hash: senhaHash,
    nome: nome || null,
    data_expiracao: expiracao ? new Date(expiracao).toISOString() : null,
    role: role.trim() || 'user',
    status: 'ativo',
  }).select().single();

  if (error) {
    console.error('\n❌ Erro:', error.message);
  } else {
    console.log('\n✅ Usuário criado com sucesso!');
    console.log('   ID:', data.id);
    console.log('   Email:', data.email);
    console.log('   Role:', data.role);
  }

  rl.close();
}

main().catch(console.error);

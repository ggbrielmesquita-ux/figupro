-- =============================================
-- FIGURINHAS PRO - Schema do banco de dados
-- Execute no SQL Editor do Supabase
-- =============================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255),
  whatsapp VARCHAR(20),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_expiracao TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'pendente')),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  reset_token VARCHAR(255),
  reset_token_expira TIMESTAMP WITH TIME ZONE,
  CONSTRAINT email_lowercase CHECK (email = LOWER(email))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_reset_token ON usuarios(reset_token) WHERE reset_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_usuarios_status ON usuarios(status);

-- RLS (Row Level Security) - Desabilitar para uso com service role
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- =============================================
-- Inserir usuário admin inicial
-- Senha: admin123 (TROQUE IMEDIATAMENTE!)
-- Hash gerado com bcrypt rounds=12
-- =============================================

-- Para gerar o hash da senha, use o script abaixo no Node.js:
-- const bcrypt = require('bcryptjs');
-- console.log(await bcrypt.hash('sua-senha', 12));

-- Exemplo de insert (descomente e ajuste):
-- INSERT INTO usuarios (email, senha_hash, nome, role, status)
-- VALUES (
--   'admin@figurinhaspro.com',
--   '$2a$12$HASH_GERADO_AQUI',
--   'Admin',
--   'admin',
--   'ativo'
-- );

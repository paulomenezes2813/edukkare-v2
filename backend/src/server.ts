import app from './app';
import { config } from './config/env';
import prisma from './config/database';

const PORT = config.port;

async function startServer() {
  try {
    // Testar conexão com o banco
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados SQLite');

    // Iniciar servidor (0.0.0.0 permite acesso de qualquer dispositivo na rede)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando em http://192.168.0.9:${PORT}`);
      console.log(`📱 Acesso local: http://localhost:${PORT}`);
      console.log(`📚 API docs em http://192.168.0.9:${PORT}/api`);
      console.log(`🎓 EDUKKARE - Sistema Inteligente para Educação Infantil`);
      console.log(`⚡ Ambiente: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();


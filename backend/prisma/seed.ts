import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@edukkare.com' },
    update: {},
    create: {
      email: 'admin@edukkare.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  const professor1 = await prisma.user.upsert({
    where: { email: 'maria.silva@edukkare.com' },
    update: {},
    create: {
      email: 'maria.silva@edukkare.com',
      password: hashedPassword,
      name: 'Maria Silva',
      role: 'PROFESSOR',
    },
  });

  const professor2 = await prisma.user.upsert({
    where: { email: 'joao.santos@edukkare.com' },
    update: {},
    create: {
      email: 'joao.santos@edukkare.com',
      password: hashedPassword,
      name: 'João Santos',
      role: 'PROFESSOR',
    },
  });

  console.log('✅ Usuários criados');

  // Criar turmas
  const turma1 = await prisma.class.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Infantil II - A',
      age_group: 'Infantil II',
      shift: 'MANHA',
      year: 2025,
      teacherId: professor1.id,
    },
  });

  const turma2 = await prisma.class.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Infantil I - B',
      age_group: 'Infantil I',
      shift: 'TARDE',
      year: 2025,
      teacherId: professor2.id,
    },
  });

  const turma3 = await prisma.class.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Berçário II - A',
      age_group: 'Berçário II',
      shift: 'MANHA',
      year: 2025,
      teacherId: professor1.id,
    },
  });

  console.log('✅ Turmas criadas');

  // Criar códigos BNCC
  const bnccCodes = [
    {
      code: 'EI02TS02',
      name: 'Traços, sons, cores e formas',
      description: 'Utilizar materiais variados com possibilidades de manipulação (argila, massa de modelar), explorando cores, texturas, superfícies, planos, formas e volumes ao criar objetos tridimensionais.',
      field: 'Traços, sons, cores e formas',
      age_group: 'Crianças pequenas (2-3 anos)',
    },
    {
      code: 'EI02EF01',
      name: 'Escuta, fala, pensamento e imaginação',
      description: 'Dialogar com crianças e adultos, expressando seus desejos, necessidades, sentimentos e opiniões.',
      field: 'Escuta, fala, pensamento e imaginação',
      age_group: 'Crianças pequenas (2-3 anos)',
    },
    {
      code: 'EI02CG02',
      name: 'Corpo, gestos e movimentos',
      description: 'Deslocar seu corpo no espaço, orientando-se por noções como em frente, atrás, no alto, embaixo, dentro, fora etc., ao se envolver em brincadeiras e atividades de diferentes naturezas.',
      field: 'Corpo, gestos e movimentos',
      age_group: 'Crianças pequenas (2-3 anos)',
    },
    {
      code: 'EI02TS01',
      name: 'Traços, sons, cores e formas',
      description: 'Criar sons com materiais, objetos e instrumentos musicais, para acompanhar diversos ritmos de música.',
      field: 'Traços, sons, cores e formas',
      age_group: 'Crianças pequenas (2-3 anos)',
    },
  ];

  for (const bncc of bnccCodes) {
    await prisma.bNCCCode.upsert({
      where: { code: bncc.code },
      update: {},
      create: bncc,
    });
  }

  console.log('✅ Códigos BNCC criados');

  // Criar atividades
  const bnccTS02 = await prisma.bNCCCode.findUnique({ where: { code: 'EI02TS02' } });
  const bnccEF01 = await prisma.bNCCCode.findUnique({ where: { code: 'EI02EF01' } });
  const bnccCG02 = await prisma.bNCCCode.findUnique({ where: { code: 'EI02CG02' } });

  if (bnccTS02) {
    await prisma.activity.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Pintura com Texturas',
        description: 'Atividade de pintura utilizando diferentes texturas e materiais para estimular a criatividade e coordenação motora fina.',
        duration: 30,
        materials: JSON.stringify(['Tinta guache', 'Pincéis', 'Esponjas', 'Papel canson', 'Avental']),
        objectives: JSON.stringify(['Desenvolver coordenação motora fina', 'Explorar texturas', 'Estimular criatividade']),
        bnccCodeId: bnccTS02.id,
        classId: turma1.id,
      },
    });
  }

  if (bnccEF01) {
    await prisma.activity.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Contação de Histórias',
        description: 'Roda de contação de histórias com fantoches para desenvolver a linguagem oral e imaginação.',
        duration: 20,
        materials: JSON.stringify(['Livros infantis', 'Fantoches', 'Tapete', 'Almofadas']),
        objectives: JSON.stringify(['Desenvolver linguagem oral', 'Estimular imaginação', 'Promover interação']),
        bnccCodeId: bnccEF01.id,
        classId: turma2.id,
      },
    });
  }

  if (bnccCG02) {
    await prisma.activity.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Circuito Motor',
        description: 'Percurso com obstáculos para trabalhar noções espaciais e coordenação motora ampla.',
        duration: 25,
        materials: JSON.stringify(['Cones', 'Cordas', 'Bambolês', 'Colchonetes', 'Túnel']),
        objectives: JSON.stringify(['Desenvolver coordenação motora ampla', 'Trabalhar noções espaciais', 'Promover autonomia']),
        bnccCodeId: bnccCG02.id,
        classId: turma1.id,
      },
    });
  }

  console.log('✅ Atividades criadas');

  // Criar alunos
  const students: any[] = [
    { name: 'João Pedro', birthDate: new Date('2022-03-15'), responsavel: 'Ana Paula Silva', telefone: '(85) 98765-4321', shift: 'MANHA' as const, classId: turma1.id },
    { name: 'Maria Silva', birthDate: new Date('2022-07-22'), responsavel: 'Carlos Silva', telefone: '(85) 98765-4322', shift: 'TARDE' as const, classId: turma2.id },
    { name: 'Lucas Santos', birthDate: new Date('2023-01-10'), responsavel: 'Fernanda Santos', telefone: '(85) 98765-4323', shift: 'MANHA' as const, classId: turma3.id },
    { name: 'Ana Julia', birthDate: new Date('2022-05-18'), responsavel: 'Roberto Costa', telefone: '(85) 98765-4324', shift: 'MANHA' as const, classId: turma1.id },
    { name: 'Pedro Henrique', birthDate: new Date('2022-09-30'), responsavel: 'Juliana Mendes', telefone: '(85) 98765-4325', shift: 'TARDE' as const, classId: turma2.id },
    { name: 'Sofia Oliveira', birthDate: new Date('2022-04-12'), responsavel: 'Mariana Oliveira', telefone: '(85) 98765-4326', shift: 'MANHA' as const, classId: turma1.id },
    { name: 'Miguel Souza', birthDate: new Date('2022-08-05'), responsavel: 'Ricardo Souza', telefone: '(85) 98765-4327', shift: 'TARDE' as const, classId: turma2.id },
    { name: 'Helena Costa', birthDate: new Date('2023-02-20'), responsavel: 'Paula Costa', telefone: '(85) 98765-4328', shift: 'MANHA' as const, classId: turma3.id },
    { name: 'Davi Alves', birthDate: new Date('2022-06-14'), responsavel: 'Marcos Alves', telefone: '(85) 98765-4329', shift: 'MANHA' as const, classId: turma1.id },
    { name: 'Alice Rocha', birthDate: new Date('2022-11-28'), responsavel: 'Beatriz Rocha', telefone: '(85) 98765-4330', shift: 'TARDE' as const, classId: turma2.id },
    { name: 'Gabriel Lima', birthDate: new Date('2023-03-08'), responsavel: 'Leonardo Lima', telefone: '(85) 98765-4331', shift: 'MANHA' as const, classId: turma3.id },
    { name: 'Laura Martins', birthDate: new Date('2022-02-25'), responsavel: 'Camila Martins', telefone: '(85) 98765-4332', shift: 'MANHA' as const, classId: turma1.id },
    { name: 'Arthur Pereira', birthDate: new Date('2022-10-17'), responsavel: 'Fernando Pereira', telefone: '(85) 98765-4333', shift: 'TARDE' as const, classId: turma2.id },
    { name: 'Valentina Dias', birthDate: new Date('2023-01-30'), responsavel: 'Renata Dias', telefone: '(85) 98765-4334', shift: 'MANHA' as const, classId: turma3.id },
    { name: 'Heitor Gomes', birthDate: new Date('2022-12-05'), responsavel: 'Sandra Gomes', telefone: '(85) 98765-4335', shift: 'TARDE' as const, classId: turma2.id },
  ];

  for (let i = 0; i < students.length; i++) {
    await prisma.student.upsert({
      where: { id: i + 1 },
      update: {},
      create: students[i],
    });
  }

  console.log('✅ Alunos criados');

  // Criar algumas avaliações de exemplo
  if (bnccTS02) {
    await prisma.evaluation.create({
      data: {
        level: 'REALIZOU',
        percentage: 85,
        observations: 'João demonstrou excelente desenvolvimento na atividade, utilizou todas as cores disponíveis.',
        studentId: 1,
        activityId: 1,
        bnccCodeId: bnccTS02.id,
        teacherId: professor1.id,
      },
    });
  }

  if (bnccEF01) {
    await prisma.evaluation.create({
      data: {
        level: 'PARCIALMENTE',
        percentage: 60,
        observations: 'Maria participou da atividade, mas demonstrou timidez ao falar.',
        studentId: 2,
        activityId: 2,
        bnccCodeId: bnccEF01.id,
        teacherId: professor2.id,
      },
    });
  }

  console.log('✅ Avaliações criadas');

  // Criar insights de IA
  await prisma.aIInsight.createMany({
    data: [
      {
        type: 'ATENCAO',
        title: 'Atenção Necessária',
        content: '3 alunos (João Pedro, Maria Silva, Lucas Santos) demonstraram dificuldade em atividades de linguagem esta semana. Recomenda-se reforço com atividades de contação de histórias e jogos de vocabulário.',
        priority: 2,
        studentId: null,
      },
      {
        type: 'SUGESTAO',
        title: 'Sugestão para Amanhã',
        content: 'Com base no progresso atual, sugerimos a atividade "Caixa Sensorial" para trabalhar as habilidades EI02TS01 e EI02CG02, focando no desenvolvimento tátil e coordenação motora.',
        priority: 1,
        studentId: null,
      },
      {
        type: 'MENSAGEM_FAMILIA',
        title: 'Mensagem para Família - João Pedro',
        content: 'João demonstrou grande evolução na coordenação motora fina! Sugerimos continuar com atividades de pintura e desenho em casa. Usar giz de cera grosso ajuda no desenvolvimento da pegada do lápis.',
        priority: 1,
        studentId: 1,
      },
    ],
  });

  console.log('✅ Insights de IA criados');

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📝 Credenciais de acesso:');
  console.log('Admin: admin@edukkare.com / 123456');
  console.log('Prof 1: maria.silva@edukkare.com / 123456');
  console.log('Prof 2: joao.santos@edukkare.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


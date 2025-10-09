import * as XLSX from 'xlsx';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ExcelRow {
  'BANCO DE ATIVIDADES BNCC - CRIANÇAS BEM PEQUENAS (1a7m a 3a11m)': string | number;
  __EMPTY?: string;
  __EMPTY_1?: string;
  __EMPTY_2?: string;
  __EMPTY_3?: string;
  __EMPTY_4?: string;
  __EMPTY_5?: string;
  __EMPTY_6?: string;
  __EMPTY_7?: string;
}

interface ActivityData {
  id: number;
  atividade: string;
  campoExperiencia: string;
  codigosBNCC: string;
  faixaEtaria: string;
  etapaEnsino: string;
  direitos: string;
  descricao: string;
  recursos: string;
}

async function importBNCC() {
  try {
    console.log('📚 Iniciando importação de dados BNCC...\n');

    // Lê o arquivo Excel
    const filePath = path.join(__dirname, '../../Banco_Atividades_BNCC.xlsx');
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

    // Pula as 2 primeiras linhas (título e cabeçalho)
    const activities: ActivityData[] = rawData.slice(2).map(row => ({
      id: Number(row['BANCO DE ATIVIDADES BNCC - CRIANÇAS BEM PEQUENAS (1a7m a 3a11m)']),
      atividade: row.__EMPTY || '',
      campoExperiencia: row.__EMPTY_1 || '',
      codigosBNCC: row.__EMPTY_2 || '',
      faixaEtaria: row.__EMPTY_3 || '',
      etapaEnsino: row.__EMPTY_4 || '',
      direitos: row.__EMPTY_5 || '',
      descricao: row.__EMPTY_6 || '',
      recursos: row.__EMPTY_7 || ''
    })).filter(act => act.atividade); // Filtra linhas vazias

    console.log(`✅ ${activities.length} atividades encontradas\n`);

    // Coleta todos os códigos BNCC únicos
    const bnccCodesSet = new Set<string>();
    activities.forEach(act => {
      const codes = act.codigosBNCC.split(';').map(c => c.trim());
      codes.forEach(code => {
        if (code) bnccCodesSet.add(code);
      });
    });

    console.log(`📋 ${bnccCodesSet.size} códigos BNCC únicos encontrados\n`);

    // Insere ou atualiza códigos BNCC
    console.log('🔄 Inserindo códigos BNCC...');
    for (const code of Array.from(bnccCodesSet)) {
      // Encontra uma atividade que usa este código para pegar os dados
      const actWithCode = activities.find(act => act.codigosBNCC.includes(code));
      if (!actWithCode) continue;

      await prisma.bNCCCode.upsert({
        where: { code },
        update: {},
        create: {
          code,
          name: actWithCode.atividade.substring(0, 100), // Usa nome da atividade como referência
          description: actWithCode.descricao || `Código BNCC ${code}`,
          field: actWithCode.campoExperiencia || 'Campo de Experiência',
          age_group: actWithCode.faixaEtaria || '1a7m - 3a11m'
        }
      });
      console.log(`  ✓ ${code}`);
    }

    console.log('\n✅ Códigos BNCC inseridos com sucesso!\n');

    // Busca uma turma para associar as atividades
    const turma = await prisma.class.findFirst();
    if (!turma) {
      console.error('❌ Nenhuma turma encontrada. Execute o seed principal primeiro.');
      return;
    }

    // Insere atividades
    console.log('🔄 Inserindo atividades...');
    for (const act of activities) {
      const primaryCode = act.codigosBNCC.split(';')[0].trim();
      const bnccCode = await prisma.bNCCCode.findUnique({ where: { code: primaryCode } });

      if (!bnccCode) {
        console.log(`  ⚠️  Pulando atividade "${act.atividade}" - código BNCC não encontrado`);
        continue;
      }

      // Extrai duração estimada ou usa padrão
      const duration = 30; // minutos padrão

      // Converte recursos em array JSON
      const materials = act.recursos 
        ? JSON.stringify(act.recursos.split(',').map(r => r.trim()))
        : JSON.stringify([]);

      // Converte direitos em objetivos
      const objectives = act.direitos
        ? JSON.stringify(act.direitos.split(';').map(d => d.trim()))
        : JSON.stringify(['Desenvolver habilidades conforme BNCC']);

      await prisma.activity.upsert({
        where: { id: act.id },
        update: {},
        create: {
          id: act.id,
          title: act.atividade,
          description: act.descricao || `Atividade baseada no código BNCC ${primaryCode}`,
          duration,
          materials,
          objectives,
          bnccCodeId: bnccCode.id,
          classId: turma.id
        }
      });

      console.log(`  ✓ ${act.id}. ${act.atividade}`);
    }

    console.log(`\n✅ ${activities.length} atividades inseridas com sucesso!`);
    console.log('\n🎉 Importação concluída!\n');

  } catch (error) {
    console.error('❌ Erro durante importação:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executa a importação
importBNCC()
  .then(() => {
    console.log('✨ Processo finalizado com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });




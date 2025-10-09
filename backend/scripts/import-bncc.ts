import * as XLSX from 'xlsx';
import * as path from 'path';

// Lê o arquivo Excel
const filePath = path.join(__dirname, '../../Banco_Atividades_BNCC.xlsx');
console.log('📚 Lendo arquivo:', filePath);

try {
  const workbook = XLSX.readFile(filePath);
  console.log('\n📄 Planilhas encontradas:', workbook.SheetNames);

  // Pega a primeira planilha
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Converte para JSON
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`\n✅ Total de registros: ${data.length}`);
  
  if (data.length > 0) {
    const firstRecord = data[0] as Record<string, any>;
    console.log('\n📋 Estrutura do primeiro registro:');
    console.log(JSON.stringify(firstRecord, null, 2));
    
    console.log('\n📋 Colunas disponíveis:');
    console.log(Object.keys(firstRecord));
    
    console.log('\n📋 Primeiros 5 registros:');
    data.slice(0, 5).forEach((row: any, index: number) => {
      console.log(`\n--- Registro ${index + 1} ---`);
      console.log(JSON.stringify(row, null, 2));
    });
  }
} catch (error) {
  console.error('❌ Erro ao ler arquivo:', error);
}


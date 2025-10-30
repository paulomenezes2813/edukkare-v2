import fs from 'fs';
import path from 'path';

export const ensureUploadDirectories = () => {
  const uploadDirs = [
    'uploads',
    'uploads/fotos',
    'uploads/audios',
    'uploads/videos'
  ];

  uploadDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Diretório criado: ${dir}`);
    }
  });
};


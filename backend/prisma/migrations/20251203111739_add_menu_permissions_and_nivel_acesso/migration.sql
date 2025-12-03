-- CreateEnum
CREATE TYPE "NivelAcesso" AS ENUM ('ESTRATEGICO', 'OPERACIONAL', 'PEDAGOGICO', 'NUCLEO_FAMILIAR', 'PROFISSIONAIS_EXTERNOS');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nivelAcesso" "NivelAcesso" NOT NULL DEFAULT 'PEDAGOGICO';

-- CreateTable
CREATE TABLE "menu_permissions" (
    "id" SERIAL NOT NULL,
    "menuItem" TEXT NOT NULL,
    "menuLabel" TEXT NOT NULL,
    "parentItem" TEXT,
    "nivelAcesso" "NivelAcesso" NOT NULL,
    "order" INTEGER NOT NULL,
    "icon" TEXT,
    "screen" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menu_permissions_menuItem_nivelAcesso_key" ON "menu_permissions"("menuItem", "nivelAcesso");

-- Insert default menu permissions for ESTRATEGICO level
INSERT INTO "menu_permissions" ("menuItem", "menuLabel", "parentItem", "nivelAcesso", "order", "icon", "screen", "active", "createdAt", "updatedAt") VALUES
('home', 'Início', NULL, 'ESTRATEGICO', 1, '🏠', 'home', true, NOW(), NOW()),
('gestor', 'Gestor', NULL, 'ESTRATEGICO', 2, '📊', NULL, true, NOW(), NOW()),
('gestor.dashboard', 'Dashboard', 'gestor', 'ESTRATEGICO', 1, '📈', 'dashboard', true, NOW(), NOW()),
('gestor.monitoring', 'Monitoramento', 'gestor', 'ESTRATEGICO', 2, '👁️', 'monitoring', true, NOW(), NOW()),
('gestor.pedagogical', 'Dashboard Pedagógico', 'gestor', 'ESTRATEGICO', 3, '🎓', 'pedagogicalDashboard', true, NOW(), NOW()),
('gestor.integrated', 'Gestão Integrada', 'gestor', 'ESTRATEGICO', 4, '🤝', 'integratedManagement', true, NOW(), NOW()),
('students', 'Alunos', NULL, 'ESTRATEGICO', 3, '👶', 'students', true, NOW(), NOW()),
('teachers', 'Professores', NULL, 'ESTRATEGICO', 4, '👩‍🏫', 'teachers', true, NOW(), NOW()),
('training', 'Treinamento', NULL, 'ESTRATEGICO', 5, '🎓', 'training', true, NOW(), NOW()),
('users', 'Usuários', NULL, 'ESTRATEGICO', 6, '👥', 'users', true, NOW(), NOW()),
('schools', 'Escolas', NULL, 'ESTRATEGICO', 7, '🏫', 'schools', true, NOW(), NOW()),
('activities', 'Atividades', NULL, 'ESTRATEGICO', 8, '📝', 'activities', true, NOW(), NOW()),
('activities.rubrics', 'Gerenciar Rubricas', 'activities', 'ESTRATEGICO', 1, '📊', 'rubrics', true, NOW(), NOW()),
('classes', 'Turmas', NULL, 'ESTRATEGICO', 9, '🎓', 'classes', true, NOW(), NOW()),
('avatars', 'Avatares', NULL, 'ESTRATEGICO', 10, '🎭', 'avatars', true, NOW(), NOW()),
('administracao', 'Administração', NULL, 'ESTRATEGICO', 11, '⚙️', NULL, true, NOW(), NOW()),
('administracao.notes', 'Notas', 'administracao', 'ESTRATEGICO', 1, '📝', 'notes', true, NOW(), NOW()),
('relatorios', 'Relatórios', NULL, 'ESTRATEGICO', 12, '📊', NULL, true, NOW(), NOW()),
('relatorios.notes', 'Relatório das Notas', 'relatorios', 'ESTRATEGICO', 1, '📄', 'notesReport', true, NOW(), NOW()),
('configuracao', 'Configuração', NULL, 'ESTRATEGICO', 13, '🔧', NULL, true, NOW(), NOW()),
('configuracao.access', 'Acessos', 'configuracao', 'ESTRATEGICO', 1, '🔐', 'access', true, NOW(), NOW()),
('configuracao.menuAccess', 'Controle de Menus', 'configuracao', 'ESTRATEGICO', 2, '🎯', 'menuAccess', true, NOW(), NOW()),
('help', 'Ajuda', NULL, 'ESTRATEGICO', 14, '❓', 'training', true, NOW(), NOW());

-- Insert default menu permissions for OPERACIONAL level
INSERT INTO "menu_permissions" ("menuItem", "menuLabel", "parentItem", "nivelAcesso", "order", "icon", "screen", "active", "createdAt", "updatedAt") VALUES
('home', 'Início', NULL, 'OPERACIONAL', 1, '🏠', 'home', true, NOW(), NOW()),
('gestor', 'Gestor', NULL, 'OPERACIONAL', 2, '📊', NULL, true, NOW(), NOW()),
('gestor.dashboard', 'Dashboard', 'gestor', 'OPERACIONAL', 1, '📈', 'dashboard', true, NOW(), NOW()),
('gestor.monitoring', 'Monitoramento', 'gestor', 'OPERACIONAL', 2, '👁️', 'monitoring', true, NOW(), NOW()),
('students', 'Alunos', NULL, 'OPERACIONAL', 3, '👶', 'students', true, NOW(), NOW()),
('teachers', 'Professores', NULL, 'OPERACIONAL', 4, '👩‍🏫', 'teachers', true, NOW(), NOW()),
('training', 'Treinamento', NULL, 'OPERACIONAL', 5, '🎓', 'training', true, NOW(), NOW()),
('schools', 'Escolas', NULL, 'OPERACIONAL', 6, '🏫', 'schools', true, NOW(), NOW()),
('activities', 'Atividades', NULL, 'OPERACIONAL', 7, '📝', 'activities', true, NOW(), NOW()),
('classes', 'Turmas', NULL, 'OPERACIONAL', 8, '🎓', 'classes', true, NOW(), NOW()),
('administracao', 'Administração', NULL, 'OPERACIONAL', 9, '⚙️', NULL, true, NOW(), NOW()),
('administracao.notes', 'Notas', 'administracao', 'OPERACIONAL', 1, '📝', 'notes', true, NOW(), NOW()),
('relatorios', 'Relatórios', NULL, 'OPERACIONAL', 10, '📊', NULL, true, NOW(), NOW()),
('relatorios.notes', 'Relatório das Notas', 'relatorios', 'OPERACIONAL', 1, '📄', 'notesReport', true, NOW(), NOW()),
('help', 'Ajuda', NULL, 'OPERACIONAL', 11, '❓', 'training', true, NOW(), NOW()),
('configuracao', 'Configuração', NULL, 'OPERACIONAL', 12, '🔧', NULL, true, NOW(), NOW()),
('configuracao.access', 'Acessos', 'configuracao', 'OPERACIONAL', 1, '🔐', 'access', true, NOW(), NOW()),
('configuracao.menuAccess', 'Controle de Menus', 'configuracao', 'OPERACIONAL', 2, '🎯', 'menuAccess', true, NOW(), NOW());

-- Insert default menu permissions for PEDAGOGICO level
INSERT INTO "menu_permissions" ("menuItem", "menuLabel", "parentItem", "nivelAcesso", "order", "icon", "screen", "active", "createdAt", "updatedAt") VALUES
('home', 'Início', NULL, 'PEDAGOGICO', 1, '🏠', 'home', true, NOW(), NOW()),
('students', 'Alunos', NULL, 'PEDAGOGICO', 2, '👶', 'students', true, NOW(), NOW()),
('training', 'Treinamento', NULL, 'PEDAGOGICO', 3, '🎓', 'training', true, NOW(), NOW()),
('activities', 'Atividades', NULL, 'PEDAGOGICO', 4, '📝', 'activities', true, NOW(), NOW()),
('activities.rubrics', 'Gerenciar Rubricas', 'activities', 'PEDAGOGICO', 1, '📊', 'rubrics', true, NOW(), NOW()),
('classes', 'Turmas', NULL, 'PEDAGOGICO', 5, '🎓', 'classes', true, NOW(), NOW()),
('administracao', 'Administração', NULL, 'PEDAGOGICO', 6, '⚙️', NULL, true, NOW(), NOW()),
('administracao.notes', 'Notas', 'administracao', 'PEDAGOGICO', 1, '📝', 'notes', true, NOW(), NOW()),
('help', 'Ajuda', NULL, 'PEDAGOGICO', 7, '❓', 'training', true, NOW(), NOW()),
('configuracao', 'Configuração', NULL, 'PEDAGOGICO', 8, '🔧', NULL, true, NOW(), NOW()),
('configuracao.access', 'Acessos', 'configuracao', 'PEDAGOGICO', 1, '🔐', 'access', true, NOW(), NOW()),
('configuracao.menuAccess', 'Controle de Menus', 'configuracao', 'PEDAGOGICO', 2, '🎯', 'menuAccess', true, NOW(), NOW());

-- Insert default menu permissions for NUCLEO_FAMILIAR level
INSERT INTO "menu_permissions" ("menuItem", "menuLabel", "parentItem", "nivelAcesso", "order", "icon", "screen", "active", "createdAt", "updatedAt") VALUES
('home', 'Início', NULL, 'NUCLEO_FAMILIAR', 1, '🏠', 'home', true, NOW(), NOW()),
('students', 'Alunos', NULL, 'NUCLEO_FAMILIAR', 2, '👶', 'students', true, NOW(), NOW()),
('help', 'Ajuda', NULL, 'NUCLEO_FAMILIAR', 3, '❓', 'training', true, NOW(), NOW());

-- Insert default menu permissions for PROFISSIONAIS_EXTERNOS level
INSERT INTO "menu_permissions" ("menuItem", "menuLabel", "parentItem", "nivelAcesso", "order", "icon", "screen", "active", "createdAt", "updatedAt") VALUES
('home', 'Início', NULL, 'PROFISSIONAIS_EXTERNOS', 1, '🏠', 'home', true, NOW(), NOW()),
('students', 'Alunos', NULL, 'PROFISSIONAIS_EXTERNOS', 2, '👶', 'students', true, NOW(), NOW()),
('help', 'Ajuda', NULL, 'PROFISSIONAIS_EXTERNOS', 3, '❓', 'training', true, NOW(), NOW());

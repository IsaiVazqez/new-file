#!/bin/bash
# ============================================================
# NewFile Studio — Script de Testing E2E Automatizado
# ============================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD}║   NewFile Studio — Testing E2E Automatizado     ║${NC}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# --- Step 0: Check Node version ---
echo -e "${YELLOW}[1/6]${NC} Verificando Node.js..."
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//' | cut -d. -f1)
if [ -z "$NODE_VERSION" ] || [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}  ✗ Se necesita Node.js 20+. Tienes: $(node -v 2>/dev/null || echo 'no instalado')${NC}"
  echo -e "${YELLOW}  Ejecuta: nvm use 20${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓ Node.js $(node -v)${NC}"

# --- Step 1: Clean database ---
echo -e "${YELLOW}[2/6]${NC} Limpiando base de datos..."
rm -f data.db data.db-wal data.db-shm
rm -rf uploads/
echo -e "${GREEN}  ✓ BD y uploads eliminados${NC}"

# --- Step 2: Check .env ---
echo -e "${YELLOW}[3/6]${NC} Verificando .env..."
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i '' 's/your-super-secret-key-change-this/test-secret-key/' .env 2>/dev/null || true
  sed -i '' 's/your-refresh-secret-key-change-this/test-refresh-key/' .env 2>/dev/null || true
  sed -i '' 's/change-this-password/admin123/' .env 2>/dev/null || true
  echo -e "${GREEN}  ✓ .env creado${NC}"
else
  echo -e "${GREEN}  ✓ .env existe${NC}"
fi

# --- Step 3: Install dependencies ---
echo -e "${YELLOW}[4/6]${NC} Verificando dependencias..."
if [ ! -d node_modules ]; then
  echo -e "  → Instalando npm packages..."
  npm install 2>&1 | tail -1
fi
echo -e "${GREEN}  ✓ Dependencias listas${NC}"

# --- Step 4: Install Playwright browsers ---
echo -e "${YELLOW}[5/6]${NC} Verificando Playwright..."
if [ ! -d "$HOME/Library/Caches/ms-playwright/chromium-"* ] 2>/dev/null; then
  echo -e "  → Descargando Chromium (primera vez, ~165MB)..."
  npx playwright install chromium 2>&1 | grep -E "(downloaded|already)" || true
fi
echo -e "${GREEN}  ✓ Playwright listo${NC}"

# --- Step 5: Run tests ---
echo ""
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  El navegador se abrirá automáticamente.${NC}"
echo -e "${CYAN}  Cada acción tiene un delay de 500ms para que veas todo.${NC}"
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════${NC}"
echo ""

npx playwright test --headed --reporter=list 2>&1
TEST_EXIT=$?

# --- Step 6: Results ---
echo ""
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════${NC}"
if [ $TEST_EXIT -eq 0 ]; then
  echo -e "${GREEN}${BOLD}  ✅ TODOS LOS TESTS PASARON${NC}"
else
  echo -e "${RED}${BOLD}  ❌ ALGUNOS TESTS FALLARON (ver reporte abajo)${NC}"
fi
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}[6/6]${NC} Abriendo reporte HTML..."
npx playwright show-report 2>/dev/null

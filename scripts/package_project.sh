#!/bin/bash
# Empaqueta el proyecto completo para descarga
set -e

PROJECT_DIR="/home/z/my-project"
OUTPUT="/home/z/my-project/download/modelo-valor-mcda.zip"

cd "$PROJECT_DIR"

echo "=== Empaquetando proyecto para descarga ==="

# Eliminar zip anterior
rm -f "$OUTPUT"

# Copiar Excel de referencia al directorio data
cp "/home/z/my-project/upload/Modelo de valor degeneración macular asociada a la edad.xlsm" "$PROJECT_DIR/data/Excel-original-referencia.xlsm" 2>/dev/null || true

# Crear zip
zip -r "$OUTPUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".zscripts/*" \
  -x "tool-results/*" \
  -x "dev.log" \
  -x "server.log" \
  -x "data/app_state.json" \
  -x "data/raw-*.png" \
  -x "data/inspect-*.png" \
  -x "download/*" \
  -x "skills/*" \
  -x "examples/*" \
  -x "db/*" \
  -x "mini-services/*" \
  -x "upload/*" \
  -x ".env" \
  2>&1 | tail -3

echo ""
echo "=== Archivo creado ==="
ls -lh "$OUTPUT"
echo ""
echo "=== Resumen del contenido ==="
unzip -l "$OUTPUT" | tail -1
echo ""
echo "=== Carpetas principales ==="
unzip -l "$OUTPUT" | grep -E "^\s+\d+.*/$" | head -20

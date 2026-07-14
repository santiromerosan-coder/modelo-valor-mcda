# Modelo de Valor MCDA — Degeneración Macular Asociada a la Edad

Plataforma web ejecutiva para el análisis multicriterio (MCDA) de medicamentos anti-VEGF en degeneración macular asociada a la edad (AMD). Convierte el modelo de Excel en una aplicación web interactiva con fórmulas automatizadas, clics en el diagrama que navegan a definiciones, y edición de costos en tiempo real.

---

## 📋 Requisitos previos

Antes de instalar, necesitas tener:

1. **Node.js 18+** (recomendado 20+) — https://nodejs.org/
2. **Bun** (gestor de paquetes) — https://bun.sh/
   ```bash
   # Instalar bun (Linux/Mac)
   curl -fsSL https://bun.sh/install | bash
   # En Windows: powershell -c "irm bun.sh/install.ps1 | iex"
   ```

---

## 🚀 Instalación

1. **Descomprimir el archivo ZIP**
   ```bash
   unzip modelo-valor-mcda.zip -d modelo-valor-mcda
   cd modelo-valor-mcda
   ```

2. **Instalar dependencias**
   ```bash
   bun install
   ```

3. **Inicializar la base de datos** (solo la primera vez)
   ```bash
   bun run db:push
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   bun run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

---

## 📦 Para producción (deploy)

Si van a subirlo a un servidor real (Vercel, Netlify, servidor propio):

```bash
# Construir la versión de producción
bun run build

# Iniciar el servidor de producción
bun run start
```

Para deploy en **Vercel** (recomendado):
1. Crear cuenta en https://vercel.com
2. Subir el proyecto a un repositorio de GitHub
3. Conectar el repositorio con Vercel
4. Vercel detecta automáticamente Next.js y hace el deploy

---

## 🗂️ Estructura del proyecto

```
modelo-valor-mcda/
├── src/
│   ├── app/
│   │   ├── api/data/              # API REST del backend
│   │   │   ├── route.ts           # GET /api/data (todos los datos)
│   │   │   ├── costs/route.ts     # PUT /api/data/costs (editar costos)
│   │   │   ├── discount/route.ts  # PUT /api/data/discount (editar descuento)
│   │   │   └── reset/route.ts     # POST /api/data/reset (restablecer)
│   │   ├── globals.css            # Estilos globales (paleta azul/verde/blanco)
│   │   ├── layout.tsx             # Layout raíz con fuentes
│   │   └── page.tsx               # Página principal
│   ├── components/
│   │   ├── layout/Sidebar.tsx     # Panel izquierdo con navegación
│   │   ├── common/ui.tsx          # Componentes reutilizables
│   │   └── views/
│   │       ├── ModeloDeValor.tsx       # Hub central + diagrama de óvalos
│   │       ├── ValorRadialDiagram.tsx  # Diagrama de óvalos (SVG)
│   │       ├── Negociacion.tsx         # Vista de descuento
│   │       ├── Definiciones.tsx        # Tabla de definiciones
│   │       ├── McdaDashboard.tsx       # Dashboard avanzado
│   │       ├── Resumen.tsx             # Tabla comparativa
│   │       ├── InputCostos.tsx         # Tabla de costos editable
│   │       └── Referencias.tsx         # Bibliografía
│   └── lib/
│       ├── types.ts              # Tipos TypeScript
│       ├── calculator.ts         # Motor de cálculo (réplica de fórmulas del Excel)
│       ├── server-store.ts       # Store del servidor (persistencia JSON)
│       └── store.ts              # Store Zustand del frontend
├── public/
│   ├── logo-axonpharma.png       # Logo Axon Pharma (transparente)
│   └── logo-lucentis.png         # Logo Lucentis (transparente)
├── data/
│   └── seed_data.json            # Datos extraídos del Excel (8 moléculas, costos, etc.)
├── scripts/
│   ├── extract_seed_data.py      # Script para extraer datos del Excel original
│   ├── extract_new_seed.py       # Script para extraer datos del nuevo Excel
│   ├── convert_logos.py          # Convertir logos PDF a PNG
│   └── process_logos.py          # Qitar fondo a logos
├── prisma/
│   └── schema.prisma             # Esquema de base de datos
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

---

## ✨ Funcionalidades

### Vistas de la presentación (6 visibles + 1 oculta)

1. **Modelo de valor** (Hub central)
   - Diagrama de óvalos interactivo con degradados
   - 4 dominios (Eficacia, Seguridad, PROs, Posicionamiento) en columna izquierda
   - 10 criterios en círculo alrededor de "Valor"
   - **Clic en cualquier criterio → navega a su definición**
   - Tabla de moléculas con checkboxes
   - Botones de navegación estilo Excel

2. **Negociación** (oculta, accesible vía flecha desplegable bajo "Modelo de valor")
   - Editor de descuento con barra de progreso verde
   - Muestra moléculas afectadas (LP-RAN) con ahorro calculado

3. **Definiciones**
   - Tabla con 10 criterios en 4 dominios
   - Resalta el criterio seleccionado desde el diagrama
   - Scroll automático a la fila seleccionada

4. **Dashboard**
   - Puntaje global de la molécula seleccionada
   - Donut chart de distribución por dominio
   - Panel económico completo
   - Tabla detallada con pesos, valores y dots 1-5

5. **Resumen**
   - Tabla comparativa de las 8 moléculas
   - Ordenamiento por cualquier columna
   - Identificación de moléculas ganadoras

6. **Costos**
   - 3 columnas editables (N° inyecciones, Precio por vial, Costo/visita admin)
   - 3 columnas automáticas con fórmulas:
     - Costo inyecciones = N° × Precio
     - Costo admin = N° × Costo/visita
     - Costo anual = Inyecciones + Admin
   - Descuento automático para LP-RAN

7. **Referencias**
   - Bibliografía por molécula y dominio

### Fórmulas automatizadas (réplica del Excel)

- `Puntaje ponderado = Peso × (Valor / 5)`
- `% del dominio = Σ(Puntaje) / Σ(Peso) × 100`
- `Total global = Σ(Puntajes ponderados)`
- `Costo inyecciones = N° inyecciones × Precio × (1 − Descuento)` (LP-RAN)
- `Costo admin = N° inyecciones × Costo/visita`
- `Costo total = Costo inyecciones + Costo admin`
- `Costo por beneficio = Costo total / Total global`

---

## 🔄 Actualizar datos desde un nuevo Excel

Si la empresa actualiza el Excel, pueden regenerar los datos:

1. Colocar el nuevo Excel en `upload/`
2. Ejecutar el script de extracción:
   ```bash
   python3 scripts/extract_new_seed.py
   ```
3. Esto genera `data/new_seed_data.json`
4. Reemplazar el seed:
   ```bash
   cp data/new_seed_data.json data/seed_data.json
   ```
5. Eliminar el estado guardado para forzar recarga:
   ```bash
   rm -f data/app_state.json
   ```
6. Reiniciar el servidor

---

## 🎨 Personalización

### Cambiar colores
Editar `src/app/globals.css` en la sección `:root`:
- `--primary`: Azul corporativo
- `--secondary`: Verde claro
- `--accent`: Color de acento

### Cambiar logos
Reemplazar los archivos en `public/`:
- `logo-axonpharma.png`
- `logo-lucentis.png`

### Cambiar moléculas o criterios
Editar `data/seed_data.json` directamente o regenerar desde Excel.

---

## 🛠️ Tecnologías

- **Next.js 16** con App Router
- **TypeScript 5**
- **Tailwind CSS 4** con shadcn/ui
- **Recharts** para gráficos
- **Zustand** para estado global
- **Prisma ORM** con SQLite
- **Python** para scripts de extracción de Excel (openpyxl, PyMuPDF, PIL)

---

## 📞 Soporte

Si tienen preguntas técnicas sobre el proyecto, revisar:
- `data/seed_data.json` — datos del modelo
- `src/lib/calculator.ts` — fórmulas del Excel
- `src/components/views/` — todas las vistas

---

*Modelo de Valor MCDA v5.0 — Basado en Excel "Modelo de valor degeneración macular asociada a la edad.xlsm"*

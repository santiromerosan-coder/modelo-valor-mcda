"""
Procesa los logos PDF para:
1. Axon Pharma: extraer solo la sección principal del logo y quitar el fondo blanco
2. Lucentis: quitar el fondo blanco dejando el logo transparente

Usa PIL para procesamiento de imágenes (fondos sólidos blancos).
"""
import fitz
from PIL import Image, ImageChops
import numpy as np
import os

# ============================================================
# 1. Renderizar PDFs a alta resolución
# ============================================================
def render_pdf_to_png(pdf_path, out_path, zoom=4):
    doc = fitz.open(pdf_path)
    page = doc[0]
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=True)
    pix.save(out_path)
    doc.close()
    return out_path

print('=== Renderizando PDFs ===')
axon_raw = render_pdf_to_png(
    '/home/z/my-project/upload/LOGO_AXONPHARMA.pdf',
    '/home/z/my-project/data/raw-axonpharma.png',
    zoom=3
)
lucentis_raw = render_pdf_to_png(
    '/home/z/my-project/upload/Logo Lucentis.pdf',
    '/home/z/my-project/data/raw-lucentis.png',
    zoom=4
)
print(f'  Axon raw: {axon_raw}')
print(f'  Lucentis raw: {lucentis_raw}')

# ============================================================
# 2. Procesar Axon Pharma — el PDF tiene 4 secciones, tomar la principal
# ============================================================
print('\n=== Procesando Axon Pharma ===')
img = Image.open(axon_raw).convert('RGBA')
print(f'  Tamaño original: {img.size}')

# El PDF de Axon (1920x1080) tiene 4 cuadrantes con el logo en diferentes fondos.
# Vamos a tomar el primer cuadrante (arriba-izquierda) que es el logo sobre fondo blanco.
w, h = img.size
# Cuadrante superior-izquierdo
axon_crop = img.crop((0, 0, w // 2, h // 2))
print(f'  Después de recorte: {axon_crop.size}')

# Quitar el fondo blanco del recorte (hacer transparente lo que es casi blanco)
arr = np.array(axon_crop)
# Crear máscara: píxeles que son casi blancos (R>240, G>240, B>240)
mask_white = (arr[:, :, 0] > 240) & (arr[:, :, 1] > 240) & (arr[:, :, 2] > 240)
# También quitar píxeles casi negros del borde si los hay
# Crear array con alpha
arr_alpha = arr.copy()
arr_alpha[:, :, 3] = np.where(mask_white, 0, 255)
# Suavizar bordes: píxeles semi-blancos parcialmente transparentes
semi_white = (arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220) & (~mask_white)
arr_alpha[semi_white, 3] = 128

axon_processed = Image.fromarray(arr_alpha, 'RGBA')

# Recortar al contenido (quitar espacios transparentes)
# Encontrar bounding box del contenido no transparente
bbox = axon_processed.getbbox()
if bbox:
    # Agregar padding de 20px
    pad = 20
    bbox = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(axon_processed.width, bbox[2] + pad),
        min(axon_processed.height, bbox[3] + pad),
    )
    axon_final = axon_processed.crop(bbox)
else:
    axon_final = axon_processed

print(f'  Tamaño final: {axon_final.size}')
axon_out = '/home/z/my-project/public/logo-axonpharma.png'
axon_final.save(axon_out, 'PNG', optimize=True)
print(f'  Guardado: {axon_out}')

# ============================================================
# 3. Procesar Lucentis — quitar fondo blanco
# ============================================================
print('\n=== Procesando Lucentis ===')
img = Image.open(lucentis_raw).convert('RGBA')
print(f'  Tamaño original: {img.size}')

arr = np.array(img)
# Quitar fondo blanco
mask_white = (arr[:, :, 0] > 240) & (arr[:, :, 1] > 240) & (arr[:, :, 2] > 240)
arr_alpha = arr.copy()
arr_alpha[:, :, 3] = np.where(mask_white, 0, 255)
# Suavizar
semi_white = (arr[:, :, 0] > 220) & (arr[:, :, 1] > 220) & (arr[:, :, 2] > 220) & (~mask_white)
arr_alpha[semi_white, 3] = 128

lucentis_processed = Image.fromarray(arr_alpha, 'RGBA')

# Recortar al contenido
bbox = lucentis_processed.getbbox()
if bbox:
    pad = 20
    bbox = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(lucentis_processed.width, bbox[2] + pad),
        min(lucentis_processed.height, bbox[3] + pad),
    )
    lucentis_final = lucentis_processed.crop(bbox)
else:
    lucentis_final = lucentis_processed

print(f'  Tamaño final: {lucentis_final.size}')
lucentis_out = '/home/z/my-project/public/logo-lucentis.png'
lucentis_final.save(lucentis_out, 'PNG', optimize=True)
print(f'  Guardado: {lucentis_out}')

print('\n=== Resumen ===')
print(f'  Axon Pharma: {os.path.getsize(axon_out):,} bytes')
print(f'  Lucentis: {os.path.getsize(lucentis_out):,} bytes')
print('¡Logos procesados con fondo transparente!')

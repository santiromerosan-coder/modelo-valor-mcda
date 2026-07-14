"""
Convert PDF logos to high-quality PNG images.
"""
import fitz  # PyMuPDF
import os

LOGOS = [
    {
        'pdf': '/home/z/my-project/upload/LOGO_AXONPHARMA.pdf',
        'out': '/home/z/my-project/public/logo-axonpharma.png',
        'name': 'Axon Pharma',
    },
    {
        'pdf': '/home/z/my-project/upload/Logo Lucentis.pdf',
        'out': '/home/z/my-project/public/logo-lucentis.png',
        'name': 'Lucentis',
    },
]

for logo in LOGOS:
    print(f'Convirtiendo {logo["name"]}...')
    doc = fitz.open(logo['pdf'])
    page = doc[0]  # primera página
    
    # Renderizar a alta resolución (zoom 4x para calidad)
    mat = fitz.Matrix(4, 4)
    pix = page.get_pixmap(matrix=mat, alpha=True)
    
    # Guardar como PNG
    pix.save(logo['out'])
    print(f'  ✓ Guardado: {logo["out"]}')
    print(f'    Tamaño: {pix.width} x {pix.height} px')
    print(f'    Archivo: {os.path.getsize(logo["out"]):,} bytes')
    doc.close()

print('\n¡Logos convertidos exitosamente!')

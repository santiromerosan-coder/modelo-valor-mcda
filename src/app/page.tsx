'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { ModeloDeValor } from '@/components/views/ModeloDeValor';
import { Negociacion } from '@/components/views/Negociacion';
import { Definiciones } from '@/components/views/Definiciones';
import { McdaDashboard } from '@/components/views/McdaDashboard';
import { Resumen } from '@/components/views/Resumen';
import { InputCostos } from '@/components/views/InputCostos';
import { Referencias } from '@/components/views/Referencias';
import { Loader2, AlertCircle, Activity } from 'lucide-react';

const VIEW_LABELS: Record<string, string> = {
  'modelo-valor': 'Modelo de valor',
  'negociacion': 'Negociación',
  'definiciones': 'Definiciones',
  'mcda-dashboard': 'Dashboard',
  'resumen': 'Resumen',
  'input-costos': 'Costos',
  'referencias': 'Referencias',
};

export default function Home() {
  const activeView = useAppStore((s) => s.activeView);
  const data = useAppStore((s) => s.data);
  const loading = useAppStore((s) => s.loading);
  const error = useAppStore((s) => s.error);
  const fetchData = useAppStore((s) => s.fetchData);

  useEffect(() => {
    if (!data && !loading) {
      fetchData();
    }
  }, [data, loading, fetchData]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        {/* Top bar — minimalista */}
        <header className="sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border">
          <div className="px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[12px]">
                <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} />
                <span className="font-semibold text-foreground">Modelo de Valor</span>
                <span className="text-muted-foreground/40">/</span>
                <span className="text-muted-foreground">{VIEW_LABELS[activeView]}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              {loading && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Actualizando
                </span>
              )}
              {error && (
                <span className="flex items-center gap-1.5 text-destructive">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </span>
              )}
              {data && !loading && !error && (
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span>{data.molecules.length} moléculas</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>Desc. {((data.meta.discount ?? 0) * 100).toFixed(0)}%</span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="font-mono">v5.0</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View content */}
        <div className="flex-1 px-8 py-8 max-w-[1600px] mx-auto w-full">
          {!data && loading && (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <span className="ml-3 text-[13px] text-muted-foreground">
                Cargando datos del modelo...
              </span>
            </div>
          )}

          {!data && error && (
            <div className="flex flex-col items-center justify-center py-32">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="mt-4 text-[13px] text-muted-foreground">
                Error al cargar: {error}
              </p>
              <button
                onClick={() => fetchData()}
                className="mt-4 px-4 py-2 text-[13px] bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {data && (
            <>
              {activeView === 'modelo-valor' && <ModeloDeValor />}
              {activeView === 'negociacion' && <Negociacion />}
              {activeView === 'definiciones' && <Definiciones />}
              {activeView === 'mcda-dashboard' && <McdaDashboard />}
              {activeView === 'resumen' && <Resumen />}
              {activeView === 'input-costos' && <InputCostos />}
              {activeView === 'referencias' && <Referencias />}
            </>
          )}
        </div>

        {/* Footer con logos de empresas integrados */}
        <footer className="border-t border-border mt-8 py-6 px-8">
          <div className="flex items-center justify-between gap-8">
            {/* Logo Axon Pharma — izquierda */}
            <div className="flex items-center shrink-0 py-1">
              <img
                src="/logo-axonpharma.png"
                alt="Axon Pharma"
                className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Texto central */}
            <div className="text-center text-[11px] text-muted-foreground flex-1 min-w-0">
              <p>Modelo de Valor MCDA · Análisis multicriterio de medicamentos anti-VEGF</p>
              <p className="mt-0.5 text-[10px] text-muted-foreground/60">
                Degeneración macular asociada a la edad · v5.0
              </p>
            </div>

            {/* Logo Lucentis — derecha */}
            <div className="flex items-center shrink-0 py-1">
              <img
                src="/logo-lucentis.png"
                alt="Lucentis"
                className="h-9 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

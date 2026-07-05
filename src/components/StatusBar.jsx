import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export default function StatusBar() {
  return (
    <div className="w-full flex justify-between items-center px-6 py-3 bg-transparent text-white shrink-0 z-50">
      {/* Reloj (Text text = "16:30") */}
      <div className="flex items-center">
        <span className="text-[14px] font-medium leading-tight">16:30</span>
      </div>

      {/* Iconos de Estado (Simulación de los PainterResource) */}
      <div className="flex items-center gap-2">
        <Signal className="w-4 h-4 text-white" />
        <Wifi className="w-4 h-4 text-white" />

        {/* Simulación del TextField/Batería que estaba en el código */}
        <div className="relative w-7 h-3.5 border-2 border-white/30 rounded-sm p-0.5 ml-1 flex items-center">
          <div className="h-full bg-white w-3/4 rounded-sm"></div>
          <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-1.5 bg-white/30 rounded-r-sm"></div>
        </div>
      </div>
    </div>
  );
}

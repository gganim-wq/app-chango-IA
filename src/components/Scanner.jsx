import React, { useState, useEffect } from 'react';
import { Camera, Keyboard, AlertCircle, Play, X, Search, Smartphone } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function Scanner({ onScanSuccess, onScanError, onClose }) {
  const [manualEan, setManualEan] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);

  const qrRegionId = 'html5-qr-reader';

  const startWebcam = async () => {
    setCameraError('');
    setIsScanning(true);
    setTimeout(async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (!devices || devices.length === 0) throw new Error("No se detectaron cámaras.");
        const html5Qrcode = new Html5Qrcode(qrRegionId);
        setScannerInstance(html5Qrcode);
        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 20, qrbox: { width: 280, height: 280 }, aspectRatio: 1.0 },
          (decodedText) => {
            html5Qrcode.stop().then(() => {
              setIsScanning(false);
              onScanSuccess(decodedText);
            });
          },
          () => {}
        );
      } catch (err) {
        setCameraError("Error al iniciar cámara. Verifica permisos.");
        setIsScanning(false);
      }
    }, 400);
  };

  const stopWebcam = async () => {
    if (scannerInstance?.isScanning) {
      await scannerInstance.stop();
    }
    setIsScanning(false);
    setScannerInstance(null);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualEan.length >= 5) {
      onScanSuccess(manualEan.replace(/\D/g, ''));
      setManualEan('');
    }
  };

  return (
    <div className="w-full h-full bg-[#0F1115] flex flex-col sm:rounded-[3rem] overflow-hidden animate-fade-in relative">
      
      {/* HEADER ESCANER */}
      <header className="pt-12 pb-6 px-8 flex justify-between items-center bg-[#0F1115] border-b border-white/5">
         <div className="flex items-center gap-2">
            <span className="text-diaRed-600 font-black text-2xl tracking-tighter">Chango</span>
            <span className="bg-white text-black px-1.5 py-0.5 rounded-lg text-xs font-black">IA</span>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-2xl bg-white/5 text-gray-400">
             <X className="w-6 h-6" />
          </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar pb-12">

          <h3 className="text-sm font-black text-center text-white uppercase tracking-[0.3em] opacity-80">
            Escaneo de Productos
          </h3>

          {/* AREA DE VISION / CAMARA */}
          <div className="relative aspect-square w-full max-w-[320px] mx-auto">
             {!isScanning ? (
                <div className="w-full h-full rounded-[2.5rem] bg-[#1A1D24] border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-6 p-8 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                        <Camera className="w-10 h-10 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-white font-bold text-lg">Cámara en espera</p>
                        <p className="text-xs text-gray-500">Escaneá el código de barras del producto directamente.</p>
                    </div>
                    <button
                        onClick={startWebcam}
                        className="w-full py-4 bg-diaRed-600 hover:bg-diaRed-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95"
                    >
                        Encender Cámara
                    </button>
                </div>
             ) : (
                <div className="w-full h-full rounded-[2.5rem] overflow-hidden border-4 border-blue-500/30 relative shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                    <div id={qrRegionId} className="w-full h-full object-cover"></div>
                    {/* Overlay de Escaneo Pro */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-48 border-2 border-blue-500 rounded-3xl animate-pulse flex items-center justify-center">
                            <div className="w-full h-0.5 bg-blue-500 shadow-[0_0_15px_#3b82f6] animate-scan-line"></div>
                        </div>
                    </div>
                    <p className="absolute bottom-6 inset-x-0 text-center text-[10px] font-black text-blue-400 uppercase tracking-widest">Buscando código...</p>
                </div>
             )}
          </div>

          {/* INGRESO MANUAL ESTILO PREMIUM (Imagen 2 Stitch) */}
          <div className="bg-[#1A1D24] rounded-[2rem] p-6 border border-white/5 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Búsqueda Manual</span>
             </div>
             <form onSubmit={handleManualSubmit} className="flex gap-2">
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Código de Barras (EAN)"
                    value={manualEan}
                    onChange={(e) => setManualEan(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    maxLength={13}
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                    Cargar
                </button>
             </form>
          </div>

          <button
            onClick={onClose}
            className="w-full py-5 bg-[#1A1D24] text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] border border-white/5 active:scale-95 transition-all"
          >
            Cerrar
          </button>

          {cameraError && (
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-2xl text-center">
                <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{cameraError}</p>
            </div>
          )}

      </div>
    </div>
  );
}

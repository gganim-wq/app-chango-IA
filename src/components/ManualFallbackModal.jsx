import React, { useState, useEffect } from 'react';
import { X, AlertCircle, WifiOff, Check } from 'lucide-react';

export default function ManualFallbackModal({ isOpen, ean, errorType, onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [hasPromo, setHasPromo] = useState(false);
  const [promoPrice, setPromoPrice] = useState('');
  const [promoType, setPromoType] = useState('Directa'); // 'Directa', 'Club Dia', 'Por Cantidad'
  const [validationError, setValidationError] = useState('');

  // Sincronizar campos cuando se abre para un EAN específico
  useEffect(() => {
    setName('');
    setListPrice('');
    setHasPromo(false);
    setPromoPrice('');
    setPromoType('Directa');
    setValidationError('');
  }, [isOpen, ean]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Por favor, ingresá el nombre del producto.');
      return;
    }
    
    const parsedListPrice = parseFloat(listPrice);
    if (isNaN(parsedListPrice) || parsedListPrice <= 0) {
      setValidationError('Por favor, ingresá un precio regular válido mayor a 0.');
      return;
    }

    let finalPrice = parsedListPrice;
    let parsedPromoPrice = null;

    if (hasPromo) {
      parsedPromoPrice = parseFloat(promoPrice);
      if (isNaN(parsedPromoPrice) || parsedPromoPrice <= 0) {
        setValidationError('Por favor, ingresá un precio promocional válido.');
        return;
      }
      if (parsedPromoPrice >= parsedListPrice) {
        setValidationError('El precio promocional debe ser menor al precio regular.');
        return;
      }
      finalPrice = parsedPromoPrice;
    }

    onConfirm({
      ean: ean || 'MANUAL_' + Date.now(),
      name: name.trim(),
      listPrice: parsedListPrice,
      price: finalPrice,
      ofertaActiva: hasPromo,
      tipoOferta: hasPromo ? promoType : '',
      imageUrl: '', // Sin imagen para carga manual
      quantity: 1 // Cantidad inicial por defecto
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Fondo */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Contenido del Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-darkBg-800 rounded-2xl border border-gray-200 dark:border-darkBg-750 shadow-premium overflow-hidden animate-scale-in">
        
        {/* Cabecera del modal */}
        <div className="bg-gray-50 dark:bg-darkBg-850 p-4 border-b border-gray-250 dark:border-darkBg-750 flex items-center justify-between">
          <div className="flex items-center gap-2 text-diaRed-600 dark:text-diaRed-500">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-800 dark:text-gray-100">
              Carga de Producto Manual
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-gray-200/50 hover:bg-gray-200 dark:bg-darkBg-700 dark:hover:bg-darkBg-600 text-gray-500 dark:text-gray-400 min-w-[36px] min-h-[36px] flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo / Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Alerta del motivo del fallback */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 rounded-xl text-xs flex gap-2 items-start border border-amber-200/40 dark:border-amber-900/30">
            {errorType === 'timeout' ? (
              <>
                <WifiOff className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error de Conexión:</span> Tiempo de espera agotado (4s). Podés registrar el producto manualmente para no perder tiempo de compra.
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Producto No Encontrado:</span> El código EAN no figura en la tienda de Dia online. Ingresalo manualmente a continuación.
                </div>
              </>
            )}
          </div>

          {/* Código EAN (Lectura) */}
          {ean && (
            <div className="bg-gray-100 dark:bg-darkBg-850 p-2.5 rounded-lg border border-gray-200/40 dark:border-darkBg-700/60 flex justify-between items-center text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Código Escaneado:</span>
              <span className="font-mono font-bold text-gray-800 dark:text-gray-200 tracking-widest">{ean}</span>
            </div>
          )}

          {/* Nombre del Producto */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              Nombre del Producto *
            </label>
            <input
              type="text"
              placeholder="Ej: Azúcar Ledesma 1kg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-darkBg-850 text-gray-900 dark:text-gray-100 border border-gray-250 dark:border-darkBg-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-diaRed-500"
              required
            />
          </div>

          {/* Precio Regular */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
              Precio de Lista (Regular) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 bg-gray-50 dark:bg-darkBg-850 text-gray-900 dark:text-gray-100 border border-gray-250 dark:border-darkBg-700 rounded-xl text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-diaRed-500"
                required
              />
            </div>
          </div>

          {/* Switch de Oferta */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-darkBg-850 rounded-xl border border-gray-150 dark:border-darkBg-700/60">
            <div>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">¿Este producto tiene descuento?</span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">Oferta directa, Club Dia o por cantidad</span>
            </div>
            
            <button
              type="button"
              onClick={() => setHasPromo(!hasPromo)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-250 min-h-[30px] min-w-[48px] focus:outline-none ${
                hasPromo ? 'bg-diaRed-600' : 'bg-gray-300 dark:bg-darkBg-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-250 ${
                  hasPromo ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Sección de Descuento (Si está activado) */}
          {hasPromo && (
            <div className="p-3 bg-red-50/20 dark:bg-red-950/10 border border-diaRed-200/40 dark:border-red-900/20 rounded-xl space-y-3.5 animate-fade-in">
              
              {/* Precio Promocional */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-diaRed-700 dark:text-diaRed-400 block">
                  Precio con Descuento *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-diaRed-600">$</span>
                  <input
                    type="number"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2 bg-white dark:bg-darkBg-850 text-gray-900 dark:text-gray-100 border border-diaRed-200 dark:border-red-900/35 rounded-lg text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-diaRed-500"
                    required={hasPromo}
                  />
                </div>
              </div>

              {/* Tipo de Oferta */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-diaRed-700 dark:text-diaRed-400 block">
                  Tipo de Oferta
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Directa', 'Club Dia', 'Por Cantidad'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setPromoType(type)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition ${
                        promoType === type
                          ? 'bg-diaRed-600 text-white shadow-sm'
                          : 'bg-white dark:bg-darkBg-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-darkBg-750 hover:bg-gray-100 dark:hover:bg-darkBg-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Mensajes de Validación */}
          {validationError && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-xl text-xs font-medium border border-red-200/50 dark:border-red-900/30">
              {validationError}
            </div>
          )}

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-darkBg-750">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-gray-600 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 dark:bg-darkBg-750 dark:hover:bg-darkBg-700 rounded-xl transition min-h-[44px]"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="flex-[2] py-3 text-xs font-bold text-white bg-diaRed-600 hover:bg-diaRed-700 rounded-xl shadow-md hover:shadow-lg transition duration-200 flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Check className="w-4 h-4" />
              Guardar Producto
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

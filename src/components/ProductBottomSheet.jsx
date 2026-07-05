import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Box, Sparkles } from 'lucide-react';

export default function ProductBottomSheet({ isOpen, product, getEffectivePrice, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) setQuantity(1);
  }, [product]);

  if (!isOpen || !product) return null;

  const originalListPrice = product.listPrice;
  const currentEffectivePrice = getEffectivePrice({ ...product, quantity });
  const totalAhorro = (originalListPrice * quantity) - (currentEffectivePrice * quantity);
  const hasPromotion = product.ofertaActiva === true || (product.price && product.price < product.listPrice) || !!product.qtyPromoFormula;
  const promoLabel = product.qtyPromoFormula || product.tipoOferta || null;
  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* PRODUCT DETAIL MODAL - XHDPI FIGMA STYLE (Imagen 3) */}
      <div className="relative w-full max-w-[420px] h-screen sm:h-auto sm:max-h-[90vh] bg-black overflow-hidden flex flex-col border border-white/5 rounded-t-[3.5rem] sm:rounded-[3.5rem] shadow-2xl">
        
        <header className="pt-10 pb-4 px-8 flex justify-center items-center relative shrink-0">
            <div className="flex items-center gap-1">
                <span className="text-white font-black text-xl tracking-tighter">Detalle </span>
                <span className="text-figmaPurple font-black text-xl tracking-tighter">IA</span>
            </div>
            <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6 no-scrollbar flex flex-col items-center">
          
          <div className="bg-figmaRed text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg animate-pulse">
             ¡PRODUCTO ENCONTRADO!
          </div>

          <div className="relative w-64 h-64 bg-[#1A1A1A] rounded-[3rem] overflow-visible flex items-center justify-center border border-white/5 shadow-inner mt-2">
             <div className="w-full h-full rounded-[3rem] overflow-hidden flex items-center justify-center">
               {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-8" /> : <Box className="w-24 h-24 text-gray-800" />}
             </div>
             {/* BADGE DE BENEFICIO SOBRE LA IMAGEN */}
             {hasPromotion && promoLabel && (
               <div className="absolute -top-3 -right-3 bg-[#FACC15] text-black font-black text-[11px] px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 animate-bounce-once border-2 border-black/10">
                 <Sparkles className="w-3 h-3 text-black" />
                 <span className="uppercase tracking-tight">{promoLabel}</span>
               </div>
             )}
          </div>

          <div className="text-center space-y-2 w-full">
              <h3 className="text-xl font-bold text-white leading-tight px-2">{product.name}</h3>
              <p className="text-[10px] font-bold text-gray-600 tracking-widest uppercase">EAN: {product.ean}</p>
          </div>

          <div className="w-full text-center space-y-1 py-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TOTAL CHANGO IA</p>
              <span className="text-5xl font-black text-figmaRed tracking-tighter block">
                {formatCurrency(currentEffectivePrice * quantity)}
              </span>
              {/* Precio tachado si hay descuento */}
              {hasPromotion && originalListPrice * quantity > currentEffectivePrice * quantity && (
                <p className="text-sm font-bold text-gray-600 line-through mt-0.5">
                  {formatCurrency(originalListPrice * quantity)}
                </p>
              )}
              {totalAhorro > 0 ? (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="bg-green-500/15 text-green-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      Ahorrás {formatCurrency(totalAhorro)}
                    </span>
                  </div>
              ) : (
                  product.qtyPromoFormula && (
                      <p className="text-[10px] font-bold text-[#FF1E1E] uppercase tracking-tighter mt-1">
                          Suma Mas
                      </p>
                  )
              )}
          </div>

          {/* CONTROLES DE CANTIDAD FIGMA STYLE */}
          <div className="w-full bg-white rounded-2xl p-2.5 flex items-center justify-between shadow-xl mt-4">
             <div className="flex flex-col pl-6">
                <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Cantidad</span>
             </div>
             <div className="flex items-center gap-6 pr-4">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center active:scale-90 transition-all">
                    <Minus className="w-5 h-5" />
                 </button>
                 <span className="text-2xl font-black text-black w-6 text-center">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center active:scale-90 transition-all">
                    <Plus className="w-5 h-5" />
                 </button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full pt-6">
            <button
                onClick={onClose}
                className="py-5 bg-[#1A1A1A] border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
                CANCELAR
            </button>
            <button
                onClick={() => onConfirm({...product, quantity})}
                className="py-5 bg-figmaRed text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-accent flex items-center justify-center gap-2"
            >
                <ShoppingCart className="w-4 h-4" />
                AGREGAR
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

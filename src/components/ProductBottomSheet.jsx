import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Percent, Sparkles, Box } from 'lucide-react';

export default function ProductBottomSheet({ isOpen, product, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const listPrice = product.listPrice || product.price;
  const finalPrice = product.price;
  const hasDiscount = listPrice > finalPrice || product.qtyPromoFormula;
  const discountPercent = hasDiscount ? Math.round(((listPrice - finalPrice) / listPrice) * 100) : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 transition-all animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* PRODUCT DETAIL MODAL - STITCH STYLE (Imagen 3) */}
      <div className="relative w-full max-w-[440px] h-full sm:h-auto sm:max-h-[90vh] bg-[#0F1115] sm:rounded-[3rem] overflow-hidden flex flex-col border border-white/5">
        
        <header className="pt-12 pb-6 px-8 flex justify-between items-center bg-[#0F1115]">
            <p className="text-xs font-black text-white/50 uppercase tracking-[0.3em] mx-auto">Detalle Producto Chango IA</p>
            <button onClick={onClose} className="absolute top-10 right-6 p-2.5 rounded-2xl bg-white/5 text-gray-400">
                <X className="w-6 h-6" />
            </button>
        </header>

        <div className="flex-1 overflow-y-auto px-8 pb-12 space-y-10 no-scrollbar">
          
          {/* TAG EXITO */}
          <div className="flex justify-center">
             <span className="bg-diaRed-600/20 text-diaRed-500 border border-diaRed-600/30 text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em]">
                ¡Producto Encontrado!
             </span>
          </div>

          {/* IMAGEN GIGANTE */}
          <div className="relative flex justify-center py-4">
             <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full scale-75"></div>
             <div className="relative w-64 h-64 bg-white rounded-[4rem] overflow-hidden flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-6">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                    <Box className="w-24 h-24 text-gray-200" />
                )}
             </div>
          </div>

          {/* NOMBRE Y EAN */}
          <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white leading-tight px-4">{product.name}</h3>
              <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">EAN: {product.ean}</p>
          </div>

          {/* PRECIO STITCH STYLE */}
          <div className="text-center space-y-1 py-4">
              <p className="text-[10px] font-black text-diaRed-500 uppercase tracking-[0.4em]">Precio Chango IA</p>
              <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-diaRed-600 tracking-tighter">
                    {formatCurrency(finalPrice)}
                  </span>

                  {hasDiscount && (
                    <div className="flex items-center gap-3 mt-4">
                        <span className="text-lg text-gray-600 line-through font-bold">
                            {formatCurrency(listPrice)}
                        </span>
                        <div className="bg-blue-600 text-white px-4 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-lg shadow-blue-600/20">
                            <Percent className="w-3.5 h-3.5" />
                            <span>{product.qtyPromoFormula || `${discountPercent}% OFF`}</span>
                        </div>
                    </div>
                  )}
              </div>
          </div>

          {/* SELECTOR CANTIDAD Y BOTÓN AGREGAR */}
          <div className="bg-[#1A1D24] rounded-[2.5rem] p-4 border border-white/5 space-y-4">
             <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-white/40 uppercase tracking-widest">Cantidad</span>
                <div className="flex items-center bg-black/40 rounded-2xl p-1.5 gap-6">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 bg-white/5 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                        <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-black text-white min-w-[30px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 bg-white/5 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all">
                        <Plus className="w-5 h-5" />
                    </button>
                </div>
             </div>

             <button
                onClick={() => onConfirm({...product, quantity, price: finalPrice, listPrice})}
                className="w-full py-6 bg-diaRed-600 hover:bg-diaRed-700 text-white rounded-[2rem] font-black text-base shadow-xl flex items-center justify-center gap-4 uppercase tracking-[0.3em] active:scale-95 transition-all"
             >
                <ShoppingCart className="w-6 h-6" />
                Agregar
             </button>
          </div>

        </div>
      </div>
    </div>
  );
}

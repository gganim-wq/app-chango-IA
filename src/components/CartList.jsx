import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Percent, Sparkles, X, Bot, Tag, ShoppingCart } from 'lucide-react';

export default function CartList({ items = [], getEffectivePrice, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (items.length === 0) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="w-full flex flex-col space-y-4">
      {items.map((item, index) => {
        const currentUnitPrice = getEffectivePrice(item);
        const ahorroItem = (item.listPrice - currentUnitPrice) * item.quantity;
        const hasPromotion = item.qtyPromoFormula || (item.tipoOferta && item.tipoOferta !== 'Ninguna');

        return (
          <div key={item.ean + (item.qtyPromoFormula || item.tipoOferta)} className="bg-black/40 rounded-[2.5rem] p-5 border border-white/5 flex gap-5 items-center shadow-lg relative overflow-hidden mb-4">

            {/* MINIATURA CON TAG DE PROMO (Imagen 1) */}
            <div className="shrink-0 relative">
                <div className="w-24 h-24 bg-white rounded-[2rem] overflow-hidden p-3 flex items-center justify-center border border-white/10">
                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-contain" /> : <ShoppingBag className="w-12 h-12 text-gray-200" />}
                </div>
                {hasPromotion && (
                    <div className="absolute -bottom-1 -left-1 bg-[#FFD700] text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                        {item.qtyPromoFormula || item.tipoOferta}
                    </div>
                )}
            </div>

            {/* INFO FIGMA STYLE */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-1">
                <div className="flex justify-between items-start">
                    <h4 className="text-[13px] font-bold text-white truncate pr-6 leading-tight">
                        {index + 1}) {item.name}
                    </h4>
                    <button onClick={() => onRemoveItem(item.ean)} className="absolute top-5 right-5 text-gray-600 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-gray-500 uppercase">Cant:</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => onUpdateQuantity(item.ean, Math.max(1, item.quantity - 1))} className="w-7 h-7 bg-white/5 text-white rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all">
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-black text-white w-4 text-center">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.ean, item.quantity + 1)} className="w-7 h-7 bg-white/5 text-white rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-lg font-black text-white tracking-tighter">
                            {formatCurrency(currentUnitPrice * item.quantity)}
                        </p>
                        {ahorroItem > 0 ? (
                            <p className="text-[9px] font-bold text-[#22C55E] uppercase tracking-tighter">
                                Ahorro: {formatCurrency(ahorroItem)}
                            </p>
                        ) : (
                            item.qtyPromoFormula && (
                                <p className="text-[9px] font-bold text-[#FF1E1E] uppercase tracking-tighter">
                                    Suma Mas
                                </p>
                            )
                        )}
                    </div>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

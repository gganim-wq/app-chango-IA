import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Percent, Sparkles, X } from 'lucide-react';

export default function CartList({ items = [], onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (items.length === 0) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="w-full flex flex-col space-y-4">
      {items.map((item, index) => {
        const ahorroItem = (item.listPrice - item.price) * item.quantity;
        return (
          <div key={item.ean} className="bg-[#1A1D24] rounded-3xl p-4 border border-white/5 flex gap-4 items-center animate-fade-in shadow-sm">

            {/* Index y Miniatura */}
            <div className="relative shrink-0">
               <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden p-2 flex items-center justify-center border border-white/10">
                 {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-contain" /> : <ShoppingBag className="text-gray-200" />}
               </div>
               <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1A1D24]">
                 {index + 1}
               </span>
            </div>

            {/* Datos */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black text-white truncate pr-4">{item.name}</h4>
                    <button onClick={() => onRemoveItem(item.ean)} className="text-gray-600 hover:text-red-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-white/40">Cant: {item.quantity}</p>
                        <p className="text-sm font-black text-white">{formatCurrency(item.price)} <span className="text-[9px] text-gray-600 font-bold">c/u</span></p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                         <div className="flex items-center bg-black/40 rounded-xl p-1 gap-3">
                            <button onClick={() => onUpdateQuantity(item.ean, Math.max(1, item.quantity - 1))} className="w-8 h-8 bg-white/5 text-white rounded-lg flex items-center justify-center active:scale-90 transition-all"><Minus className="w-3.5 h-3.5" /></button>
                            <span className="text-xs font-black text-white">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.ean, item.quantity + 1)} className="w-8 h-8 bg-white/5 text-white rounded-lg flex items-center justify-center active:scale-90 transition-all"><Plus className="w-3.5 h-3.5" /></button>
                        </div>
                        {ahorroItem > 0 && <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter italic">Ahorro: {formatCurrency(ahorroItem)}</span>}
                    </div>
                </div>
            </div>
          </div>
        );
      })}

      <button
        onClick={onClearCart}
        className="w-full py-4 border-2 border-dashed border-white/5 text-gray-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] mt-4 hover:border-red-500/20 hover:text-red-500/50 transition-all"
      >
        Vaciar Changuito
      </button>
    </div>
  );
}

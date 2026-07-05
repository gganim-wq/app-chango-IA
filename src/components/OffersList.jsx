import React from 'react';
import { Tag, Sparkles, ChevronRight, ShoppingCart } from 'lucide-react';

const HOT_OFFERS = [
  {
    ean: '8480017316226',
    name: 'Cubeteras Set x 2 Dia',
    price: 2001.00,
    listPrice: 2001.00,
    tag: 'Producto DIA',
    imageUrl: 'https://ardiaprod.vteximg.com.br/arquivos/ids/349154/Cubeteras-Set-x-2-Dia-1-Ud-_1.jpg'
  },
  {
    ean: '8480017555380',
    name: 'Sal Fina DIA 500 Gr.',
    price: 990.00,
    listPrice: 1200.00,
    tag: '25% OFF',
    imageUrl: 'https://diaonline.supermercadosdia.com.ar/arquivos/ids/263590'
  },
  {
    ean: '7790895001413',
    name: 'Coca Cola 2.25L',
    price: 2280.00,
    listPrice: 2850.00,
    tag: 'Club Dia',
    imageUrl: 'https://diaonline.supermercadosdia.com.ar/arquivos/ids/263590'
  },
  {
    ean: '7790040583205',
    name: 'Criollitas 100g',
    price: 680.00,
    listPrice: 850.00,
    tag: '2x1',
    imageUrl: 'https://diaonline.supermercadosdia.com.ar/arquivos/ids/261314'
  }
];

export default function OffersList({ onSelectOffer }) {
  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
            Ofertas <span className="text-diaRed-600">Hot</span>
        </h2>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Actualizado hoy</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {HOT_OFFERS.map((offer) => (
          <button
            key={offer.ean}
            onClick={() => onSelectOffer(offer.ean)}
            className="bg-[#1A1D24] rounded-[2rem] p-4 border border-white/5 flex gap-4 items-center text-left active:scale-[0.98] transition-all shadow-lg group"
          >
            <div className="w-24 h-24 bg-white rounded-3xl overflow-hidden p-3 flex-shrink-0 relative">
                <img src={offer.imageUrl} alt="" className="w-full h-full object-contain" />
                <div className="absolute top-1 left-1 bg-yellow-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {offer.tag}
                </div>
            </div>

            <div className="flex-1 space-y-2">
                <h4 className="text-sm font-black text-white leading-tight group-hover:text-diaRed-500 transition-colors">{offer.name}</h4>
                <div className="space-y-0.5">
                    <p className="text-xl font-black text-diaRed-600">{formatCurrency(offer.price)}</p>
                    <p className="text-[10px] text-gray-500 line-through font-bold">{formatCurrency(offer.listPrice)}</p>
                </div>
                <div className="flex items-center gap-1 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                    <span>Ver más</span>
                    <ChevronRight className="w-3 h-3" />
                </div>
            </div>

            <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-gray-600 group-hover:bg-diaRed-600 group-hover:text-white transition-all">
                <ShoppingCart className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      {/* Banner Publicitario */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl">
        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10 rotate-12" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">Especial Club Dia</p>
        <h3 className="text-lg font-black leading-tight mb-4">¡Llevate la segunda<br/>al 70% en lácteos!</h3>
        <button className="bg-white text-blue-700 px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            Ver Productos
        </button>
      </div>
    </div>
  );
}

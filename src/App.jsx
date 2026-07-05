import React, { useState, useEffect } from 'react';
import { Moon, Sun, Barcode, Sparkles, X, Home, Tag, ShoppingCart, Scan, Search, ShoppingBag, Bot, ChevronLeft, Trash2 } from 'lucide-react';
import { CapacitorHttp } from '@capacitor/core';
import CartList from './components/CartList';
import Scanner from './components/Scanner';
import OffersList from './components/OffersList';
import ProductBottomSheet from './components/ProductBottomSheet';
import ManualFallbackModal from './components/ManualFallbackModal';
import { SadBag, BasketPromo } from './components/DesignIcons';
import heroImg from './assets/hero.png';

export default function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('dia_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('dia_dark');
    return saved === 'true' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const [activeTab, setActiveTab] = useState('inicio');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const [scannedProduct, setScannedProduct] = useState(null);
  const [activeEan, setActiveEan] = useState('');
  const [errorType, setErrorType] = useState('not_found');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('dia_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dia_dark', darkMode.toString());
  }, [darkMode]);

  const getEffectivePrice = (item) => {
    const { listPrice, price, quantity, qtyPromoFormula, tipoOferta } = item;
    if (tipoOferta === 'Por Cantidad' || qtyPromoFormula) {
      if (qtyPromoFormula === '2x1') {
        const payCount = Math.floor(quantity / 2) + (quantity % 2);
        return (payCount * listPrice) / quantity;
      } else if (qtyPromoFormula === '3x2') {
        const payCount = (Math.floor(quantity / 3) * 2) + (quantity % 3);
        return (payCount * listPrice) / quantity;
      } else if (qtyPromoFormula === '4x3') {
        const payCount = (Math.floor(quantity / 4) * 3) + (quantity % 4);
        return (payCount * listPrice) / quantity;
      } else if (qtyPromoFormula === '2da 70') {
        const pairs = Math.floor(quantity / 2);
        return ((pairs * listPrice * 1.3) + ((quantity % 2) * listPrice)) / quantity;
      } else if (qtyPromoFormula === '2da 50') {
        const pairs = Math.floor(quantity / 2);
        return ((pairs * listPrice * 1.5) + ((quantity % 2) * listPrice)) / quantity;
      } else if (qtyPromoFormula === '2da 80') {
        const pairs = Math.floor(quantity / 2);
        return ((pairs * listPrice * 1.2) + ((quantity % 2) * listPrice)) / quantity;
      }
    }
    return (price < listPrice) ? price : listPrice;
  };

  const handleBarcodeScanned = async (ean) => {
    setIsScannerOpen(false);
    setIsLoading(true);
    try {
      const url = `https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?fq=alternateIds_Ean:${ean}`;
      const response = await CapacitorHttp.get({
        url,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      let data = response.data;
      if (!data || data.length === 0) {
        const fallbackUrl = `https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?ft=${ean}`;
        const fallbackRes = await CapacitorHttp.get({ url: fallbackUrl, headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } });
        data = fallbackRes.data;
      }

      setIsLoading(false);

      if (data && data.length > 0) {
        const product = data[0];
        const item = product.items[0];
        const offer = item.sellers[0].commertialOffer;

        let listPrice = offer.ListPrice;
        let price = offer.Price;
        let ofertaActiva = false;
        let tipoOferta = 'Ninguna';
        let qtyPromoFormula = null;
        let promoDetectada = false;

        // ── PRIORIDAD 1: DiscountHighLight ──────────────────────────────────
        // Fuente oficial de Dia: la etiqueta exacta que aparece en la página
        // Ej: [{"<Name>k__BackingField": "40%"}] o [{"<Name>k__BackingField": "3X2"}]
        for (const d of (offer.DiscountHighLight || [])) {
          const n = (d['<Name>k__BackingField'] || d.Name || '').toUpperCase().trim();
          if (!n) continue;
          if (n === '3X2')           { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '3x2';   ofertaActiva = true; promoDetectada = true; break; }
          if (n === '4X3')           { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '4x3';   ofertaActiva = true; promoDetectada = true; break; }
          if (n === '2X1')           { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2x1';   ofertaActiva = true; promoDetectada = true; break; }
          if (n.includes('2DO') || n.includes('2DA') || n.includes('SEGUNDA')) {
            if (n.includes('80')) { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2da 80'; ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('70')) { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2da 70'; ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('50')) { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2da 50'; ofertaActiva = true; promoDetectada = true; break; }
          }
          // Porcentaje directo puro (ej "40%", "30%")
          const m1 = n.match(/^(\d{1,3})%$/);
          if (m1) { tipoOferta = `${m1[1]}%`; ofertaActiva = true; promoDetectada = true; if (listPrice === price) price = listPrice * (1 - parseInt(m1[1]) / 100); break; }
        }

        // ── PRIORIDAD 2: Diferencia matemática de precio ────────────────────
        // Si ListPrice > Price, el descuento ya está aplicado en los precios
        if (!promoDetectada && listPrice > price) {
          tipoOferta = `${Math.round(((listPrice - price) / listPrice) * 100)}%`;
          ofertaActiva = true;
          promoDetectada = true;
        }

        // ── PRIORIDAD 3: PromotionTeasers / Teasers (combos exactos) ────────
        // Solo para combos de cantidad (3x2, 2x1, etc.), nunca para porcentajes
        // ya que los teasers pueden estar presentes aunque no apliquen al precio actual
        if (!promoDetectada) {
          for (const t of [...(offer.PromotionTeasers || []), ...(offer.Teasers || [])]) {
            const n = (t.Name || t['<Name>k__BackingField'] || '').toUpperCase().trim();
            if (!n) continue;
            if (n.includes('3X2'))                                        { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '3x2';   ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('4X3'))                                        { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '4x3';   ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('2X1'))                                        { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2x1';   ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('2DO AL 80') || n.includes('2DA AL 80'))       { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2da 80'; ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('2DO AL 70') || n.includes('2DA AL 70'))       { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2da 70'; ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('2DO AL 50') || n.includes('2DA AL 50'))       { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2da 50'; ofertaActiva = true; promoDetectada = true; break; }
            if (n.includes('CLUB') || n.includes('SOCIO'))                { tipoOferta = 'Club Dia';     ofertaActiva = true; promoDetectada = true; break; }
          }
        }

        // ── PRIORIDAD 4: productClusters — SOLO nombre exactamente un % puro ─
        // Ej: cluster "40%" es válido. "Hasta 2x1 s27" o "2do al 80% s29" son IGNORADOS
        if (!promoDetectada) {
          for (const val of Object.values(product.productClusters || {})) {
            const cv = String(val).toUpperCase().trim();
            if (cv === '2X1') { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '2x1'; ofertaActiva = true; promoDetectada = true; break; }
            if (cv === '3X2') { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '3x2'; ofertaActiva = true; promoDetectada = true; break; }
            if (cv === '4X3') { tipoOferta = 'Por Cantidad'; qtyPromoFormula = '4x3'; ofertaActiva = true; promoDetectada = true; break; }
            const m4 = cv.match(/^(\d{1,3})%$/);  // coincide SOLO con "40%", no con "Hasta 45% s21"
            if (m4) { tipoOferta = `${m4[1]}%`; ofertaActiva = true; promoDetectada = true; if (listPrice === price) price = listPrice * (1 - parseInt(m4[1]) / 100); break; }
          }
        }

        setScannedProduct({
          ean, name: product.productName, listPrice, price,
          tipoOferta, qtyPromoFormula, ofertaActiva, imageUrl: item.images[0]?.imageUrl
        });
        setIsBottomSheetOpen(true);
      } else {
        setActiveEan(ean); setErrorType('not_found'); setIsManualModalOpen(true);
      }
    } catch (err) {
      setIsLoading(false); setActiveEan(ean); setErrorType('timeout'); setIsManualModalOpen(true);
    }
  };

  const handleConfirmProduct = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.ean === product.ean && item.qtyPromoFormula === product.qtyPromoFormula);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += product.quantity;
        return newCart;
      }
      return [...prevCart, product];
    });
    setIsBottomSheetOpen(false);
    setActiveTab('changuito');
  };

  const totalPagar = cart.reduce((acc, i) => acc + getEffectivePrice(i) * i.quantity, 0);
  const totalSinDescuento = cart.reduce((acc, i) => acc + i.listPrice * i.quantity, 0);
  const totalAhorro = totalSinDescuento - totalPagar;
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  return (
    <div className="min-h-screen bg-figmaBlack flex flex-col items-center justify-center p-0 transition-colors duration-300 overflow-hidden font-sans">

      <div className="w-full max-w-[440px] h-screen bg-figmaBlack flex flex-col relative animate-fade-in">

        {/* HEADER FIGMA STYLE */}
        <header className="pt-10 pb-4 px-8 flex items-center shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-white font-black text-2xl tracking-tighter">
              {activeTab === 'changuito' ? 'Mi Changuito ' : 'Chango '}
            </span>
            <span className="text-figmaPurple font-black text-2xl tracking-tighter">IA</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 no-scrollbar pb-32">

          {activeTab === 'inicio' && (
            <div className="flex flex-col h-full animate-fade-in pt-4">
              {/* BANNER IA CON ROBOT */}
              <div className="bg-[#1A1D24] rounded-[2.5rem] p-6 relative overflow-hidden border border-white/5 shadow-2xl flex items-center gap-4 mb-10">
                 <div className="flex-1 z-10 space-y-2">
                    <h2 className="text-[13px] font-bold text-white leading-tight">
                        Chango IA: Tu asistente de ahorro. Escanea productos y no te olvides de nada.
                    </h2>
                 </div>
                 <div className="w-16 h-16 relative z-10 bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
                    <Bot className="w-10 h-10 text-white opacity-80" />
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-8 text-center pb-20">
                  <div className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10">
                      <SadBag className="w-20 h-20 opacity-60" />
                  </div>
                  <div className="space-y-3 px-4">
                      <h3 className="text-xl font-bold text-white">Tu changuito está vacío</h3>
                      <p className="text-[12px] text-gray-500 font-medium leading-relaxed px-8">
                          Escanea los códigos de barra de tus productos favoritos para cargar tu carrito. Verifica tu Changuito para ver las Ofertas. Consulta tu lista de Pedidos.
                      </p>
                  </div>
              </div>

              {/* BOTÓN ESCANEAR AL FINAL (FIGMA 4) */}
              <div className="pb-10">
                  <button
                      onClick={() => setIsScannerOpen(true)}
                      className="w-full py-5 bg-figmaRed text-white rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-accent"
                  >
                      <Scan className="w-5 h-5" />
                      ESCANEAR
                  </button>
              </div>
            </div>
          )}

          {activeTab === 'changuito' && (
            <div className="pt-2 space-y-6 animate-fade-in relative">
                {/* CABECERA FIJA XHDPI STYLE (Imagen 1) */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-figmaBlue p-6 rounded-[2rem] shadow-xl relative overflow-hidden h-32 flex flex-col justify-between">
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Total a Pagar:</p>
                            <p className="text-xl font-black text-white">{formatCurrency(totalPagar)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-figmaCyan to-figmaPurple p-6 rounded-[2rem] shadow-xl relative overflow-hidden h-32 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-bold text-white uppercase tracking-widest">Tu Ahorro:</p>
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <p className="text-xl font-black text-white">{formatCurrency(totalAhorro)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="py-4 bg-figmaRed text-white rounded-full font-black text-xs uppercase tracking-widest">
                            Finalizar
                        </button>
                        <button onClick={() => setActiveTab('inicio')} className="py-4 border-2 border-white/20 text-white rounded-full font-black text-xs uppercase tracking-widest bg-transparent">
                            Seguir
                        </button>
                    </div>

                    {/* BOTÓN VACIAR CARRITO */}
                    {cart.length > 0 && (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="w-full py-3.5 flex items-center justify-center gap-2 border border-red-900/40 text-red-500 hover:text-red-400 hover:border-red-700/60 bg-red-950/20 rounded-full font-black text-[11px] uppercase tracking-[0.2em] active:scale-95 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Vaciar Carrito
                      </button>
                    )}
                </div>

                <div className="pt-4">
                    <CartList
                        items={cart}
                        getEffectivePrice={getEffectivePrice}
                        onUpdateQuantity={(ean, q) => setCart(prev => prev.map(i => i.ean === ean ? {...i, quantity: q} : i))}
                        onRemoveItem={(ean) => setCart(prev => prev.filter(i => i.ean !== ean))}
                        onClearCart={() => setShowClearConfirm(true)}
                    />
                </div>
            </div>
          )}

          {activeTab === 'ofertas' && <div className="pt-4"><OffersList onSelectOffer={handleBarcodeScanned} /></div>}

        </main>

        <nav className="absolute bottom-0 inset-x-0 bg-[#0A0C10] border-t border-white/5 px-6 pb-8 pt-4 flex justify-between items-center shrink-0">
            {[
                { id: 'inicio', icon: Home, label: 'Inicio' },
                { id: 'ofertas', icon: Tag, label: 'Ofertas' },
                { id: 'escanear', icon: Scan, label: 'Escanear', action: () => setIsScannerOpen(true) },
                { id: 'changuito', icon: ShoppingCart, label: 'Carrito', badge: cart.length },
                { id: 'pedidos', icon: ShoppingBag, label: 'Pedidos' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={tab.action ? tab.action : () => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === tab.id ? 'text-figmaCyan' : 'text-gray-600'}`}
                >
                    <div className="relative">
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-figmaCyan' : ''}`} />
                        {tab.badge > 0 && <span className="absolute -top-1.5 -right-2 bg-figmaRed text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#0A0C10]">{tab.badge}</span>}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
                </button>
            ))}
        </nav>
      </div>

      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="relative w-full max-w-[440px] h-full sm:h-auto"><Scanner onScanSuccess={handleBarcodeScanned} onScanError={alert} onClose={() => setIsScannerOpen(false)} /></div>
        </div>
      )}

      <ProductBottomSheet isOpen={isBottomSheetOpen} product={scannedProduct} getEffectivePrice={getEffectivePrice} onClose={() => setIsBottomSheetOpen(false)} onConfirm={handleConfirmProduct} />
      <ManualFallbackModal isOpen={isManualModalOpen} ean={activeEan} errorType={errorType} onClose={() => setIsManualModalOpen(false)} onConfirm={(p) => { setCart(prev => [...prev, p]); setIsManualModalOpen(false); }} />

      {/* ── MODAL DE CONFIRMACIÓN: VACIAR CARRITO ─────────────────────── */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[300] flex items-end justify-center animate-fade-in" onClick={() => setShowClearConfirm(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <div
            className="relative w-full max-w-[440px] bg-[#0F1115] border border-white/8 rounded-t-[3rem] px-8 pt-8 pb-12 flex flex-col items-center gap-6 shadow-2xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Pastilla drag handle */}
            <div className="w-10 h-1 bg-white/15 rounded-full -mt-2 mb-2" />

            {/* Icono */}
            <div className="w-16 h-16 rounded-[1.5rem] bg-red-950/50 border border-red-900/40 flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>

            {/* Texto */}
            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight">¿Vaciar el changuito?</h3>
              <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-[260px]">
                Se eliminarán todos los productos que agregaste. Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Botones */}
            <div className="w-full flex flex-col gap-3 pt-2">
              <button
                onClick={() => { setCart([]); setShowClearConfirm(false); }}
                className="w-full py-4 bg-figmaRed text-white rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Sí, vaciar
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all border border-white/5"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

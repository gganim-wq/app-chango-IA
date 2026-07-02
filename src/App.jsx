import React, { useState, useEffect } from 'react';
import { Moon, Sun, Barcode, Sparkles, X, Home, Tag, ShoppingCart, User, Search } from 'lucide-react';
import { CapacitorHttp } from '@capacitor/core';
import CartList from './components/CartList';
import Scanner from './components/Scanner';
import ProductBottomSheet from './components/ProductBottomSheet';
import ManualFallbackModal from './components/ManualFallbackModal';
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
  
  const [activeTab, setActiveTab] = useState('inicio'); // 'inicio', 'ofertas', 'changuito', 'perfil'
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

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

  const handleBarcodeScanned = async (ean) => {
    setIsScannerOpen(false);
    setIsLoading(true);

    try {
      const searchUrls = [
        `https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?fq=alternateIds_Ean:${ean}`,
        `https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?ft=${ean}`
      ];

      let data = null;
      for (const url of searchUrls) {
        const options = {
          url: url,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        };

        const response = await CapacitorHttp.get(options);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          data = response.data;
          break;
        }
      }

      setIsLoading(false);

      if (data && data.length > 0) {
        const product = data[0];
        const item = product.items[0];
        const offer = item.sellers[0].commertialOffer;

        const clusterStr = product.productClusters ? Object.values(product.productClusters).join(' ').toUpperCase() : "";
        let tipoOferta = offer.ListPrice > offer.Price ? 'Directa' : 'Ninguna';
        let qtyPromoFormula = null;

        if (clusterStr.includes("2X1")) { tipoOferta = "Por Cantidad"; qtyPromoFormula = "2x1"; }
        else if (clusterStr.includes("3X2")) { tipoOferta = "Por Cantidad"; qtyPromoFormula = "3x2"; }
        else if (clusterStr.includes("70") || clusterStr.includes("SEGUNDA")) { tipoOferta = "Por Cantidad"; qtyPromoFormula = "2da 70"; }
        else if (clusterStr.includes("CLUB")) { tipoOferta = "Club Dia"; }

        const mappedProduct = {
          status: 'success',
          ean: ean,
          name: product.productName,
          listPrice: offer.ListPrice,
          price: offer.Price,
          ofertaActiva: offer.ListPrice > offer.Price || qtyPromoFormula !== null || tipoOferta === 'Club Dia',
          tipoOferta: tipoOferta,
          qtyPromoFormula: qtyPromoFormula,
          imageUrl: item.images[0]?.imageUrl
        };

        setScannedProduct(mappedProduct);
        setIsBottomSheetOpen(true);
      } else {
        setActiveEan(ean);
        setErrorType('not_found');
        setIsManualModalOpen(true);
      }
    } catch (err) {
      setIsLoading(false);
      setActiveEan(ean);
      setErrorType('timeout');
      setIsManualModalOpen(true);
    }
  };

  const handleConfirmProduct = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.ean === product.ean);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += product.quantity;
        return newCart;
      }
      return [...prevCart, product];
    });
    setIsBottomSheetOpen(false);
    setActiveTab('changuito'); // Ir al carrito al agregar un producto
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-0 sm:p-4 transition-colors duration-300 overflow-hidden font-sans">

      {/* FRAME DE LA APLICACIÓN - Diseño Stitch Premium */}
      <div className="w-full max-w-[420px] h-[100vh] sm:h-[850px] sm:rounded-[3rem] bg-[#0F1115] overflow-hidden flex flex-col relative animate-fade-in shadow-2xl">

        {/* HEADER - Estilo Stitch */}
        <header className="pt-12 pb-4 px-6 shrink-0 flex justify-between items-center bg-[#0F1115]">
          <div className="flex items-center gap-2">
            <span className="text-diaRed-600 font-black text-2xl tracking-tighter">Chango</span>
            <span className="bg-white text-black px-1.5 py-0.5 rounded-lg text-xs font-black">IA</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-white/5 text-gray-400">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* CONTENIDO SEGÚN TAB SELECCIONADA */}
        <main className="flex-1 overflow-y-auto px-6 no-scrollbar pb-32">

          {/* VISTA: INICIO */}
          {activeTab === 'inicio' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-fade-in">
              <div className="relative w-full aspect-square max-w-[280px] bg-gradient-to-b from-blue-500/10 to-transparent rounded-[3rem] p-8 flex items-center justify-center">
                 <img src={heroImg} className="w-full h-full object-contain" alt="Chango IA" />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-2xl font-black text-white leading-tight">Chango IA: Tu<br/>asistente de ahorro.</h2>
                <p className="text-sm text-gray-500 px-4">Escaneá productos y descubrí ofertas personalizadas.</p>
              </div>

              {cart.length === 0 && (
                 <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                        <ShoppingCart className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest">Tu changuito está vacío</p>
                 </div>
              )}

              <button
                onClick={() => setIsScannerOpen(true)}
                className="w-full bg-diaRed-600 hover:bg-diaRed-700 text-white rounded-2xl py-5 shadow-[0_10px_20px_rgba(229,18,27,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <Barcode className="w-6 h-6" />
                <span className="font-black text-sm uppercase tracking-widest">ESCANEAR</span>
              </button>
            </div>
          )}

          {/* VISTA: CHANGUITO (Basado en Imagen 4 de Stitch) */}
          {activeTab === 'changuito' && (
            <div className="pt-4 space-y-8 animate-fade-in">
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    Mi Changuito <span className="text-blue-500 italic">IA</span>
                </h2>

                {/* Dashboard de Totales */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1A1D24] p-5 rounded-3xl border border-white/5 space-y-1">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total a Pagar:</p>
                        <p className="text-lg font-black text-white">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cart.reduce((acc, i) => acc + i.price * i.quantity, 0))}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-3xl shadow-lg space-y-1 relative overflow-hidden">
                        <Sparkles className="absolute -top-1 -right-1 w-12 h-12 text-white/10 rotate-12" />
                        <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Tu Ahorro:</p>
                        <p className="text-lg font-black text-white">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(cart.reduce((acc, i) => acc + (i.listPrice - i.price) * i.quantity, 0))}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <CartList
                        items={cart}
                        onUpdateQuantity={(ean, q) => setCart(prev => prev.map(i => i.ean === ean ? {...i, quantity: q} : i))}
                        onRemoveItem={(ean) => setCart(prev => prev.filter(i => i.ean !== ean))}
                        onClearCart={() => window.confirm('¿Vaciar?') && setCart([])}
                    />
                </div>

                <div className="space-y-3 pt-4">
                    <button className="w-full py-5 bg-diaRed-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        Finalizar Compra
                    </button>
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="w-full py-5 bg-transparent border-2 border-white/5 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all"
                    >
                        Seguir Escaneando
                    </button>
                </div>
            </div>
          )}

          {activeTab === 'ofertas' && <div className="text-center pt-20 text-gray-500 font-bold uppercase tracking-widest">Sección de Ofertas Próximamente</div>}
          {activeTab === 'perfil' && <div className="text-center pt-20 text-gray-500 font-bold uppercase tracking-widest">Tu Perfil Próximamente</div>}

        </main>

        {/* BARRA DE NAVEGACIÓN INFERIOR - Estilo Stitch */}
        <nav className="absolute bottom-0 inset-x-0 bg-[#0F1115] border-t border-white/5 px-8 pb-8 pt-4 flex justify-between items-center shrink-0">
            <button onClick={() => setActiveTab('inicio')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'inicio' ? 'text-diaRed-600' : 'text-gray-600'}`}>
                <Home className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Inicio</span>
            </button>
            <button onClick={() => setActiveTab('ofertas')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'ofertas' ? 'text-diaRed-600' : 'text-gray-600'}`}>
                <Tag className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Ofertas</span>
            </button>
            <button onClick={() => setActiveTab('changuito')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'changuito' ? 'text-diaRed-600' : 'text-gray-600'}`}>
                <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-diaRed-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0F1115]">{cart.length}</span>}
                </div>
                <span className="text-[9px] font-black uppercase tracking-tighter">Changuito</span>
            </button>
            <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'perfil' ? 'text-diaRed-600' : 'text-gray-600'}`}>
                <User className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase tracking-tighter">Mi Cuenta</span>
            </button>
        </nav>

      </div>

      {/* Modales centrado */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-8 bg-black/95 backdrop-blur-2xl">
          <div className="relative w-full max-w-[420px] h-full sm:h-auto">
            <Scanner onScanSuccess={handleBarcodeScanned} onScanError={alert} onClose={() => setIsScannerOpen(false)} />
          </div>
        </div>
      )}

      <ProductBottomSheet isOpen={isBottomSheetOpen} product={scannedProduct} onClose={() => setIsBottomSheetOpen(false)} onConfirm={handleConfirmProduct} />
      <ManualFallbackModal isOpen={isManualModalOpen} ean={activeEan} errorType={errorType} onClose={() => setIsManualModalOpen(false)} onConfirm={(p) => { setCart(prev => [...prev, p]); setIsManualModalOpen(false); }} />

      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1A1D24] p-10 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border border-white/5">
            <div className="w-12 h-12 border-4 border-diaRed-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-black text-white uppercase tracking-widest tracking-[0.2em]">Analizando...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

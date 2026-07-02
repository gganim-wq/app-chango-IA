import urllib.request
import json
import socket
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Proxy Scraper Chango Dia", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/consultar")
def consultar_producto(ean: str = Query(..., min_length=1, max_length=13)):
    # Intentar varios formatos de búsqueda en Dia (VTEX)
    urls_to_try = [
        f"https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?fq=alternateIds_Ean:{ean}",
        f"https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?fq=ean:{ean}",
        f"https://diaonline.supermercadosdia.com.ar/api/catalog_system/pub/products/search?ft={ean}"
    ]
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Accept-Language": "es-AR,es;q=0.9",
        "Cache-Control": "no-cache"
    }

    data = []
    for url in urls_to_try:
        try:
            print(f"Probando: {url}")
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=6.0) as response:
                if response.getcode() == 200:
                    temp_res = response.read().decode("utf-8")
                    if temp_res:
                        temp_data = json.loads(temp_res)
                        if temp_data and len(temp_data) > 0:
                            data = temp_data
                            print(f"¡Producto encontrado!")
                            break
        except Exception as e:
            print(f"Error en intento: {e}")
            continue

    if not data or len(data) == 0:
        return {
            "status": "not_found",
            "message": f"Producto {ean} no encontrado en Dia Online."
        }

    try:
        product = data[0]
        product_name = product.get("productName", "Producto Sin Nombre")

        # Buscar el item específico que coincida con el EAN
        target_item = product.get("items", [{}])[0]
        for item in product.get("items", []):
            if ean in item.get("ean", []):
                target_item = item
                break

        image_url = target_item.get("images", [{}])[0].get("imageUrl", "")
        offer = target_item.get("sellers", [{}])[0].get("commertialOffer", {})
        price = offer.get("Price")
        list_price = offer.get("ListPrice", price)

        if price is None:
            return {"status": "not_found", "message": "Precio no disponible"}

        # Lógica de ofertas (2x1, 3x2, etc)
        clusters = product.get("productClusters", {})
        cluster_str = " ".join(clusters.values()).upper()

        oferta_activa = list_price > price
        tipo_oferta = "Directa" if oferta_activa else "Ninguna"
        qty_promo_formula = None

        if "2X1" in cluster_str:
            oferta_activa, tipo_oferta, qty_promo_formula = True, "Por Cantidad", "2x1"
        elif "3X2" in cluster_str:
            oferta_activa, tipo_oferta, qty_promo_formula = True, "Por Cantidad", "3x2"
        elif "70" in cluster_str or "SEGUNDA" in cluster_str:
            oferta_activa, tipo_oferta, qty_promo_formula = True, "Por Cantidad", "2da 70"

        return {
            "status": "success",
            "ean": ean,
            "name": product_name,
            "listPrice": list_price,
            "price": price,
            "ofertaActiva": oferta_activa,
            "tipoOferta": tipo_oferta,
            "qtyPromoFormula": qty_promo_formula,
            "imageUrl": image_url
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("servidor_chango:app", host="0.0.0.0", port=8000, reload=True)

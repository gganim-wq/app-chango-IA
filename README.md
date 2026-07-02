# App Carro Dia Argentina (Chango Supermercado)

## Resumen Ejecutivo

**App Carro Dia Argentina** es una aplicación híbrida (Web/Móvil) diseñada para optimizar y controlar la experiencia de compra en tiempo real en los supermercados Dia de Argentina. La aplicación permite a los usuarios escanear los códigos de barras (EAN-13) de los productos directamente desde las góndolas usando la cámara de su dispositivo móvil o ingresarlos manualmente en caso de fallas de red o demoras en la respuesta del servidor.

El sistema se conecta de forma dinámica con las APIs de la tienda online de Supermercados Dia mediante un servidor proxy ligero desarrollado en **Python con FastAPI**. Esto permite recuperar el precio oficial actualizado, comparar precios de lista con precios de oferta, identificar promociones vigentes (tales como "Club Dia", "2x1", "3x2", o descuento en la segunda unidad) y calcular el total acumulado en el chango de compras de manera instantánea.

### Características Clave
*   **Escaneo Autónomo**: Integración con cámara mediante Capacitor para una lectura de códigos de barra rápida y fluida en dispositivos móviles.
*   **Scraper Proxy de Alta Velocidad**: Backend en FastAPI que consulta y parsea en tiempo real los datos de la API pública de Dia Online.
*   **Resiliencia de Red (Timeout de 4s)**: Mecanismo de contingencia inteligente que, ante demoras del servidor remoto tras 4 segundos de espera, interrumpe la búsqueda y habilita una ventana interactiva (Bottom Sheet) para la carga y edición manual de los datos del producto (Nombre y Precio).
*   **Cálculo de Ofertas Inteligente**: Identificación y desglose de descuentos directos, ofertas Club Dia y promociones por cantidad para reflejar el ahorro real del cliente en todo momento.
*   **Interfaz Mobile-First (Una sola mano)**: Diseño ergonómico adaptado a dispositivos táctiles con botones de acción grandes (mínimo 44x44px), teclado numérico automático y un botón de escaneo flotante de fácil alcance.
*   **Soporte Adaptativo Claro/Oscuro**: Cumplimiento visual con un esquema de colores moderno y acentos en el emblemático **Rojo Dia (`#E5121B`)**.

---

## Requisitos Previos

Antes de iniciar el desarrollo o producción, asegúrese de contar con:
1.  **Node.js** (v18.0 o superior) y **npm** (v9.0 o superior).
2.  **Python** (v3.9 o superior) para ejecutar el servidor de scraping.
3.  **Dependencias de Python**: `fastapi`, `uvicorn`.

---

## Comandos del Desarrollador

Para poner en marcha la aplicación localmente en su entorno de desarrollo, siga los siguientes pasos:

### 1. Clonar o Ubicarse en el Directorio del Proyecto
Abra su terminal (PowerShell o CMD en Windows) en la ruta del proyecto:
```bash
cd "c:\Gustavo\App Chango Supermercado"
```

### 2. Levantar el Servidor Proxy (Backend)
Instale las dependencias de Python si aún no lo ha hecho:
```bash
pip install fastapi uvicorn
```
Ejecute el servidor local de desarrollo:
```bash
python servidor_chango.py
```
*   El servidor iniciará en: `http://127.0.0.1:8000`
*   La documentación interactiva de la API estará disponible en: `http://127.0.0.1:8000/docs`

### 3. Levantar la Aplicación Web (Frontend)
En otra terminal, instale las dependencias de Node.js:
```bash
npm install
```
Ejecute el servidor de desarrollo Vite con soporte HMR:
```bash
npm run dev
```
*   La aplicación web estará disponible por defecto en: `http://localhost:5173`

### 4. Analizar la Calidad del Código (Linter)
Para ejecutar un escaneo rápido del código javascript/react usando **Oxlint**:
```bash
npm run lint
```

---

## Estructura del Directorio

A continuación se detalla la estructura principal del proyecto para facilitar su navegación y mantenimiento:

```text
c:\Gustavo\App Chango Supermercado\
│
├── .gitignore               # Archivos y carpetas ignorados por Git (node_modules, cachés, etc.)
├── .oxlintrc.json           # Configuración de reglas y optimización del linter Oxlint
├── index.html               # Plantilla base HTML de la aplicación SPA
├── package.json             # Manifiesto de npm, scripts y dependencias (React 19, Vite 8, Oxlint)
├── postcss.config.js        # Configuración del procesador CSS PostCSS
├── servidor_chango.py       # API Backend en FastAPI (Proxy Scraper de la API de Supermercados Dia)
├── tailwind.config.js       # Configuración de Tailwind CSS (colores de acento, tipografías y vistas)
├── vite.config.js           # Configuración del empaquetador rápido Vite
│
├── public/                  # Recursos estáticos públicos de la aplicación
│   └── icons.svg            # Archivo sprite con los íconos Lucide empaquetados
│
└── src/                     # Código fuente del Frontend React
    ├── assets/              # Imágenes y recursos estáticos multimedia
    │   ├── hero.png         # Ilustración/Logo de bienvenida de la aplicación
    │   ├── react.svg        # Logo de la librería React
    │   └── vite.svg         # Logo de la herramienta de compilación Vite
    │
    ├── App.css              # Estilos globales y reglas de maquetación específicas
    ├── App.jsx              # Componente principal y controlador de vistas, estados y lógica del carrito
    ├── index.css            # Archivo de entrada de estilos Tailwind CSS
    └── main.jsx             # Punto de entrada de renderizado React 19 en el DOM
```

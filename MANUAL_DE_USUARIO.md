# Manual de Usuario

¡Bienvenido a **App Carro Dia Argentina** (Chango Supermercado)! Esta aplicación está diseñada para ayudarte a controlar tus gastos en tiempo real mientras realizas tus compras en las góndolas de Supermercados Dia. 

Con esta aplicación podrás escanear códigos de barras, visualizar los precios de lista y de oferta, clasificar las promociones, ajustar las cantidades y conocer exactamente cuánto vas a pagar en la caja antes de llegar a ella.

---

## 1. Primeros Pasos e Interfaz Adaptativa

Al abrir la aplicación en tu celular, notarás un diseño limpio y moderno optimizado para su uso cómodo con una sola mano:

*   **Modo Claro / Modo Oscuro automático**: La interfaz cambia de color de manera inteligente adaptándose al tema visual que tengas configurado en tu teléfono móvil. En entornos de baja luminosidad (como los pasillos del supermercado), el Modo Oscuro se activará automáticamente para facilitarte la lectura sin cansar la vista.
*   **Diseño para una sola mano**: Los elementos interactivos clave, como el botón flotante de escaneo y los controles de cantidad, están posicionados en la zona inferior de la pantalla para que puedas tocarlos cómodamente con tu dedo pulgar mientras sostienes el changuito con la otra mano.
*   **Botones Táctiles Amplios**: Todos los botones de acción rápida miden al menos **44x44 píxeles**, previniendo pulsaciones accidentales mientras caminas.

---

## 2. Escanear un Producto

Para agregar un producto a tu carrito de compras virtual, sigue estos pasos:

1.  Presiona el **botón flotante rojo con el icono de cámara** ubicado en la esquina inferior de la pantalla.
2.  Dale permiso a la aplicación para utilizar la cámara de tu celular (solo la primera vez).
3.  Apunta con la cámara hacia el código de barras (EAN-13) del producto en la góndola. Intenta mantener el celular estable y a una distancia de 10 a 15 cm.
4.  Una vez leído el código de barras, el celular realizará una **vibración corta** para confirmarte el escaneo exitoso y la cámara se cerrará de inmediato.
5.  El sistema buscará los datos en el catálogo online de Dia y el producto aparecerá automáticamente en tu listado del carrito.

---

## 3. Contingencia ante Fallas de Red (Carga Manual)

El interior de los supermercados suele tener problemas de cobertura móvil o Wifi lento. Si al escanear un producto, el servidor de Dia tarda más de **4 segundos** en responder o tu celular no tiene conexión a internet:

1.  La aplicación interrumpirá la búsqueda web automáticamente para no dejarte esperando.
2.  Se desplegará una **Bottom Sheet** (ventana flotante desde la parte inferior de la pantalla) indicando que ocurrió un problema de red.
3.  En esta ventana podrás rellenar rápidamente los datos usando tu pulgar:
    *   **Nombre del Producto**: (ej. *Leche Entera Dia 1L*)
    *   **Precio Unitario**: Ingresa el precio que ves físicamente en el cartel de la góndola. El teclado numérico se abrirá automáticamente.
    *   **Cantidad**: Elige cuántas unidades vas a llevar.
4.  Presiona el botón **Agregar al Carro**. El producto se sumará al listado con la etiqueta **"Carga Manual"**, asegurando que el total de tu carrito se mantenga exacto y actualizado.

---

## 4. Visualización de Ofertas y Promociones

La aplicación procesa y etiqueta automáticamente los precios para que no tengas que hacer cálculos mentales complejos:

*   **Precio Regular (Sin Descuentos)**: Se muestra en color negro (o blanco en Modo Oscuro) con fuente regular.
*   **Producto en Oferta**: Si el producto cuenta con una rebaja en la tienda online, el precio de lista anterior se mostrará **tachado en color gris** y el precio final a pagar se destacará en **Rojo Dia brillante**.
*   **Etiquetas de Promoción**: Cada ítem en el carro puede mostrar una etiqueta descriptiva según la promoción detectada:
    *   🏷️ **Oferta Directa**: Descuentos generales aplicados sobre el artículo.
    *   💳 **Club Dia**: Descuentos exclusivos que se aplican únicamente si presentas tu tarjeta de beneficios Club Dia en la caja.
    *   📦 **Por Cantidad**: Promociones que requieren llevar múltiples unidades (por ejemplo, *2x1*, *3x2*, o *2da unidad al 70%*).

---

## 5. Modificar Cantidades y Eliminar Productos

Puedes ajustar las unidades de cualquier artículo directamente desde la lista principal del carrito de compras:

*   **Incrementar Unidades**: Toca el botón **`+`** al lado del producto. El total acumulado se actualizará inmediatamente en la parte inferior de la pantalla.
*   **Reducir Unidades**: Toca el botón **`-`** al lado del producto.
*   **Eliminar un Producto**: 
    *   Si reduces la cantidad por debajo de 1 con el botón **`-`**, el sistema te mostrará una confirmación visual rápida y eliminará el producto del carro.
    *   También puedes presionar el icono del **Tacho de Basura** en el lateral derecho de la fila del producto para eliminarlo al instante.

---

## 6. Limpiar el Carrito (Vaciar Chango)

Si deseas comenzar una nueva compra de cero o ya pasaste por caja y quieres vaciar la aplicación:

1.  Presiona el botón **Vaciar Carrito** (icono de papelera general) en el encabezado o al final de la lista del carrito.
2.  Aparecerá un mensaje de alerta solicitando confirmación: *"¿Estás seguro de que deseas vaciar todo el carrito?"* para evitar pérdidas de información por toques accidentales.
3.  Confirma la acción. Todo el listado se borrará del almacenamiento del celular (`LocalStorage`) y el contador volverá a `$0.00`.

---

## 7. Consejos Útiles para la Compra
*   **Verificación visual**: Compara siempre el precio que muestra la aplicación con el cartel físico de la góndola. Si notas una diferencia, puedes presionar la opción de edición en el producto dentro del carro para corregirlo manualmente.
*   **Uso de Linterna**: Si el pasillo del supermercado está muy oscuro y la cámara tiene problemas para enfocar el código de barras, puedes activar la linterna integrada presionando el icono de rayo dentro de la pantalla de escaneo.

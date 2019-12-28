# 📰 El grid

Iniciamos con tener la estructura siguiente en el HTML:

-   `grid`: El contenedor que será el grid de nuestro _layout._
-   `item`: Los elementos de nuestro _grid._
-   `content`: Es el contenedor que envuelve nuestros elementos del _grid_ / _grid items_


        <section class="grid">

          <div class="item">

            <div class="content">

            </div>

          </div>

        </section>

Establecemos en nuestros estilos, haciendo uso de _css grid layout _

    .grid {

      display: grid;

      grid-gap: 16px;

      grid-template-columns: repeat(auto-fill, minmax(350px,1fr));

      grid-auto-rows: 20px; //Como minimo, este varia de forma dinámica

    }

-   `grid-gap`: Es la separación entre los elementos del _grid._
-   `grid-template-columns`: Es más complicado y es la forma en que definimos las columnas de la cuadrícula. Es bastante simple configurar un número definido de columnas de ancho fijo, pero vamos a desarrollar nuestra capacidad de respuesta al usar este parámetro.

El valor **repeat(auto-fill, minmax(350px,1fr))** especifica lo siguiente:

-   `repeat`:Crea multiples columnas similares.
-   `auto-fill`: Crear tantas columnas que quepan en el ancho de cuadrícula disponible.
-   `minmax(250px,1fr)`: Las columnas deben tener un ancho mínimo de 250px y un ancho máximo flexible que es el mismo para cada columna.

Esto significa que la cuadrícula se llena con tantas columnas de 250 píxeles de ancho como sea posible. A medida que la cuadrícula se hace más grande, todas las columnas aumentan de igual ancho hasta que haya suficiente espacio para una columna adicional de 250 píxeles.

![](https://storage.googleapis.com/slite-api-files-production/files/e437d893-b567-41ad-bd31-2ff2aded21b7/image01.gif)

Entonces ya tenemos un diseño de cuadrícula simple.



1.  Los elementos(_items_) se organizan en columnas manteniendo su orden dado.
2.  Las alturas de fila se ajustan automáticamente al elemento más grande en esa fila.
3.  La cuadrícula mueve automáticamente los elementos a nuevas columnas según lo permita el espacio.

# 🔠 Spanning multiple rows

Por el momento, las filas se dimensionan automáticamente para permitir que los elementos más grandes de cada fila se muestren por completo. En su lugar, restringiremos los tamaños de fila a una altura predeterminada:

    .grid {

       display: grid;

       grid-gap: 10px;

       grid-template-columns: repeat(auto-fill, minmax(250px,1fr));

```
undefined
```

    }

-   `grid-auto-rows`: Limita el alto de las filas a 200px.

Con cada elemento todavía restringido a una sola fila, esto significa que todos los elementos ahora son demasiado altos para la fila y parte del contenido de cada elemento no se muestra.

![](https://storage.googleapis.com/slite-api-files-production/files/1135ba72-231b-48c2-acf0-e170a3f3c9d9/image.png)

Si cada uno de nuestros tipos de contenido tuviera una altura constante, podríamos configurar cada uno de nuestros tipos de contenido para abarcar un número diferente de filas:

    .photo {

       grid-row-end: span 2;

    }

    .project {

       grid-row-end: span 3;

    }

    .blog {

       grid-row-end: span 1;

    }

![](https://storage.googleapis.com/slite-api-files-production/files/627e8dfe-77ff-4478-b5e6-92168c284084/image.png)

Sin embargo, como muestra la captura de pantalla, esto no funcionará para nuestro contenido, ya que incluso el contenido del mismo tipo puede ser de diferentes tamaños. Por lo tanto, eliminaremos el código que acabamos de agregar configurando cada tipo de contenido para abarcar un número determinado de filas.

En cambio, **aquí es donde presentaremos JavaScript**. Revisaremos cada elemento individual y estableceremos el número de filas que abarca para que sea lo suficientemente alto como para que se muestre todo el contenido.

# 🔃 Establecer dinámicamente el intervalo de filas (row span)

En primer lugar, dentro de cada elemento colocamos otro `<div>` que envuelve todo el contenido y le asignamos la clase `content`.

    <div class="item blog">

       <div class="content">

          // EL CONTENIDO VA AQUÍ

       </div>

    </div>

Esto significa que podremos comparar la altura de este `div`** **`content` con la altura del _grid item_ que lo contiene. El objetivo será hacer que el _grid item_ sea lo suficientemente grande como para mostrar todo el contenido sin ser demasiado grande para crear un espacio en blanco en exceso.

A continuación, escribimos una función de JavaScript que cambia el tamaño de un elemento para que sea lo suficientemente grande como para mostrar todo el contenido dentro de él.

La función analiza el CSS ya aplicado a la rejilla(_grid)_. A partir de esto, encuentra la altura de las filas (_**grid-auto-rows**_) y el espacio vertical entre filas (_**grid-row-gap**_).

Ahora que conocemos la altura de cada fila(_row_) y espacio(_span_), podemos calcular la cantidad de filas requeridas para acomodar la altura del contenido del elemento.

Este valor calculado se aplica al valor del elemento (_**grid-row-end**_).

    function resizeGridItem(item){

       grid = document.getElementsByClassName("grid")[0];

       rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));

       rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));

       rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));

       item.style.gridRowEnd = "span "+rowSpan;

    }

Esta función cambia el tamaño de los elementos individualmente. También necesitamos una función que permita cambiar el tamaño de todos los elementos a la vez. Esta función busca todos los elementos en la cuadrícula y recorre la función individual de cambio de tamaño en cada uno.

    function resizeAllGridItems(){

       allItems = document.getElementsByClassName("item");

       for(x=0; x<allItems.length; x++){

          resizeGridItem(allItems[x]);

       }

    }

Esto significa que podemos llamar a la función que redimensiona todos los elementos una vez que la página se ha cargado.

    window.onload = resizeAllGridItems();

El ancho de las columnas también cambia cuando se cambia el tamaño del navegador, por lo que también llamaremos a esta función al cambiar el tamaño de la ventana.

    window.addEventListener("resize", resizeAllGridItems);

Finalmente, aunque llamamos a la función _**resizeAllGridItems()**_ (cambiar el tamaño de todos los elementos) cuando se carga la página, no significa necesariamente que se hayan cargado todas las imágenes de la página. A medida que las imágenes se cargan, aumentan el tamaño del contenido en el que se encuentran. Por lo tanto, es posible que estos elementos necesiten abarcar más filas de las calculadas al principio.

Para manejar esto, usaré la biblioteca[ imagesLoaded.js.](https://imagesloaded.desandro.com) Esto puede llamar a una función cuando las imágenes dentro de un elemento se han cargado.

Después de incluir la biblioteca en nuestro proyecto, adjuntamos el controlador **imagesLoaded **a todos los grid items y llamamos a una nueva función _**resizeInstance()**_.

    // Este fragmento solo es para habilitar la libreria de imagesLoader

    allItems = document.getElementsByClassName("item");

    for(x=0;x<allItems.length;x++){

       imagesLoaded( allItems[x], resizeInstance);

    }

Esta función pasa el grid item individual a nuestra función _**resizeGridItem()**_ ya existente.



Esto significa que cuando todas las imágenes hayan terminado de cargarse dentro de un _grid item_, se redimensionará para garantizar que el contenido se muestre completamente.

    function resizeInstance(instance){

       item = instance.elements[0];

       resizeGridItem(item);

    }

Eso es todo el JavaScript que se necesita. 

1.  Cuando la página se carga, se calcula la altura de cada elemento y se establece dinámicamente el número de filas de cuadrícula que abarca. 
2.  Luego, cuando se cargan las imágenes o se cambia el tamaño de la página, la altura de los elementos se calcula nuevamente para garantizar que todavía se ajusten. 

# ⬇ Optimizando la altura de la fila

Algunos elementos tienen una gran cantidad de espacio en blanco en la parte inferior. Esto se debe a que los elementos abarcan el número de filas necesarias para ser mayor que su altura de contenido. Si observa detenidamente la captura de pantalla debajo de las filas y el espaciado se han dibujado sobre la cuadrícula. Puede ver que el Elemento 4 es más alto que 2 filas, por lo que está configurado para abarcar 3 filas. Esto deja una brecha bastante grande sin llenar.

![](https://storage.googleapis.com/slite-api-files-production/files/628be295-9f7f-43a7-875a-8223a8b3ed83/image.png)

La solución es establecer la altura de las filas en un valor menor:

    .grid {

       display: grid;

       grid-gap: 10px;

       grid-template-columns: repeat(auto-fill, minmax(250px,1fr));

       

    }

Cada elemento abarcará más filas, pero hay menos espacio en blanco en la parte inferior de los elementos.

![](https://storage.googleapis.com/slite-api-files-production/files/b1a86129-0750-43ef-a61c-1eaf6792064c/image.png)

**DEMO **e implementación final en https://github.com/icao/pinterest-grid

# 🤗 El fin

Y eso es. Espero haberte mostrado una manera simple de hacer un diseño de Mansory estándar usando CSS Grid y solo un pequeño fragmento de JavaScript.

Extracción del post [Masonry style layout with CSS Grid](https://medium.com/@andybarefoot/a-masonry-style-layout-using-css-grid-8c663d355ebb)

# 🚦 Solución optimizada

La propuesta aún se puede optimizar y eliminar algunos procesos.

Siguiendo el mismo principio de tener un _grid_ que contenga a sus elementos organizados, podemos lograrlo con tener solo 2 elementos a los cuales usaremos para lograr el cometido.

1.  _**grid**_: El elcargado de organizar a sus hijos de manera ordenada en columnas y filas, procurando una separación entre los elementos.
2.  _**item**_: El elemento que contiene la información a graficar, el cual con JavaScript nos ayudará a establecer la altura de los elementos.

-   Uno de los problemas de la resolución que tenía era que, en algunos casos, los artículos tenían sus alturas estiradas para que coincidieran con un artículo de un hermano.
-   Otro problema era que los huecos de la cuadrícula no siempre eran consistentes. Esto debido a que se establecia `grid-auto-rows: 40px;`

Acontinuación la nueva implementación:

    (function() {

      window.addEventListener("load", resize); //Escucha la carga de la página

      window.addEventListener("resize", resize); // Escucha el redimencionamiento

      function resize() {

        const grid = document.querySelector(".grid"); // Elemento grid (rejilla)

        const rowHeight = getStyleValue(grid, "grid-auto-rows"); // numero de filas en el grid

        const rowGap = getStyleValue(grid, "grid-row-gap"); // espacio entre las filas

        grid.style.gridAutoRows = "auto";

        grid.style.alignItems = "self-start";

        //A todos los elementos del grid, asignales una altura con span, deacuerdo a su contenido

        grid.querySelectorAll(".item").forEach(item => {

          item.style.gridRowEnd = `span ${Math.ceil(

            (item.clientHeight + rowGap) / (rowHeight + rowGap)

          )}`;

        });

        grid.removeAttribute("style"); //Remueve el atributo estilo para que al redimensionar vuelva a ponerselo

      }

     

      function getStyleValue(element, style) {

        return parseInt(window.getComputedStyle(element).getPropertyValue(style));

      }

    })();

La principal diferencia es establecer el campo `grid-auto-rows` de la cuadrícula en `auto `antes de cambiar el tamaño de cada` .item` y luego reasignar `grid-auto-rows` al valor CSS almacenado una vez completado. 

    grid.style.gridAutoRows = "auto";

Al agregar `alignItems: "self-start"` al elemento de cuadrícula antes de calcular las alturas, se aseguró de que la altura de cada elemento fuera precisa:

    grid.style.alignItems = "self-start";

La eliminación de `alignItems: "self-start"` de la cuadrícula aseguró que todos los huecos de la cuadrícula fueran consistentes, ya que `align-items: stretch` es el valor predeterminado.

    grid.removeAttribute("style");

El evento de `load` se dispara después de que se hayan cargado las imágenes:

La razón por la que no funcionaba en el primer ejemplo es porque estaba asignando `window.onload `a `resizeAllGridItems()` en lugar de `resizeAllGridItems`.

Por lo tanto, `resizeAllGridItems `se disparó tan pronto como el navegador analizó esa línea, en lugar de en el evento de carga.

**NOTA**: Se reporta un bug para versiones de Chrome Version 65.0.3325.181, [ver seguimiento en este link](https://medium.com/@andybarefoot/hi-raphael-im-not-sure-why-but-your-updated-pen-looks-broken-at-the-bottom-c0372e42e2eb)

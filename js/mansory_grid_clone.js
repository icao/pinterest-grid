(function() {
  window.addEventListener("load", resize); //Escucha la carga de la pagina
  window.addEventListener("resize", resize); // Escucha el redimencionamiento 

  function resize() {
    const grid = document.querySelector(".grid"); // Elemento grid (rejilla)
    const rowHeight = getStyleValue(grid, "grid-auto-rows"); // numero de filas en el grid
    const rowGap = getStyleValue(grid, "grid-row-gap"); // espacio entre las filas
    grid.style.gridAutoRows = "auto"; //Acorta la distancia entre items
    grid.style.alignItems = "self-start";
    // Para alinearlos apilados hacia arriba
    //A todos los elementos del grid, asignales una altura con span, deacuerdo a su contenido
    grid.querySelectorAll(".item").forEach(item => {
      item.style.gridRowEnd = `span ${Math.ceil(
        (item.clientHeight + rowGap) / (rowHeight + rowGap)
      )}`;
    });
    grid.removeAttribute("style");  
     //Remueve el atributo estilo para que al redimensionar vuelva a ponerselo
  }
 
  function getStyleValue(element, style) {
    return parseInt(window.getComputedStyle(element).getPropertyValue(style));
  }
})();

// VER EXPLICACION EN: https://slite.com/api/s/note/DGwpkfstCqmtAP4AWBVzUC/Mansory-CSS-Grid-y-JS



// NORA IMPORTANTE:
// se intengo agregar a react, pero tiene fallas,
//cargando el script en el index de la app, o mandando a llamar en didComponent del item
// aun con los event listeners de load o resize, no se acomodan los elementos una vez cargado, se intento provocando un resize
//con el 
/*
componentDidMount() {
    this.getSizeImages()
    window.dispatchEvent(new Event("resize"));
    console.log('distpach event..................');
  }
  */
 
  // se corrige el problema, pero solo si las imagenes son pequeñas,
// al parecer si las imagenes son grandes, ni provocando un resize forzado con el dispatchEvent se webkitConvertPointFromPageToNode, ya que las imagenes por ser tangrandes se tardan. 
//   No se encontro algo que detecte la carga final de las imagenes para volver a forzar el resize

// No funciona por el momento con react
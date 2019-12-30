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
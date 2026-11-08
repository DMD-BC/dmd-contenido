/* DMD Contenido IA (proyecto aparte: Posts + Publicidad) — parche de enlaces.
   El CSS y el JS compartidos se cargan desde el sitio oficial
   (https://www.dmdmx.dev/style.css y /script.js), porque son
   archivos de 172 KB y 244 KB que no se pueden subir por partes
   sin romper su lógica (script.js es un solo bloque); ahí viven
   openPremiumModal, showDmdToast, el menú móvil y la barra inferior
   que usan estas páginas.
   El script oficial construye el menú móvil (drawer) y la barra
   inferior con enlaces relativos a las páginas del sitio oficial;
   en este dominio esas páginas no existen, así que este parche los
   reescribe a su URL absoluta en www.dmdmx.dev. Los enlaces a
   las páginas de Contenido IA (posts.html, publicidad.html) se dejan
   relativos: esas páginas sí viven en este proyecto. */
(function () {
  var OFFICIAL = "https://www.dmdmx.dev";
  var LOCAL_PAGES = ["posts.html", "publicidad.html"];
  function patchLinks() {
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      if (a.getAttribute("data-dmd-patched")) continue;
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) === "#" || href.indexOf(":") !== -1 || href.indexOf("//") === 0) {
        a.setAttribute("data-dmd-patched", "1");
        continue;
      }
      var page = href.split("?")[0].split("#")[0];
      if (page.slice(-5) === ".html" && LOCAL_PAGES.indexOf(page) === -1) {
        a.setAttribute("href", OFFICIAL + "/" + href);
      }
      a.setAttribute("data-dmd-patched", "1");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      patchLinks();
      setTimeout(patchLinks, 600);
    });
  } else {
    patchLinks();
    setTimeout(patchLinks, 600);
  }
})();

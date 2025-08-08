document.addEventListener("DOMContentLoaded", function () {
  // Botón para mostrar/ocultar CBC
  const toggleCBC = document.getElementById("toggleMaterias");
  const materiasCBC = document.getElementById("materiasContainer");
  toggleCBC.addEventListener("click", () => {
    materiasCBC.style.display = materiasCBC.style.display === "none" ? "block" : "none";
  });

  // Seleccionamos TODOS los botones de materias
  const allButtons = document.querySelectorAll(".btn-materia, .btn-materia-lic");
  const orientaciones = document.querySelectorAll(".btn-orientacion"); // botones de orientaciones

  // Función para actualizar desbloqueos según dependencias
  function actualizarDesbloqueos() {
    allButtons.forEach(button => {
      const dependsOn = button.dataset.dependsOn;
      if (dependsOn) {
        const deps = dependsOn.split(",").map(dep => dep.trim());
        const allApproved = deps.every(depId => localStorage.getItem(depId) === "tachado");
        if (allApproved) {
          button.disabled = false;
          button.classList.remove("disabled");
        } else {
          button.disabled = true;
          button.classList.add("disabled");
        }
      }
    });

    // Desbloquear orientaciones si TODAS las obligatorias están completas
    const obligatorias = document.querySelectorAll(".btn-materia.obligatoria");
        const todasObligatoriasOK = Array.from(obligatorias).every(btn => btn.classList.contains("tachado"));
const yaMostrado = localStorage.getItem("felicidadesMostrado") === "true";

if (todasObligatoriasOK) {
  // Mostrar la sección de orientaciones SIEMPRE
  document.getElementById("orientacionesSection").style.display = "block";

  // Activar botones de orientación
  orientaciones.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });

  // Mostrar cartel solo si no se mostró antes
  if (!yaMostrado) {
    mostrarFelicidades();
    localStorage.setItem("felicidadesMostrado", "true");
  }
} else {
  // Ocultar sección si se desmarcan obligatorias
  document.getElementById("orientacionesSection").style.display = "none";
  localStorage.removeItem("felicidadesMostrado");

  // Desactivar botones de orientación
  orientaciones.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });
}
  }

  // Función para actualizar barra de progreso
  function actualizarProgreso() {
    const total = allButtons.length;
    const completadas = Array.from(allButtons).filter(btn => btn.classList.contains("tachado")).length;
    const porcentaje = Math.round((completadas / total) * 100);

    const barra = document.getElementById("progresoInterno");
    barra.style.width = `${porcentaje}%`;
    barra.textContent = `${porcentaje}%`;
  }

  // Inicialización: restaurar estado y aplicar dependencias
  allButtons.forEach(button => {
    const id = button.dataset.id;
    if (!id) {
      console.warn("Botón sin data-id:", button.textContent);
      return;
    }

    // Restaurar estado
    if (localStorage.getItem(id) === "tachado") {
      button.classList.add("tachado");
    }

    // Listener de click
    button.addEventListener("click", function () {
      if (button.disabled) return;

      button.classList.toggle("tachado");
      const isTachado = button.classList.contains("tachado");

      if (isTachado) {
        localStorage.setItem(id, "tachado");
      } else {
        localStorage.removeItem(id);
      }

      actualizarDesbloqueos();
      actualizarProgreso();
    });
  });

  actualizarDesbloqueos();
  actualizarProgreso();
});
 

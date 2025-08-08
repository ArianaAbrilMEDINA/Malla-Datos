document.addEventListener("DOMContentLoaded", function () {
  // Botón para mostrar/ocultar CBC
  const toggleCBC = document.getElementById("toggleMaterias");
  const materiasCBC = document.getElementById("materiasContainer");
  toggleCBC.addEventListener("click", () => {
    materiasCBC.style.display = materiasCBC.style.display === "none" ? "block" : "none";
  });

  // Seleccionamos TODOS los botones de materias
  const allButtons = document.querySelectorAll(".btn-materia, .btn-materia-1");
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
    if (todasObligatoriasOK) {
      orientaciones.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("disabled");
      });
      mostrarFelicidades();
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

  // Mostrar cartel de "Felicidades"
function mostrarFelicidades() {
  // Mostrar la sección de orientaciones
  document.getElementById("orientacionesSection").style.display = "block";

  // Mostrar el cartel de felicitaciones si no existe
  if (!document.getElementById("felicidadesCartel")) {
    const cartel = document.createElement("div");
    cartel.id = "felicidadesCartel";
    cartel.textContent = "🎉 ¡Felicidades! Has completado todas las materias obligatorias.";
    cartel.style.position = "fixed";
    cartel.style.top = "20px";
    cartel.style.left = "50%";
    cartel.style.transform = "translateX(-50%)";
    cartel.style.background = "#4CAF50";
    cartel.style.color = "white";
    cartel.style.padding = "10px 20px";
    cartel.style.borderRadius = "10px";
    cartel.style.zIndex = "9999";
    document.body.appendChild(cartel);
    setTimeout(() => cartel.remove(), 4000);
  }
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
 

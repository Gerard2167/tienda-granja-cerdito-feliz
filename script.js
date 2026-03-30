const productos = [
  { nombre: "Chuleta de Lomo", img: "img/chuleta.jpg", stock: false },
  { nombre: "Costillas", img: "img/Costilla.jpg", stock: true },
  { nombre: "Pernil", img: "img/Pernil.jpg", stock: true },
  { nombre: "Patitas", img: "img/Patitas.jpg", stock: true },
  { nombre: "Cabeza", img: "img/Cabeza.jpg", stock: true }
];

const combos = [
  { nombre: "Combo Parrillero", lbs: 5, img: "img/Combo Parrillero.jpg", stock: true },
  { nombre: "Combo Familiar", lbs: 10, img: "img/Combo Familiar.jpg", stock: true }
];

document.addEventListener("DOMContentLoaded", function () {
  const regionGuardada = localStorage.getItem('region');
  const ubicacion = document.getElementById("ubicacion");

  if (ubicacion && regionGuardada) {
    ubicacion.innerHTML =
      regionGuardada === "interior"
        ? "📍 Entrega: Interior"
        : "📍 Entrega: Ciudad";
  }
});

let carrito = [];

const contenedor = document.getElementById("productos");
const contCombos = document.getElementById("combos");

// =========================
// RENDER PRODUCTOS
// =========================
productos.forEach(p => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="img-container">
      <img src="${p.img}" alt="${p.nombre}" class="producto-img-p">
      ${!p.stock ? '<div class="badge">Agotado</div>' : ''}
    </div>
    <h3>${p.nombre}</h3>
    ${p.stock ? `
      <button class="btn-add" onclick="agregar('${p.nombre}',2)">2 lb</button>
      <button class="btn-add" onclick="agregar('${p.nombre}',5)">5 lb</button>
      <button class="btn-add" onclick="agregar('${p.nombre}',10)">10 lb</button>
    ` : '<p class="agotado-texto">No disponible</p>'}
  `;

  contenedor.appendChild(div);
});

// =========================
// RENDER COMBOS
// =========================
combos.forEach(c => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="img-container">
      <img src="${c.img}" alt="${c.nombre}" class="producto-img-c">
      ${!c.stock ? '<div class="badge">Agotado</div>' : ''}
    </div>
    <h3>${c.nombre}</h3>
    <p>${c.lbs} lb surtidas</p>
    ${c.stock ? `<button class="btn-add" onclick="agregar('${c.nombre}',${c.lbs})">Agregar Combo</button>` : '<p class="agotado-texto">No disponible</p>'}
  `;

  contCombos.appendChild(div);
});

// =========================
// AGREGAR AL CARRITO
// =========================
function agregar(nombre, lbs) {
  const regionGuardada = localStorage.getItem('region');
  let precioBase = regionGuardada === 'interior' ? 2.25 : 2.5;

  let total = precioBase * lbs;

  if (lbs >= 10) total *= 0.9;
  carrito.push({ nombre, lbs, total });
  render();
}

// =========================
// ELIMINAR
// =========================
function eliminar(index) {
  carrito.splice(index, 1);
  render();
}

// =========================
// RENDER CARRITO
// =========================
function render() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach((item, index) => {
    suma += item.total;
    lista.innerHTML += `
      <div class="item">
        <span>${item.nombre} - ${item.lbs} lb ($${item.total.toFixed(2)})</span>
        <button class="btn-remove" onclick="eliminar(${index})">X</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = suma.toFixed(2);
}

// =========================
// ENVIAR PEDIDO
// =========================
function enviarPedido() {
  const nombre = document.getElementById("nombre").value;
  const correo = document.getElementById("correo").value;

  let mensaje = `🐷 Pedido Granja Cerdito Feliz%0A`;
  mensaje += `Cliente: ${nombre}%0A`;
  mensaje += `Correo: ${correo}%0A%0A`;
  mensaje += `🛒 Pedido:%0A`;

  carrito.forEach(item => {
    mensaje += `✔ ${item.nombre} ${item.lbs} lb ($${item.total.toFixed(2)})%0A`;
  });

  mensaje += `%0ATotal: $${document.getElementById("total").innerText}%0A`;
  mensaje += `💰 Pago por Yappy: 6288-4868%0A`;
  mensaje += `📦 Entrega programada`;

  window.open(`https://wa.me/50762884868?text=${mensaje}`);
}

// =========================
// VOLVER AL INICIO
// =========================
function volverInicio() {
  window.location.href = 'index.html';
}

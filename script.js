const productos = [
  { nombre: "Chuleta de Lomo", img: "img/chuleta.jpg", precioInterior: 2.75, precioCiudad: 3.25, tipo: "lb", stock: false },

  { nombre: "Costillas", img: "img/Costilla.jpg", precioInterior: 3.25, precioCiudad: 3.75, tipo: "lb", stock: true },

  { nombre: "Pernil", img: "img/Pernil.jpg", precioInterior: 2.75, precioCiudad: 3.25, tipo: "lb", stock: true },

  { nombre: "Patitas", img: "img/Patitas.jpg", precioInterior: 2.25, precioCiudad: 2.50, tipo: "lb", stock: true },

  { nombre: "Cabeza Completa", img: "img/Cabeza.jpg", precioInterior: 25, precioCiudad: 30, tipo: "unidad", stock: true },

  { nombre: "Media Cabeza", img: "img/Cabeza.jpg", precioInterior: 15, precioCiudad: 15, tipo: "unidad", stock: true }
];

const combos = [
  { 
    nombre: "Combo del Campo", 
    lbs: 5, 
    img: "img/Combo Parrillero.jpg", 
    precioInterior: 14, 
    precioCiudad: 16,
    descripcion: "✔️ Carne fresca<br>✔️ Porciones mixtas del cerdo<br>✔️ Ideal para varias comidas",
    stock: true 
  },
  { 
    nombre: "Combo Familiar", 
    lbs: 10, 
    img: "img/Combo Familiar.jpg", 
    precioInterior: 26, 
    precioCiudad: 30,
    descripcion: "✔️ Carne fresca<br>✔️ Porciones mixtas del cerdo<br>✔️ Ideal para familia grande",
    stock: true 
  }
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

  const precio = regionGuardada === 'interior' ? p.precioInterior : p.precioCiudad;

  div.innerHTML = `
    <div class="img-container">
      <img src="${p.img}" alt="${p.nombre}" class="producto-img-p">
      ${!p.stock ? '<div class="badge">Agotado</div>' : ''}
    </div>
    <h3>${p.nombre}</h3>
    <h4>$${precio} ${p.tipo === "lb" ? "/lb" : ""}</h4>

    ${p.stock ? (
      p.tipo === "lb" 
      ? `
        <button class="btn-add" onclick="agregar('${p.nombre}',2)">2 lb</button>
        <button class="btn-add" onclick="agregar('${p.nombre}',5)">5 lb</button>
        <button class="btn-add" onclick="agregar('${p.nombre}',10)">10 lb</button>
      `
      : `
        <button class="btn-add" onclick="agregar('${p.nombre}',0,${precio})">Comprar</button>
      `
    ) : '<p class="agotado-texto">No disponible</p>'}
  `;

  contenedor.appendChild(div);
});

// =========================
// RENDER COMBOS
// =========================
combos.forEach(c => {
  const div = document.createElement("div");
  div.className = "card";

  const precioCombo = regionGuardada === 'interior' ? c.precioInterior : c.precioCiudad;

  div.innerHTML = `
    <div class="img-container">
      <img src="${c.img}" alt="${c.nombre}" class="producto-img-c">
      ${!c.stock ? '<div class="badge">Agotado</div>' : ''}
    </div>
    <h3>${c.nombre}</h3>
    <p>${c.lbs} lb surtidas</p>

    <p class="combo-desc">${c.descripcion}</p>

    <h4>$${precioCombo}</h4>

    ${c.stock 
      ? `<button class="btn-add" onclick="agregar('${c.nombre}',0,${precioCombo})">Agregar Combo</button>`
      : '<p class="agotado-texto">No disponible</p>'
    }
  `;

  contCombos.appendChild(div);
});

// =========================
// AGREGAR AL CARRITO
// =========================
function agregar(nombre, lbs = 0, precioFijo = null) {
  const region = localStorage.getItem('region');
  let total = 0;

  if (precioFijo !== null) {
    total = precioFijo;
  } else {
    const producto = productos.find(p => p.nombre === nombre);
    const precio = region === 'interior' ? producto.precioInterior : producto.precioCiudad;
    total = precio * lbs;
  }

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

// Referencias a elementos
const form = document.getElementById('vehicle-form');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const vehiclesTableBody = document.querySelector('#vehicles-table tbody');
const downloadBtn = document.getElementById('download-btn');
const uploadFileInput = document.getElementById('upload-file');

// Estado local de vehículos
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
let editingId = null;

// Función para mostrar la lista en la tabla
function renderTable() {
    vehiclesTableBody.innerHTML = '';
    vehicles.forEach((v, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${v.vin}</td>
            <td>${v.marca}</td>
            <td>${v.modelo}</td>
            <td>${v.anio}</td>
            <td>${v.motor}</td>
            <td>${v.conductor}</td>
            <td>${v.descripcion}</td>
            <td>
                <button class="action-btn edit-btn" data-index="${index}">Editar</button>
                <button class="action-btn delete-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        vehiclesTableBody.appendChild(tr);
    });
}

// Guardar/Actualizar vehículo
form.addEventListener('submit', e => {
    e.preventDefault();

    const vehicleData = {
        vin: form.vin.value.trim(),
        marca: form.marca.value.trim(),
        modelo: form.modelo.value.trim(),
        anio: form.anio.value,
        motor: form.motor.value.trim(),
        conductor: form.conductor.value.trim(),
        descripcion: form.descripcion.value.trim(),
    };

    if (editingId === null) {
        // Nuevo vehículo
        vehicles.push(vehicleData);
    } else {
        // Actualizar existente
        vehicles[editingId] = vehicleData;
        editingId = null;
        saveBtn.textContent = 'Agregar Vehículo';
        cancelBtn.style.display = 'none';
    }

    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    form.reset();
    renderTable();
});

// Cancelar edición
cancelBtn.addEventListener('click', () => {
    editingId = null;
    form.reset();
    saveBtn.textContent = 'Agregar Vehículo';
    cancelBtn.style.display = 'none';
});

// Editar vehículo
vehiclesTableBody.addEventListener('click', e => {
    if (e.target.classList.contains('edit-btn')) {
        const index = e.target.dataset.index;
        const v = vehicles[index];
        editingId = index;

        form.vin.value = v.vin;
        form.marca.value = v.marca;
        form.modelo.value = v.modelo;
        form.anio.value = v.anio;
        form.motor.value = v.motor;
        form.conductor.value = v.conductor;
        form.descripcion.value = v.descripcion;

        saveBtn.textContent = 'Guardar Cambios';
        cancelBtn.style.display = 'inline-block';
    } else if (e.target.classList.contains('delete-btn')) {
        const index = e.target.dataset.index;
        if (confirm('¿Seguro que deseas eliminar este vehículo?')) {
            vehicles.splice(index, 1);
            localStorage.setItem('vehicles', JSON.stringify(vehicles));
            renderTable();
        }
    }
});

// Descargar JSON de vehículos
downloadBtn.addEventListener('click', () => {
    const dataStr = JSON.stringify(vehicles, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vehiculos.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Cargar JSON desde archivo
uploadFileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const importedVehicles = JSON.parse(evt.target.result);
            if (Array.isArray(importedVehicles)) {
                vehicles = importedVehicles;
                localStorage.setItem('vehicles', JSON.stringify(vehicles));
                renderTable();
                alert('Datos importados correctamente');
            } else {
                alert('Archivo inválido');
            }
        } catch {
            alert('Error al leer el archivo JSON');
        }
    };
    reader.readAsText(file);
});

// Renderizar al cargar la página
renderTable();

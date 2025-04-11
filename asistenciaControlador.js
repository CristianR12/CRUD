const { v4: uuidv4 } = require("uuid");

class AsistenciaControlador {
  constructor() {
    this.asistencias = [];

    this.consultar = this.consultar.bind(this);
    this.ingresar = this.ingresar.bind(this);
    this.actualizar = this.actualizar.bind(this);
    this.borrar = this.borrar.bind(this);
  }

  consultar(req, res) {
    try {
      res.status(200).json(this.asistencias);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  ingresar(req, res) {
    try {
      let body = req.body;

      // Si el body está en formato Buffer, se parsea
      if (Buffer.isBuffer(body)) {
        const json = body.toString("utf8");
        body = JSON.parse(json);
      }

      console.log("Body parseado:", body);

      const { nombre, estado } = body;

      // Validar que los campos no estén vacíos
      if (!nombre || !estado) {
        return res.status(400).send("Los campos no han sido llenados correctamente.");
      }

      // Validar que el nombre tenga máximo 50 caracteres
      if (nombre.length > 50) {
        return res.status(400).send("El nombre no debe exceder 50 caracteres.");
      }

      // Validar que el nombre contenga al menos dos palabras (nombre y apellido)
      if (!nombre.trim().includes(" ")) {
        return res.status(400).send("Por favor ingresa al menos nombre y apellido.");
      }

      // Validar la estructura del nombre usando una expresión regular
      const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
      if (!regexNombre.test(nombre)) {
        return res.status(400).send("El nombre ingresado no tiene una estructura válida.");
      }

      // Validar que el nombre no sea solo un carácter repetido (sin contar espacios)
      if (new Set(nombre.replace(/\s+/g, '').split('')).size < 2) {
        return res.status(400).send("El nombre ingresado no parece ser válido.");
      }

      // Validar que el estado de asistencia sea uno de los permitidos
      const estadosValidos = ["presente", "ausente", "excusa"];
      if (!estadosValidos.includes(estado.toLowerCase())) {
        return res.status(400).send("No es un estado de asistencia válido.");
      }

      // Crear el nuevo registro con un ID único
      const nuevo = {
        id: uuidv4(),
        nombre,
        estado
      };

      this.asistencias.push(nuevo);
      res.status(200).json(nuevo);
    } catch (err) {
      res.status(500).send("Error en ingresar: " + err.message);
    }
  }

  actualizar(req, res) {
    try {
      let body = req.body;

      if (Buffer.isBuffer(body)) {
        const json = body.toString("utf8");
        body = JSON.parse(json);
      }

      console.log("Body recibido en actualizar:", body);

      const { id } = req.params;
      const { nombre, estado } = body;

      const index = this.asistencias.findIndex(e => e.id === id);
      if (index === -1) {
        return res.status(404).send("Asistencia no encontrada");
      }

      if (nombre) {
        // Validar que el nombre tenga máximo 50 caracteres
        if (nombre.length > 50) {
          return res.status(400).send("El nombre no debe exceder 50 caracteres.");
        }

        // Validar que el nombre contenga al menos dos palabras (nombre y apellido)
        if (!nombre.trim().includes(" ")) {
          return res.status(400).send("Por favor ingresa al menos nombre y apellido.");
        }

        // Validar la estructura del nombre usando la expresión regular
        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/;
        if (!regexNombre.test(nombre)) {
          return res.status(400).send("El nombre ingresado no tiene una estructura válida.");
        }
        // Validar que el nombre no sea solo un carácter repetido (sin contar espacios)
        if (new Set(nombre.replace(/\s+/g, '').split('')).size < 2) {
          return res.status(400).send("El nombre ingresado no parece ser válido.");
        }
        this.asistencias[index].nombre = nombre;
      }
      if (estado) {
        // Validar el nuevo estado
        const estadosValidos = ["presente", "ausente", "excusa"];
        if (!estadosValidos.includes(estado.toLowerCase())) {
          return res.status(400).send("No es un estado de asistencia válido.");
        }
        this.asistencias[index].estado = estado;
      }

      res.status(200).json(this.asistencias[index]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  borrar(req, res) {
    try {
      const { id } = req.params;
      const index = this.asistencias.findIndex(e => e.id === id);
      if (index === -1) {
        return res.status(404).send("Registro no encontrado");
      }

      const eliminado = this.asistencias.splice(index, 1)[0];
      res.status(200).json(eliminado);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = new AsistenciaControlador();

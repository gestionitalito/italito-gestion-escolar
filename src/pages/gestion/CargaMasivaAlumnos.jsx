import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "../../firebase";

const columnasPlantilla = [
  "RUT Alumno",
  "Nombre Alumno",
  "Apellido Paterno",
  "Apellido Materno",
  "Fecha Nacimiento",
  "Nivel",
  "Jornada",
  "Domicilio",
  "Comuna",
  "Nombre Apoderado",
  "RUT Apoderado",
  "Teléfono Apoderado",
  "Correo Apoderado",
  "Nombre Madre",
  "Teléfono Madre",
  "Nombre Padre",
  "Teléfono Padre",
  "Sistema de Salud",
  "Alergias",
  "Enfermedades",
  "Medicamentos",
  "Contacto Emergencia",
  "Teléfono Emergencia",
  "Autorización Fotografías",
  "Autorización Retiro",
  "Observaciones",
  "Estado",
];

function limpiarTexto(valor) {
  return String(valor || "").trim();
}

function normalizarRut(rut) {
  return String(rut || "")
    .replace(/\./g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .toUpperCase();
}

function formatearFechaExcel(valor) {
  if (!valor) return "";

  if (typeof valor === "number") {
    const fecha = XLSX.SSF.parse_date_code(valor);
    if (!fecha) return "";

    const yyyy = fecha.y;
    const mm = String(fecha.m).padStart(2, "0");
    const dd = String(fecha.d).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
  }

  const texto = String(valor).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) return texto;

  const partes = texto.split(/[/-]/);
  if (partes.length === 3) {
    const [d, m, y] = partes;
    if (y?.length === 4) {
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  return texto;
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "";

  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();

  if (Number.isNaN(nacimiento.getTime())) return "";

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad >= 0 ? edad : "";
}

function normalizarAutorizacion(valor) {
  const texto = limpiarTexto(valor).toLowerCase();

  if (["si", "sí", "s", "autorizado", "autoriza"].includes(texto)) return true;
  if (["no", "n", "no autoriza"].includes(texto)) return false;

  return "";
}

function mapearFila(row, index) {
  const fechaNacimiento = formatearFechaExcel(row["Fecha Nacimiento"]);
  const rutParvulo = limpiarTexto(row["RUT Alumno"]);
  const rutNormalizado = normalizarRut(rutParvulo);

  const alumno = {
    rutParvulo,
    rutNormalizado,
    nombreParvulo: limpiarTexto(row["Nombre Alumno"]),
    apellidoPaterno: limpiarTexto(row["Apellido Paterno"]),
    apellidoMaterno: limpiarTexto(row["Apellido Materno"]),
    fechaNacimiento,
    edad: calcularEdad(fechaNacimiento),
    nivel: limpiarTexto(row["Nivel"]),
    jornada: limpiarTexto(row["Jornada"]),
    domicilio: limpiarTexto(row["Domicilio"]),
    comuna: limpiarTexto(row["Comuna"]),

    apoderado: {
      nombre: limpiarTexto(row["Nombre Apoderado"]),
      rut: limpiarTexto(row["RUT Apoderado"]),
      telefono: limpiarTexto(row["Teléfono Apoderado"]),
      correo: limpiarTexto(row["Correo Apoderado"]),
    },

    madre: {
      nombre: limpiarTexto(row["Nombre Madre"]),
      telefono: limpiarTexto(row["Teléfono Madre"]),
    },

    padre: {
      nombre: limpiarTexto(row["Nombre Padre"]),
      telefono: limpiarTexto(row["Teléfono Padre"]),
    },

    salud: {
      sistemaSalud: limpiarTexto(row["Sistema de Salud"]),
      alergias: limpiarTexto(row["Alergias"]),
      enfermedades: limpiarTexto(row["Enfermedades"]),
      medicamentos: limpiarTexto(row["Medicamentos"]),
    },

    emergencia: {
      contacto: limpiarTexto(row["Contacto Emergencia"]),
      telefono: limpiarTexto(row["Teléfono Emergencia"]),
    },

    autorizaciones: {
      fotografias: normalizarAutorizacion(row["Autorización Fotografías"]),
      retiro: normalizarAutorizacion(row["Autorización Retiro"]),
    },

    observaciones: limpiarTexto(row["Observaciones"]),
    estado: limpiarTexto(row["Estado"]) || "Activo",
  };

  const errores = [];

  if (!alumno.rutParvulo) errores.push("Falta RUT del alumno");
  if (!alumno.nombreParvulo) errores.push("Falta nombre del alumno");
  if (!alumno.apellidoPaterno) errores.push("Falta apellido paterno");
  if (!alumno.fechaNacimiento) errores.push("Falta fecha de nacimiento");
  if (!alumno.nivel) errores.push("Falta nivel");
  if (!alumno.apoderado.nombre) errores.push("Falta nombre del apoderado");
  if (!alumno.apoderado.telefono) errores.push("Falta teléfono del apoderado");

  return {
    idTemporal: `${index}-${rutNormalizado || Math.random()}`,
    filaExcel: index + 2,
    alumno,
    errores,
    duplicadoEnExcel: false,
    duplicadoEnFirestore: false,
    guardado: false,
  };
}

export default function CargaMasivaAlumnos() {
  const [archivoNombre, setArchivoNombre] = useState("");
  const [filas, setFilas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const resumen = useMemo(() => {
    const total = filas.length;
    const conErrores = filas.filter((f) => f.errores.length > 0).length;
    const duplicadosExcel = filas.filter((f) => f.duplicadoEnExcel).length;
    const duplicadosFirestore = filas.filter((f) => f.duplicadoEnFirestore).length;
    const listos = filas.filter(
      (f) =>
        f.errores.length === 0 &&
        !f.duplicadoEnExcel &&
        !f.duplicadoEnFirestore &&
        !f.guardado
    ).length;
    const guardados = filas.filter((f) => f.guardado).length;

    return {
      total,
      conErrores,
      duplicadosExcel,
      duplicadosFirestore,
      listos,
      guardados,
    };
  }, [filas]);

  const descargarPlantilla = () => {
    const datosEjemplo = [
      {
        "RUT Alumno": "12.345.678-9",
        "Nombre Alumno": "Juanito",
        "Apellido Paterno": "Pérez",
        "Apellido Materno": "González",
        "Fecha Nacimiento": "2020-05-14",
        Nivel: "Pre-Kínder",
        Jornada: "Mañana",
        Domicilio: "Los Aromos 123",
        Comuna: "Limache",
        "Nombre Apoderado": "María González",
        "RUT Apoderado": "11.111.111-1",
        "Teléfono Apoderado": "912345678",
        "Correo Apoderado": "apoderado@correo.cl",
        "Nombre Madre": "María González",
        "Teléfono Madre": "912345678",
        "Nombre Padre": "Pedro Pérez",
        "Teléfono Padre": "923456789",
        "Sistema de Salud": "Fonasa",
        Alergias: "Sin alergias informadas",
        Enfermedades: "Sin enfermedades informadas",
        Medicamentos: "No",
        "Contacto Emergencia": "María González",
        "Teléfono Emergencia": "912345678",
        "Autorización Fotografías": "Sí",
        "Autorización Retiro": "Sí",
        Observaciones: "",
        Estado: "Activo",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(datosEjemplo, {
      header: columnasPlantilla,
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alumnos");

    XLSX.writeFile(wb, "Plantilla_Carga_Masiva_Alumnos_Italito.xlsx");
  };

  const revisarDuplicadosEnFirestore = async (items) => {
    const revisados = [];

    for (const item of items) {
      if (!item.alumno.rutNormalizado) {
        revisados.push(item);
        continue;
      }

      const q = query(
        collection(db, "alumnos"),
        where("rutNormalizado", "==", item.alumno.rutNormalizado)
      );

      const snap = await getDocs(q);

      revisados.push({
        ...item,
        duplicadoEnFirestore: !snap.empty,
      });
    }

    return revisados;
  };

  const procesarArchivo = async (event) => {
    const archivo = event.target.files?.[0];

    if (!archivo) return;

    setCargando(true);
    setMensaje("");
    setArchivoNombre(archivo.name);

    try {
      const data = await archivo.arrayBuffer();
      const workbook = XLSX.read(data);
      const hoja = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(hoja, {
        defval: "",
      });

      let datosMapeados = json.map((row, index) => mapearFila(row, index));

      const contadorRut = {};

      datosMapeados.forEach((item) => {
        const rut = item.alumno.rutNormalizado;
        if (!rut) return;
        contadorRut[rut] = (contadorRut[rut] || 0) + 1;
      });

      datosMapeados = datosMapeados.map((item) => ({
        ...item,
        duplicadoEnExcel:
          item.alumno.rutNormalizado &&
          contadorRut[item.alumno.rutNormalizado] > 1,
      }));

      datosMapeados = await revisarDuplicadosEnFirestore(datosMapeados);

      setFilas(datosMapeados);
      setMensaje("Archivo leído correctamente. Revisa la vista previa antes de guardar.");
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo leer el archivo Excel. Revisa que tenga el formato correcto.");
    } finally {
      setCargando(false);
      event.target.value = "";
    }
  };

  const limpiarCarga = () => {
    setArchivoNombre("");
    setFilas([]);
    setMensaje("");
  };

  const guardarEnFirestore = async () => {
    const alumnosValidos = filas.filter(
      (f) =>
        f.errores.length === 0 &&
        !f.duplicadoEnExcel &&
        !f.duplicadoEnFirestore &&
        !f.guardado
    );

    if (alumnosValidos.length === 0) {
      setMensaje("No hay alumnos válidos para guardar.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      for (const item of alumnosValidos) {
        await addDoc(collection(db, "alumnos"), {
          ...item.alumno,
          origenCarga: "Excel",
          creadoEn: serverTimestamp(),
          actualizadoEn: serverTimestamp(),
        });
      }

      setFilas((prev) =>
        prev.map((item) => {
          const fueGuardado = alumnosValidos.some(
            (v) => v.idTemporal === item.idTemporal
          );

          return fueGuardado
            ? {
                ...item,
                guardado: true,
              }
            : item;
        })
      );

      setMensaje(`Se guardaron ${alumnosValidos.length} alumnos correctamente.`);
    } catch (error) {
      console.error(error);
      setMensaje("Ocurrió un error al guardar los alumnos en Firestore.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="gestion-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Italito Gestión Escolar</p>
          <h1>Carga Masiva de Alumnos</h1>
          <p>
            Sube una planilla Excel para registrar rápidamente alumnos en la
            base de datos institucional.
          </p>
        </div>

        <button className="btn-secondary" onClick={descargarPlantilla}>
          <Download size={18} />
          Descargar plantilla
        </button>
      </div>

      <section className="panel-card">
        <div className="upload-box">
          <div className="upload-icon">
            <FileSpreadsheet size={42} />
          </div>

          <h2>Subir archivo Excel</h2>
          <p>
            Utiliza la plantilla oficial para evitar errores en los nombres de
            las columnas.
          </p>

          <label className="btn-primary upload-label">
            <Upload size={18} />
            Seleccionar Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={procesarArchivo}
              hidden
            />
          </label>

          {archivoNombre && (
            <p className="archivo-nombre">
              Archivo seleccionado: <strong>{archivoNombre}</strong>
            </p>
          )}
        </div>

        {cargando && (
          <div className="estado-carga">
            <Loader2 className="spin" size={20} />
            Leyendo archivo Excel...
          </div>
        )}

        {mensaje && <div className="mensaje-sistema">{mensaje}</div>}
      </section>

      {filas.length > 0 && (
        <>
          <section className="resumen-grid">
            <div className="resumen-card">
              <span>Total filas</span>
              <strong>{resumen.total}</strong>
            </div>

            <div className="resumen-card success">
              <span>Listos para guardar</span>
              <strong>{resumen.listos}</strong>
            </div>

            <div className="resumen-card warning">
              <span>Con errores</span>
              <strong>{resumen.conErrores}</strong>
            </div>

            <div className="resumen-card warning">
              <span>Duplicados Excel</span>
              <strong>{resumen.duplicadosExcel}</strong>
            </div>

            <div className="resumen-card danger">
              <span>Ya existen</span>
              <strong>{resumen.duplicadosFirestore}</strong>
            </div>

            <div className="resumen-card success">
              <span>Guardados</span>
              <strong>{resumen.guardados}</strong>
            </div>
          </section>

          <section className="panel-card">
            <div className="acciones-carga">
              <div>
                <h2>Vista previa de alumnos</h2>
                <p>
                  Revisa los datos antes de guardarlos definitivamente en
                  Firestore.
                </p>
              </div>

              <div className="acciones-botones">
                <button className="btn-secondary danger" onClick={limpiarCarga}>
                  <Trash2 size={18} />
                  Limpiar
                </button>

                <button
                  className="btn-primary"
                  onClick={guardarEnFirestore}
                  disabled={guardando || resumen.listos === 0}
                >
                  {guardando ? (
                    <>
                      <Loader2 className="spin" size={18} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Guardar en Firestore
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="tabla-scroll">
              <table className="tabla-carga">
                <thead>
                  <tr>
                    <th>Fila</th>
                    <th>Estado</th>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Nivel</th>
                    <th>Jornada</th>
                    <th>Apoderado</th>
                    <th>Teléfono</th>
                    <th>Observación</th>
                  </tr>
                </thead>

                <tbody>
                  {filas.map((item) => {
                    const tieneProblemas =
                      item.errores.length > 0 ||
                      item.duplicadoEnExcel ||
                      item.duplicadoEnFirestore;

                    return (
                      <tr
                        key={item.idTemporal}
                        className={
                          item.guardado
                            ? "fila-ok"
                            : tieneProblemas
                            ? "fila-error"
                            : ""
                        }
                      >
                        <td>{item.filaExcel}</td>

                        <td>
                          {item.guardado ? (
                            <span className="badge success">
                              <CheckCircle2 size={14} />
                              Guardado
                            </span>
                          ) : tieneProblemas ? (
                            <span className="badge danger">
                              <AlertTriangle size={14} />
                              Revisar
                            </span>
                          ) : (
                            <span className="badge success">
                              <CheckCircle2 size={14} />
                              Correcto
                            </span>
                          )}
                        </td>

                        <td>{item.alumno.rutParvulo}</td>
                        <td>
                          {item.alumno.nombreParvulo}{" "}
                          {item.alumno.apellidoPaterno}{" "}
                          {item.alumno.apellidoMaterno}
                        </td>
                        <td>{item.alumno.nivel}</td>
                        <td>{item.alumno.jornada}</td>
                        <td>{item.alumno.apoderado.nombre}</td>
                        <td>{item.alumno.apoderado.telefono}</td>

                        <td>
                          {item.errores.length > 0 && (
                            <div>{item.errores.join(" | ")}</div>
                          )}

                          {item.duplicadoEnExcel && (
                            <div>RUT repetido dentro del Excel</div>
                          )}

                          {item.duplicadoEnFirestore && (
                            <div>Este RUT ya existe en Firestore</div>
                          )}

                          {!tieneProblemas && !item.guardado && (
                            <div>Listo para guardar</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
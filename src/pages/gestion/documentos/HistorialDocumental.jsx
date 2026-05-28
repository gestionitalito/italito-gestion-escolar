import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  Search,
  FileText,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CalendarDays,
  GraduationCap,
  Filter,
  AlertCircle,
  FolderOpen,
  Printer,
} from "lucide-react";

import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "../../../firebase";

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  try {
    if (fecha?.toDate) {
      return fecha.toDate().toLocaleDateString("es-CL");
    }

    const nuevaFecha = new Date(fecha);
    if (Number.isNaN(nuevaFecha.getTime())) return "Sin fecha";

    return nuevaFecha.toLocaleDateString("es-CL");
  } catch {
    return "Sin fecha";
  }
}

function obtenerFechaOrden(fecha) {
  try {
    if (fecha?.toDate) return fecha.toDate().getTime();

    const nuevaFecha = new Date(fecha);
    if (Number.isNaN(nuevaFecha.getTime())) return 0;

    return nuevaFecha.getTime();
  } catch {
    return 0;
  }
}

function obtenerIniciales(nombre) {
  if (!nombre) return "ID";

  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

function HistorialDocumental() {
  const anioGestion = localStorage.getItem("italito_anio_gestion") || "2026";

  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [nivelFiltro, setNivelFiltro] = useState("todos");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");

  const cargarDocumentos = async () => {
    setCargando(true);
    setError("");

    try {
      /*
        COLECCIÓN FIRESTORE ESPERADA:
        historial_documental

        Campos sugeridos:
        {
          alumnoNombre: "Nombre del alumno",
          alumnoRut: "12.345.678-9",
          tipoDocumento: "Certificado de Alumno Regular",
          folio: "001",
          nivel: "Pre-Kínder",
          curso: "Pre-Kínder A",
          fecha: serverTimestamp(),
          estado: "emitido",
          creadoPor: "Administrador",
          url: "https://...",
          anioGestion: "2026"
        }
      */

      const snapshot = await getDocs(collection(db, "historial_documental"));

      const datos = snapshot.docs.map((documento) => {
        const data = documento.data();

        return {
          id: documento.id,

          alumnoNombre:
            data.alumnoNombre ||
            data.nombreAlumno ||
            data.nombreParvulo ||
            data.estudiante ||
            "Alumno sin nombre",

          alumnoRut:
            data.alumnoRut ||
            data.rutAlumno ||
            data.rutParvulo ||
            data.rut ||
            "Sin RUT",

          tipoDocumento:
            data.tipoDocumento ||
            data.tipo ||
            data.documento ||
            "Documento escolar",

          folio:
            data.folio ||
            data.numeroFolio ||
            data.numero ||
            "Sin folio",

          nivel:
            data.nivel ||
            data.cursoNivel ||
            "Sin nivel",

          curso:
            data.curso ||
            data.seccion ||
            "",

          fecha:
            data.fecha ||
            data.fechaEmision ||
            data.createdAt ||
            data.creadoEn ||
            "",

          estado:
            data.estado ||
            "emitido",

          creadoPor:
            data.creadoPor ||
            data.usuario ||
            "Sistema",

          url:
            data.url ||
            data.documentoUrl ||
            data.pdfUrl ||
            data.archivoUrl ||
            "",

          anioGestion:
            String(data.anioGestion || data.anio || anioGestion),
        };
      });

      const documentosDelAnio = datos
        .filter((item) => String(item.anioGestion) === String(anioGestion))
        .sort((a, b) => obtenerFechaOrden(b.fecha) - obtenerFechaOrden(a.fecha));

      setDocumentos(documentosDelAnio);
    } catch (err) {
      console.error("Error al cargar historial documental:", err);
      setError(
        "No se pudo cargar el historial documental. Revisa la conexión con Firebase o la colección historial_documental."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const tiposDisponibles = useMemo(() => {
    const tipos = documentos.map((item) => item.tipoDocumento).filter(Boolean);
    return ["todos", ...Array.from(new Set(tipos))];
  }, [documentos]);

  const nivelesDisponibles = useMemo(() => {
    const niveles = documentos.map((item) => item.nivel).filter(Boolean);
    return ["todos", ...Array.from(new Set(niveles))];
  }, [documentos]);

  const estadosDisponibles = useMemo(() => {
    const estados = documentos.map((item) => item.estado).filter(Boolean);
    return ["todos", ...Array.from(new Set(estados))];
  }, [documentos]);

  const documentosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda);

    return documentos.filter((item) => {
      const coincideBusqueda =
        !textoBusqueda ||
        normalizarTexto(item.alumnoNombre).includes(textoBusqueda) ||
        normalizarTexto(item.alumnoRut).includes(textoBusqueda) ||
        normalizarTexto(item.tipoDocumento).includes(textoBusqueda) ||
        normalizarTexto(item.folio).includes(textoBusqueda);

      const coincideTipo =
        tipoFiltro === "todos" || item.tipoDocumento === tipoFiltro;

      const coincideNivel =
        nivelFiltro === "todos" || item.nivel === nivelFiltro;

      const coincideEstado =
        estadoFiltro === "todos" || item.estado === estadoFiltro;

      return coincideBusqueda && coincideTipo && coincideNivel && coincideEstado;
    });
  }, [documentos, busqueda, tipoFiltro, nivelFiltro, estadoFiltro]);

  const resumen = useMemo(() => {
    const certificados = documentos.filter((item) =>
      normalizarTexto(item.tipoDocumento).includes("certificado")
    ).length;

    const informes = documentos.filter((item) =>
      normalizarTexto(item.tipoDocumento).includes("informe")
    ).length;

    const accidentes = documentos.filter((item) =>
      normalizarTexto(item.tipoDocumento).includes("accidente")
    ).length;

    return {
      total: documentos.length,
      certificados,
      informes,
      accidentes,
    };
  }, [documentos]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setTipoFiltro("todos");
    setNivelFiltro("todos");
    setEstadoFiltro("todos");
  };

  const abrirDocumento = (url) => {
    if (!url) {
      alert("Este registro no tiene un archivo asociado todavía.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const imprimirListado = () => {
    window.print();
  };

  const eliminarDocumento = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este registro del historial documental?"
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "historial_documental", id));
      setDocumentos((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      alert("No se pudo eliminar el registro. Revisa permisos de Firebase.");
    }
  };

  return (
    <div className="historial-page">
      <section className="historial-hero">
        <div>
          <span className="historial-chip">
            <Archive size={16} />
            Año de gestión {anioGestion}
          </span>

          <h1>Historial Documental</h1>

          <p>
            Registro centralizado de certificados, informes al hogar, accidentes
            escolares y documentos emitidos por Italito Gestión Escolar.
          </p>
        </div>

        <div className="historial-hero-actions">
          <button
            type="button"
            className="btn-secundario"
            onClick={cargarDocumentos}
          >
            <RefreshCw size={18} />
            Actualizar
          </button>

          <button
            type="button"
            className="btn-principal"
            onClick={imprimirListado}
          >
            <Printer size={18} />
            Imprimir listado
          </button>
        </div>
      </section>

      <section className="historial-resumen">
        <article className="resumen-card">
          <div className="resumen-icon">
            <FolderOpen size={22} />
          </div>
          <div>
            <span>Total documentos</span>
            <strong>{resumen.total}</strong>
          </div>
        </article>

        <article className="resumen-card">
          <div className="resumen-icon">
            <FileText size={22} />
          </div>
          <div>
            <span>Certificados</span>
            <strong>{resumen.certificados}</strong>
          </div>
        </article>

        <article className="resumen-card">
          <div className="resumen-icon">
            <GraduationCap size={22} />
          </div>
          <div>
            <span>Informes</span>
            <strong>{resumen.informes}</strong>
          </div>
        </article>

        <article className="resumen-card">
          <div className="resumen-icon">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>Accidentes</span>
            <strong>{resumen.accidentes}</strong>
          </div>
        </article>
      </section>

      <section className="historial-panel">
        <div className="panel-header">
          <div>
            <h2>Documentos registrados</h2>
            <p>
              Busca por nombre, RUT, folio o tipo de documento. El listado se
              filtra automáticamente.
            </p>
          </div>

          <span className="contador-resultados">
            {documentosFiltrados.length} resultado
            {documentosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="historial-filtros">
          <label className="buscador-documentos">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por alumno, RUT, folio o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>

          <div className="filtros-grid">
            <label>
              <span>
                <Filter size={14} />
                Tipo
              </span>
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
              >
                {tiposDisponibles.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo === "todos" ? "Todos los tipos" : tipo}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>
                <GraduationCap size={14} />
                Nivel
              </span>
              <select
                value={nivelFiltro}
                onChange={(e) => setNivelFiltro(e.target.value)}
              >
                {nivelesDisponibles.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel === "todos" ? "Todos los niveles" : nivel}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>
                <Archive size={14} />
                Estado
              </span>
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
              >
                {estadosDisponibles.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado === "todos" ? "Todos los estados" : estado}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="btn-limpiar"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {error && (
          <div className="mensaje-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {cargando ? (
          <div className="estado-vacio">
            <RefreshCw className="spin" size={34} />
            <h3>Cargando historial documental...</h3>
            <p>Estamos consultando los registros guardados en Firebase.</p>
          </div>
        ) : documentosFiltrados.length === 0 ? (
          <div className="estado-vacio">
            <Archive size={42} />
            <h3>No hay documentos para mostrar</h3>
            <p>
              Cuando se emitan certificados, informes o documentos escolares,
              aparecerán registrados en este historial.
            </p>
          </div>
        ) : (
          <>
            <div className="tabla-documentos desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Alumno</th>
                    <th>RUT</th>
                    <th>Documento</th>
                    <th>Folio</th>
                    <th>Nivel</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {documentosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fecha-cell">
                          <CalendarDays size={16} />
                          {formatearFecha(item.fecha)}
                        </div>
                      </td>

                      <td>
                        <div className="alumno-cell">
                          <div className="avatar-mini">
                            {obtenerIniciales(item.alumnoNombre)}
                          </div>
                          <div>
                            <strong>{item.alumnoNombre}</strong>
                            <span>{item.curso || "Sin curso asignado"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.alumnoRut}</td>

                      <td>
                        <span className="tipo-badge">
                          {item.tipoDocumento}
                        </span>
                      </td>

                      <td>{item.folio}</td>

                      <td>{item.nivel}</td>

                      <td>
                        <span
                          className={`estado-badge estado-${normalizarTexto(
                            item.estado
                          )}`}
                        >
                          {item.estado}
                        </span>
                      </td>

                      <td>
                        <div className="acciones-tabla">
                          <button
                            type="button"
                            title="Ver documento"
                            onClick={() => abrirDocumento(item.url)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Descargar documento"
                            onClick={() => abrirDocumento(item.url)}
                          >
                            <Download size={16} />
                          </button>

                          <button
                            type="button"
                            title="Eliminar registro"
                            className="danger"
                            onClick={() => eliminarDocumento(item.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="documentos-mobile mobile-only">
              {documentosFiltrados.map((item) => (
                <article className="documento-card" key={item.id}>
                  <div className="documento-card-top">
                    <div className="avatar-card">
                      {obtenerIniciales(item.alumnoNombre)}
                    </div>

                    <div>
                      <h3>{item.alumnoNombre}</h3>
                      <p>{item.alumnoRut}</p>
                    </div>
                  </div>

                  <div className="documento-card-body">
                    <div>
                      <span>Documento</span>
                      <strong>{item.tipoDocumento}</strong>
                    </div>

                    <div>
                      <span>Fecha</span>
                      <strong>{formatearFecha(item.fecha)}</strong>
                    </div>

                    <div>
                      <span>Folio</span>
                      <strong>{item.folio}</strong>
                    </div>

                    <div>
                      <span>Nivel / Curso</span>
                      <strong>
                        {item.nivel}
                        {item.curso ? ` · ${item.curso}` : ""}
                      </strong>
                    </div>

                    <div>
                      <span>Estado</span>
                      <strong>{item.estado}</strong>
                    </div>

                    <div>
                      <span>Creado por</span>
                      <strong>{item.creadoPor}</strong>
                    </div>
                  </div>

                  <div className="documento-card-actions">
                    <button
                      type="button"
                      className="btn-card"
                      onClick={() => abrirDocumento(item.url)}
                    >
                      <Eye size={17} />
                      Ver
                    </button>

                    <button
                      type="button"
                      className="btn-card"
                      onClick={() => abrirDocumento(item.url)}
                    >
                      <Download size={17} />
                      Descargar
                    </button>

                    <button
                      type="button"
                      className="btn-card danger"
                      onClick={() => eliminarDocumento(item.id)}
                    >
                      <Trash2 size={17} />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <style>{`
        .historial-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 32%),
            #f8fafc;
          color: #0f172a;
        }

        .historial-hero {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: flex-start;
          padding: 28px;
          border-radius: 28px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
          margin-bottom: 22px;
        }

        .historial-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.20);
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .historial-hero h1 {
          margin: 0;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .historial-hero p {
          max-width: 740px;
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 15px;
          line-height: 1.6;
        }

        .historial-hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .btn-principal,
        .btn-secundario,
        .btn-limpiar {
          border: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 11px 16px;
          border-radius: 16px;
          font-weight: 800;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .btn-principal {
          background: #f8fafc;
          color: #0f172a;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.16);
        }

        .btn-secundario {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .btn-principal:hover,
        .btn-secundario:hover,
        .btn-limpiar:hover,
        .btn-card:hover,
        .acciones-tabla button:hover {
          transform: translateY(-1px);
        }

        .historial-resumen {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .resumen-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 24px;
          background: white;
          border: 1px solid #e2e8f0;
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.06);
        }

        .resumen-icon {
          width: 48px;
          height: 48px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: #eff6ff;
          color: #1d4ed8;
        }

        .resumen-card span {
          display: block;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .resumen-card strong {
          display: block;
          font-size: 28px;
          line-height: 1;
          margin-top: 5px;
        }

        .historial-panel {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.07);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
          padding: 24px 24px 18px;
          border-bottom: 1px solid #e2e8f0;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: -0.03em;
        }

        .panel-header p {
          margin: 7px 0 0;
          color: #64748b;
          line-height: 1.5;
          font-size: 14px;
        }

        .contador-resultados {
          flex: 0 0 auto;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #334155;
          font-size: 13px;
          font-weight: 800;
        }

        .historial-filtros {
          padding: 20px 24px 24px;
          display: grid;
          gap: 16px;
        }

        .buscador-documentos {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 52px;
          padding: 0 15px;
          border: 1px solid #cbd5e1;
          border-radius: 18px;
          background: #f8fafc;
          color: #64748b;
        }

        .buscador-documentos input {
          border: 0;
          outline: 0;
          background: transparent;
          width: 100%;
          font-size: 15px;
          color: #0f172a;
        }

        .filtros-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          align-items: end;
        }

        .filtros-grid label {
          display: grid;
          gap: 7px;
        }

        .filtros-grid label span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .filtros-grid select {
          width: 100%;
          min-height: 44px;
          border-radius: 14px;
          border: 1px solid #cbd5e1;
          background: white;
          padding: 0 12px;
          color: #0f172a;
          font-weight: 700;
          outline: none;
        }

        .btn-limpiar {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .mensaje-error {
          margin: 0 24px 20px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 15px;
          border-radius: 16px;
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
          font-weight: 700;
        }

        .estado-vacio {
          padding: 54px 24px;
          display: grid;
          place-items: center;
          text-align: center;
          color: #64748b;
        }

        .estado-vacio svg {
          color: #94a3b8;
          margin-bottom: 14px;
        }

        .estado-vacio h3 {
          color: #0f172a;
          margin: 0 0 8px;
          font-size: 21px;
        }

        .estado-vacio p {
          max-width: 520px;
          margin: 0;
          line-height: 1.6;
        }

        .tabla-documentos {
          overflow-x: auto;
          padding: 0 24px 24px;
        }

        .tabla-documentos table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .tabla-documentos th {
          text-align: left;
          padding: 14px 12px;
          color: #475569;
          background: #f8fafc;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabla-documentos td {
          padding: 14px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
          font-size: 14px;
          color: #334155;
        }

        .fecha-cell {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-weight: 800;
          color: #475569;
        }

        .alumno-cell {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .alumno-cell strong {
          display: block;
          color: #0f172a;
        }

        .alumno-cell span {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-top: 2px;
        }

        .avatar-mini,
        .avatar-card {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: linear-gradient(135deg, #dbeafe, #dcfce7);
          color: #1e3a8a;
          font-weight: 900;
        }

        .avatar-mini {
          width: 42px;
          height: 42px;
          font-size: 13px;
        }

        .tipo-badge,
        .estado-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .tipo-badge {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .estado-badge {
          background: #ecfdf5;
          color: #047857;
          text-transform: capitalize;
        }

        .estado-anulado,
        .estado-eliminado,
        .estado-pendiente {
          background: #fef2f2;
          color: #b91c1c;
        }

        .acciones-tabla {
          display: flex;
          gap: 8px;
        }

        .acciones-tabla button {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .acciones-tabla button.danger {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
        }

        .mobile-only {
          display: none;
        }

        .documentos-mobile {
          padding: 0 18px 22px;
          display: none;
          gap: 14px;
        }

        .documento-card {
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 16px;
          background: #ffffff;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
        }

        .documento-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .avatar-card {
          width: 48px;
          height: 48px;
          font-size: 14px;
        }

        .documento-card h3 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
          line-height: 1.2;
        }

        .documento-card p {
          margin: 4px 0 0;
          color: #64748b;
          font-weight: 700;
          font-size: 13px;
        }

        .documento-card-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 14px 0;
        }

        .documento-card-body div {
          padding: 12px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .documento-card-body span {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }

        .documento-card-body strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          line-height: 1.3;
          word-break: break-word;
        }

        .documento-card-actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
        }

        .btn-card {
          min-height: 42px;
          border: 0;
          border-radius: 15px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 900;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          cursor: pointer;
        }

        .btn-card.danger {
          background: #fef2f2;
          color: #b91c1c;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media print {
          .historial-hero-actions,
          .historial-filtros,
          .acciones-tabla,
          .documento-card-actions {
            display: none !important;
          }

          .historial-page {
            background: white;
            padding: 0;
          }

          .historial-hero {
            background: white;
            color: #0f172a;
            box-shadow: none;
            border: 1px solid #e2e8f0;
          }

          .historial-hero p {
            color: #334155;
          }

          .desktop-only {
            display: block !important;
          }

          .mobile-only {
            display: none !important;
          }
        }

        @media (max-width: 900px) {
          .historial-page {
            padding: 14px;
          }

          .historial-hero {
            flex-direction: column;
            border-radius: 24px;
            padding: 22px;
          }

          .historial-hero-actions {
            width: 100%;
            justify-content: stretch;
          }

          .historial-hero-actions button {
            flex: 1;
          }

          .historial-resumen {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filtros-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .historial-page {
            padding: 10px;
          }

          .historial-hero {
            padding: 20px;
            border-radius: 22px;
            margin-bottom: 14px;
          }

          .historial-chip {
            font-size: 12px;
          }

          .historial-hero h1 {
            font-size: 30px;
          }

          .historial-hero p {
            font-size: 14px;
          }

          .historial-hero-actions {
            flex-direction: column;
          }

          .btn-principal,
          .btn-secundario {
            width: 100%;
            min-height: 48px;
          }

          .historial-resumen {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 14px;
          }

          .resumen-card {
            border-radius: 20px;
            padding: 14px;
          }

          .resumen-icon {
            width: 42px;
            height: 42px;
            border-radius: 15px;
          }

          .resumen-card strong {
            font-size: 24px;
          }

          .historial-panel {
            border-radius: 22px;
          }

          .panel-header {
            flex-direction: column;
            padding: 18px;
          }

          .panel-header h2 {
            font-size: 21px;
          }

          .contador-resultados {
            width: 100%;
            text-align: center;
          }

          .historial-filtros {
            padding: 16px 18px 18px;
          }

          .buscador-documentos {
            min-height: 50px;
            border-radius: 16px;
          }

          .filtros-grid {
            grid-template-columns: 1fr;
          }

          .btn-limpiar {
            width: 100%;
            min-height: 46px;
          }

          .desktop-only {
            display: none !important;
          }

          .mobile-only {
            display: grid !important;
          }

          .documentos-mobile {
            display: grid;
            padding: 0 12px 18px;
          }

          .documento-card {
            border-radius: 20px;
            padding: 14px;
          }

          .documento-card-body {
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .documento-card-actions {
            grid-template-columns: 1fr;
          }

          .btn-card {
            min-height: 46px;
          }

          .mensaje-error {
            margin: 0 18px 16px;
            align-items: flex-start;
          }

          .estado-vacio {
            padding: 42px 18px;
          }
        }
      `}</style>
    </div>
  );
}

export default HistorialDocumental;
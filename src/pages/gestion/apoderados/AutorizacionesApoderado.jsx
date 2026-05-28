import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  AlertCircle,
  BadgeCheck,
  UserCheck,
  UserX,
  Phone,
  Mail,
  UsersRound,
  GraduationCap,
  AlertTriangle,
  Lock,
  Pencil,
  Save,
  X,
  FileCheck2,
} from "lucide-react";

import {
  db,
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "../../../firebase";

const formularioInicial = {
  puedeRetirar: "si",
  contactoEmergencia: "si",
  recibeComunicaciones: "si",
  restriccionRetiro: "no",
  observacionesSeguridad: "",
  estado: "activo",
};

function normalizarTexto(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function obtenerIniciales(texto) {
  if (!texto) return "ID";

  return texto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

function textoResponsabilidad(tipo) {
  const opciones = {
    apoderado_titular: "Apoderado titular",
    apoderado_suplente: "Apoderado suplente",
    contacto_emergencia: "Contacto emergencia",
    autorizado_retiro: "Autorizado retiro",
    familiar: "Familiar",
  };

  return opciones[tipo] || tipo || "Sin responsabilidad";
}

function AutorizacionesApoderado() {
  const anioGestion = localStorage.getItem("italito_anio_gestion") || "2026";

  const [vinculaciones, setVinculaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const cargarAutorizaciones = async () => {
    setCargando(true);
    setError("");
    setMensaje("");

    try {
      /*
        Este módulo usa la colección:
        vinculaciones_apoderados_alumnos

        La idea es no duplicar información.
        Primero se crea el vínculo en VinculacionAlumnos.jsx.
        Luego acá se administran permisos y autorizaciones de seguridad.
      */

      const snapshot = await getDocs(
        collection(db, "vinculaciones_apoderados_alumnos")
      );

      const datos = snapshot.docs.map((documento) => {
        const data = documento.data();

        return {
          id: documento.id,

          apoderadoId: data.apoderadoId || "",
          alumnoId: data.alumnoId || "",

          apoderadoNombre: data.apoderadoNombre || "Apoderado sin nombre",
          apoderadoRut: data.apoderadoRut || "Sin RUT",
          apoderadoTelefono: data.apoderadoTelefono || "",
          apoderadoCorreo: data.apoderadoCorreo || "",

          alumnoNombre: data.alumnoNombre || "Alumno sin nombre",
          alumnoRut: data.alumnoRut || "Sin RUT",
          alumnoNivel: data.alumnoNivel || "Sin nivel",

          parentesco: data.parentesco || "No indicado",
          tipoResponsabilidad:
            data.tipoResponsabilidad || "apoderado_titular",

          puedeRetirar: data.puedeRetirar || "si",
          contactoEmergencia: data.contactoEmergencia || "si",
          recibeComunicaciones: data.recibeComunicaciones || "si",

          restriccionRetiro: data.restriccionRetiro || "no",
          observacionesSeguridad:
            data.observacionesSeguridad || data.observaciones || "",

          estado: data.estado || "activo",
          anioGestion: String(data.anioGestion || data.anio || anioGestion),
        };
      });

      const datosFiltrados = datos
        .filter((item) => String(item.anioGestion) === String(anioGestion))
        .sort((a, b) => a.alumnoNombre.localeCompare(b.alumnoNombre, "es"));

      setVinculaciones(datosFiltrados);
    } catch (err) {
      console.error("Error al cargar autorizaciones:", err);
      setError(
        "No se pudieron cargar las autorizaciones. Revisa Firebase o la colección vinculaciones_apoderados_alumnos."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAutorizaciones();
  }, []);

  const registrosFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    return vinculaciones.filter((item) => {
      const coincideBusqueda =
        !texto ||
        normalizarTexto(item.alumnoNombre).includes(texto) ||
        normalizarTexto(item.alumnoRut).includes(texto) ||
        normalizarTexto(item.alumnoNivel).includes(texto) ||
        normalizarTexto(item.apoderadoNombre).includes(texto) ||
        normalizarTexto(item.apoderadoRut).includes(texto) ||
        normalizarTexto(item.parentesco).includes(texto);

      const coincideEstado =
        filtroEstado === "todos" || item.estado === filtroEstado;

      let coincideTipo = true;

      if (filtroTipo === "puede_retirar") {
        coincideTipo = item.puedeRetirar === "si";
      }

      if (filtroTipo === "emergencia") {
        coincideTipo = item.contactoEmergencia === "si";
      }

      if (filtroTipo === "restriccion") {
        coincideTipo = item.restriccionRetiro === "si";
      }

      if (filtroTipo === "no_retirar") {
        coincideTipo = item.puedeRetirar === "no";
      }

      return coincideBusqueda && coincideEstado && coincideTipo;
    });
  }, [vinculaciones, busqueda, filtroTipo, filtroEstado]);

  const resumen = useMemo(() => {
    const activos = vinculaciones.filter(
      (item) => item.estado === "activo"
    ).length;

    const autorizadosRetiro = vinculaciones.filter(
      (item) => item.estado === "activo" && item.puedeRetirar === "si"
    ).length;

    const emergencia = vinculaciones.filter(
      (item) => item.estado === "activo" && item.contactoEmergencia === "si"
    ).length;

    const restricciones = vinculaciones.filter(
      (item) => item.estado === "activo" && item.restriccionRetiro === "si"
    ).length;

    return {
      total: vinculaciones.length,
      activos,
      autorizadosRetiro,
      emergencia,
      restricciones,
    };
  }, [vinculaciones]);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const abrirEditar = (registro) => {
    setRegistroEditando(registro);
    setFormulario({
      puedeRetirar: registro.puedeRetirar || "si",
      contactoEmergencia: registro.contactoEmergencia || "si",
      recibeComunicaciones: registro.recibeComunicaciones || "si",
      restriccionRetiro: registro.restriccionRetiro || "no",
      observacionesSeguridad: registro.observacionesSeguridad || "",
      estado: registro.estado || "activo",
    });
    setError("");
    setMensaje("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setRegistroEditando(null);
    setFormulario(formularioInicial);
    setGuardando(false);
  };

  const guardarAutorizacion = async (e) => {
    e.preventDefault();

    if (!registroEditando) {
      setError("No hay registro seleccionado para actualizar.");
      return;
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    const datosGuardar = {
      puedeRetirar: formulario.puedeRetirar,
      contactoEmergencia: formulario.contactoEmergencia,
      recibeComunicaciones: formulario.recibeComunicaciones,
      restriccionRetiro: formulario.restriccionRetiro,
      observacionesSeguridad: formulario.observacionesSeguridad.trim(),
      estado: formulario.estado,
      actualizadoEn: serverTimestamp(),
    };

    try {
      await updateDoc(
        doc(
          db,
          "vinculaciones_apoderados_alumnos",
          registroEditando.id
        ),
        datosGuardar
      );

      setVinculaciones((prev) =>
        prev.map((item) =>
          item.id === registroEditando.id
            ? {
                ...item,
                ...datosGuardar,
              }
            : item
        )
      );

      setMensaje("Autorización actualizada correctamente.");
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar autorización:", err);
      setError("No se pudo guardar la autorización. Revisa permisos de Firebase.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoRapido = async (registro, nuevoEstado) => {
    const confirmar = window.confirm(
      nuevoEstado === "inactivo"
        ? "¿Seguro que deseas desactivar esta autorización?"
        : "¿Seguro que deseas activar nuevamente esta autorización?"
    );

    if (!confirmar) return;

    try {
      await updateDoc(
        doc(db, "vinculaciones_apoderados_alumnos", registro.id),
        {
          estado: nuevoEstado,
          actualizadoEn: serverTimestamp(),
        }
      );

      setVinculaciones((prev) =>
        prev.map((item) =>
          item.id === registro.id ? { ...item, estado: nuevoEstado } : item
        )
      );

      setMensaje(
        nuevoEstado === "inactivo"
          ? "Autorización desactivada correctamente."
          : "Autorización activada correctamente."
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError("No se pudo cambiar el estado de la autorización.");
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroTipo("todos");
    setFiltroEstado("todos");
  };

  return (
    <div className="autorizaciones-page">
      <section className="autorizaciones-hero">
        <div>
          <span className="autorizaciones-chip">
            <ShieldCheck size={16} />
            Año de gestión {anioGestion}
          </span>

          <h1>Autorizaciones y Retiro</h1>

          <p>
            Administra quiénes pueden retirar alumnos, quiénes son contactos de
            emergencia, quiénes reciben comunicaciones y qué restricciones deben
            considerarse por seguridad escolar.
          </p>
        </div>

        <div className="hero-actions">
          <button
            type="button"
            className="btn-secundario"
            onClick={cargarAutorizaciones}
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </div>
      </section>

      <section className="resumen-grid">
        <article>
          <div className="resumen-icon azul">
            <UsersRound size={22} />
          </div>
          <div>
            <span>Total vínculos</span>
            <strong>{resumen.total}</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon verde">
            <UserCheck size={22} />
          </div>
          <div>
            <span>Autorizados retiro</span>
            <strong>{resumen.autorizadosRetiro}</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon morado">
            <Phone size={22} />
          </div>
          <div>
            <span>Contactos emergencia</span>
            <strong>{resumen.emergencia}</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon rojo">
            <AlertTriangle size={22} />
          </div>
          <div>
            <span>Restricciones</span>
            <strong>{resumen.restricciones}</strong>
          </div>
        </article>
      </section>

      <section className="autorizaciones-panel">
        <div className="panel-header">
          <div>
            <h2>Registro de autorizaciones</h2>
            <p>
              Este listado se alimenta desde los vínculos familiares. Para crear
              una nueva autorización, primero crea el vínculo entre apoderado y
              alumno.
            </p>
          </div>

          <span className="contador">
            {registrosFiltrados.length} resultado
            {registrosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="filtros-autorizaciones">
          <label className="buscador">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por alumno, apoderado, RUT, nivel o parentesco..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todas las autorizaciones</option>
            <option value="puede_retirar">Puede retirar</option>
            <option value="no_retirar">No puede retirar</option>
            <option value="emergencia">Contacto emergencia</option>
            <option value="restriccion">Con restricción</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          <button
            type="button"
            className="btn-limpiar"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        </div>

        {mensaje && (
          <div className="mensaje-ok">
            <BadgeCheck size={18} />
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mensaje-error">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {cargando ? (
          <div className="estado-vacio">
            <RefreshCw className="spin" size={34} />
            <h3>Cargando autorizaciones...</h3>
            <p>Estamos consultando las vinculaciones familiares guardadas.</p>
          </div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="estado-vacio">
            <ShieldCheck size={42} />
            <h3>No hay autorizaciones para mostrar</h3>
            <p>
              Primero crea vínculos familiares entre apoderados y alumnos. Luego
              aparecerán aquí para administrar permisos de retiro y emergencia.
            </p>
          </div>
        ) : (
          <>
            <div className="tabla-autorizaciones desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Adulto responsable</th>
                    <th>Parentesco</th>
                    <th>Responsabilidad</th>
                    <th>Retiro</th>
                    <th>Emergencia</th>
                    <th>Comunicación</th>
                    <th>Restricción</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {registrosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="persona-cell">
                          <div className="avatar-mini alumno">
                            {obtenerIniciales(item.alumnoNombre)}
                          </div>
                          <div>
                            <strong>{item.alumnoNombre}</strong>
                            <span>
                              {item.alumnoRut} · {item.alumnoNivel}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="persona-cell">
                          <div className="avatar-mini apoderado">
                            {obtenerIniciales(item.apoderadoNombre)}
                          </div>
                          <div>
                            <strong>{item.apoderadoNombre}</strong>
                            <span>{item.apoderadoRut}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.parentesco}</td>

                      <td>
                        <span className="tipo-badge">
                          {textoResponsabilidad(item.tipoResponsabilidad)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.puedeRetirar === "si"
                              ? "badge-ok"
                              : "badge-no"
                          }
                        >
                          {item.puedeRetirar === "si" ? "Sí" : "No"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.contactoEmergencia === "si"
                              ? "badge-ok"
                              : "badge-no"
                          }
                        >
                          {item.contactoEmergencia === "si" ? "Sí" : "No"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.recibeComunicaciones === "si"
                              ? "badge-ok"
                              : "badge-no"
                          }
                        >
                          {item.recibeComunicaciones === "si" ? "Sí" : "No"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.restriccionRetiro === "si"
                              ? "badge-alerta"
                              : "badge-ok"
                          }
                        >
                          {item.restriccionRetiro === "si" ? "Sí" : "No"}
                        </span>
                      </td>

                      <td>
                        <span className={`estado-badge estado-${item.estado}`}>
                          {item.estado}
                        </span>
                      </td>

                      <td>
                        <div className="acciones">
                          <button
                            type="button"
                            title="Editar autorización"
                            onClick={() => abrirEditar(item)}
                          >
                            <Pencil size={16} />
                          </button>

                          {item.estado === "activo" ? (
                            <button
                              type="button"
                              className="danger"
                              title="Desactivar"
                              onClick={() =>
                                cambiarEstadoRapido(item, "inactivo")
                              }
                            >
                              <UserX size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Activar"
                              onClick={() =>
                                cambiarEstadoRapido(item, "activo")
                              }
                            >
                              <UserCheck size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="autorizaciones-mobile mobile-only">
              {registrosFiltrados.map((item) => (
                <article className="autorizacion-card" key={item.id}>
                  <div className="autorizacion-card-top">
                    <div className="avatar-card">
                      {obtenerIniciales(item.alumnoNombre)}
                    </div>

                    <div>
                      <h3>{item.alumnoNombre}</h3>
                      <p>
                        {item.alumnoRut} · {item.alumnoNivel}
                      </p>
                      <span className={`estado-badge estado-${item.estado}`}>
                        {item.estado}
                      </span>
                    </div>
                  </div>

                  <div className="autorizacion-card-info">
                    <div>
                      <span>Adulto</span>
                      <strong>{item.apoderadoNombre}</strong>
                    </div>

                    <div>
                      <span>RUT adulto</span>
                      <strong>{item.apoderadoRut}</strong>
                    </div>

                    <div>
                      <span>Parentesco</span>
                      <strong>{item.parentesco}</strong>
                    </div>

                    <div>
                      <span>Responsabilidad</span>
                      <strong>{textoResponsabilidad(item.tipoResponsabilidad)}</strong>
                    </div>

                    <div>
                      <span>Puede retirar</span>
                      <strong>{item.puedeRetirar === "si" ? "Sí" : "No"}</strong>
                    </div>

                    <div>
                      <span>Emergencia</span>
                      <strong>
                        {item.contactoEmergencia === "si" ? "Sí" : "No"}
                      </strong>
                    </div>

                    <div>
                      <span>Restricción</span>
                      <strong>
                        {item.restriccionRetiro === "si" ? "Sí" : "No"}
                      </strong>
                    </div>

                    <div>
                      <span>Comunicación</span>
                      <strong>
                        {item.recibeComunicaciones === "si" ? "Sí" : "No"}
                      </strong>
                    </div>
                  </div>

                  {item.observacionesSeguridad && (
                    <div className="observacion-card">
                      <AlertTriangle size={16} />
                      {item.observacionesSeguridad}
                    </div>
                  )}

                  <div className="autorizacion-card-actions">
                    <button type="button" onClick={() => abrirEditar(item)}>
                      <Pencil size={17} />
                      Editar
                    </button>

                    {item.estado === "activo" ? (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => cambiarEstadoRapido(item, "inactivo")}
                      >
                        <UserX size={17} />
                        Desactivar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => cambiarEstadoRapido(item, "activo")}
                      >
                        <UserCheck size={17} />
                        Activar
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {mostrarModal && registroEditando && (
        <div className="modal-backdrop">
          <div className="modal-autorizacion">
            <div className="modal-header">
              <div>
                <span>Editar autorización</span>
                <h2>{registroEditando.alumnoNombre}</h2>
                <p>
                  {registroEditando.apoderadoNombre} ·{" "}
                  {registroEditando.parentesco}
                </p>
              </div>

              <button type="button" onClick={cerrarModal}>
                <X size={20} />
              </button>
            </div>

            <form className="form-autorizacion" onSubmit={guardarAutorizacion}>
              <div className="form-section">
                <h3>Permisos de retiro y contacto</h3>

                <div className="form-grid">
                  <label>
                    <span>¿Puede retirar?</span>
                    <select
                      value={formulario.puedeRetirar}
                      onChange={(e) =>
                        actualizarCampo("puedeRetirar", e.target.value)
                      }
                    >
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </label>

                  <label>
                    <span>¿Contacto emergencia?</span>
                    <select
                      value={formulario.contactoEmergencia}
                      onChange={(e) =>
                        actualizarCampo("contactoEmergencia", e.target.value)
                      }
                    >
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </label>

                  <label>
                    <span>¿Recibe comunicaciones?</span>
                    <select
                      value={formulario.recibeComunicaciones}
                      onChange={(e) =>
                        actualizarCampo("recibeComunicaciones", e.target.value)
                      }
                    >
                      <option value="si">Sí</option>
                      <option value="no">No</option>
                    </select>
                  </label>

                  <label>
                    <span>¿Tiene restricción de retiro?</span>
                    <select
                      value={formulario.restriccionRetiro}
                      onChange={(e) =>
                        actualizarCampo("restriccionRetiro", e.target.value)
                      }
                    >
                      <option value="no">No</option>
                      <option value="si">Sí</option>
                    </select>
                  </label>

                  <label>
                    <span>Estado</span>
                    <select
                      value={formulario.estado}
                      onChange={(e) =>
                        actualizarCampo("estado", e.target.value)
                      }
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </label>

                  <label className="full">
                    <span>Observaciones de seguridad</span>
                    <textarea
                      rows="5"
                      value={formulario.observacionesSeguridad}
                      onChange={(e) =>
                        actualizarCampo(
                          "observacionesSeguridad",
                          e.target.value
                        )
                      }
                      placeholder="Ej: Solo puede retirar con aviso previo, existe restricción familiar, llamar antes de entregar al alumno, etc."
                    />
                  </label>
                </div>
              </div>

              <div className="form-note">
                <Lock size={18} />
                Esta información debe ser tratada con especial cuidado, porque
                afecta directamente la seguridad del alumno.
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancelar"
                  onClick={cerrarModal}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-guardar"
                  disabled={guardando}
                >
                  <Save size={18} />
                  {guardando ? "Guardando..." : "Guardar autorización"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .autorizaciones-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 32%),
            #f8fafc;
          color: #0f172a;
        }

        .autorizaciones-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 22px;
          padding: 30px;
          border-radius: 28px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: white;
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.18);
          margin-bottom: 22px;
        }

        .autorizaciones-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.20);
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 14px;
        }

        .autorizaciones-hero h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .autorizaciones-hero p {
          max-width: 850px;
          margin: 14px 0 0;
          color: rgba(255, 255, 255, 0.82);
          font-size: 15px;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .btn-secundario,
        .btn-limpiar,
        .btn-cancelar,
        .btn-guardar {
          border: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          padding: 11px 16px;
          border-radius: 16px;
          font-weight: 900;
        }

        .btn-secundario {
          background: rgba(255, 255, 255, 0.12);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .resumen-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .resumen-grid article {
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
        }

        .resumen-icon.azul {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .resumen-icon.verde {
          background: #ecfdf5;
          color: #047857;
        }

        .resumen-icon.morado {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .resumen-icon.rojo {
          background: #fef2f2;
          color: #b91c1c;
        }

        .resumen-grid span {
          display: block;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .resumen-grid strong {
          display: block;
          font-size: 28px;
          line-height: 1;
          margin-top: 5px;
        }

        .autorizaciones-panel {
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

        .contador {
          flex: 0 0 auto;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #334155;
          font-size: 13px;
          font-weight: 900;
        }

        .filtros-autorizaciones {
          padding: 20px 24px 24px;
          display: grid;
          grid-template-columns: 1fr 230px 190px auto;
          gap: 12px;
          align-items: center;
        }

        .buscador {
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

        .buscador input {
          border: 0;
          outline: 0;
          background: transparent;
          width: 100%;
          font-size: 15px;
          color: #0f172a;
        }

        .filtros-autorizaciones select {
          min-height: 52px;
          border-radius: 18px;
          border: 1px solid #cbd5e1;
          background: white;
          padding: 0 13px;
          font-weight: 800;
          color: #0f172a;
          outline: none;
        }

        .btn-limpiar {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .mensaje-ok,
        .mensaje-error {
          margin: 0 24px 20px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 13px 15px;
          border-radius: 16px;
          font-weight: 800;
        }

        .mensaje-ok {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #bbf7d0;
        }

        .mensaje-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
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
          max-width: 560px;
          margin: 0;
          line-height: 1.6;
        }

        .tabla-autorizaciones {
          overflow-x: auto;
          padding: 0 24px 24px;
        }

        .tabla-autorizaciones table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1250px;
        }

        .tabla-autorizaciones th {
          text-align: left;
          padding: 14px 12px;
          color: #475569;
          background: #f8fafc;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabla-autorizaciones td {
          padding: 14px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
          font-size: 14px;
          color: #334155;
        }

        .persona-cell {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .persona-cell strong {
          display: block;
          color: #0f172a;
        }

        .persona-cell span {
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
          font-weight: 900;
        }

        .avatar-mini {
          width: 42px;
          height: 42px;
          font-size: 13px;
        }

        .avatar-mini.alumno,
        .avatar-card {
          background: linear-gradient(135deg, #dbeafe, #dcfce7);
          color: #1e3a8a;
        }

        .avatar-mini.apoderado {
          background: linear-gradient(135deg, #f5f3ff, #eff6ff);
          color: #7c3aed;
        }

        .avatar-card {
          width: 52px;
          height: 52px;
          font-size: 14px;
        }

        .badge-ok,
        .badge-no,
        .badge-alerta,
        .estado-badge,
        .tipo-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .badge-ok {
          background: #ecfdf5;
          color: #047857;
        }

        .badge-no {
          background: #fef2f2;
          color: #b91c1c;
        }

        .badge-alerta {
          background: #fff7ed;
          color: #c2410c;
        }

        .tipo-badge {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .estado-activo {
          background: #ecfdf5;
          color: #047857;
          text-transform: capitalize;
        }

        .estado-inactivo {
          background: #f1f5f9;
          color: #64748b;
          text-transform: capitalize;
        }

        .acciones {
          display: flex;
          gap: 8px;
        }

        .acciones button {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #334155;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .acciones button.danger {
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
        }

        .mobile-only {
          display: none;
        }

        .autorizaciones-mobile {
          display: none;
          gap: 14px;
          padding: 0 18px 22px;
        }

        .autorizacion-card {
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 16px;
          background: white;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
        }

        .autorizacion-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .autorizacion-card-top h3 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
          line-height: 1.2;
        }

        .autorizacion-card-top p {
          margin: 4px 0 6px;
          color: #64748b;
          font-weight: 800;
          font-size: 13px;
        }

        .autorizacion-card-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 14px 0;
        }

        .autorizacion-card-info div {
          padding: 12px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .autorizacion-card-info span {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }

        .autorizacion-card-info strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          line-height: 1.3;
          word-break: break-word;
        }

        .observacion-card {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 12px;
          border-radius: 16px;
          background: #fff7ed;
          color: #c2410c;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.45;
          margin-bottom: 12px;
        }

        .autorizacion-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .autorizacion-card-actions button {
          min-height: 44px;
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

        .autorizacion-card-actions button.danger {
          background: #fef2f2;
          color: #b91c1c;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
        }

        .modal-autorizacion {
          width: min(920px, 100%);
          max-height: 92vh;
          overflow: auto;
          background: white;
          border-radius: 28px;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
          border: 1px solid #e2e8f0;
        }

        .modal-header {
          position: sticky;
          top: 0;
          z-index: 2;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 18px;
          padding: 22px 24px;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-header span {
          display: block;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 5px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 26px;
          letter-spacing: -0.04em;
        }

        .modal-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-weight: 800;
        }

        .modal-header button {
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 14px;
          background: #f1f5f9;
          color: #0f172a;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .form-autorizacion {
          padding: 22px 24px 24px;
          display: grid;
          gap: 18px;
        }

        .form-section {
          padding: 18px;
          border-radius: 22px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .form-section h3 {
          margin: 0 0 14px;
          font-size: 18px;
          letter-spacing: -0.02em;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .form-grid label {
          display: grid;
          gap: 7px;
        }

        .form-grid label.full {
          grid-column: 1 / -1;
        }

        .form-grid label span {
          font-size: 12px;
          font-weight: 900;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .form-grid select,
        .form-grid textarea {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 14px;
          background: white;
          color: #0f172a;
          padding: 12px 13px;
          outline: none;
          font: inherit;
          font-weight: 700;
        }

        .form-grid textarea {
          resize: vertical;
        }

        .form-note {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 14px;
          border-radius: 18px;
          background: #fff7ed;
          color: #c2410c;
          font-weight: 800;
          line-height: 1.45;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 6px;
        }

        .btn-cancelar {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #e2e8f0;
        }

        .btn-guardar {
          background: #1d4ed8;
          color: white;
          box-shadow: 0 14px 28px rgba(29, 78, 216, 0.22);
        }

        .btn-guardar:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1100px) {
          .autorizaciones-hero {
            flex-direction: column;
          }

          .hero-actions {
            width: 100%;
            justify-content: stretch;
          }

          .hero-actions button {
            flex: 1;
          }

          .resumen-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filtros-autorizaciones {
            grid-template-columns: 1fr 1fr;
          }

          .form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .autorizaciones-page {
            padding: 10px;
          }

          .autorizaciones-hero {
            padding: 22px;
            border-radius: 22px;
            margin-bottom: 14px;
          }

          .autorizaciones-hero h1 {
            font-size: 32px;
          }

          .autorizaciones-hero p {
            font-size: 14px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-secundario {
            width: 100%;
            min-height: 48px;
          }

          .resumen-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 14px;
          }

          .resumen-grid article {
            border-radius: 20px;
            padding: 14px;
          }

          .autorizaciones-panel {
            border-radius: 22px;
          }

          .panel-header {
            flex-direction: column;
            padding: 18px;
          }

          .panel-header h2 {
            font-size: 21px;
          }

          .contador {
            width: 100%;
            text-align: center;
          }

          .filtros-autorizaciones {
            grid-template-columns: 1fr;
            padding: 16px 18px 18px;
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

          .autorizaciones-mobile {
            display: grid;
            padding: 0 12px 18px;
          }

          .autorizacion-card-info {
            grid-template-columns: 1fr;
          }

          .autorizacion-card-actions {
            grid-template-columns: 1fr;
          }

          .modal-backdrop {
            padding: 8px;
            align-items: start;
          }

          .modal-autorizacion {
            border-radius: 22px;
            max-height: 96vh;
          }

          .modal-header {
            padding: 18px;
          }

          .modal-header h2 {
            font-size: 22px;
          }

          .form-autorizacion {
            padding: 18px;
          }

          .form-section {
            padding: 14px;
            border-radius: 18px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .btn-cancelar,
          .btn-guardar {
            width: 100%;
            min-height: 48px;
          }
        }
      `}</style>
    </div>
  );
}

export default AutorizacionesApoderado;
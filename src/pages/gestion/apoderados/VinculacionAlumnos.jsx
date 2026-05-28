import { useEffect, useMemo, useState } from "react";
import {
  Link2,
  UsersRound,
  UserRound,
  GraduationCap,
  Search,
  Save,
  X,
  RefreshCw,
  AlertCircle,
  BadgeCheck,
  ShieldCheck,
  UserCheck,
  UserX,
  Pencil,
  PlusCircle,
  Phone,
  Mail,
} from "lucide-react";

import {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "../../../firebase";

const formularioInicial = {
  apoderadoId: "",
  alumnoId: "",
  parentesco: "",
  tipoResponsabilidad: "apoderado_titular",
  puedeRetirar: "si",
  contactoEmergencia: "si",
  recibeComunicaciones: "si",
  estado: "activo",
  observaciones: "",
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

function obtenerNombreApoderado(apoderado) {
  if (!apoderado) return "Apoderado no encontrado";
  return `${apoderado.nombres || ""} ${apoderado.apellidos || ""}`.trim();
}

function obtenerNombreAlumno(alumno) {
  if (!alumno) return "Alumno no encontrado";

  return (
    alumno.nombreParvulo ||
    alumno.nombreCompleto ||
    alumno.nombreAlumno ||
    alumno.nombre ||
    `${alumno.nombres || ""} ${alumno.apellidos || ""}`.trim() ||
    "Alumno sin nombre"
  );
}

function obtenerRutAlumno(alumno) {
  if (!alumno) return "Sin RUT";
  return alumno.rut || alumno.rutAlumno || alumno.rutParvulo || "Sin RUT";
}

function obtenerNivelAlumno(alumno) {
  if (!alumno) return "Sin nivel";
  return alumno.nivel || alumno.curso || alumno.cursoNivel || "Sin nivel";
}

function VinculacionAlumnos() {
  const anioGestion = localStorage.getItem("italito_anio_gestion") || "2026";

  const [apoderados, setApoderados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [vinculaciones, setVinculaciones] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [vinculoEditando, setVinculoEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    setMensaje("");

    try {
      const [snapshotApoderados, snapshotAlumnos, snapshotVinculaciones] =
        await Promise.all([
          getDocs(collection(db, "apoderados")),
          getDocs(collection(db, "alumnos")),
          getDocs(collection(db, "vinculaciones_apoderados_alumnos")),
        ]);

      const apoderadosData = snapshotApoderados.docs
        .map((documento) => {
          const data = documento.data();

          return {
            id: documento.id,
            nombres: data.nombres || "",
            apellidos: data.apellidos || "",
            rut: data.rut || "",
            telefonoPrincipal: data.telefonoPrincipal || "",
            correo: data.correo || "",
            estado: data.estado || "activo",
            anioGestion: String(data.anioGestion || data.anio || anioGestion),
          };
        })
        .filter((item) => String(item.anioGestion) === String(anioGestion))
        .sort((a, b) =>
          obtenerNombreApoderado(a).localeCompare(
            obtenerNombreApoderado(b),
            "es"
          )
        );

      const alumnosData = snapshotAlumnos.docs
        .map((documento) => {
          const data = documento.data();

          return {
            id: documento.id,
            ...data,
            anioGestion: String(data.anioGestion || data.anio || anioGestion),
          };
        })
        .filter((item) => String(item.anioGestion) === String(anioGestion))
        .sort((a, b) =>
          obtenerNombreAlumno(a).localeCompare(obtenerNombreAlumno(b), "es")
        );

      const vinculacionesData = snapshotVinculaciones.docs
        .map((documento) => {
          const data = documento.data();

          return {
            id: documento.id,
            apoderadoId: data.apoderadoId || "",
            alumnoId: data.alumnoId || "",
            apoderadoNombre: data.apoderadoNombre || "",
            apoderadoRut: data.apoderadoRut || "",
            alumnoNombre: data.alumnoNombre || "",
            alumnoRut: data.alumnoRut || "",
            alumnoNivel: data.alumnoNivel || "",
            parentesco: data.parentesco || "",
            tipoResponsabilidad:
              data.tipoResponsabilidad || "apoderado_titular",
            puedeRetirar: data.puedeRetirar || "si",
            contactoEmergencia: data.contactoEmergencia || "si",
            recibeComunicaciones: data.recibeComunicaciones || "si",
            estado: data.estado || "activo",
            observaciones: data.observaciones || "",
            anioGestion: String(data.anioGestion || data.anio || anioGestion),
          };
        })
        .filter((item) => String(item.anioGestion) === String(anioGestion))
        .sort((a, b) => a.alumnoNombre.localeCompare(b.alumnoNombre, "es"));

      setApoderados(apoderadosData);
      setAlumnos(alumnosData);
      setVinculaciones(vinculacionesData);
    } catch (err) {
      console.error("Error al cargar vinculaciones:", err);
      setError(
        "No se pudieron cargar los datos. Revisa Firebase, permisos o las colecciones apoderados, alumnos y vinculaciones_apoderados_alumnos."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const apoderadosActivos = useMemo(
    () => apoderados.filter((item) => item.estado === "activo"),
    [apoderados]
  );

  const alumnosActivos = useMemo(
    () =>
      alumnos.filter((item) => {
        const estado = item.estado || item.estadoMatricula || "activo";
        return estado !== "retirado" && estado !== "inactivo";
      }),
    [alumnos]
  );

  const vinculacionesFiltradas = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    return vinculaciones.filter((item) => {
      const coincideBusqueda =
        !texto ||
        normalizarTexto(item.apoderadoNombre).includes(texto) ||
        normalizarTexto(item.apoderadoRut).includes(texto) ||
        normalizarTexto(item.alumnoNombre).includes(texto) ||
        normalizarTexto(item.alumnoRut).includes(texto) ||
        normalizarTexto(item.parentesco).includes(texto) ||
        normalizarTexto(item.alumnoNivel).includes(texto);

      const coincideEstado =
        estadoFiltro === "todos" || item.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [vinculaciones, busqueda, estadoFiltro]);

  const resumen = useMemo(() => {
    const activos = vinculaciones.filter(
      (item) => item.estado === "activo"
    ).length;

    const titulares = vinculaciones.filter(
      (item) =>
        item.estado === "activo" &&
        item.tipoResponsabilidad === "apoderado_titular"
    ).length;

    const autorizados = vinculaciones.filter(
      (item) => item.estado === "activo" && item.puedeRetirar === "si"
    ).length;

    const emergencia = vinculaciones.filter(
      (item) => item.estado === "activo" && item.contactoEmergencia === "si"
    ).length;

    return {
      total: vinculaciones.length,
      activos,
      titulares,
      autorizados,
      emergencia,
    };
  }, [vinculaciones]);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const abrirNuevoVinculo = () => {
    setVinculoEditando(null);
    setFormulario(formularioInicial);
    setError("");
    setMensaje("");
    setMostrarFormulario(true);
  };

  const abrirEditarVinculo = (vinculo) => {
    setVinculoEditando(vinculo);
    setFormulario({
      apoderadoId: vinculo.apoderadoId || "",
      alumnoId: vinculo.alumnoId || "",
      parentesco: vinculo.parentesco || "",
      tipoResponsabilidad:
        vinculo.tipoResponsabilidad || "apoderado_titular",
      puedeRetirar: vinculo.puedeRetirar || "si",
      contactoEmergencia: vinculo.contactoEmergencia || "si",
      recibeComunicaciones: vinculo.recibeComunicaciones || "si",
      estado: vinculo.estado || "activo",
      observaciones: vinculo.observaciones || "",
    });
    setError("");
    setMensaje("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setVinculoEditando(null);
    setFormulario(formularioInicial);
    setGuardando(false);
  };

  const validarFormulario = () => {
    if (!formulario.apoderadoId) {
      return "Debes seleccionar un apoderado.";
    }

    if (!formulario.alumnoId) {
      return "Debes seleccionar un alumno.";
    }

    if (!formulario.parentesco) {
      return "Debes seleccionar el parentesco o vínculo familiar.";
    }

    const existeVinculoActivo = vinculaciones.some((item) => {
      const mismoApoderado = item.apoderadoId === formulario.apoderadoId;
      const mismoAlumno = item.alumnoId === formulario.alumnoId;
      const activo = item.estado === "activo";
      const distintoDocumento = !vinculoEditando || item.id !== vinculoEditando.id;

      return mismoApoderado && mismoAlumno && activo && distintoDocumento;
    });

    if (existeVinculoActivo) {
      return "Ya existe un vínculo activo entre este apoderado y este alumno.";
    }

    return "";
  };

  const guardarVinculo = async (e) => {
    e.preventDefault();

    const validacion = validarFormulario();
    if (validacion) {
      setError(validacion);
      setMensaje("");
      return;
    }

    const apoderado = apoderados.find(
      (item) => item.id === formulario.apoderadoId
    );

    const alumno = alumnos.find((item) => item.id === formulario.alumnoId);

    if (!apoderado || !alumno) {
      setError("No se encontró el apoderado o el alumno seleccionado.");
      return;
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    const datosGuardar = {
      apoderadoId: apoderado.id,
      alumnoId: alumno.id,

      apoderadoNombre: obtenerNombreApoderado(apoderado),
      apoderadoRut: apoderado.rut || "Sin RUT",
      apoderadoTelefono: apoderado.telefonoPrincipal || "",
      apoderadoCorreo: apoderado.correo || "",

      alumnoNombre: obtenerNombreAlumno(alumno),
      alumnoRut: obtenerRutAlumno(alumno),
      alumnoNivel: obtenerNivelAlumno(alumno),

      parentesco: formulario.parentesco,
      tipoResponsabilidad: formulario.tipoResponsabilidad,
      puedeRetirar: formulario.puedeRetirar,
      contactoEmergencia: formulario.contactoEmergencia,
      recibeComunicaciones: formulario.recibeComunicaciones,
      estado: formulario.estado,
      observaciones: formulario.observaciones.trim(),
      anioGestion,
      actualizadoEn: serverTimestamp(),
    };

    try {
      if (vinculoEditando) {
        await updateDoc(
          doc(db, "vinculaciones_apoderados_alumnos", vinculoEditando.id),
          datosGuardar
        );

        setVinculaciones((prev) =>
          prev.map((item) =>
            item.id === vinculoEditando.id
              ? {
                  ...item,
                  ...datosGuardar,
                }
              : item
          )
        );

        setMensaje("Vínculo actualizado correctamente.");
      } else {
        const nuevoDocumento = await addDoc(
          collection(db, "vinculaciones_apoderados_alumnos"),
          {
            ...datosGuardar,
            creadoEn: serverTimestamp(),
          }
        );

        setVinculaciones((prev) => [
          {
            id: nuevoDocumento.id,
            ...datosGuardar,
          },
          ...prev,
        ]);

        setMensaje("Vínculo creado correctamente.");
      }

      cerrarFormulario();
    } catch (err) {
      console.error("Error al guardar vínculo:", err);
      setError("No se pudo guardar el vínculo. Revisa permisos de Firebase.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoVinculo = async (vinculo, nuevoEstado) => {
    const confirmar = window.confirm(
      nuevoEstado === "inactivo"
        ? "¿Seguro que deseas desactivar este vínculo?"
        : "¿Seguro que deseas activar nuevamente este vínculo?"
    );

    if (!confirmar) return;

    try {
      await updateDoc(doc(db, "vinculaciones_apoderados_alumnos", vinculo.id), {
        estado: nuevoEstado,
        actualizadoEn: serverTimestamp(),
      });

      setVinculaciones((prev) =>
        prev.map((item) =>
          item.id === vinculo.id ? { ...item, estado: nuevoEstado } : item
        )
      );

      setMensaje(
        nuevoEstado === "inactivo"
          ? "Vínculo desactivado correctamente."
          : "Vínculo activado correctamente."
      );
    } catch (err) {
      console.error("Error al cambiar estado del vínculo:", err);
      setError("No se pudo cambiar el estado del vínculo.");
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("todos");
  };

  const textoTipoResponsabilidad = (tipo) => {
    const opciones = {
      apoderado_titular: "Apoderado titular",
      apoderado_suplente: "Apoderado suplente",
      contacto_emergencia: "Contacto emergencia",
      autorizado_retiro: "Autorizado retiro",
      familiar: "Familiar",
    };

    return opciones[tipo] || tipo;
  };

  return (
    <div className="vinculacion-page">
      <section className="vinculacion-hero">
        <div>
          <span className="vinculacion-chip">
            <Link2 size={16} />
            Año de gestión {anioGestion}
          </span>

          <h1>Vínculos Familiares</h1>

          <p>
            Relaciona apoderados con alumnos, definiendo parentesco,
            responsabilidad, autorización de retiro, contacto de emergencia y
            recepción de comunicaciones.
          </p>
        </div>

        <div className="hero-actions">
          <button type="button" className="btn-secundario" onClick={cargarDatos}>
            <RefreshCw size={18} />
            Actualizar
          </button>

          <button type="button" className="btn-principal" onClick={abrirNuevoVinculo}>
            <PlusCircle size={18} />
            Nuevo vínculo
          </button>
        </div>
      </section>

      <section className="resumen-grid">
        <article>
          <div className="resumen-icon azul">
            <Link2 size={22} />
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
            <span>Activos</span>
            <strong>{resumen.activos}</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon morado">
            <UsersRound size={22} />
          </div>
          <div>
            <span>Titulares</span>
            <strong>{resumen.titulares}</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon naranja">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span>Autorizados retiro</span>
            <strong>{resumen.autorizados}</strong>
          </div>
        </article>
      </section>

      <section className="vinculacion-panel">
        <div className="panel-header">
          <div>
            <h2>Registro de vínculos</h2>
            <p>
              Busca por alumno, apoderado, RUT, parentesco o nivel. Esta sección
              será la base para controlar qué adulto está relacionado con cada
              párvulo.
            </p>
          </div>

          <span className="contador">
            {vinculacionesFiltradas.length} resultado
            {vinculacionesFiltradas.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="filtros-vinculacion">
          <label className="buscador">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por alumno, apoderado, RUT, parentesco o nivel..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </label>

          <select
            value={estadoFiltro}
            onChange={(e) => setEstadoFiltro(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>

          <button type="button" className="btn-limpiar" onClick={limpiarFiltros}>
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
            <h3>Cargando vínculos...</h3>
            <p>Estamos consultando apoderados, alumnos y vinculaciones.</p>
          </div>
        ) : vinculacionesFiltradas.length === 0 ? (
          <div className="estado-vacio">
            <Link2 size={42} />
            <h3>No hay vínculos para mostrar</h3>
            <p>
              Puedes crear el primer vínculo usando el botón “Nuevo vínculo”.
            </p>
          </div>
        ) : (
          <>
            <div className="tabla-vinculos desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Alumno</th>
                    <th>Apoderado</th>
                    <th>Parentesco</th>
                    <th>Responsabilidad</th>
                    <th>Retiro</th>
                    <th>Emergencia</th>
                    <th>Comunicaciones</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {vinculacionesFiltradas.map((item) => (
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
                          {textoTipoResponsabilidad(item.tipoResponsabilidad)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.puedeRetirar === "si" ? "badge-ok" : "badge-no"
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
                        <span className={`estado-badge estado-${item.estado}`}>
                          {item.estado}
                        </span>
                      </td>

                      <td>
                        <div className="acciones">
                          <button
                            type="button"
                            title="Editar"
                            onClick={() => abrirEditarVinculo(item)}
                          >
                            <Pencil size={16} />
                          </button>

                          {item.estado === "activo" ? (
                            <button
                              type="button"
                              className="danger"
                              title="Desactivar"
                              onClick={() =>
                                cambiarEstadoVinculo(item, "inactivo")
                              }
                            >
                              <UserX size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Activar"
                              onClick={() =>
                                cambiarEstadoVinculo(item, "activo")
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

            <div className="vinculos-mobile mobile-only">
              {vinculacionesFiltradas.map((item) => (
                <article className="vinculo-card" key={item.id}>
                  <div className="vinculo-card-top">
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

                  <div className="vinculo-card-info">
                    <div>
                      <span>Apoderado</span>
                      <strong>{item.apoderadoNombre}</strong>
                    </div>

                    <div>
                      <span>RUT apoderado</span>
                      <strong>{item.apoderadoRut}</strong>
                    </div>

                    <div>
                      <span>Parentesco</span>
                      <strong>{item.parentesco}</strong>
                    </div>

                    <div>
                      <span>Responsabilidad</span>
                      <strong>
                        {textoTipoResponsabilidad(item.tipoResponsabilidad)}
                      </strong>
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
                  </div>

                  <div className="vinculo-card-actions">
                    <button type="button" onClick={() => abrirEditarVinculo(item)}>
                      <Pencil size={17} />
                      Editar
                    </button>

                    {item.estado === "activo" ? (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => cambiarEstadoVinculo(item, "inactivo")}
                      >
                        <UserX size={17} />
                        Desactivar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => cambiarEstadoVinculo(item, "activo")}
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

      {mostrarFormulario && (
        <div className="modal-backdrop">
          <div className="modal-vinculo">
            <div className="modal-header">
              <div>
                <span>{vinculoEditando ? "Editar vínculo" : "Nuevo vínculo"}</span>
                <h2>
                  {vinculoEditando
                    ? "Editar vínculo familiar"
                    : "Crear vínculo familiar"}
                </h2>
              </div>

              <button type="button" onClick={cerrarFormulario}>
                <X size={20} />
              </button>
            </div>

            <form className="form-vinculo" onSubmit={guardarVinculo}>
              <div className="form-section">
                <h3>Selección principal</h3>

                <div className="form-grid">
                  <label className="full">
                    <span>Apoderado *</span>
                    <select
                      value={formulario.apoderadoId}
                      onChange={(e) =>
                        actualizarCampo("apoderadoId", e.target.value)
                      }
                    >
                      <option value="">Seleccionar apoderado</option>
                      {apoderadosActivos.map((apoderado) => (
                        <option key={apoderado.id} value={apoderado.id}>
                          {obtenerNombreApoderado(apoderado)} ·{" "}
                          {apoderado.rut || "Sin RUT"}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="full">
                    <span>Alumno *</span>
                    <select
                      value={formulario.alumnoId}
                      onChange={(e) =>
                        actualizarCampo("alumnoId", e.target.value)
                      }
                    >
                      <option value="">Seleccionar alumno</option>
                      {alumnosActivos.map((alumno) => (
                        <option key={alumno.id} value={alumno.id}>
                          {obtenerNombreAlumno(alumno)} · {obtenerRutAlumno(alumno)} ·{" "}
                          {obtenerNivelAlumno(alumno)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Tipo de vínculo</h3>

                <div className="form-grid">
                  <label>
                    <span>Parentesco *</span>
                    <select
                      value={formulario.parentesco}
                      onChange={(e) =>
                        actualizarCampo("parentesco", e.target.value)
                      }
                    >
                      <option value="">Seleccionar</option>
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Abuela">Abuela</option>
                      <option value="Abuelo">Abuelo</option>
                      <option value="Tía">Tía</option>
                      <option value="Tío">Tío</option>
                      <option value="Hermana">Hermana</option>
                      <option value="Hermano">Hermano</option>
                      <option value="Tutor legal">Tutor legal</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </label>

                  <label>
                    <span>Responsabilidad</span>
                    <select
                      value={formulario.tipoResponsabilidad}
                      onChange={(e) =>
                        actualizarCampo("tipoResponsabilidad", e.target.value)
                      }
                    >
                      <option value="apoderado_titular">Apoderado titular</option>
                      <option value="apoderado_suplente">Apoderado suplente</option>
                      <option value="contacto_emergencia">Contacto emergencia</option>
                      <option value="autorizado_retiro">Autorizado retiro</option>
                      <option value="familiar">Familiar</option>
                    </select>
                  </label>

                  <label>
                    <span>Estado</span>
                    <select
                      value={formulario.estado}
                      onChange={(e) => actualizarCampo("estado", e.target.value)}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Permisos y autorizaciones</h3>

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

                  <label className="full">
                    <span>Observaciones</span>
                    <textarea
                      rows="4"
                      value={formulario.observaciones}
                      onChange={(e) =>
                        actualizarCampo("observaciones", e.target.value)
                      }
                      placeholder="Agrega observaciones importantes sobre este vínculo familiar."
                    />
                  </label>
                </div>
              </div>

              <div className="form-note">
                <ShieldCheck size={18} />
                Este vínculo será la base para controlar qué apoderados,
                familiares o adultos autorizados están relacionados con cada
                alumno.
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit" className="btn-guardar" disabled={guardando}>
                  <Save size={18} />
                  {guardando ? "Guardando..." : "Guardar vínculo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .vinculacion-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 32%),
            #f8fafc;
          color: #0f172a;
        }

        .vinculacion-hero {
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

        .vinculacion-chip {
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

        .vinculacion-hero h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .vinculacion-hero p {
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

        .btn-principal,
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

        .btn-principal {
          background: #f8fafc;
          color: #0f172a;
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

        .resumen-icon.naranja {
          background: #fff7ed;
          color: #ea580c;
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

        .vinculacion-panel {
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

        .filtros-vinculacion {
          padding: 20px 24px 24px;
          display: grid;
          grid-template-columns: 1fr 220px auto;
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

        .filtros-vinculacion select {
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
          max-width: 520px;
          margin: 0;
          line-height: 1.6;
        }

        .tabla-vinculos {
          overflow-x: auto;
          padding: 0 24px 24px;
        }

        .tabla-vinculos table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1180px;
        }

        .tabla-vinculos th {
          text-align: left;
          padding: 14px 12px;
          color: #475569;
          background: #f8fafc;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabla-vinculos td {
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

        .vinculos-mobile {
          display: none;
          gap: 14px;
          padding: 0 18px 22px;
        }

        .vinculo-card {
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 16px;
          background: white;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
        }

        .vinculo-card-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .vinculo-card-top h3 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
          line-height: 1.2;
        }

        .vinculo-card-top p {
          margin: 4px 0 6px;
          color: #64748b;
          font-weight: 800;
          font-size: 13px;
        }

        .vinculo-card-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 14px 0;
        }

        .vinculo-card-info div {
          padding: 12px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .vinculo-card-info span {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }

        .vinculo-card-info strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          line-height: 1.3;
          word-break: break-word;
        }

        .vinculo-card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .vinculo-card-actions button {
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

        .vinculo-card-actions button.danger {
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

        .modal-vinculo {
          width: min(980px, 100%);
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

        .form-vinculo {
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

        .form-grid input,
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
          background: #eff6ff;
          color: #1d4ed8;
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

        @media (max-width: 1050px) {
          .vinculacion-hero {
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

          .filtros-vinculacion {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .vinculacion-page {
            padding: 10px;
          }

          .vinculacion-hero {
            padding: 22px;
            border-radius: 22px;
            margin-bottom: 14px;
          }

          .vinculacion-hero h1 {
            font-size: 32px;
          }

          .vinculacion-hero p {
            font-size: 14px;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-principal,
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

          .vinculacion-panel {
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

          .filtros-vinculacion {
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

          .vinculos-mobile {
            display: grid;
            padding: 0 12px 18px;
          }

          .vinculo-card-info {
            grid-template-columns: 1fr;
          }

          .vinculo-card-actions {
            grid-template-columns: 1fr;
          }

          .modal-backdrop {
            padding: 8px;
            align-items: start;
          }

          .modal-vinculo {
            border-radius: 22px;
            max-height: 96vh;
          }

          .modal-header {
            padding: 18px;
          }

          .modal-header h2 {
            font-size: 22px;
          }

          .form-vinculo {
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

export default VinculacionAlumnos;
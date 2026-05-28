import { useEffect, useMemo, useState } from "react";
import {
  UsersRound,
  UserPlus,
  Search,
  Save,
  X,
  Pencil,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
  BadgeCheck,
  Link2,
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
  nombres: "",
  apellidos: "",
  rut: "",
  parentescoReferencia: "",
  telefonoPrincipal: "",
  telefonoAlternativo: "",
  correo: "",
  direccion: "",
  comuna: "",
  ocupacion: "",
  estado: "activo",
  puedeRetirar: "si",
  esContactoEmergencia: "si",
  observaciones: "",
};

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

function obtenerIniciales(nombres, apellidos) {
  const texto = `${nombres || ""} ${apellidos || ""}`.trim();

  if (!texto) return "AP";

  return texto
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();
}

function BaseApoderados() {
  const anioGestion = localStorage.getItem("italito_anio_gestion") || "2026";

  const [apoderados, setApoderados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [apoderadoEditando, setApoderadoEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);

  const cargarApoderados = async () => {
    setCargando(true);
    setError("");

    try {
      const snapshot = await getDocs(collection(db, "apoderados"));

      const datos = snapshot.docs.map((documento) => {
        const data = documento.data();

        return {
          id: documento.id,
          nombres: data.nombres || "",
          apellidos: data.apellidos || "",
          rut: data.rut || "",
          parentescoReferencia: data.parentescoReferencia || "",
          telefonoPrincipal: data.telefonoPrincipal || "",
          telefonoAlternativo: data.telefonoAlternativo || "",
          correo: data.correo || "",
          direccion: data.direccion || "",
          comuna: data.comuna || "",
          ocupacion: data.ocupacion || "",
          estado: data.estado || "activo",
          puedeRetirar: data.puedeRetirar || "si",
          esContactoEmergencia: data.esContactoEmergencia || "si",
          observaciones: data.observaciones || "",
          anioGestion: String(data.anioGestion || anioGestion),
          creadoEn: data.creadoEn || "",
          actualizadoEn: data.actualizadoEn || "",
          alumnosVinculados: Array.isArray(data.alumnosVinculados)
            ? data.alumnosVinculados
            : [],
        };
      });

      const datosOrdenados = datos
        .filter((item) => String(item.anioGestion) === String(anioGestion))
        .sort((a, b) =>
          `${a.apellidos} ${a.nombres}`.localeCompare(
            `${b.apellidos} ${b.nombres}`,
            "es"
          )
        );

      setApoderados(datosOrdenados);
    } catch (err) {
      console.error("Error al cargar apoderados:", err);
      setError(
        "No se pudo cargar la base de apoderados. Revisa Firebase o la colección apoderados."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarApoderados();
  }, []);

  const apoderadosFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    return apoderados.filter((item) => {
      const nombreCompleto = `${item.nombres} ${item.apellidos}`;

      const coincideBusqueda =
        !texto ||
        normalizarTexto(nombreCompleto).includes(texto) ||
        normalizarTexto(item.rut).includes(texto) ||
        normalizarTexto(item.telefonoPrincipal).includes(texto) ||
        normalizarTexto(item.telefonoAlternativo).includes(texto) ||
        normalizarTexto(item.correo).includes(texto);

      const coincideEstado =
        estadoFiltro === "todos" || item.estado === estadoFiltro;

      return coincideBusqueda && coincideEstado;
    });
  }, [apoderados, busqueda, estadoFiltro]);

  const resumen = useMemo(() => {
    const activos = apoderados.filter((item) => item.estado === "activo").length;
    const inactivos = apoderados.filter(
      (item) => item.estado === "inactivo"
    ).length;
    const autorizados = apoderados.filter(
      (item) => item.puedeRetirar === "si"
    ).length;
    const emergencia = apoderados.filter(
      (item) => item.esContactoEmergencia === "si"
    ).length;

    return {
      total: apoderados.length,
      activos,
      inactivos,
      autorizados,
      emergencia,
    };
  }, [apoderados]);

  const actualizarCampo = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const abrirNuevoApoderado = () => {
    setApoderadoEditando(null);
    setFormulario(formularioInicial);
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  };

  const abrirEditarApoderado = (apoderado) => {
    setApoderadoEditando(apoderado);
    setFormulario({
      nombres: apoderado.nombres || "",
      apellidos: apoderado.apellidos || "",
      rut: apoderado.rut || "",
      parentescoReferencia: apoderado.parentescoReferencia || "",
      telefonoPrincipal: apoderado.telefonoPrincipal || "",
      telefonoAlternativo: apoderado.telefonoAlternativo || "",
      correo: apoderado.correo || "",
      direccion: apoderado.direccion || "",
      comuna: apoderado.comuna || "",
      ocupacion: apoderado.ocupacion || "",
      estado: apoderado.estado || "activo",
      puedeRetirar: apoderado.puedeRetirar || "si",
      esContactoEmergencia: apoderado.esContactoEmergencia || "si",
      observaciones: apoderado.observaciones || "",
    });
    setMensaje("");
    setError("");
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setApoderadoEditando(null);
    setFormulario(formularioInicial);
    setGuardando(false);
  };

  const validarFormulario = () => {
    if (!formulario.nombres.trim()) {
      return "Debes ingresar el nombre del apoderado.";
    }

    if (!formulario.apellidos.trim()) {
      return "Debes ingresar los apellidos del apoderado.";
    }

    if (!formulario.rut.trim()) {
      return "Debes ingresar el RUT del apoderado.";
    }

    if (!formulario.telefonoPrincipal.trim()) {
      return "Debes ingresar al menos un teléfono principal.";
    }

    return "";
  };

  const guardarApoderado = async (e) => {
    e.preventDefault();

    const validacion = validarFormulario();
    if (validacion) {
      setError(validacion);
      setMensaje("");
      return;
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    const datosGuardar = {
      nombres: formulario.nombres.trim(),
      apellidos: formulario.apellidos.trim(),
      rut: formulario.rut.trim(),
      parentescoReferencia: formulario.parentescoReferencia.trim(),
      telefonoPrincipal: formulario.telefonoPrincipal.trim(),
      telefonoAlternativo: formulario.telefonoAlternativo.trim(),
      correo: formulario.correo.trim(),
      direccion: formulario.direccion.trim(),
      comuna: formulario.comuna.trim(),
      ocupacion: formulario.ocupacion.trim(),
      estado: formulario.estado,
      puedeRetirar: formulario.puedeRetirar,
      esContactoEmergencia: formulario.esContactoEmergencia,
      observaciones: formulario.observaciones.trim(),
      anioGestion,
      actualizadoEn: serverTimestamp(),

      /*
        PREPARADO PARA FUTURA VINCULACIÓN:
        Más adelante este campo puede alimentarse desde VinculacionAlumnos.jsx.
        La estructura sugerida será:
        alumnosVinculados: [
          {
            alumnoId,
            nombreAlumno,
            rutAlumno,
            nivel,
            parentesco,
            esTitular,
            activo
          }
        ]
      */
    };

    try {
      if (apoderadoEditando) {
        await updateDoc(doc(db, "apoderados", apoderadoEditando.id), datosGuardar);

        setApoderados((prev) =>
          prev.map((item) =>
            item.id === apoderadoEditando.id
              ? {
                  ...item,
                  ...datosGuardar,
                  actualizadoEn: new Date().toISOString(),
                }
              : item
          )
        );

        setMensaje("Apoderado actualizado correctamente.");
      } else {
        const nuevoDocumento = await addDoc(collection(db, "apoderados"), {
          ...datosGuardar,
          creadoEn: serverTimestamp(),
          alumnosVinculados: [],
        });

        setApoderados((prev) => [
          {
            id: nuevoDocumento.id,
            ...datosGuardar,
            creadoEn: new Date().toISOString(),
            actualizadoEn: new Date().toISOString(),
            alumnosVinculados: [],
          },
          ...prev,
        ]);

        setMensaje("Apoderado creado correctamente.");
      }

      cerrarFormulario();
    } catch (err) {
      console.error("Error al guardar apoderado:", err);
      setError("No se pudo guardar el apoderado. Revisa permisos de Firebase.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstadoApoderado = async (apoderado, nuevoEstado) => {
    const confirmar = window.confirm(
      nuevoEstado === "inactivo"
        ? "¿Seguro que deseas desactivar este apoderado?"
        : "¿Seguro que deseas activar nuevamente este apoderado?"
    );

    if (!confirmar) return;

    try {
      await updateDoc(doc(db, "apoderados", apoderado.id), {
        estado: nuevoEstado,
        actualizadoEn: serverTimestamp(),
      });

      setApoderados((prev) =>
        prev.map((item) =>
          item.id === apoderado.id ? { ...item, estado: nuevoEstado } : item
        )
      );

      setMensaje(
        nuevoEstado === "inactivo"
          ? "Apoderado desactivado correctamente."
          : "Apoderado activado correctamente."
      );
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      setError("No se pudo cambiar el estado del apoderado.");
    }
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("todos");
  };

  return (
    <div className="base-apoderados-page">
      <section className="base-apoderados-hero">
        <div>
          <span className="base-apoderados-chip">
            <UsersRound size={16} />
            Año de gestión {anioGestion}
          </span>

          <h1>Base de Apoderados</h1>

          <p>
            Administra la ficha única de apoderados: datos personales, contacto,
            autorización de retiro, contacto de emergencia y preparación para
            futuras vinculaciones con alumnos.
          </p>
        </div>

        <div className="hero-actions">
          <button type="button" className="btn-secundario" onClick={cargarApoderados}>
            <RefreshCw size={18} />
            Actualizar
          </button>

          <button type="button" className="btn-principal" onClick={abrirNuevoApoderado}>
            <UserPlus size={18} />
            Nuevo apoderado
          </button>
        </div>
      </section>

      <section className="apoderados-resumen-grid">
        <article>
          <div className="resumen-icon azul">
            <UsersRound size={22} />
          </div>
          <div>
            <span>Total registrados</span>
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
          <div className="resumen-icon naranja">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span>Autorizados retiro</span>
            <strong>{resumen.autorizados}</strong>
          </div>
        </article>

        <article>
          <div className="resumen-icon morado">
            <Phone size={22} />
          </div>
          <div>
            <span>Emergencia</span>
            <strong>{resumen.emergencia}</strong>
          </div>
        </article>
      </section>

      <section className="apoderados-panel">
        <div className="panel-header">
          <div>
            <h2>Registro general</h2>
            <p>
              Busca, edita y administra apoderados. El ingreso de nuevos registros
              y los datos de contacto están integrados en esta misma base.
            </p>
          </div>

          <span className="contador">
            {apoderadosFiltrados.length} resultado
            {apoderadosFiltrados.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="filtros-base-apoderados">
          <label className="buscador">
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, RUT, teléfono o correo..."
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
            <h3>Cargando apoderados...</h3>
            <p>Estamos consultando los registros guardados en Firebase.</p>
          </div>
        ) : apoderadosFiltrados.length === 0 ? (
          <div className="estado-vacio">
            <UsersRound size={42} />
            <h3>No hay apoderados para mostrar</h3>
            <p>
              Puedes crear el primer apoderado usando el botón “Nuevo apoderado”.
            </p>
          </div>
        ) : (
          <>
            <div className="tabla-apoderados desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Apoderado</th>
                    <th>RUT</th>
                    <th>Contacto</th>
                    <th>Parentesco</th>
                    <th>Retiro</th>
                    <th>Emergencia</th>
                    <th>Estado</th>
                    <th>Vínculos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {apoderadosFiltrados.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="apoderado-cell">
                          <div className="avatar-mini">
                            {obtenerIniciales(item.nombres, item.apellidos)}
                          </div>
                          <div>
                            <strong>
                              {item.nombres} {item.apellidos}
                            </strong>
                            <span>{item.ocupacion || "Sin ocupación registrada"}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.rut}</td>

                      <td>
                        <div className="contacto-cell">
                          <span>
                            <Phone size={14} />
                            {item.telefonoPrincipal || "Sin teléfono"}
                          </span>
                          <span>
                            <Mail size={14} />
                            {item.correo || "Sin correo"}
                          </span>
                        </div>
                      </td>

                      <td>{item.parentescoReferencia || "No indicado"}</td>

                      <td>
                        <span className={item.puedeRetirar === "si" ? "badge-ok" : "badge-no"}>
                          {item.puedeRetirar === "si" ? "Sí" : "No"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            item.esContactoEmergencia === "si"
                              ? "badge-ok"
                              : "badge-no"
                          }
                        >
                          {item.esContactoEmergencia === "si" ? "Sí" : "No"}
                        </span>
                      </td>

                      <td>
                        <span className={`estado-badge estado-${item.estado}`}>
                          {item.estado}
                        </span>
                      </td>

                      <td>
                        <span className="vinculos-badge">
                          <Link2 size={14} />
                          {item.alumnosVinculados?.length || 0}
                        </span>
                      </td>

                      <td>
                        <div className="acciones">
                          <button
                            type="button"
                            title="Editar"
                            onClick={() => abrirEditarApoderado(item)}
                          >
                            <Pencil size={16} />
                          </button>

                          {item.estado === "activo" ? (
                            <button
                              type="button"
                              className="danger"
                              title="Desactivar"
                              onClick={() => cambiarEstadoApoderado(item, "inactivo")}
                            >
                              <UserX size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              title="Activar"
                              onClick={() => cambiarEstadoApoderado(item, "activo")}
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

            <div className="apoderados-mobile mobile-only">
              {apoderadosFiltrados.map((item) => (
                <article className="apoderado-card-mobile" key={item.id}>
                  <div className="apoderado-mobile-top">
                    <div className="avatar-card">
                      {obtenerIniciales(item.nombres, item.apellidos)}
                    </div>

                    <div>
                      <h3>
                        {item.nombres} {item.apellidos}
                      </h3>
                      <p>{item.rut}</p>
                      <span className={`estado-badge estado-${item.estado}`}>
                        {item.estado}
                      </span>
                    </div>
                  </div>

                  <div className="apoderado-mobile-info">
                    <div>
                      <span>Teléfono</span>
                      <strong>{item.telefonoPrincipal || "Sin teléfono"}</strong>
                    </div>

                    <div>
                      <span>Correo</span>
                      <strong>{item.correo || "Sin correo"}</strong>
                    </div>

                    <div>
                      <span>Parentesco</span>
                      <strong>{item.parentescoReferencia || "No indicado"}</strong>
                    </div>

                    <div>
                      <span>Puede retirar</span>
                      <strong>{item.puedeRetirar === "si" ? "Sí" : "No"}</strong>
                    </div>

                    <div>
                      <span>Emergencia</span>
                      <strong>
                        {item.esContactoEmergencia === "si" ? "Sí" : "No"}
                      </strong>
                    </div>

                    <div>
                      <span>Alumnos vinculados</span>
                      <strong>{item.alumnosVinculados?.length || 0}</strong>
                    </div>
                  </div>

                  <div className="apoderado-mobile-actions">
                    <button type="button" onClick={() => abrirEditarApoderado(item)}>
                      <Pencil size={17} />
                      Editar
                    </button>

                    {item.estado === "activo" ? (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => cambiarEstadoApoderado(item, "inactivo")}
                      >
                        <UserX size={17} />
                        Desactivar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => cambiarEstadoApoderado(item, "activo")}
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
          <div className="modal-apoderado">
            <div className="modal-header">
              <div>
                <span>
                  {apoderadoEditando ? "Editar registro" : "Nuevo registro"}
                </span>
                <h2>
                  {apoderadoEditando
                    ? "Editar apoderado"
                    : "Nuevo apoderado"}
                </h2>
              </div>

              <button type="button" onClick={cerrarFormulario}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarApoderado} className="form-apoderado">
              <div className="form-section">
                <h3>Datos personales</h3>

                <div className="form-grid">
                  <label>
                    <span>Nombres *</span>
                    <input
                      type="text"
                      value={formulario.nombres}
                      onChange={(e) => actualizarCampo("nombres", e.target.value)}
                      placeholder="Ej: María"
                    />
                  </label>

                  <label>
                    <span>Apellidos *</span>
                    <input
                      type="text"
                      value={formulario.apellidos}
                      onChange={(e) => actualizarCampo("apellidos", e.target.value)}
                      placeholder="Ej: González Pérez"
                    />
                  </label>

                  <label>
                    <span>RUT *</span>
                    <input
                      type="text"
                      value={formulario.rut}
                      onChange={(e) => actualizarCampo("rut", e.target.value)}
                      placeholder="Ej: 12.345.678-9"
                    />
                  </label>

                  <label>
                    <span>Parentesco referencial</span>
                    <select
                      value={formulario.parentescoReferencia}
                      onChange={(e) =>
                        actualizarCampo("parentescoReferencia", e.target.value)
                      }
                    >
                      <option value="">Seleccionar</option>
                      <option value="Madre">Madre</option>
                      <option value="Padre">Padre</option>
                      <option value="Abuela">Abuela</option>
                      <option value="Abuelo">Abuelo</option>
                      <option value="Tía">Tía</option>
                      <option value="Tío">Tío</option>
                      <option value="Tutor legal">Tutor legal</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </label>

                  <label>
                    <span>Ocupación</span>
                    <input
                      type="text"
                      value={formulario.ocupacion}
                      onChange={(e) => actualizarCampo("ocupacion", e.target.value)}
                      placeholder="Ej: Trabajadora independiente"
                    />
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
                <h3>Datos de contacto</h3>

                <div className="form-grid">
                  <label>
                    <span>Teléfono principal *</span>
                    <input
                      type="text"
                      value={formulario.telefonoPrincipal}
                      onChange={(e) =>
                        actualizarCampo("telefonoPrincipal", e.target.value)
                      }
                      placeholder="Ej: +56 9 8765 4321"
                    />
                  </label>

                  <label>
                    <span>Teléfono alternativo</span>
                    <input
                      type="text"
                      value={formulario.telefonoAlternativo}
                      onChange={(e) =>
                        actualizarCampo("telefonoAlternativo", e.target.value)
                      }
                      placeholder="Ej: +56 9 1234 5678"
                    />
                  </label>

                  <label>
                    <span>Correo electrónico</span>
                    <input
                      type="email"
                      value={formulario.correo}
                      onChange={(e) => actualizarCampo("correo", e.target.value)}
                      placeholder="Ej: apoderado@email.com"
                    />
                  </label>

                  <label>
                    <span>Comuna</span>
                    <input
                      type="text"
                      value={formulario.comuna}
                      onChange={(e) => actualizarCampo("comuna", e.target.value)}
                      placeholder="Ej: Limache"
                    />
                  </label>

                  <label className="full">
                    <span>Dirección</span>
                    <input
                      type="text"
                      value={formulario.direccion}
                      onChange={(e) => actualizarCampo("direccion", e.target.value)}
                      placeholder="Calle, número, sector o referencia"
                    />
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Autorizaciones básicas</h3>

                <div className="form-grid">
                  <label>
                    <span>¿Puede retirar al alumno?</span>
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
                    <span>¿Es contacto de emergencia?</span>
                    <select
                      value={formulario.esContactoEmergencia}
                      onChange={(e) =>
                        actualizarCampo("esContactoEmergencia", e.target.value)
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
                      placeholder="Anota información relevante, restricciones, indicaciones o detalles importantes."
                    />
                  </label>
                </div>
              </div>

              <div className="form-note">
                <Link2 size={18} />
                La vinculación con alumnos se administrará desde el módulo
                “Vínculos Familiares”. Esta ficha queda preparada para esa
                integración.
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit" className="btn-guardar" disabled={guardando}>
                  <Save size={18} />
                  {guardando ? "Guardando..." : "Guardar apoderado"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .base-apoderados-page {
          width: 100%;
          min-height: 100%;
          padding: 24px;
          background:
            radial-gradient(circle at top left, rgba(59, 130, 246, 0.10), transparent 34%),
            radial-gradient(circle at top right, rgba(16, 185, 129, 0.10), transparent 32%),
            #f8fafc;
          color: #0f172a;
        }

        .base-apoderados-hero {
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

        .base-apoderados-chip {
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

        .base-apoderados-hero h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .base-apoderados-hero p {
          max-width: 820px;
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

        .apoderados-resumen-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 22px;
        }

        .apoderados-resumen-grid article {
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

        .resumen-icon.naranja {
          background: #fff7ed;
          color: #ea580c;
        }

        .resumen-icon.morado {
          background: #f5f3ff;
          color: #7c3aed;
        }

        .apoderados-resumen-grid span {
          display: block;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
        }

        .apoderados-resumen-grid strong {
          display: block;
          font-size: 28px;
          line-height: 1;
          margin-top: 5px;
        }

        .apoderados-panel {
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

        .filtros-base-apoderados {
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

        .filtros-base-apoderados select {
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

        .tabla-apoderados {
          overflow-x: auto;
          padding: 0 24px 24px;
        }

        .tabla-apoderados table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1120px;
        }

        .tabla-apoderados th {
          text-align: left;
          padding: 14px 12px;
          color: #475569;
          background: #f8fafc;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid #e2e8f0;
        }

        .tabla-apoderados td {
          padding: 14px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
          font-size: 14px;
          color: #334155;
        }

        .apoderado-cell {
          display: flex;
          align-items: center;
          gap: 11px;
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

        .avatar-card {
          width: 52px;
          height: 52px;
          font-size: 14px;
        }

        .apoderado-cell strong {
          display: block;
          color: #0f172a;
        }

        .apoderado-cell span {
          display: block;
          color: #64748b;
          font-size: 12px;
          margin-top: 2px;
        }

        .contacto-cell {
          display: grid;
          gap: 5px;
        }

        .contacto-cell span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .badge-ok,
        .badge-no,
        .estado-badge,
        .vinculos-badge {
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

        .vinculos-badge {
          background: #eff6ff;
          color: #1d4ed8;
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

        .apoderados-mobile {
          display: none;
          gap: 14px;
          padding: 0 18px 22px;
        }

        .apoderado-card-mobile {
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 16px;
          background: white;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
        }

        .apoderado-mobile-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #e2e8f0;
        }

        .apoderado-mobile-top h3 {
          margin: 0;
          font-size: 17px;
          color: #0f172a;
          line-height: 1.2;
        }

        .apoderado-mobile-top p {
          margin: 4px 0 6px;
          color: #64748b;
          font-weight: 800;
          font-size: 13px;
        }

        .apoderado-mobile-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 14px 0;
        }

        .apoderado-mobile-info div {
          padding: 12px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .apoderado-mobile-info span {
          display: block;
          font-size: 11px;
          color: #64748b;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 5px;
        }

        .apoderado-mobile-info strong {
          display: block;
          font-size: 13px;
          color: #0f172a;
          line-height: 1.3;
          word-break: break-word;
        }

        .apoderado-mobile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .apoderado-mobile-actions button {
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

        .apoderado-mobile-actions button.danger {
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

        .modal-apoderado {
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

        .form-apoderado {
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
          .base-apoderados-hero {
            flex-direction: column;
          }

          .hero-actions {
            width: 100%;
            justify-content: stretch;
          }

          .hero-actions button {
            flex: 1;
          }

          .apoderados-resumen-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .filtros-base-apoderados {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .base-apoderados-page {
            padding: 10px;
          }

          .base-apoderados-hero {
            padding: 22px;
            border-radius: 22px;
            margin-bottom: 14px;
          }

          .base-apoderados-hero h1 {
            font-size: 32px;
          }

          .base-apoderados-hero p {
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

          .apoderados-resumen-grid {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-bottom: 14px;
          }

          .apoderados-resumen-grid article {
            border-radius: 20px;
            padding: 14px;
          }

          .apoderados-panel {
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

          .filtros-base-apoderados {
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

          .apoderados-mobile {
            display: grid;
            padding: 0 12px 18px;
          }

          .apoderado-mobile-info {
            grid-template-columns: 1fr;
          }

          .apoderado-mobile-actions {
            grid-template-columns: 1fr;
          }

          .modal-backdrop {
            padding: 8px;
            align-items: start;
          }

          .modal-apoderado {
            border-radius: 22px;
            max-height: 96vh;
          }

          .modal-header {
            padding: 18px;
          }

          .modal-header h2 {
            font-size: 22px;
          }

          .form-apoderado {
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

export default BaseApoderados;
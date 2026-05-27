import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  FileText,
  Mail,
  Phone,
  Users,
  GraduationCap,
  Filter,
  ArrowLeft,
  RefreshCw,
  UserX,
  Trash2,
} from "lucide-react";

import {
  db,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
  serverTimestamp,
} from "../../../firebase";

function BaseAlumnos() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroNivel, setFiltroNivel] = useState("Todos");
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarAlumnos = async () => {
    try {
      setCargando(true);
      setError("");

      const alumnosRef = collection(db, "alumnos");
      const q = query(alumnosRef, orderBy("fechaRegistro", "desc"));
      const snapshot = await getDocs(q);

      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setAlumnos(lista);
    } catch (err) {
      console.error("Error al cargar alumnos:", err);
      setError(
        "No se pudo cargar la base de alumnos. Revisa la conexión o las reglas de Firebase."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const alumnosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return alumnos.filter((alumno) => {
      const nombreCompleto =
        alumno.nombreCompleto ||
        `${alumno.nombres || ""} ${alumno.apellidos || ""}`.trim();

      const rut = alumno.rut || "";
      const apoderado =
        alumno.apoderadoTitular ||
        alumno.apoderado ||
        alumno.nombreApoderado ||
        "";
      const correo = alumno.correoApoderado || alumno.correo || "";
      const nivel = alumno.nivel || "";

      const coincideNivel = filtroNivel === "Todos" || nivel === filtroNivel;

      const coincideBusqueda =
        texto === "" ||
        nombreCompleto.toLowerCase().includes(texto) ||
        rut.toLowerCase().includes(texto) ||
        apoderado.toLowerCase().includes(texto) ||
        correo.toLowerCase().includes(texto);

      return coincideNivel && coincideBusqueda;
    });
  }, [alumnos, busqueda, filtroNivel]);

  const alumnosActivos = alumnos.filter(
    (alumno) => (alumno.estado || "Activo") === "Activo"
  );

  const totalPreKinder = alumnosActivos.filter(
    (alumno) => alumno.nivel === "Pre-Kínder"
  ).length;

  const totalKinder = alumnosActivos.filter(
    (alumno) => alumno.nivel === "Kínder"
  ).length;

  const obtenerNombreAlumno = (alumno) => {
    return (
      alumno.nombreCompleto ||
      `${alumno.nombres || ""} ${alumno.apellidos || ""}`.trim() ||
      "Sin nombre registrado"
    );
  };

  const obtenerApoderado = (alumno) => {
    return (
      alumno.apoderadoTitular ||
      alumno.apoderado ||
      alumno.nombreApoderado ||
      "Sin apoderado registrado"
    );
  };

  const obtenerTelefono = (alumno) => {
    return alumno.telefonoApoderado || alumno.telefono || "Sin teléfono";
  };

  const obtenerCorreo = (alumno) => {
    return alumno.correoApoderado || alumno.correo || "Sin correo";
  };

  const marcarComoRetirado = async (alumno) => {
    const confirmar = window.confirm(
      `¿Deseas marcar como retirado a ${obtenerNombreAlumno(alumno)}?`
    );

    if (!confirmar) return;

    try {
      const alumnoRef = doc(db, "alumnos", alumno.id);

      await updateDoc(alumnoRef, {
        estado: "Retirado",
        actualizadoEn: serverTimestamp(),
      });

      await cargarAlumnos();
    } catch (err) {
      console.error("Error al actualizar alumno:", err);
      alert("No se pudo actualizar el estado del alumno.");
    }
  };

  const eliminarAlumno = async (alumno) => {
    const confirmar = window.confirm(
      `¿Deseas eliminar definitivamente a ${obtenerNombreAlumno(
        alumno
      )}?\n\nEsta acción borrará el registro desde Firebase y no se podrá recuperar.`
    );

    if (!confirmar) return;

    const confirmarFinal = window.confirm(
      "Confirmación final: esta acción es solo recomendable para alumnos de prueba o registros ingresados por error. ¿Deseas continuar?"
    );

    if (!confirmarFinal) return;

    try {
      await deleteDoc(doc(db, "alumnos", alumno.id));
      await cargarAlumnos();
    } catch (err) {
      console.error("Error al eliminar alumno:", err);
      alert("No se pudo eliminar el alumno desde Firebase.");
    }
  };

  return (
    <div className="base-alumnos-page">
      <style>{`
        .base-alumnos-page {
          width: 100%;
          min-height: 100vh;
          padding: 32px;
          background:
            radial-gradient(circle at top left, rgba(37, 99, 235, 0.10), transparent 30%),
            linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          box-sizing: border-box;
          color: #0f172a;
        }

        .base-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 18px;
          color: #2563eb;
          font-weight: 800;
          font-size: 14px;
          text-decoration: none;
        }

        .base-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(148, 163, 184, 0.26);
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.09);
          backdrop-filter: blur(14px);
        }

        .base-kicker {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
          font-size: 13px;
          font-weight: 800;
          margin-bottom: 12px;
        }

        .base-hero h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .base-hero p {
          max-width: 760px;
          margin: 12px 0 0;
          color: #475569;
          line-height: 1.6;
          font-size: 15px;
        }

        .base-actions-top {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .base-primary-button,
        .base-secondary-button {
          border: none;
          border-radius: 15px;
          padding: 13px 17px;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
        }

        .base-primary-button {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: white;
          box-shadow: 0 14px 30px rgba(37, 99, 235, 0.28);
        }

        .base-secondary-button {
          background: white;
          color: #1d4ed8;
          border: 1px solid rgba(37, 99, 235, 0.24);
        }

        .base-primary-button:hover,
        .base-secondary-button:hover {
          transform: translateY(-2px);
        }

        .base-secondary-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .base-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .base-summary-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(148, 163, 184, 0.26);
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        }

        .base-summary-icon {
          width: 58px;
          height: 58px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .base-summary-card.azul .base-summary-icon {
          background: rgba(37, 99, 235, 0.12);
          color: #2563eb;
        }

        .base-summary-card.verde .base-summary-icon {
          background: rgba(22, 163, 74, 0.12);
          color: #16a34a;
        }

        .base-summary-card.amarillo .base-summary-icon {
          background: rgba(234, 179, 8, 0.16);
          color: #a16207;
        }

        .base-summary-card p {
          margin: 0 0 6px;
          font-size: 13px;
          font-weight: 800;
          color: #64748b;
        }

        .base-summary-card h2 {
          margin: 0;
          font-size: 30px;
          font-weight: 950;
          color: #0f172a;
          letter-spacing: -0.04em;
        }

        .base-summary-card span {
          display: block;
          margin-top: 5px;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }

        .base-panel {
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 28px;
          padding: 22px;
          box-shadow: 0 18px 46px rgba(15, 23, 42, 0.10);
          overflow: hidden;
        }

        .base-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .base-search {
          flex: 1;
          min-width: 260px;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          background: #f8fafc;
          border: 1px solid rgba(203, 213, 225, 0.9);
          border-radius: 16px;
          color: #64748b;
        }

        .base-search input {
          width: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: #0f172a;
        }

        .base-search input::placeholder {
          color: #94a3b8;
        }

        .base-filters {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .base-filters button {
          height: 42px;
          border: 1px solid rgba(203, 213, 225, 0.9);
          background: white;
          border-radius: 14px;
          padding: 0 14px;
          color: #475569;
          font-size: 13px;
          font-weight: 850;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          transition: all 0.2s ease;
        }

        .base-filters button:hover,
        .base-filters button.active {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: rgba(37, 99, 235, 0.35);
        }

        .base-table-wrap {
          overflow-x: auto;
          border-radius: 20px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          -webkit-overflow-scrolling: touch;
        }

        .base-table {
          width: 100%;
          min-width: 1040px;
          border-collapse: collapse;
          background: white;
        }

        .base-table thead {
          background: #f8fafc;
        }

        .base-table th {
          text-align: left;
          padding: 15px 16px;
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 900;
          border-bottom: 1px solid #e2e8f0;
        }

        .base-table td {
          padding: 16px;
          border-bottom: 1px solid #eef2f7;
          font-size: 14px;
          color: #334155;
          vertical-align: middle;
        }

        .base-table tbody tr:hover {
          background: #f8fafc;
        }

        .base-student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .base-avatar {
          width: 44px;
          height: 44px;
          border-radius: 16px;
          background: linear-gradient(135deg, #dbeafe, #bfdbfe);
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 950;
          font-size: 14px;
          flex-shrink: 0;
        }

        .base-student-cell strong {
          display: block;
          color: #0f172a;
          font-weight: 900;
          margin-bottom: 3px;
        }

        .base-student-cell span {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .nivel-badge,
        .base-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .nivel-badge.prekinder {
          background: rgba(22, 163, 74, 0.11);
          color: #15803d;
        }

        .nivel-badge.kinder {
          background: rgba(147, 51, 234, 0.11);
          color: #7e22ce;
        }

        .base-status.activo {
          background: rgba(37, 99, 235, 0.10);
          color: #1d4ed8;
        }

        .base-status.retirado {
          background: rgba(239, 68, 68, 0.10);
          color: #b91c1c;
        }

        .base-status.postulante {
          background: rgba(234, 179, 8, 0.15);
          color: #a16207;
        }

        .base-status.egresado {
          background: rgba(100, 116, 139, 0.12);
          color: #475569;
        }

        .base-contact {
          display: grid;
          gap: 6px;
        }

        .base-contact span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #475569;
          font-size: 13px;
          white-space: nowrap;
        }

        .base-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .base-actions button,
        .base-actions a {
          width: 36px;
          height: 36px;
          border: 1px solid rgba(203, 213, 225, 0.9);
          background: white;
          color: #475569;
          border-radius: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .base-actions button:hover,
        .base-actions a:hover {
          background: #eff6ff;
          color: #1d4ed8;
          border-color: rgba(37, 99, 235, 0.35);
          transform: translateY(-1px);
        }

        .base-actions button.danger:hover {
          background: #fef2f2;
          color: #b91c1c;
          border-color: rgba(239, 68, 68, 0.35);
        }

        .base-actions button.delete:hover {
          background: #7f1d1d;
          color: white;
          border-color: #7f1d1d;
        }

        .base-empty,
        .base-loading,
        .base-error {
          padding: 34px 16px;
          text-align: center;
          color: #64748b;
          font-weight: 700;
        }

        .base-error {
          color: #b91c1c;
        }

        .base-note {
          margin-top: 22px;
          background: linear-gradient(135deg, #0f172a, #1e3a8a);
          color: rgba(255,255,255,0.82);
          border-radius: 22px;
          padding: 20px 22px;
          line-height: 1.6;
          font-size: 14px;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.20);
        }

        .base-note strong {
          color: white;
        }

        @media (max-width: 1000px) {
          .base-summary {
            grid-template-columns: 1fr;
          }

          .base-hero,
          .base-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .base-actions-top {
            justify-content: flex-start;
          }

          .base-primary-button,
          .base-secondary-button {
            justify-content: center;
          }

          .base-search {
            min-width: 100%;
          }

          .base-filters {
            width: 100%;
          }

          .base-filters button {
            flex: 1;
            justify-content: center;
          }
        }

        @media (max-width: 700px) {
          .base-alumnos-page {
            padding: 16px;
          }

          .base-back-link {
            font-size: 13px;
            margin-bottom: 14px;
          }

          .base-hero {
            padding: 20px;
            border-radius: 24px;
            margin-bottom: 18px;
          }

          .base-kicker {
            font-size: 12px;
          }

          .base-hero h1 {
            font-size: 27px;
            letter-spacing: -0.035em;
          }

          .base-hero p {
            font-size: 14px;
          }

          .base-actions-top {
            display: grid;
            grid-template-columns: 1fr;
            width: 100%;
          }

          .base-primary-button,
          .base-secondary-button {
            width: 100%;
            min-height: 48px;
            box-sizing: border-box;
          }

          .base-summary {
            gap: 12px;
            margin-bottom: 18px;
          }

          .base-summary-card {
            padding: 16px;
            border-radius: 20px;
          }

          .base-summary-icon {
            width: 48px;
            height: 48px;
            border-radius: 16px;
          }

          .base-summary-card h2 {
            font-size: 25px;
          }

          .base-panel {
            padding: 14px;
            border-radius: 24px;
          }

          .base-toolbar {
            gap: 12px;
            margin-bottom: 16px;
          }

          .base-search {
            width: 100%;
            min-width: 0;
            height: 46px;
            box-sizing: border-box;
          }

          .base-search input {
            font-size: 14px;
          }

          .base-filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .base-filters button {
            width: 100%;
            min-height: 42px;
            padding: 0 10px;
            font-size: 12px;
            justify-content: center;
          }

          .base-table-wrap {
            border-radius: 18px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .base-table {
            min-width: 980px;
          }

          .base-table th {
            padding: 12px 14px;
            font-size: 11px;
          }

          .base-table td {
            padding: 13px 14px;
            font-size: 13px;
          }

          .base-student-cell {
            min-width: 210px;
          }

          .base-avatar {
            width: 40px;
            height: 40px;
            border-radius: 14px;
          }

          .base-contact span {
            font-size: 12px;
          }

          .base-actions {
            min-width: 170px;
          }

          .base-actions button,
          .base-actions a {
            width: 38px;
            height: 38px;
          }

          .base-note {
            border-radius: 20px;
            padding: 18px;
            font-size: 13.5px;
          }
        }

        @media (max-width: 430px) {
          .base-alumnos-page {
            padding: 12px;
          }

          .base-hero {
            padding: 18px;
          }

          .base-hero h1 {
            font-size: 25px;
          }

          .base-summary-card {
            align-items: flex-start;
          }

          .base-filters {
            grid-template-columns: 1fr;
          }

          .base-table {
            min-width: 920px;
          }
        }
      `}</style>

      <Link to="/gestion/alumnos" className="base-back-link">
        <ArrowLeft size={18} />
        Volver al módulo alumnos
      </Link>

      <section className="base-hero">
        <div>
          <span className="base-kicker">Italito Gestión Escolar</span>
          <h1>Base de alumnos</h1>
          <p>
            Registro central de estudiantes de Pre-Kínder y Kínder, sus
            apoderados, datos de contacto y estado escolar.
          </p>
        </div>

        <div className="base-actions-top">
          <button
            type="button"
            className="base-secondary-button"
            onClick={cargarAlumnos}
            disabled={cargando}
          >
            <RefreshCw size={18} />
            Actualizar
          </button>

          <Link to="/gestion/alumnos/nuevo" className="base-primary-button">
            <Plus size={20} />
            Agregar alumno
          </Link>
        </div>
      </section>

      <section className="base-summary">
        <article className="base-summary-card azul">
          <div className="base-summary-icon">
            <Users size={28} />
          </div>
          <div>
            <p>Total alumnos</p>
            <h2>{alumnos.length}</h2>
            <span>Año escolar 2026</span>
          </div>
        </article>

        <article className="base-summary-card verde">
          <div className="base-summary-icon">
            <GraduationCap size={28} />
          </div>
          <div>
            <p>Pre-Kínder</p>
            <h2>{totalPreKinder}</h2>
            <span>Alumnos activos</span>
          </div>
        </article>

        <article className="base-summary-card amarillo">
          <div className="base-summary-icon">
            <GraduationCap size={28} />
          </div>
          <div>
            <p>Kínder</p>
            <h2>{totalKinder}</h2>
            <span>Alumnos activos</span>
          </div>
        </article>
      </section>

      <section className="base-panel">
        <div className="base-toolbar">
          <div className="base-search">
            <Search size={20} />
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, RUT, apoderado o correo..."
            />
          </div>

          <div className="base-filters">
            <button
              type="button"
              className={filtroNivel === "Todos" ? "active" : ""}
              onClick={() => setFiltroNivel("Todos")}
            >
              <Filter size={16} />
              Todos
            </button>

            <button
              type="button"
              className={filtroNivel === "Pre-Kínder" ? "active" : ""}
              onClick={() => setFiltroNivel("Pre-Kínder")}
            >
              Pre-Kínder
            </button>

            <button
              type="button"
              className={filtroNivel === "Kínder" ? "active" : ""}
              onClick={() => setFiltroNivel("Kínder")}
            >
              Kínder
            </button>
          </div>
        </div>

        <div className="base-table-wrap">
          <table className="base-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>RUT</th>
                <th>Nivel</th>
                <th>Apoderado titular</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="7">
                    <div className="base-loading">
                      Cargando base de alumnos desde Firebase...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7">
                    <div className="base-error">{error}</div>
                  </td>
                </tr>
              ) : alumnosFiltrados.length > 0 ? (
                alumnosFiltrados.map((alumno) => {
                  const nombreAlumno = obtenerNombreAlumno(alumno);
                  const estado = alumno.estado || "Activo";
                  const estadoClase = estado.toLowerCase();

                  return (
                    <tr key={alumno.id}>
                      <td>
                        <div className="base-student-cell">
                          <div className="base-avatar">
                            {alumno.nivel === "Pre-Kínder" ? "PK" : "K"}
                          </div>
                          <div>
                            <strong>{nombreAlumno}</strong>
                            <span>Año escolar {alumno.anioEscolar || 2026}</span>
                          </div>
                        </div>
                      </td>

                      <td>{alumno.rut || "Sin RUT"}</td>

                      <td>
                        <span
                          className={
                            alumno.nivel === "Pre-Kínder"
                              ? "nivel-badge prekinder"
                              : "nivel-badge kinder"
                          }
                        >
                          {alumno.nivel || "Sin nivel"}
                        </span>
                      </td>

                      <td>{obtenerApoderado(alumno)}</td>

                      <td>
                        <div className="base-contact">
                          <span>
                            <Phone size={14} />
                            {obtenerTelefono(alumno)}
                          </span>
                          <span>
                            <Mail size={14} />
                            {obtenerCorreo(alumno)}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={`base-status ${estadoClase}`}>
                          {estado}
                        </span>
                      </td>

                      <td>
                        <div className="base-actions">
                          <button
                            type="button"
                            title="Ver ficha"
                            onClick={() =>
                              alert(
                                `Ficha de ${nombreAlumno}\n\nPróximo paso: conectar vista detallada del alumno.`
                              )
                            }
                          >
                            <Eye size={17} />
                          </button>

                          <Link
                            to={`/gestion/alumnos/nuevo?id=${alumno.id}`}
                            title="Editar ficha"
                          >
                            <Pencil size={17} />
                          </Link>

                          <Link
                            to={`/gestion/certificados/alumno-regular?rut=${
                              alumno.rut || ""
                            }`}
                            title="Generar certificado"
                          >
                            <FileText size={17} />
                          </Link>

                          {estado !== "Retirado" && (
                            <button
                              type="button"
                              className="danger"
                              title="Marcar como retirado"
                              onClick={() => marcarComoRetirado(alumno)}
                            >
                              <UserX size={17} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="delete"
                            title="Eliminar definitivamente"
                            onClick={() => eliminarAlumno(alumno)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="base-empty">
                      No se encontraron alumnos registrados. Puedes agregar un
                      alumno nuevo desde el botón superior.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="base-note">
        <strong>Base conectada a Firebase:</strong> esta pantalla lee la
        colección <strong>alumnos</strong> desde Firestore. Para alumnos reales,
        se recomienda usar <strong>Marcar como retirado</strong>. El botón{" "}
        <strong>Eliminar definitivamente</strong> debe usarse solo para pruebas
        o registros ingresados por error.
      </section>
    </div>
  );
}

export default BaseAlumnos;
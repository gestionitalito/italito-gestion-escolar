import { useEffect, useMemo, useState } from "react";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  FolderOpen,
  BarChart3,
  Settings,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  School,
  GraduationCap,
  Bell,
  Upload,
  Archive,
  CheckCircle2,
  AlertTriangle,
  History,
  RefreshCcw,
  PlusCircle,
  BookOpenCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [anioGestion, setAnioGestion] = useState(() => {
    return localStorage.getItem("italito_anio_gestion") || "2026";
  });

  useEffect(() => {
    localStorage.setItem("italito_anio_gestion", anioGestion);
  }, [anioGestion]);

  const fechaActual = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /*
    Datos temporales.
    Luego estos valores se reemplazarán por consultas reales a Firebase
    filtradas por anioGestion.
  */

  const resumenAnual = useMemo(
    () => ({
      alumnosActivos: 64,
      preKinder: 32,
      kinder: 32,
      informesPendientes: 12,
      certificadosEmitidos: 45,
      documentosGenerados: 128,
      postulantes: 8,
      funcionariosActivos: 14,
    }),
    []
  );

  const anioSiguiente = Number(anioGestion) + 1;

  const modulos = [
    {
      titulo: "Alumnos",
      descripcion:
        "Fichas, matrícula, salud, postulación, accidentes escolares e historial del alumno.",
      icono: Users,
      ruta: "/gestion/alumnos",
      clase: "azul",
    },
    {
      titulo: "Apoderados",
      descripcion:
        "Registro de apoderados, datos de contacto, autorizaciones y vínculo con alumnos.",
      icono: UserRound,
      ruta: "/gestion/apoderados",
      clase: "verde",
    },
    {
      titulo: "Funcionarios",
      descripcion:
        "Nómina referencial, cargo, función, nivel asignado y datos institucionales.",
      icono: BriefcaseBusiness,
      ruta: "/gestion/funcionarios",
      clase: "naranjo",
    },
    {
      titulo: "Informes",
      descripcion:
        "Informe al hogar, informes pendientes, emitidos y seguimiento pedagógico.",
      icono: ClipboardCheck,
      ruta: "/gestion/informes",
      clase: "morado",
    },
    {
      titulo: "Certificados",
      descripcion:
        "Alumno regular, matrícula, retiro, asistencia y certificados personalizados.",
      icono: FileText,
      ruta: "/gestion/certificados",
      clase: "rojo",
    },
    {
      titulo: "Documentos",
      descripcion:
        "Historial documental, carga Excel, plantillas y documentos por alumno.",
      icono: FolderOpen,
      ruta: "/gestion/documentos",
      clase: "turquesa",
    },
    {
      titulo: "Reportes",
      descripcion:
        "Matrícula por nivel, nóminas, certificados emitidos e informes del año.",
      icono: BarChart3,
      ruta: "/gestion/reportes",
      clase: "azul-profundo",
    },
    {
      titulo: "Configuración",
      descripcion:
        "Datos institucionales, año escolar, usuarios, roles y parámetros del sistema.",
      icono: Settings,
      ruta: "/gestion/configuracion",
      clase: "gris",
    },
  ];

  const resumen = [
    {
      titulo: "Alumnos activos",
      valor: resumenAnual.alumnosActivos,
      icono: Users,
      clase: "azul",
    },
    {
      titulo: "Pre-Kínder",
      valor: resumenAnual.preKinder,
      icono: GraduationCap,
      clase: "verde",
    },
    {
      titulo: "Kínder",
      valor: resumenAnual.kinder,
      icono: School,
      clase: "naranjo",
    },
    {
      titulo: "Informes pendientes",
      valor: resumenAnual.informesPendientes,
      icono: ClipboardCheck,
      clase: "morado",
    },
    {
      titulo: "Certificados emitidos",
      valor: resumenAnual.certificadosEmitidos,
      icono: FileText,
      clase: "rojo",
    },
  ];

  const ultimosRegistros = [
    {
      titulo: "Martina González Pérez",
      detalle: "Nueva matrícula registrada · Pre-Kínder",
      fecha: "26/05/2026",
      icono: Users,
    },
    {
      titulo: "Benjamín Rojas Muñoz",
      detalle: "Ficha actualizada · Kínder",
      fecha: "26/05/2026",
      icono: Users,
    },
    {
      titulo: "Informe al hogar generado",
      detalle: "Isidora Valdés Soto · Pre-Kínder",
      fecha: "25/05/2026",
      icono: ClipboardCheck,
    },
    {
      titulo: "Certificado de alumno regular",
      detalle: "Tomás Contreras Araya · Kínder",
      fecha: "25/05/2026",
      icono: FileText,
    },
    {
      titulo: "Carga Excel realizada",
      detalle: "Actualización masiva de alumnos",
      fecha: "24/05/2026",
      icono: Upload,
    },
  ];

  const alertas = [
    {
      titulo: "Informes pendientes de revisión",
      texto: `${resumenAnual.informesPendientes} informes al hogar aún no han sido finalizados.`,
      tipo: "danger",
    },
    {
      titulo: `Revisar matrícula para año ${anioSiguiente}`,
      texto: "Recuerda preparar el proceso de promoción y nuevos ingresos.",
      tipo: "warning",
    },
    {
      titulo: "Carga Excel recomendada",
      texto: "Puedes actualizar datos masivos de alumnos si existe nueva matrícula.",
      tipo: "info",
    },
    {
      titulo: "Historial documental activo",
      texto: `Los documentos del año ${anioGestion} se deben guardar asociados a cada alumno.`,
      tipo: "success",
    },
  ];

  const cambiarAnio = (e) => {
    setAnioGestion(e.target.value);
  };

  return (
    <div className="italito-dashboard">
      <section className="italito-topbar">
        <div className="italito-brand">
          <div className="italito-logo">🌈</div>

          <div>
            <strong>Italito</strong>
            <span>Gestión Escolar</span>
          </div>
        </div>

        <div className="italito-year-box">
          <span>Año escolar activo:</span>

          <select value={anioGestion} onChange={cambiarAnio}>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
            <option value="2028">2028</option>
            <option value="2029">2029</option>
            <option value="2030">2030</option>
          </select>
        </div>

        <div className="italito-admin-box">
          <ShieldCheck size={22} />
          <div>
            <strong>Sistema interno</strong>
            <span>Solo administradores</span>
          </div>
        </div>

        <div className="italito-user-box">
          <div className="italito-avatar"></div>
          <div>
            <strong>Administrador</strong>
            <span>italito.admin</span>
          </div>
        </div>
      </section>

      <main className="italito-dashboard-content">
        <section className="italito-hero-row">
          <div className="italito-welcome">
            <span className="italito-secure-label">
              <ShieldCheck size={16} />
              Sector protegido para administradores
            </span>

            <h1>Bienvenido al Panel de Gestión Escolar</h1>

            <h2>Escuela de Párvulos Italito</h2>

            <p>
              Desde aquí puedes acceder a todos los módulos internos del sistema.
              La información se organiza por año escolar para conservar el
              historial y permitir una gestión ordenada año tras año.
            </p>

            <div className="italito-date-line">
              <CalendarDays size={17} />
              {fechaActual}
            </div>
          </div>

          <div className="italito-year-management">
            <div className="year-management-title">
              <CalendarDays size={22} />
              <h3>Gestión del año escolar {anioGestion}</h3>
            </div>

            <div className="year-actions">
              <button type="button">
                <RefreshCcw size={20} />
                <span>Promover alumnos al nuevo año</span>
              </button>

              <button type="button">
                <PlusCircle size={20} />
                <span>Abrir año escolar {anioSiguiente}</span>
              </button>

              <button type="button">
                <History size={20} />
                <span>Ver historial de años</span>
              </button>
            </div>

            <p>
              Al cerrar el año {anioGestion}, los alumnos de Pre-Kínder pueden
              pasar automáticamente a Kínder {anioSiguiente}, mientras que los
              alumnos de Kínder quedan como egresados en el historial.
            </p>
          </div>
        </section>

        <section className="italito-modules-grid">
          {modulos.map((modulo) => {
            const Icono = modulo.icono;

            return (
              <Link
                key={modulo.titulo}
                to={modulo.ruta}
                className={`italito-module-card ${modulo.clase}`}
              >
                <div className="module-main">
                  <div className="module-icon">
                    <Icono size={34} />
                  </div>

                  <div>
                    <h3>{modulo.titulo}</h3>
                    <p>{modulo.descripcion}</p>
                  </div>
                </div>

                <div className="module-footer">
                  <span>Ir al módulo</span>
                  <ChevronRight size={22} />
                </div>
              </Link>
            );
          })}
        </section>

        <section className="italito-bottom-grid">
          <div className="italito-panel resumen-panel">
            <div className="panel-title">
              <BookOpenCheck size={20} />
              <h3>Resumen del año {anioGestion}</h3>
            </div>

            <div className="resumen-list">
              {resumen.map((item) => {
                const Icono = item.icono;

                return (
                  <div key={item.titulo} className="resumen-item">
                    <div className={`resumen-icon ${item.clase}`}>
                      <Icono size={18} />
                    </div>

                    <span>{item.titulo}</span>
                    <strong>{item.valor}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="italito-panel registros-panel">
            <div className="panel-title">
              <Archive size={20} />
              <h3>Últimos registros</h3>
            </div>

            <div className="registro-list">
              {ultimosRegistros.map((item) => {
                const Icono = item.icono;

                return (
                  <div
                    key={`${item.titulo}-${item.fecha}`}
                    className="registro-item"
                  >
                    <div className="registro-icon">
                      <Icono size={18} />
                    </div>

                    <div>
                      <strong>{item.titulo}</strong>
                      <span>{item.detalle}</span>
                    </div>

                    <small>{item.fecha}</small>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="italito-panel alertas-panel">
            <div className="panel-title">
              <Bell size={20} />
              <h3>Alertas y recordatorios</h3>
            </div>

            <div className="alerta-list">
              {alertas.map((alerta) => (
                <div
                  key={alerta.titulo}
                  className={`alerta-item ${alerta.tipo}`}
                >
                  {alerta.tipo === "success" ? (
                    <CheckCircle2 size={17} />
                  ) : alerta.tipo === "danger" ? (
                    <AlertTriangle size={17} />
                  ) : (
                    <Bell size={17} />
                  )}

                  <div>
                    <strong>{alerta.titulo}</strong>
                    <span>{alerta.texto}</span>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" className="ver-alertas-btn">
              Ver todas las alertas
              <ChevronRight size={18} />
            </button>
          </div>
        </section>

        <footer className="italito-dashboard-footer">
          <span>Italito Gestión Escolar</span>
          <span>•</span>
          <span>Escuela de Párvulos Italito</span>
          <span>•</span>
          <span>Sistema independiente de CISPTEMA</span>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;
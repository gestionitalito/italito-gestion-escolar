import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";

import PublicLayout from "./components/public/PublicLayout";
import GestionLayout from "./components/gestion/GestionLayout";

/* Sitio público */
import Home from "./pages/public/Home";
import NuestraEscuela from "./pages/public/NuestraEscuela";
import PreKinder from "./pages/public/PreKinder";
import Kinder from "./pages/public/Kinder";
import Noticias from "./pages/public/Noticias";
import Galeria from "./pages/public/Galeria";
import Admision from "./pages/public/Admision";
import Contacto from "./pages/public/Contacto";

/* Gestión - páginas principales */
import Login from "./pages/gestion/Login";
import Dashboard from "./pages/gestion/Dashboard";
import Alumnos from "./pages/gestion/Alumnos";
import Apoderados from "./pages/gestion/Apoderados";
import Certificados from "./pages/gestion/Certificados";
import Configuracion from "./pages/gestion/Configuracion";
import Documentos from "./pages/gestion/Documentos";
import Funcionarios from "./pages/gestion/Funcionarios";
import Informes from "./pages/gestion/Informes";
import Reportes from "./pages/gestion/Reportes";
import CargaMasivaAlumnos from "./pages/gestion/CargaMasivaAlumnos";

/* Gestión - Alumnos */
import AccidentesEscolares from "./pages/gestion/alumnos/AccidentesEscolares";
import BaseAlumnos from "./pages/gestion/alumnos/BaseAlumnos";
import DatosPersonalesAlumno from "./pages/gestion/alumnos/DatosPersonalesAlumno";
import HistorialAlumno from "./pages/gestion/alumnos/HistorialAlumno";
import MatriculaAlumno from "./pages/gestion/alumnos/MatriculaAlumno";
import NuevaFichaAlumno from "./pages/gestion/alumnos/NuevaFichaAlumno";
import PostulacionAlumno from "./pages/gestion/alumnos/PostulacionAlumno";
import SaludAlumno from "./pages/gestion/alumnos/SaludAlumno";

/* Gestión - Apoderados */
import AutorizacionesApoderado from "./pages/gestion/apoderados/AutorizacionesApoderado";
import BaseApoderados from "./pages/gestion/apoderados/BaseApoderados";
import VinculacionAlumnos from "./pages/gestion/apoderados/VinculacionAlumnos";

/* Gestión - Certificados */
import AlumnoRegular from "./pages/gestion/certificados/AlumnoRegular";
import CertificadoAsistencia from "./pages/gestion/certificados/CertificadoAsistencia";
import CertificadoMatricula from "./pages/gestion/certificados/CertificadoMatricula";
import CertificadoPersonalizado from "./pages/gestion/certificados/CertificadoPersonalizado";
import CertificadoRetiro from "./pages/gestion/certificados/CertificadoRetiro";

/* Gestión - Configuración */
import AnioEscolar from "./pages/gestion/configuracion/AnioEscolar";
import DatosInstitucionales from "./pages/gestion/configuracion/DatosInstitucionales";
import Niveles from "./pages/gestion/configuracion/Niveles";
import RolesPermisos from "./pages/gestion/configuracion/RolesPermisos";
import Usuarios from "./pages/gestion/configuracion/Usuarios";

/* Gestión - Documentos */
import CargaExcel from "./pages/gestion/documentos/CargaExcel";
import DocumentosPorAlumno from "./pages/gestion/documentos/DocumentosPorAlumno";
import HistorialDocumental from "./pages/gestion/documentos/HistorialDocumental";
import PlantillasInstitucionales from "./pages/gestion/documentos/PlantillasInstitucionales";

/* Gestión - Funcionarios */
import CargoFuncion from "./pages/gestion/funcionarios/CargoFuncion";
import ContactoInstitucional from "./pages/gestion/funcionarios/ContactoInstitucional";
import DatosPersonalesFuncionario from "./pages/gestion/funcionarios/DatosPersonalesFuncionario";
import DocumentosEscolaresFuncionario from "./pages/gestion/funcionarios/DocumentosEscolaresFuncionario";
import JornadaReferencial from "./pages/gestion/funcionarios/JornadaReferencial";
import NivelAsignado from "./pages/gestion/funcionarios/NivelAsignado";
import NominaFuncionarios from "./pages/gestion/funcionarios/NominaFuncionarios";
import NuevaFichaFuncionario from "./pages/gestion/funcionarios/NuevaFichaFuncionario";
import ObservacionesInternas from "./pages/gestion/funcionarios/ObservacionesInternas";

/* Gestión - Informes */
import EvaluacionesPorNivel from "./pages/gestion/informes/EvaluacionesPorNivel";
import InformeHogar from "./pages/gestion/informes/InformeHogar";
import InformePie from "./pages/gestion/informes/InformePie";
import InformesEmitidos from "./pages/gestion/informes/InformesEmitidos";
import InformesPendientes from "./pages/gestion/informes/InformesPendientes";

/* Gestión - Reportes */
import MatriculasPorNivel from "./pages/gestion/reportes/MatriculasPorNivel";
import NominaGeneral from "./pages/gestion/reportes/NominaGeneral";
import NominaPorNivel from "./pages/gestion/reportes/NominaPorNivel";
import ReporteCertificados from "./pages/gestion/reportes/ReporteCertificados";
import ReporteInformes from "./pages/gestion/reportes/ReporteInformes";

function GestionPage({ children }) {
  return <GestionLayout>{children}</GestionLayout>;
}

function RutaPrivada({ user, cargandoSesion, children }) {
  if (cargandoSesion) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-logo-icon">🌈</div>
            <div>
              <h1>Italito</h1>
              <p>Gestión Escolar</p>
            </div>
          </div>

          <div className="login-intro">
            <span>Verificando acceso</span>
            <h2>Cargando sistema interno...</h2>
            <p>Estamos validando tu sesión de usuario.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/gestion/login" replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioActual) => {
      setUser(usuarioActual);
      setCargandoSesion(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Sitio público */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/nuestra-escuela"
          element={
            <PublicLayout>
              <NuestraEscuela />
            </PublicLayout>
          }
        />

        <Route
          path="/pre-kinder"
          element={
            <PublicLayout>
              <PreKinder />
            </PublicLayout>
          }
        />

        <Route
          path="/kinder"
          element={
            <PublicLayout>
              <Kinder />
            </PublicLayout>
          }
        />

        <Route
          path="/noticias"
          element={
            <PublicLayout>
              <Noticias />
            </PublicLayout>
          }
        />

        <Route
          path="/galeria"
          element={
            <PublicLayout>
              <Galeria />
            </PublicLayout>
          }
        />

        <Route
          path="/admision"
          element={
            <PublicLayout>
              <Admision />
            </PublicLayout>
          }
        />

        <Route
          path="/contacto"
          element={
            <PublicLayout>
              <Contacto />
            </PublicLayout>
          }
        />

        {/* Login sistema interno */}
        <Route
          path="/gestion/login"
          element={
            user ? <Navigate to="/gestion/dashboard" replace /> : <Login />
          }
        />

        {/* Dashboard */}
        <Route
          path="/gestion"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Dashboard />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/dashboard"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Dashboard />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Portadas de módulos */}
        <Route
          path="/gestion/alumnos"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Alumnos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/apoderados"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Apoderados />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/certificados"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Certificados />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/configuracion"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Configuracion />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/documentos"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Documentos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Funcionarios />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/informes"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Informes />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/reportes"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Reportes />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Alumnos */}
        <Route
          path="/gestion/alumnos/base"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <BaseAlumnos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/nuevo"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <NuevaFichaAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/datos-personales"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <DatosPersonalesAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/salud"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <SaludAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/matricula"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <MatriculaAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/postulacion"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <PostulacionAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/accidentes"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <AccidentesEscolares />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/alumnos/historial"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <HistorialAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/carga-masiva-alumnos"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CargaMasivaAlumnos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Apoderados */}
        <Route
          path="/gestion/apoderados/base"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <BaseApoderados />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/apoderados/nuevo"
          element={<Navigate to="/gestion/apoderados/base" replace />}
        />

        <Route
          path="/gestion/apoderados/contacto"
          element={<Navigate to="/gestion/apoderados/base" replace />}
        />

        <Route
          path="/gestion/apoderados/vinculacion"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <VinculacionAlumnos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/apoderados/autorizaciones"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <AutorizacionesApoderado />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Certificados */}
        <Route
          path="/gestion/certificados/alumno-regular"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <AlumnoRegular />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/certificados/asistencia"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CertificadoAsistencia />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/certificados/matricula"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CertificadoMatricula />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/certificados/personalizado"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CertificadoPersonalizado />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/certificados/retiro"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CertificadoRetiro />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Configuración */}
        <Route
          path="/gestion/configuracion/anio-escolar"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <AnioEscolar />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/configuracion/datos-institucionales"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <DatosInstitucionales />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/configuracion/niveles"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Niveles />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/configuracion/roles"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <RolesPermisos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/configuracion/usuarios"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <Usuarios />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Documentos */}
        <Route
          path="/gestion/documentos/carga-excel"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CargaExcel />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/documentos/por-alumno"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <DocumentosPorAlumno />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/documentos/historial"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <HistorialDocumental />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/documentos/plantillas"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <PlantillasInstitucionales />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Funcionarios */}
        <Route
          path="/gestion/funcionarios/cargo-funcion"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <CargoFuncion />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/contacto"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <ContactoInstitucional />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/datos-personales"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <DatosPersonalesFuncionario />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/documentos"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <DocumentosEscolaresFuncionario />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/jornada"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <JornadaReferencial />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/nivel-asignado"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <NivelAsignado />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/nomina"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <NominaFuncionarios />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/nuevo"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <NuevaFichaFuncionario />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/funcionarios/observaciones"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <ObservacionesInternas />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Informes */}
        <Route
          path="/gestion/informes/evaluaciones"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <EvaluacionesPorNivel />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/informes/hogar"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <InformeHogar />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/informes/pie"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <InformePie />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/informes/emitidos"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <InformesEmitidos />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/informes/pendientes"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <InformesPendientes />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Reportes */}
        <Route
          path="/gestion/reportes/matriculas-nivel"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <MatriculasPorNivel />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/reportes/nomina-general"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <NominaGeneral />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/reportes/nomina-nivel"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <NominaPorNivel />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/reportes/certificados"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <ReporteCertificados />
              </GestionPage>
            </RutaPrivada>
          }
        />

        <Route
          path="/gestion/reportes/informes"
          element={
            <RutaPrivada user={user} cargandoSesion={cargandoSesion}>
              <GestionPage>
                <ReporteInformes />
              </GestionPage>
            </RutaPrivada>
          }
        />

        {/* Redirecciones antiguas para no romper accesos anteriores */}
        <Route
          path="/gestion/base-alumnos"
          element={<Navigate to="/gestion/alumnos/base" replace />}
        />

        <Route
          path="/gestion/carga-excel"
          element={<Navigate to="/gestion/documentos/carga-excel" replace />}
        />

        <Route
          path="/gestion/alumnos/carga-masiva"
          element={<Navigate to="/gestion/carga-masiva-alumnos" replace />}
        />

        <Route
          path="/gestion/certificados-old"
          element={<Navigate to="/gestion/certificados" replace />}
        />

        <Route
          path="/gestion/informe-hogar"
          element={<Navigate to="/gestion/informes/hogar" replace />}
        />

        <Route
          path="/gestion/historial"
          element={<Navigate to="/gestion/documentos/historial" replace />}
        />

        <Route
          path="/gestion/alumno/:id"
          element={<Navigate to="/gestion/alumnos/base" replace />}
        />

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
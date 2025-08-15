
import React, { useState, useEffect } from "react";

const MariaUniModule = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  useEffect(() => {
    // Adicionar estilos ao document head
    const styleId = 'maria-uni-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .maria-uni-container {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          background-color: #1e5689;
          color: #f0f0f0;
          line-height: 1.6;
          overflow-x: hidden;
        }

        .maria-uni-container * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .maria-uni-navbar {
          width: 100%;
          background: rgba(26, 50, 127, 0.95);
          backdrop-filter: blur(10px);
          padding: 1rem 0;
          transition: all 0.3s ease;
        }

        .maria-uni-nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .maria-uni-logo {
          height: 40px;
          transition: transform 0.3s ease;
        }

        .maria-uni-logo:hover {
          transform: scale(1.05);
        }

        .maria-uni-nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
        }

        .maria-uni-nav-links a {
          color: #f0f0f0;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
        }

        .maria-uni-nav-links a:hover {
          color: #FFCC00;
        }

        .maria-uni-nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #FFCC00;
          transition: width 0.3s ease;
        }

        .maria-uni-nav-links a:hover::after {
          width: 100%;
        }

        .maria-uni-search-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .maria-uni-search-input {
          padding: 0.5rem 1rem;
          border: 2px solid transparent;
          border-radius: 25px;
          background: #2a2a2a;
          color: #f0f0f0;
          outline: none;
          transition: all 0.3s ease;
          width: 200px;
        }

        .maria-uni-search-input:focus {
          border-color: #FFCC00;
          box-shadow: 0 0 10px rgba(255, 204, 0, 0.3);
        }

        .maria-uni-search-btn {
          padding: 0.5rem 1rem;
          background: #FFCC00;
          color: #1e5689;
          border: none;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .maria-uni-search-btn:hover {
          background: #e6b800;
          transform: translateY(-2px);
        }

        .maria-uni-hero {
          min-height: 70vh;
          position: relative;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #1e5689 0%, #2a2a2a 100%);
          overflow: hidden;
          padding: 3rem 0;
        }

        .maria-uni-hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
        }

        .maria-uni-hero-text h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #FFCC00, #ffdd44);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .maria-uni-hero-text p {
          font-size: 1.2rem;
          color: #b3b3b3;
          margin-bottom: 2rem;
          line-height: 1.8;
        }

        .maria-uni-hero-cta {
          padding: 1rem 2rem;
          background: linear-gradient(45deg, #FFCC00, #ffdd44);
          color: #1e5689;
          border: none;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .maria-uni-hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 204, 0, 0.4);
        }

        .maria-uni-hero-image {
          position: relative;
        }

        .maria-uni-hero-course-image {
          width: 100%;
          height: 300px;
          background: #2a2a2a;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .maria-uni-hero-course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
        }

        .maria-uni-courses-section {
          padding: 4rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .maria-uni-section-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          padding: 0 2rem;
          color: #FFCC00;
        }

        .maria-uni-courses-carousel {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding: 0.5rem 1.5rem 1.5rem;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          margin: 0 -0.75rem;
        }

        .maria-uni-courses-carousel::-webkit-scrollbar {
          display: none;
        }

        .maria-uni-course-card {
          flex: 0 0 280px;
          background: #2a2a2a;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          scroll-snap-align: start;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.6s ease forwards;
        }

        .maria-uni-course-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
        }

        .maria-uni-course-image {
          width: 100%;
          height: 140px;
          background: linear-gradient(135deg, #003399, #0066cc);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .maria-uni-course-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .maria-uni-course-info {
          padding: 1.25rem;
        }

        .maria-uni-course-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #f0f0f0;
          line-height: 1.3;
        }

        .maria-uni-course-description {
          color: #b3b3b3;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .maria-uni-course-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .maria-uni-progress-bar {
          flex: 1;
          height: 6px;
          background: #333;
          border-radius: 3px;
          overflow: hidden;
        }

        .maria-uni-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #008000, #00cc00);
          border-radius: 3px;
          transition: width 0.3s ease;
        }

        .maria-uni-progress-text {
          font-size: 0.8rem;
          color: #008000;
          font-weight: 500;
        }

        .maria-uni-course-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.8rem;
          background: #008000;
          color: white;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .maria-uni-progress-section {
          background: #2a2a2a;
          padding: 3rem 0;
          margin: 3rem 0;
          box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.1), 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .maria-uni-progress-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }

        .maria-uni-progress-item {
          text-align: center;
          padding: 2rem;
          background: #1e5689;
          border-radius: 15px;
          transition: transform 0.3s ease;
        }

        .maria-uni-progress-item:hover {
          transform: translateY(-5px);
        }

        .maria-uni-progress-icon {
          width: 60px;
          height: 60px;
          background: #FFCC00;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
          color: #1e5689;
        }

        .maria-uni-progress-number {
          font-size: 2rem;
          font-weight: 700;
          color: #FFCC00;
          margin-bottom: 0.5rem;
        }

        .maria-uni-progress-label {
          color: #b3b3b3;
          font-weight: 500;
        }

        .maria-uni-footer {
          background: #111;
          padding: 3rem 0 1rem;
          margin-top: 4rem;
        }

        .maria-uni-footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .maria-uni-footer-section h3 {
          color: #FFCC00;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .maria-uni-footer-section a {
          color: #b3b3b3;
          text-decoration: none;
          display: block;
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }

        .maria-uni-footer-section a:hover {
          color: #FFCC00;
        }

        .maria-uni-footer-bottom {
          text-align: center;
          padding-top: 2rem;
          margin-top: 2rem;
          border-top: 1px solid #333;
          color: #b3b3b3;
        }

        .maria-uni-course-view {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #1e5689;
          z-index: 2000;
          overflow-y: auto;
        }

        .maria-uni-course-view.active {
          display: block;
        }

        .maria-uni-course-view-header {
          background: rgba(26, 50, 127, 0.95);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .maria-uni-course-view-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .maria-uni-video-section {
          background: #2a2a2a;
          border-radius: 16px;
          overflow: hidden;
        }

        .maria-uni-video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }

        .maria-uni-video-container video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        .maria-uni-video-info {
          padding: 1.5rem;
        }

        .maria-uni-video-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f0f0f0;
        }

        .maria-uni-video-description {
          color: #b3b3b3;
          font-size: 1rem;
          line-height: 1.6;
        }

        .maria-uni-modules-section {
          background: #2a2a2a;
          border-radius: 16px;
          overflow: hidden;
        }

        .maria-uni-modules-header {
          padding: 1rem 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .maria-uni-modules-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #f0f0f0;
        }

        .maria-uni-modules-list {
          list-style: none;
          padding: 1rem 0;
        }

        .maria-uni-module-item {
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 3px solid transparent;
        }

        .maria-uni-module-item:hover {
          background: rgba(255, 255, 255, 0.05);
          border-left-color: #FFCC00;
        }

        .maria-uni-module-item.active {
          background: rgba(255, 204, 0, 0.1);
          border-left-color: #FFCC00;
        }

        .maria-uni-module-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFCC00;
          border-radius: 50%;
          color: #1e5689;
          font-size: 0.8rem;
        }

        .maria-uni-module-info {
          flex: 1;
        }

        .maria-uni-module-name {
          font-weight: 500;
          color: #f0f0f0;
          margin-bottom: 0.25rem;
        }

        .maria-uni-module-duration {
          font-size: 0.8rem;
          color: #b3b3b3;
        }

        .maria-uni-close-course-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: none;
          color: #f0f0f0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .maria-uni-close-course-btn:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }

        .maria-uni-module-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .maria-uni-module-progress-bar {
          flex: 1;
          height: 4px;
          background: #333;
          border-radius: 2px;
          overflow: hidden;
        }

        .maria-uni-module-progress-fill {
          height: 100%;
          background: #008000;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .maria-uni-nav-container {
            padding: 0 1rem;
          }

          .maria-uni-nav-links {
            display: none;
          }

          .maria-uni-search-input {
            width: 150px;
          }

          .maria-uni-hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            padding: 0 1rem;
          }

          .maria-uni-hero-text h1 {
            font-size: 2rem;
          }

          .maria-uni-courses-carousel {
            padding: 0 1rem 1rem;
          }

          .maria-uni-course-card {
            flex: 0 0 250px;
          }

          .maria-uni-progress-container {
            grid-template-columns: 1fr;
            padding: 0 1rem;
          }

          .maria-uni-course-view-container {
            grid-template-columns: 1fr;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function
    return () => {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
    };
  }, []);

  const openCourseView = (courseId: string) => {
    setActiveModule(courseId);
  };

  const closeCourseView = () => {
    setActiveModule(null);
  };

  const courseVideos = {
    '1': {
      videoUrl: 'https://ecoakyylvovjgtyomera.supabase.co/storage/v1/object/public/video/Videos/coala.mp4',
      title: 'Integração das profissionais',
      description: 'Descrição detalhada do curso de integração...'
    },
    '2': {
      videoUrl: 'https://ecoakyylvovjgtyomera.supabase.co/storage/v1/object/public/video/Videos/coala.mp4',
      title: 'Cozinheira',
      description: 'Descrição detalhada do curso de cozinha...'
    },
    '3': {
      videoUrl: 'https://ecoakyylvovjgtyomera.supabase.co/storage/v1/object/public/video/Videos/coala.mp4',
      title: 'Passadeira',
      description: 'Descrição detalhada do curso de passar roupas...'
    },
    '4': {
      videoUrl: 'https://ecoakyylvovjgtyomera.supabase.co/storage/v1/object/public/video/Videos/coala.mp4',
      title: 'Limpeza de Vidros',
      description: 'Descrição detalhada do curso de limpeza de vidros...'
    }
  };

  const currentCourse = activeModule ? courseVideos[activeModule as keyof typeof courseVideos] : null;

  return (
    <div className="maria-uni-container">
      {/* Barra de Navegação */}
      <nav className="maria-uni-navbar">
        <div className="maria-uni-nav-container">
          <img src="/logo.png" alt="Maria Brasileira" className="maria-uni-logo" />
          
          <ul className="maria-uni-nav-links">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#cursos">Cursos</a></li>
            <li><a href="#progresso">Progresso</a></li>
            <li><a href="#perfil">Perfil</a></li>
          </ul>
          
          <div className="maria-uni-search-container">
            <input type="text" className="maria-uni-search-input" placeholder="Buscar cursos..." />
            <button className="maria-uni-search-btn">Buscar</button>
          </div>
        </div>
      </nav>

      {/* Seção Hero */}
      <section className="maria-uni-hero" id="inicio">
        <div className="maria-uni-hero-content">
          <div className="maria-uni-hero-text">
            <h1>Transforme seu Futuro com a Maria Brasileira</h1>
            <p>Descubra cursos incríveis que vão impulsionar sua carreira e realizar seus sonhos. Aprenda com os melhores professores e tenha acesso a conteúdo de qualidade mundial.</p>
            <a href="#" className="maria-uni-hero-cta">Começar Agora</a>
          </div>
          <div className="maria-uni-hero-image">
            <div className="maria-uni-hero-course-image">
              <img src="https://nehmpbytxsvmsevrxvxa.supabase.co/storage/v1/object/public/imagenscursos//capa%20cursos.jpg" alt="Curso em Destaque" />
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Cursos Populares */}
      <section className="maria-uni-courses-section" id="cursos">
        <h2 className="maria-uni-section-title">Cursos Populares</h2>
        <div className="maria-uni-courses-carousel">
          {/* Card de Curso 1 */}
          <div className="maria-uni-course-card" onClick={() => openCourseView('1')}>
            <div className="maria-uni-course-image">
              <img src="https://nehmpbytxsvmsevrxvxa.supabase.co/storage/v1/object/public/imagenscursos//curso1.jpg" alt="Integração das profissionais" />
            </div>
            <div className="maria-uni-course-info">
              <h3 className="maria-uni-course-title">Integração das profissionais</h3>
              <p className="maria-uni-course-description">Descrição breve do curso que explica o que o aluno vai aprender.</p>
              <div className="maria-uni-course-progress">
                <div className="maria-uni-progress-bar">
                  <div className="maria-uni-progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span className="maria-uni-progress-text">75%</span>
              </div>
              <span className="maria-uni-course-badge">✓ Concluído</span>
            </div>
          </div>

          {/* Card de Curso 2 */}
          <div className="maria-uni-course-card" onClick={() => openCourseView('2')}>
            <div className="maria-uni-course-image">
              <img src="https://nehmpbytxsvmsevrxvxa.supabase.co/storage/v1/object/public/imagenscursos//curso%202.jpg" alt="Cozinheira" />
            </div>
            <div className="maria-uni-course-info">
              <h3 className="maria-uni-course-title">Cozinheira</h3>
              <p className="maria-uni-course-description">Descrição breve do curso que explica o que o aluno vai aprender.</p>
              <div className="maria-uni-course-progress">
                <div className="maria-uni-progress-bar">
                  <div className="maria-uni-progress-fill" style={{ width: '45%' }}></div>
                </div>
                <span className="maria-uni-progress-text">45%</span>
              </div>
              <span className="maria-uni-course-badge">📚 Em Progresso</span>
            </div>
          </div>

          {/* Card de Curso 3 */}
          <div className="maria-uni-course-card" onClick={() => openCourseView('3')}>
            <div className="maria-uni-course-image">
              <img src="https://nehmpbytxsvmsevrxvxa.supabase.co/storage/v1/object/public/imagenscursos//curso3.jpg" alt="Passadeira" />
            </div>
            <div className="maria-uni-course-info">
              <h3 className="maria-uni-course-title">Passadeira</h3>
              <p className="maria-uni-course-description">Descrição breve do curso que explica o que o aluno vai aprender.</p>
              <div className="maria-uni-course-progress">
                <div className="maria-uni-progress-bar">
                  <div className="maria-uni-progress-fill" style={{ width: '0%' }}></div>
                </div>
                <span className="maria-uni-progress-text">0%</span>
              </div>
              <span className="maria-uni-course-badge">🆕 Novo</span>
            </div>
          </div>

          {/* Card de Curso 4 */}
          <div className="maria-uni-course-card" onClick={() => openCourseView('4')}>
            <div className="maria-uni-course-image">
              <img src="https://nehmpbytxsvmsevrxvxa.supabase.co/storage/v1/object/public/imagenscursos//curso%204.jpg" alt="Limpeza de Vidros" />
            </div>
            <div className="maria-uni-course-info">
              <h3 className="maria-uni-course-title">Limpeza de Vidros</h3>
              <p className="maria-uni-course-description">Descrição breve do curso que explica o que o aluno vai aprender.</p>
              <div className="maria-uni-course-progress">
                <div className="maria-uni-progress-bar">
                  <div className="maria-uni-progress-fill" style={{ width: '100%' }}></div>
                </div>
                <span className="maria-uni-progress-text">100%</span>
              </div>
              <span className="maria-uni-course-badge">🏆 Certificado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Progresso do Usuário */}
      <section className="maria-uni-progress-section" id="progresso">
        <div className="maria-uni-progress-container">
          <div className="maria-uni-progress-item">
            <div className="maria-uni-progress-icon">📚</div>
            <div className="maria-uni-progress-number">12</div>
            <div className="maria-uni-progress-label">Cursos Concluídos</div>
          </div>
          <div className="maria-uni-progress-item">
            <div className="maria-uni-progress-icon">🏆</div>
            <div className="maria-uni-progress-number">8</div>
            <div className="maria-uni-progress-label">Certificados Obtidos</div>
          </div>
          <div className="maria-uni-progress-item">
            <div className="maria-uni-progress-icon">⭐</div>
            <div className="maria-uni-progress-number">1,250</div>
            <div className="maria-uni-progress-label">Pontos Conquistados</div>
          </div>
          <div className="maria-uni-progress-item">
            <div className="maria-uni-progress-icon">🔥</div>
            <div className="maria-uni-progress-number">45</div>
            <div className="maria-uni-progress-label">Dias de Sequência</div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="maria-uni-footer">
        <div className="maria-uni-footer-content">
          <div className="maria-uni-footer-section">
            <h3>Maria Brasileira</h3>
            <a href="#">Sobre Nós</a>
            <a href="#">Nossa Missão</a>
            <a href="#">Equipe</a>
            <a href="#">Carreiras</a>
          </div>
          <div className="maria-uni-footer-section">
            <h3>Cursos</h3>
            <a href="#">Todos os Cursos</a>
            <a href="#">Categorias</a>
            <a href="#">Novidades</a>
            <a href="#">Gratuitos</a>
          </div>
          <div className="maria-uni-footer-section">
            <h3>Suporte</h3>
            <a href="#">Central de Ajuda</a>
            <a href="#">Contato</a>
            <a href="#">FAQ</a>
            <a href="#">Comunidade</a>
          </div>
          <div className="maria-uni-footer-section">
            <h3>Legal</h3>
            <a href="#">Termos de Uso</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">Cookies</a>
            <a href="#">Acessibilidade</a>
          </div>
        </div>
        <div className="maria-uni-footer-bottom">
          <p>&copy; 2025 Maria Brasileira. Todos os direitos reservados.</p>
        </div>
      </footer>

      {/* Visualização do Curso */}
      {activeModule && (
        <div className={`maria-uni-course-view ${activeModule ? 'active' : ''}`}>
          <div className="maria-uni-course-view-header">
            <div className="maria-uni-nav-container">
              <button className="maria-uni-close-course-btn" onClick={closeCourseView}>×</button>
            </div>
          </div>
          <div className="maria-uni-course-view-container">
            <div className="maria-uni-video-section">
              <div className="maria-uni-video-container">
                <video controls style={{ width: '100%', height: '100%' }}>
                  <source src={currentCourse?.videoUrl} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
              <div className="maria-uni-video-info">
                <h2 className="maria-uni-video-title">{currentCourse?.title}</h2>
                <p className="maria-uni-video-description">{currentCourse?.description}</p>
              </div>
            </div>
            <div className="maria-uni-modules-section">
              <div className="maria-uni-modules-header">
                <h3 className="maria-uni-modules-title">Módulos do Curso</h3>
              </div>
              <ul className="maria-uni-modules-list">
                <li className="maria-uni-module-item active">
                  <div className="maria-uni-module-icon">1</div>
                  <div className="maria-uni-module-info">
                    <div className="maria-uni-module-name">Introdução ao Curso</div>
                    <div className="maria-uni-module-duration">15 minutos</div>
                    <div className="maria-uni-module-progress">
                      <div className="maria-uni-module-progress-bar">
                        <div className="maria-uni-module-progress-fill" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="maria-uni-module-item">
                  <div className="maria-uni-module-icon">2</div>
                  <div className="maria-uni-module-info">
                    <div className="maria-uni-module-name">Fundamentos Básicos</div>
                    <div className="maria-uni-module-duration">25 minutos</div>
                    <div className="maria-uni-module-progress">
                      <div className="maria-uni-module-progress-bar">
                        <div className="maria-uni-module-progress-fill" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="maria-uni-module-item">
                  <div className="maria-uni-module-icon">3</div>
                  <div className="maria-uni-module-info">
                    <div className="maria-uni-module-name">Técnicas Avançadas</div>
                    <div className="maria-uni-module-duration">30 minutos</div>
                    <div className="maria-uni-module-progress">
                      <div className="maria-uni-module-progress-bar">
                        <div className="maria-uni-module-progress-fill" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="maria-uni-module-item">
                  <div className="maria-uni-module-icon">4</div>
                  <div className="maria-uni-module-info">
                    <div className="maria-uni-module-name">Práticas Recomendadas</div>
                    <div className="maria-uni-module-duration">20 minutos</div>
                    <div className="maria-uni-module-progress">
                      <div className="maria-uni-module-progress-bar">
                        <div className="maria-uni-module-progress-fill" style={{ width: '0%' }}></div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MariaUniModule;

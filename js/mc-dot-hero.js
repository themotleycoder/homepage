// <mc-dot-hero [compact] [static="true"]> - the MC dot logo as toon-shaded spheres, face-on (three.js).
// The dots assemble into the logo on first view and scatter again as you scroll away. Falls back to the
// logo image when WebGL is unavailable, reduced motion is requested, or static="true" is set.
(function () {
  if (customElements.get('mc-dot-hero')) return;

  const THREE_URL = './vendor/three.module.min.js';
  const FALLBACK_IMG = 'images/mcdotlogo.png';

  // 10x10 grid for the "M" and 10x8 grid for the "C"; 1 = a dot
  const M = ['1100000011', '1110000111', '1111001111', '1111111111', '1101111011', '1100110011', '1100000011', '1100000011', '1100000011', '1100000011'];
  const C = ['00111100', '01111110', '11000011', '11000011', '11000000', '11000000', '11000011', '11000011', '01111110', '00111100'];
  // one colour per row, matching the logo's cream-to-brown gradient
  const ROW_COLORS = ['#EEDDB8', '#EEDDB8', '#F0C6A0', '#F0A882', '#D93A1F', '#7A3A2E', '#5A3E36', '#48443E', '#48443E', '#48443E'];

  const SPACING = .78;
  const RADIUS = .33;
  const clamp01 = v => Math.min(1, Math.max(0, v));

  class MCDotHero extends HTMLElement {
    static get observedAttributes() { return ['static']; }

    connectedCallback() {
      if (this._init) return; this._init = true;
      Object.assign(this.style, { display: 'block', position: 'relative', width: '100%', height: '100%', overflow: 'hidden' });
      this._canvas = document.createElement('canvas');
      Object.assign(this._canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
      this.appendChild(this._canvas);
      this._mx = 0; this._my = 0;
      this._onMove = e => { const r = this.getBoundingClientRect(); this._mx = ((e.clientX - r.left) / r.width - .5) * 2; this._my = ((e.clientY - r.top) / r.height - .5) * 2; };
      window.addEventListener('pointermove', this._onMove);
      this._visible = false;
      this._vis = new IntersectionObserver(es => {
        this._visible = es[es.length - 1].isIntersecting;
        if (this._visible && !this._loading && !this._useFallback()) this._load();
      }, { rootMargin: '200px' });
      this._vis.observe(this);
      this._fallback(this._useFallback());
    }

    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      this._io && this._io.disconnect();
      this._vis && this._vis.disconnect();
      this._ro && this._ro.disconnect();
      this._renderer && this._renderer.dispose();
      window.removeEventListener('pointermove', this._onMove);
      this._loading = false; this._img = null; this._init = false;
      this.replaceChildren();
    }

    attributeChangedCallback() {
      if (!this._canvas) return;
      const fallback = this._useFallback();
      this._fallback(fallback);
      if (!fallback && !this._loading && this._visible) this._load();
    }

    _load() {
      this._loading = true;
      import(THREE_URL).then(T => this._build(T)).catch(() => this._fallback(true));
    }

    _useFallback() {
      if (this.getAttribute('static') === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
      try { const c = document.createElement('canvas'); return !(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return true; }
    }

    _fallback(on) {
      if (on && !this._img) {
        this._img = document.createElement('img');
        this._img.src = FALLBACK_IMG;
        this._img.alt = '';
        Object.assign(this._img.style, { position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 'min(46%, 520px)', display: 'block' });
        this.appendChild(this._img);
      }
      if (this._img) this._img.style.display = on ? 'block' : 'none';
      this._canvas.style.display = on ? 'none' : 'block';
    }

    _build(T) {
      const compact = this.hasAttribute('compact');
      const r = this._renderer = new T.WebGLRenderer({ canvas: this._canvas, antialias: true, alpha: true }); r.setClearColor(0x000000, 0);
      r.setPixelRatio(Math.min(devicePixelRatio, 2));
      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(compact ? 40 : 30, 2, .1, 200);
      const camBase = compact ? new T.Vector3(0, 0, 33) : new T.Vector3(0, 0, 30);
      const target = new T.Vector3(0, compact ? -.4 : .3, 0);

      // warm lighting, toon-shaded in three steps
      scene.add(new T.HemisphereLight('#FFF1DC', '#8A6A58', 1.1));
      const sun = new T.DirectionalLight('#FFD7B0', 2.4); sun.position.set(-12, 10, -18); scene.add(sun);
      const fill = new T.DirectionalLight('#FFE3C8', .9); fill.position.set(10, 6, 12); scene.add(fill);
      const gradientMap = new T.DataTexture(new Uint8Array([90, 90, 90, 255, 170, 170, 170, 255, 255, 255, 255, 255]), 3, 1);
      gradientMap.minFilter = gradientMap.magFilter = T.NearestFilter; gradientMap.needsUpdate = true;

      // the logo lies in the XZ plane; rotating it a quarter turn about X puts it face-on to the camera
      let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const logo = new T.Group(); logo.position.set(.2, 0, 0); logo.rotation.x = Math.PI / 2; scene.add(logo);
      const dots = [];
      const add = (c, row) => dots.push({ x: (c - 9.5) * SPACING, z: (row - 4.5) * SPACING, row, col: c, j: rnd() });
      M.forEach((line, row) => [...line].forEach((v, c) => v === '1' && add(c, row)));
      C.forEach((line, row) => [...line].forEach((v, c) => v === '1' && add(c + 11, row)));

      const geometry = new T.SphereGeometry(RADIUS, 32, 20);
      dots.forEach(d => {
        d.delay = (d.col / 18) * .7 + Math.random() * .4;          // left-to-right stagger for the intro
        const a = Math.random() * Math.PI * 2;                     // scatter direction and depth
        d.vx = Math.cos(a) * (.5 + Math.random());
        d.vz = Math.sin(a) * (.5 + Math.random());
        d.vy = .4 + Math.random();
        const mesh = new T.Mesh(geometry, new T.MeshToonMaterial({ color: ROW_COLORS[d.row], gradientMap }));
        mesh.position.set(d.x, 0, d.z);
        logo.add(mesh); d.mesh = mesh;
      });

      const size = () => { const w = this.clientWidth || 1, h = this.clientHeight || 1; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      this._ro = new ResizeObserver(size); this._ro.observe(this); size();

      const clock = new T.Clock(); let cx = 0, cy = 0, scroll = 0, introStart = null;
      this._io = new IntersectionObserver(es => {
        if (introStart == null && es.some(e => e.isIntersecting)) { introStart = clock.getElapsedTime() + .35; this._io.disconnect(); }
      }, { threshold: .4 });
      this._io.observe(this);

      const tick = () => {
        this._raf = requestAnimationFrame(tick);
        if (!this._visible || this._canvas.style.display === 'none') return;

        // scrolling away scatters the dots; the intro is the same motion played in reverse
        const rb = this.getBoundingClientRect();
        scroll += (clamp01(-rb.top / (rb.height * .85)) - scroll) * .12;
        const scat = Math.pow(scroll, 1.4);
        const g = introStart == null ? -1 : clock.getElapsedTime() - introStart;
        dots.forEach(d => {
          const s = scat + Math.pow(1 - clamp01((g - d.delay * .8) / 1.5), 3);
          d.mesh.position.set(d.x + d.vx * s * 7, d.vy * s * 9, d.z + d.vz * s * 7);
          d.mesh.rotation.set(d.vz * s * 3, 0, d.vx * s * 3);
        });
        const s = scat + Math.pow(1 - clamp01(g / 1.4), 3);
        logo.rotation.z = s * .25;
        this._canvas.style.opacity = String(1 - Math.min(1, s) * .85);

        // slight camera parallax follows the pointer
        cx += (this._mx - cx) * .05; cy += (this._my - cy) * .05;
        cam.position.set(camBase.x + cx * 1.6, camBase.y - cy * .8, camBase.z);
        cam.lookAt(target);
        r.render(scene, cam);
      };
      tick();
    }
  }
  customElements.define('mc-dot-hero', MCDotHero);
})();

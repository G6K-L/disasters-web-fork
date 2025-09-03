import React, { useEffect, useRef, useState } from 'react'
import {
  Timer,
  Zap,
  Image,
  Armchair,
  FileSearch,
  Search,
  AlertTriangle,
  Train,
  BadgeEuro,
  Circle,
  Network
} from 'lucide-react'
import * as THREE from 'three'
import _ from 'lodash'

// ... (Les types Train, Station, Stat, AppData et les constantes limits/color restent identiques)
type Train = {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seatsAvailable: number;
  details: {
    trainNumber: string;
    duration: string;
    class: string;
    amenities: string[];
  };
}
type Station = {
  id: string;
  nameStation: string;
  region: string;
  transports: (string | number)[];
  transportType: 'gare' | 'aeroport' | 'port';
  icon: string;
};
type Stat = {
  bundle: number
  weight: number
  dom: number
  resources: number
  js: number
  css: number
  img: number
  cache: number
  memory: number
  load: number
  rps: number
  pl: number
}
type AppData = {
  seatsNumber: number;
  updatePrice: number;
  trains: Train[];
  stations: Station[];
}
const limits = {
  weight: [512_000, 1_048_576],
  dom: [1_000, 2_000],
  resources: [50, 100],
  js: [153_600, 307_200],
  css: [51_200, 102_400],
  img: [307_200, 716_800],
  cache: [0.6, 0.4]
}
const color = (v: number, [g, y]: number[], inv = false) =>
  inv
    ? v >= g
      ? 'border-green-500/30 bg-green-500/20'
      : v >= y
        ? 'border-yellow-500/30 bg-yellow-500/20'
        : 'border-red-500/30 bg-red-500/20'
    : v <= g
      ? 'border-green-500/30 bg-green-500/20'
      : v <= y
        ? 'border-yellow-500/30 bg-yellow-500/20'
        : 'border-red-500/30 bg-red-500/20'


export default function App() {
  const [stats, setStats] = useState<Stat>({
    bundle: 0,
    weight: 0,
    dom: 0,
    resources: 0,
    js: 0,
    css: 0,
    img: 0,
    cache: 0,
    memory: 0,
    load: 0,
    rps: 0,
    pl: 0,
  })

  const [ready, setReady] = useState(false)
  const [appData, setAppData] = useState<AppData>({
    seatsNumber: 22,
    updatePrice: 96,
    trains: [],
    stations: [],
  });

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const injectedRef = useRef(false)
  const intervalRef = useRef<number>()

  // NOUVEL EFFET UNIQUE POUR LES DONNÉES EN TEMPS RÉEL AVEC SSE
  useEffect(() => {
    // 1. On crée une instance EventSource qui se connecte à notre route SSE
    const eventSource = new EventSource('http://localhost:5001/api/events');

    // 2. On écoute les événements spécifiques envoyés par le serveur
    eventSource.addEventListener('seats', (e) => {
      const { seats } = JSON.parse(e.data);
      setAppData(prev => ({ ...prev, seatsNumber: seats }));
    });

    eventSource.addEventListener('price', (e) => {
      const { price } = JSON.parse(e.data);
      setAppData(prev => ({ ...prev, updatePrice: price }));
    });

    eventSource.addEventListener('trains', (e) => {
      const receivedTrains: Train[] = JSON.parse(e.data);
      setAppData(prev => ({ ...prev, trains: receivedTrains }));
    });

    eventSource.addEventListener('stations', (e) => {
      const receivedStations: Station[] = JSON.parse(e.data);
      setAppData(prev => ({ ...prev, stations: receivedStations }));
    });

    // Gestion des erreurs de connexion
    eventSource.onerror = (err) => {
      console.error("Erreur de connexion SSE:", err);
      eventSource.close(); // On ferme en cas d'erreur
    };

    // 3. La fonction de nettoyage ferme la connexion quand le composant est démonté
    return () => {
      eventSource.close();
    };
  }, []); // Le tableau de dépendances vide assure que cet effet ne s'exécute qu'une fois


  // LES ANCIENS useEffect pour le polling sont supprimés
  // useEffect(() => { /* update seats */ }, []);
  // useEffect(() => { /* update price */ }, []);
  // useEffect(() => { /* update trains */ }, []);
  // useEffect(() => { /* update stations */ }, []);


  // ... (Le reste du code du composant reste identique)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1_000)
    camera.position.z = 30
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.clientWidth || 640, canvas.clientHeight || 480)
    renderer.setPixelRatio(window.devicePixelRatio)
    const ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambient)
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(25, 25, 25)
    scene.add(dir)
    for (let i = 0; i < 20; i++) {
      const mat = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, shininess: 80 })
      const geo = new THREE.BoxGeometry(1 + Math.random(), 1 + Math.random(), 1 + Math.random())
      const cube = new THREE.Mesh(geo, mat)
      cube.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50)
      scene.add(cube)
    }
    const animate = () => {
      let i = 0
      scene.traverse((o: any) => {
        if (o.isMesh) {
          o.rotation.x += 0.002 * ((i % 3) + 1)
          o.rotation.y += 0.003 * ((i % 4) + 1)
        }
        i++
      })
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()
    const onResize = _.throttle(() => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }, 200)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      scene.traverse((o: any) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) {
          Array.isArray(o.material) ? o.material.forEach((m: any) => m.dispose()) : o.material.dispose()
        }
      })
    }
  }, [])
  useEffect(() => {
    if (injectedRef.current) return
    injectedRef.current = true
    const loadAssets = () => {
      const h = document.head
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'http://localhost:5001/static/big.css'
      h.appendChild(link)
      const script = document.createElement('script')
      script.src = 'http://localhost:5001/static/big.js'
      script.crossOrigin = 'anonymous'
      h.appendChild(script)
    }
    document.readyState === 'complete'
      ? loadAssets()
      : window.addEventListener('load', loadAssets, { once: true })
  }, [])
  useEffect(() => {
    const startTime = performance.now();
    const computeStats = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      if (!nav) return;
      const totalWeight = nav.transferSize + resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const jsWeight = resources.filter(r => r.initiatorType === 'script').reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const cssWeight = resources.filter(r => r.initiatorType === 'link').reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const imgWeight = resources
        .filter(
          r =>
            r.initiatorType === 'img' ||
            r.initiatorType === 'css' ||
            /\.(jpg|jpeg|png|gif|webp)$/i.test(r.name)
        )
        .reduce((sum, r) => sum + (r.transferSize || 0), 0);
      const totalEncoded = nav.encodedBodySize + resources.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0);
      const cacheRatio = totalEncoded ? 1 - totalWeight / totalEncoded : 0;
      setStats(s => ({
        ...s,
        bundle: nav.transferSize,
        weight: totalWeight,
        dom: document.getElementsByTagName('*').length,
        resources: resources.length,
        js: jsWeight,
        css: cssWeight || s.css,
        img: imgWeight || s.img,
        cache: cacheRatio,
        pl: Math.round(performance.now() - startTime)
      }));
      setReady(true);
    };
    if (document.readyState === 'complete') {
      computeStats();
    } else {
      window.addEventListener('load', computeStats, { once: true });
    }
    // Ajout du rafraîchissement périodique
    const interval = setInterval(computeStats, 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const po = new PerformanceObserver(list => {
      const res = list.getEntries() as PerformanceResourceTiming[]
      const added = res.reduce((a, b) => a + (b.transferSize || 0), 0)
      const jsAdd = res.filter(r => r.initiatorType === 'script').reduce((a, b) => a + (b.transferSize || 0), 0)
      const cssAdd = res.filter(r => r.initiatorType === 'link' || /\.css$/i.test(r.name)).reduce((a, b) => a + (b.transferSize || 0), 0)
      const isImg = (r: PerformanceResourceTiming) => r.initiatorType === 'img' || r.initiatorType === 'css' || /\.(avif|jpe?g|png|gif|webp|svg)$/i.test(r.name);
      const imgAdd = res.filter(isImg).reduce((a, b) => a + (b.transferSize || 0), 0);
      const encAdd = res.reduce((a, b) => a + (b.encodedBodySize || 0), 0)
      setStats(s => {
        const weight = s.weight + added
        const enc = (1 - s.cache) * s.weight + encAdd
        const cache = enc ? 1 - weight / enc : s.cache
        return { ...s, weight, js: s.js + jsAdd, css: s.css + cssAdd, img: s.img + imgAdd, cache }
      })
    })
    po.observe({ type: 'resource', buffered: true })
    return () => po.disconnect()
  }, [])
  useEffect(() => {
    if (intervalRef.current) return
    intervalRef.current = window.setInterval(async () => {
      for (let i = 0; i < 2; i++) {
        fetch(`http://localhost:5001/api/payload?${Date.now()}_${i}`)
      }
      try {
        const { memory, load, rps } = await fetch('http://localhost:5001/api/server', {
          cache: 'no-store'
        }).then(r => r.json())
        setStats(s => ({
          ...s,
          memory: Math.ceil(memory / 1_048_576),
          load,
          rps
        }))
      } catch (err) {
        console.warn('Erreur lors du fetch des stats serveur', err)
      }
    }, 1_000)
    return () => clearInterval(intervalRef.current)
  }, [])

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin h-24 w-24 rounded-full border-b-2 border-white mx-auto mb-6" />
          <p className="text-white text-xl font-semibold">Chargement…</p>
        </div>
      </div>
    )

  return (
    // Le JSX reste identique
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* ... */}
      <div className="relative z-10 container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-clip-text">
            EcoTraining Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">Plateforme d'entraînement avancée pour l'optimisation web et l'éco-conception</p>
        </header>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card icon={<Timer className="w-8 h-8 text-yellow-400" />} title="Load page" value={`${stats.pl} ms`} tone="bg-white/10 border-white/20" />
          <CardEmpty tone="bg-white/10 border-white/20" />
          <CardEmpty tone="bg-white/10 border-white/20" />
          <CardEmpty tone="bg-white/10 border-white/20" />
          <CardEmpty tone="bg-white/10 border-white/20" />
          <CardEmpty tone="bg-white/10 border-white/20" />
          <Card icon={<Network className="w-8 h-8 text-yellow-400" />} title="Simulation" value="requêtes" tone="bg-white/10 border-white/20" />
          <Card icon={<Image className="w-8 h-8 text-amber-400" />} title="Bon plan" value="A la une" tone={color(stats.img, limits.img)} />
          <Card icon={<AlertTriangle className="w-8 h-8 text-teal-400" />} title="Alertes" value="infos" tone={color(stats.dom, limits.dom)} tip="nombre de nœuds" />
          <Card icon={<Search className="w-8 h-8 text-purple-400" />} title="Gares d'arrivée (auto-complétion)" value={appData.stations.length + " objets"} tone={color(stats.weight, limits.weight)} tip="transferSize du document" />
          <Card icon={<Search className="w-8 h-8 text-blue-400" />} title="Gares de départ (auto-complétion)" value={appData.stations.length + " objets"} tone={color(stats.weight, limits.weight)} tip="somme transferSize" />
          <Card icon={<Train className="w-8 h-8 text-emerald-400" />} title="Liste des trains" value={appData.trains.length + " objets"} tone="bg-white/10 border-white/20" />
          <Card icon={<Armchair className="w-8 h-8 text-indigo-400" />} title="Nombre de places restantes" value={appData.seatsNumber} tone="bg-white/10 border-white/20" />
          <Card icon={<Circle className="w-8 h-8 text-sky-400" />} title="Train/ statut réservation" value="ouvert" tone="bg-white/10 border-white/20" />
          <Card icon={<BadgeEuro className="w-8 h-8 text-red-400" />} title="Mise à jour des prix" value={appData.updatePrice + " €"} tone="bg-white/10 border-white/20" />
          <Card icon={<FileSearch className="w-8 h-8 text-lime-400" />} title="Détail d’un trajet" value="9 propriétés" tone={color(stats.css, limits.css)} />
          <Card icon={<Armchair className="w-8 h-8 text-yellow-400" />} title="Attribution place libre" value="siège 22" tone={color(stats.css, limits.css)} />
          <Card icon={<Network className="w-8 h-8 text-yellow-400" />} title="Simulation" value="requêtes" tone="bg-white/10 border-white/20" />
          <CardWithImage title="Train complet" imageUrl="https://images.unsplash.com/photo-1626544001303-f60b92396d47?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Envie de prolonger votre été ?" imageUrl="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Nos idées pour les vacances" imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Vente flash" imageUrl="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Où partir ?" imageUrl="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Les abonnements" imageUrl="https://images.unsplash.com/photo-1670888664952-efff442ec0d2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Train complet" imageUrl="https://images.unsplash.com/photo-1626544001303-f60b92396d47?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Envie de prolonger votre été ?" imageUrl="https://images.unsplash.com/photo-1473625247510-8ceb1760943f?q=80&w=1711&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Nos idées pour les vacances" imageUrl="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Vente flash" imageUrl="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Où partir ?" imageUrl="https://images.unsplash.com/photo-1530789253388-582c481c54b0?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <CardWithImage title="Les abonnements" imageUrl="https://images.unsplash.com/photo-1670888664952-efff442ec0d2?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
        </section>
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-16">
          <div className="flex items-center gap-4 mb-6">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Visualisation 3D</h2>
          </div>
          <div className="flex justify-center">
            <canvas ref={canvasRef} className="rounded-xl border border-white/20 shadow-2xl w-full h-96" />
          </div>
          <p className="text-slate-300 text-center mt-4">500 cubes tournants en temps réel</p>
        </section>
      </div>
    </div>
  )
}

function Card({ icon, title, value, tone, tip }: { icon: React.ReactNode; title: string; value: string | number; tone: string; tip?: string }) {
  return (
    <div className={`backdrop-blur-lg rounded-2xl p-8 border hover:bg-white/15 hover:scale-105 transition ${tone}`} title={tip || ''}>
      <div className="flex items-center justify-between mb-4">
        {icon}
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  )
}
function CardEmpty({ tone }: { tone: string }) {
  return (
    <div className={`backdrop-blur-lg rounded-2xl p-8 border hover:bg-white/15 hover:scale-105 transition ${tone}`} >
    </div>
  )
}
function CardWithImage({ title, imageUrl }: { title: string; imageUrl: string }) {
  return (
    <div className="relative p-6 rounded-lg border border-white/20 overflow-hidden h-[300px]">
      <img
        src={imageUrl}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt=""
      />
      <div className="relative z-10 flex items-center gap-4">
        <div>
          <span className="text-3xl font-bold text-white">{title}</span>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white">{"simulation"}</h3>
    </div>
  )
}
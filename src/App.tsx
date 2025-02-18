import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import axios from "axios";
import { Bar, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import "./App.css";

// Registra los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

function App() {
  // Estados para la funcionalidad de greet
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  // Estados para los "lots"
  const [lots, setLots] = useState<any[]>([]);
  const [loadingLots, setLoadingLots] = useState(true);
  const [errorLots, setErrorLots] = useState<Error | null>(null);

  // Función para el comando "greet" de Tauri
  async function greet() {
    const message = await invoke("greet", { name });
    setGreetMsg(message as string);
  }

  // Función para obtener los lotes desde el backend
  async function fetchLots() {
    setLoadingLots(true);
    setErrorLots(null);
    try {
      const response = await axios.get("http://localhost:3000/lots");
      console.log("Response:", response.data);
      // Si la respuesta es un array, lo asignamos; en caso contrario, asignamos un array vacío
      setLots(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      setErrorLots(err);
    } finally {
      setLoadingLots(false);
    }
  }

  // Función para guardar lotes de ejemplo en el backend
  async function saveSampleLots() {
    const sampleLots = [
      { timestamp: "2023-02-17T10:00:00Z", value: 20, label: "A" },
      { timestamp: "2023-02-17T11:00:00Z", value: 30, label: "B" },
      { timestamp: "2023-02-17T12:00:00Z", value: 40, label: "C" },
      { timestamp: "2023-02-17T13:00:00Z", value: 50, label: "D" },
    ];
    try {
      const response = await axios.post("http://localhost:3000/save_lots", sampleLots);
      console.log("Saved sample lots:", response.data);
      fetchLots();
    } catch (error: any) {
      console.error("Error saving sample lots:", error);
    }
  }

  useEffect(() => {
    fetchLots();
  }, []);

  // Para la tabla, si hay datos se obtienen las claves del primer lote
  const tableHeaders =
    Array.isArray(lots) && lots.length > 0 ? Object.keys(lots[0]) : [];

  // Datos para la gráfica de barras: usamos el campo "label" y "value"
  const barData = {
    labels: lots.map((lot) => lot.label || "Sin etiqueta"),
    datasets: [
      {
        label: "Valor de Lote",
        data: lots.map((lot) => lot.value),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Gráfica de Barras - Valor de Lote" },
    },
  };

  // Datos para la gráfica de burbujas: se usa el índice como "x", "value" como "y"
  // y se calcula el tamaño de la burbuja (r) a partir del valor.
  const bubbleData = {
    datasets: [
      {
        label: "Burbujas de Lotes",
        data: lots.map((lot, index) => ({
          x: index + 1,
          y: lot.value,
          r: lot.value / 2, // tamaño proporcional al valor
        })),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const bubbleOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Gráfica de Burbujas - Lotes" },
    },
    scales: {
      x: { title: { display: true, text: "Índice" } },
      y: { title: { display: true, text: "Valor" } },
    },
  };

  return (
    <main className="container p-4">


      {/* Sección de saludo */}
      <form
        className="row mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
          className="px-2 py-1 border rounded mr-2"
        />
        <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded">
          Greet
        </button>
      </form>
      {greetMsg && <p className="mb-8 text-xl">{greetMsg}</p>}

      <hr className="my-4" />

      {/* Sección para guardar lotes de ejemplo */}
      <h2 className="text-2xl font-bold mb-4">Guardar Lotes de Ejemplo</h2>
      <button
        onClick={saveSampleLots}
        className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Guardar Lotes de Ejemplo
      </button>

      <hr className="my-4" />

      {/* Sección para mostrar los lotes */}
      <h2 className="text-2xl font-bold mb-4">Lotes Almacenados</h2>
      <button
        onClick={fetchLots}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Refrescar Lotes
      </button>
      {loadingLots ? (
        <p>Cargando lotes...</p>
      ) : errorLots ? (
        <p className="text-red-500">Error: {errorLots.message}</p>
      ) : lots && lots.length > 0 ? (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-2 border border-gray-200 bg-gray-100 text-left"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lots.map((lot, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {tableHeaders.map((header, idx) => (
                    <td key={idx} className="px-4 py-2 border border-gray-200">
                      {String(lot[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No hay lotes para mostrar.</p>
      )}

      <hr className="my-4" />

      {/* Sección de gráficas */}
      <h2 className="text-2xl font-bold mb-4">Visualización de Gráficas</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Gráfica de Barras</h3>
        <Bar data={barData} options={barOptions} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Gráfica de Burbujas</h3>
        <Bubble data={bubbleData} options={bubbleOptions} />
      </div>
    </main>
  );
}

export default App;

/**
 * BSTVisualizer.jsx
 *
 * Componente principal del visualizador de Árbol Binario de Búsqueda.
 */

import { useState, useCallback, useMemo } from "react";
import Tree from "react-d3-tree";

import { insert, search, inOrder, preOrder, postOrder, toD3Format, randomInt } from "../utils/bst";
import TraversalPanel from "./TraversalPanel";
import SearchBar from "./SearchBar";

import styles from "./BSTVisualizer.module.css";

const getTraversalResult = (root, type) => {
  switch (type) {
    case "inOrder":   return inOrder(root);
    case "preOrder":  return preOrder(root);
    case "postOrder": return postOrder(root);
    default: return [];
  }
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function BSTVisualizer() {
  const [root, setRoot]                   = useState(null);
  const [inputValue, setInputValue]       = useState("");
  const [activeTraversal, setTraversal]   = useState(null); // "inOrder" | "preOrder" | "postOrder"
  const [searchTerm, setSearchTerm]       = useState("");
  const [foundNode, setFoundNode]         = useState(null);
  const [errorMessage, setErrorMessage]   = useState("");

  // ── Insert ──────────────────────────────────────────────────────────────────
  const handleInsert = () => {
    const parsed = parseInt(inputValue, 10);

    if (!isNaN(parsed)) {
      setRoot((prevRoot) => insert(prevRoot, parsed));
      setInputValue("");
      setErrorMessage("");
    } else {
      setErrorMessage("Por favor, ingresa un número válido.");
    }
  };

  // ── Random Insert ───────────────────────────────────────────────────────────
  const handleRandomInsert = () => {
    const value = randomInt(1, 99);
    setRoot((prevRoot) => insert(prevRoot, value));
    setErrorMessage("");
  };

  // ── Search ──────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    const parsed = parseInt(searchTerm, 10);
    const result = search(root, parsed);
    setFoundNode(result ? result.value : null);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  // Se utiliza `useMemo` para memoizar el formato D3 del árbol (`d3Data`).
  // Convertir el árbol binario de búsqueda a la estructura jerárquica de react-d3-tree
  // implica recorrer recursivamente todo el árbol. Memoizar este cálculo con la dependencia `[root]` evita
  // reconstruir la estructura visual en renders no relacionados (como cuando se escribe en los campos de texto).
  const d3Data = useMemo(() => {
    return root ? toD3Format(root) : null;
  }, [root]);

  // Se utiliza `useMemo` para memoizar el resultado del recorrido del árbol (inOrder, preOrder, postOrder).
  // Dado que el cálculo de los recorridos es una operación costosa O(N) que depende únicamente del estado `root` y
  // `activeTraversal`, evitar que se vuelva a calcular en cada render (por ejemplo, al escribir en el campo de texto
  // que actualiza `inputValue`) mejora significativamente el rendimiento cuando el árbol tiene muchos nodos.
  const traversalResult = useMemo(() => {
    return activeTraversal ? getTraversalResult(root, activeTraversal) : [];
  }, [root, activeTraversal]);

  // ── Node Rendering ──────────────────────────────────────────────────────────
  /**
   * Función de render personalizada para cada nodo del árbol.
   *
   * Se utiliza `useCallback` para memoizar la función de renderizado de los nodos.
   * Al definir esta función dentro de `BSTVisualizer`, se recrea una nueva instancia en cada renderizado.
   * Como se pasa como prop (`renderCustomNodeElement`) al componente `<Tree />` de `react-d3-tree`, el cambio en la
   * referencia de la función obliga a `<Tree />` y a todos sus nodos a re-renderizarse de forma innecesaria.
   * Al envolverla en `useCallback` con la dependencia `[foundNode]`, la referencia se mantiene idéntica en renders
   * subsecuentes a menos que cambie `foundNode`, lo que optimiza enormemente el tiempo de respuesta visual de la UI.
   */
  const renderCustomNode = useCallback(({ nodeDatum }) => {
    const isHighlighted = foundNode !== null && nodeDatum.name === String(foundNode);
    return (
      <g>
        <circle r={20} fill={isHighlighted ? "#ff9800" : "#4A90D9"} stroke="#fff" strokeWidth={2} />
        <text
          fill="white"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={12}
          fontWeight="bold"
        >
          {nodeDatum.name}
        </text>
      </g>
    );
  }, [foundNode]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>BST Visualizer</h1>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="Ingresa un número..."
            className={styles.input}
          />
          <button onClick={handleInsert} className={styles.button}>
            Insertar
          </button>
          <button onClick={handleRandomInsert} className={`${styles.button} ${styles.secondary}`}>
            🎲 Aleatorio
          </button>
        </div>

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          result={foundNode}
        />
      </div>

      {/* Traversal Selector */}
      <TraversalPanel
        active={activeTraversal}
        onChange={setTraversal}
        result={traversalResult}
      />

      {/* Tree Visualization */}
      <div className={styles.treeContainer}>
        {d3Data ? (
          <Tree
            data={d3Data}
            orientation="vertical"
            renderCustomNodeElement={renderCustomNode}
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            translate={{ x: 400, y: 60 }}
          />
        ) : (
          <div className={styles.emptyState}>
            <p>El árbol está vacío.</p>
            <p>Inserta un número para comenzar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

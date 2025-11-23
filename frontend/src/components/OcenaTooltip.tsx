export default function OcenaTooltip({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg z-50 pointer-events-none"
      style={{
        top: y,
        left: x,
      }}
    >
      <p><strong>Wystawił:</strong> tu imie nauczyciela</p>
      <p><strong>Za co:</strong> tu za co ocena</p>
      <p><strong>Data:</strong> tu data</p>
    </div>
  );
}

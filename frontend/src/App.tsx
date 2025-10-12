import { useEffect, useState } from "react";
import { getBooks, addBook } from "./api";

export default function App() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    getBooks().then(setBooks);
  }, []);

  return (
    <div className="p-4">
      <h1>📚 Lista dzienników</h1>
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.title} — {b.author} ({b.year})</li>
        ))}
      </ul>
    </div>
  );
}
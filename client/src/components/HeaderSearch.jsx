import { useState } from 'react';

function HeaderSearch({ items }) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);

const handleChange = (e) => {
  const value = e.target.value;
  setQuery(value);

  if (value.trim() === '') {
    setFiltered([]);
    return;
  }

  const lowerValue = value.toLowerCase();

  const result = items.filter(item => {
    const matchesTitle = item.title.toLowerCase().includes(lowerValue);
    const matchesTags = item.tags?.some(tag =>
      tag.toLowerCase().includes(lowerValue)
    );
    return matchesTitle || matchesTags;
  });

  setFiltered(result.slice(0, 5)); // Limit to 5 suggestions
};

  return (
    <div className="relative w-full max-w-sm mx-auto">
    <input
      type="text"
      className="w-full p-2 border rounded"
      placeholder="Search..."
      value={query}
      onChange={handleChange}
    />

    {query && (
      <ul className="absolute z-10 w-full bg-white border rounded mt-1 shadow">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer text-black hover:bg-gray-100"
              onClick={() => {
                setQuery(item.title);
                setFiltered([]);
              }}
            >
              <a href={`/item/${item.title}=it_id${item.id}`} className="block px-4 py-2 hover:bg-gray-100">
              <p className="font-medium text-black">
               {item.title}
             </p>
              <p className="text-sm text-gray-600">
                {item.tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}
              </p>
             </a>
            </li>
          ))
        ) : (
          <li className="px-4 py-2 text-gray-500 italic">No items found</li>
        )}
      </ul>
    )}
  </div>

  );
}

export default HeaderSearch;

import React from "react";

const Table = ({ columns, data }) => {
  return (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-2 text-left border-b">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col} className="px-4 py-2 border-b">{row[col.toLowerCase()]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

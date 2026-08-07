// src/features/users/components/UserRowActions.jsx

import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserRowActions({ user }) {

  const navigate = useNavigate();

  // Editar usuario
  const handleEdit = () => {
    navigate(`/users/${user.id}/edit`);
  };

  // Eliminar usuario
  const handleDelete = () => {
    console.log("Eliminar usuario", user.id);
  };

  // Ver usuario
  const handleView = () => {

    if (user.id === 1) {
      navigate("/dashboard/readUser");
    } 
    else if (user.id === 3) {
      navigate("/dashboard/readUser3");
    } 
    else if (user.id === 2) {
      navigate("/dashboard/readUser2");
    } 
    else if (user.id === 4) {
      navigate("/dashboard/readUser4");
    } 
    else if (user.id === 5) {
      navigate("/dashboard/readUser5");
    }

  };

  return (
    <div className="flex gap-2">

      {/* Editar */}
      <button
        onClick={handleEdit}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Pencil size={16} />
      </button>

      {/* Eliminar */}
      <button
        onClick={handleDelete}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Trash2 size={16} />
      </button>

      {/* Ver */}
      <button
        onClick={handleView}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Eye size={16} />
      </button>

    </div>
  );
}
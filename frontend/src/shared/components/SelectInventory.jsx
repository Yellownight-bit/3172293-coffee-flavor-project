// Componente SelectInventory
// Se conserva para no cambiar las vistas que lo importan,
// pero ahora usa el Select del sistema (mismo diseño M3).
import Select from "./Select";

export default function SelectInventory(props) {
  return <Select {...props} />;
}
import Swal from "sweetalert2";

export function showSuccessAlert({
  title = "Éxito",
  text = "",
  confirmButtonText = "Aceptar",
  timer = 2000,
}) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,

    customClass: {
      popup: "rounded-2xl",
      title: "text-success",
      confirmButton:
        "bg-success hover:bg-success-hover px-4 py-2 rounded-lg text-on-brand",
      timerProgressBar: "!bg-success",
    },

    buttonsStyling: false,
  });
}

export function showCancelDeleteAlert({
  title = "Eliminación cancelada",
  text = "No se eliminó el registro.",
  confirmButtonText = "Aceptar",
  timer = 2000,
}) {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonText,
    timer,
    timerProgressBar: true,
    showConfirmButton: true,

    customClass: {
      popup: "rounded-2xl",
      title: "!text-info",
      confirmButton:
        "bg-info text-on-brand hover:bg-info-hover px-4 py-2 rounded-lg",
      timerProgressBar: "!bg-info",
    },

    buttonsStyling: false,
  });
}

export function showConfirmDeleteAlert({
  title = "¿Estás seguro?",
  text = "¡No podrás revertir esta acción!",
  confirmButtonText = "Sí, eliminar",
  cancelButtonText = "No, cancelar",
}) {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,

    customClass: {
      popup: "rounded-2xl",
      title: "!text-brand-strong font-bold",
      confirmButton:
        "!bg-error text-on-brand hover:bg-error-hover px-4 py-2 rounded-lg ml-2 font-medium",
      cancelButton:
        "!bg-neutral text-on-brand hover:bg-neutral-hover px-4 py-2 rounded-lg font-medium",
    },

    buttonsStyling: false,
  });
}

export function showOpsAlert({
  title = "Ops, hubo un error",
  text = "¡Ocurrió un fallo inesperado en el sistema!",
  confirmButtonText = "Entendido",
} = {}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText,

    customClass: {
      popup: "rounded-2xl",
      title: "!text-error font-bold",
      confirmButton:
        "bg-error text-on-brand hover:bg-error-hover px-4 py-2 rounded-lg font-medium",
    },

    buttonsStyling: false,
  });
}

export function showUserErrorAlert({
  title = "Error al crear usuario",
  text =
    "No se pudo registrar el usuario. Por favor, verifica que los campos estén correctos.",
}) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Intentar de nuevo",

    customClass: {
      popup: "rounded-2xl",
      title: "!text-error font-bold",
      confirmButton:
        "bg-error text-on-brand hover:bg-error-hover px-4 py-2 rounded-lg font-medium transition",
    },

    buttonsStyling: false,
  });
}
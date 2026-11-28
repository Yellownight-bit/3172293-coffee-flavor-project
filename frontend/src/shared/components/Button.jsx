// Componente Button
// Botón base del sistema alineado a Material Design 3:
// - Colores: solo tokens semánticos, cambian solos con el tema claro/oscuro.
// - Estados: hover, focus (teclado), active (presionado) y disabled.
// - Medidas: alto visual de 32 o 40 px y área táctil mínima de 48 px (pseudo-elemento ::before).

// Estilos comunes a todos los botones: forma, tipografía y estados
const BASE = `
    relative
    inline-flex
    items-center
    justify-center
    rounded-full
    text-medium
    font-button
    transition-colors
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-focus-ring
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    enabled:active:brightness-90
    disabled:cursor-not-allowed
    disabled:border-transparent
    disabled:bg-panel-muted
    disabled:text-text-muted
    disabled:shadow-none
`;

// Colores por tipo de acción (hover solo cuando el botón está habilitado)
const VARIANTS = {
    // Filled: acción principal de la pantalla
    primary: `
        bg-brand
        text-on-brand
        enabled:hover:bg-brand-hover
    `,

    // Tonal: acción secundaria
    secondary: `
        bg-brand-soft
        text-text-primary
        enabled:hover:bg-brand-soft-hover
    `,

    // Outlined: cancelar o acciones neutras
    cancel: `
        border
        border-border
        bg-transparent
        text-text-secondary
        enabled:hover:bg-panel-muted
    `,

    // Filled con elevación: confirmar o finalizar un formulario
    finish: `
        bg-brand-strong
        text-on-brand
        shadow-md
        enabled:hover:bg-brand
    `,

    // Volver: pastilla ubicada en la parte superior de la tarjeta
    back: `
        absolute
        top-2
        bg-brand-strong
        text-on-brand
        enabled:hover:bg-brand
    `,

    // Solo ícono (estándar M3): sin fondo; necesita title o aria-label
    icon: `
        bg-transparent
        text-text-secondary
        enabled:hover:bg-panel-muted
        enabled:hover:text-text-primary
    `,
};

// Medidas: alto visual + área táctil invisible que completa 48 px
const SIZES = {
    // 32 px visibles + 8 px arriba y abajo = 48 px táctiles
    sm: `
        h-8
        px-4
        before:absolute
        before:content-['']
        before:-inset-y-2
        before:inset-x-0
    `,

    // 40 px visibles + 4 px arriba y abajo = 48 px táctiles
    md: `
        h-10
        px-6
        before:absolute
        before:content-['']
        before:-inset-y-1
        before:inset-x-0
    `,
    
    // 48 px visibles (botón principal destacado, ej. login)
    lg: `
        h-12
        gap-2
        px-8
    `,

    cancel: `
        h-10
        px-6
        before:absolute
        before:content-['']
        before:-inset-y-1
        before:inset-x-0
    `,

    finish: `
        h-10
        px-6
        before:absolute
        before:content-['']
        before:-inset-y-1
        before:inset-x-0
    `,

    back: `
        h-8
        gap-1
        px-4
        before:absolute
        before:content-['']
        before:-inset-y-2
        before:inset-x-0
    `,

    backProduct: `
        mb-3
        h-8
        gap-1
        px-4
        before:absolute
        before:content-['']
        before:-inset-y-2
        before:inset-x-0
    `,

    // Botón circular de 40 px + 4 px por lado = 48 px táctiles
    icon: `
        h-10
        w-10
        p-0
        before:absolute
        before:content-['']
        before:-inset-1
    `,
};

export default function Button({
    variant = "primary",
    // Los botones de solo ícono toman su tamaño circular por defecto
    size = variant === "icon" ? "icon" : "md",
    type = "button",
    className = "",
    children,
    ...props
}) {
    // Nombre accesible: si un botón de solo ícono no trae aria-label, se usa su title
    const ariaLabel =
        props["aria-label"] ?? (variant === "icon" ? props.title : undefined);

    return (
        <button
            type={type}
            {...props}
            aria-label={ariaLabel}
            className={`
                ${BASE}
                ${VARIANTS[variant] ?? VARIANTS.primary}
                ${SIZES[size] ?? SIZES.md}
                ${className}
            `}
        >
            {children}
        </button>
    );
}

import { useRef, useState, useEffect, useMemo } from "react";
import { Infinity as InfinityLoader } from "ldrs/react";
import "ldrs/react/Infinity.css";
import { API_URL } from "@/features/config";

export default function FileInput({
    value = [],
    onChange,
    multiple = false,
    accept = "image/*,application/pdf",
}) {
    const inputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);

    const isFile = (item) =>
        typeof File !== "undefined" && item instanceof File;

    const isImage = (item) => {
        if (isFile(item)) {
            return item.type.startsWith("image/");
        }

        if (typeof item === "string") {
            return /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(item);
        }

        return false;
    };

    const getFileName = (item) => {
        if (isFile(item)) {
            return item.name;
        }

        return item.split("/").pop();
    };

    const getImageUrl = (item) => {
        if (isFile(item)) return null;

        if (item.startsWith("http")) return item;

        const serverUrl = API_URL.replace(/\/api\/?$/, "");

        return `${serverUrl}${item.startsWith("/") ? item : `/${item}`}`;
    };

    const previews = useMemo(
        () =>
            value.map((item) =>
                isFile(item) && isImage(item)
                    ? URL.createObjectURL(item)
                    : null
            ),
        [value]
    );

    useEffect(() => {
        return () => {
            previews.forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [previews]);

    const handleFiles = async (files) => {
        if (!files?.length) return;

        setIsLoading(true);

        try {
            const list = Array.from(files);

            await new Promise((resolve) => setTimeout(resolve, 500));

            const data = multiple
                ? [...value, ...list]
                : [list[0]];

            onChange(data.slice(0, 12));
        } finally {
            setIsLoading(false);

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    const remove = (index) => {
        const copy = [...value];
        copy.splice(index, 1);
        onChange(copy);
    };

    const reorder = (from, to) => {
        if (from === null || from === to) return;

        const copy = [...value];
        const [item] = copy.splice(from, 1);

        copy.splice(to, 0, item);

        onChange(copy);
        setDragIndex(null);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {value.map((item, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => reorder(dragIndex, index)}
                    className="relative w-24 h-24 border rounded overflow-hidden group"
                >
                    {isImage(item) ? (
                        <img
                            src={
                                isFile(item)
                                    ? previews[index]
                                    : getImageUrl(item)
                            }
                            alt={getFileName(item)}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error(
                                    "No se pudo cargar la imagen:",
                                    e.currentTarget.src
                                );
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-panel-muted text-[10px] px-1">
                            <span className="font-semibold">PDF</span>
                            <span className="truncate w-full text-center">
                                {getFileName(item)}
                            </span>
                        </div>
                    )}

                    <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                        <button
                            type="button"
                            className="w-7 h-7 bg-panel rounded-full text-text-primary text-xs"
                        >
                            ↕
                        </button>

                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="w-7 h-7 bg-panel rounded-full text-text-primary text-xs"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}

            {(multiple || value.length === 0 || !multiple) && (
                <div
                    onClick={() => !isLoading && inputRef.current?.click()}
                    className="w-24 h-24 bg-panel border-2 border-dashed border-brand flex items-center justify-center cursor-pointer"
                >
                    {isLoading ? (
                        <InfinityLoader
                            size="55"
                            stroke="4"
                            strokeLength="0.15"
                            bgOpacity="0.1"
                            speed="1.3"
                            color="var(--semantic-text-primary)"
                        />
                    ) : (
                        <span className="text-info text-sm text-center">
                            Subir imagen
                        </span>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                hidden
                multiple={multiple}
                accept={accept}
                onChange={(e) => handleFiles(e.target.files)}
            />
        </div>
    );
}

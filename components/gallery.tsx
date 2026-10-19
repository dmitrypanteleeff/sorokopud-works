"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";

type GalleryItem = {
  src: string;
  title: string;
  material: string;
};

// Статичная галерея. Чтобы добавить фото — положите файл в
// public/assets/gallery/ и добавьте одну строку в этот массив.
const GALLERY: GalleryItem[] = [
  {
    src: "/assets/gallery/wallet-01.svg",
    title: "Кошелёк",
    material: "Растительное дубление, ручная прошивка",
  },
  {
    src: "/assets/gallery/wallet-02.svg",
    title: "Кошелёк",
    material: "Натуральная кожа, седловидный шов",
  },
  {
    src: "/assets/gallery/belt-01.svg",
    title: "Ремень",
    material: "Растительное дубление, латунная пряжка",
  },
  {
    src: "/assets/gallery/belt-02.svg",
    title: "Ремень",
    material: "Ручная прошивка, цельная кожа",
  },
  {
    src: "/assets/gallery/cover-01.svg",
    title: "Обложка для паспорта",
    material: "Плотная кожа, карман для карты",
  },
  {
    src: "/assets/gallery/cover-02.svg",
    title: "Обложка для паспорта",
    material: "Растительное дубление, тиснение",
  },
];

export default function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(() => {
    setOpenIndex((current) =>
      current === null ? null : (current + GALLERY.length - 1) % GALLERY.length,
    );
  }, []);
  const next = useCallback(() => {
    setOpenIndex((current) =>
      current === null ? null : (current + 1) % GALLERY.length,
    );
  }, []);

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    }

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  const current = openIndex === null ? null : GALLERY[openIndex];

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERY.map((item, index) => (
          <figure key={item.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="block w-full overflow-hidden rounded-2xl border border-linen bg-paper shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
              aria-label={`Открыть фото: ${item.title}`}
            >
              <img
                src={item.src}
                alt={`${item.title}, ${item.material}`}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </button>
            <figcaption className="mt-3 text-sm text-ink-soft">
              <span className="font-medium text-espresso">{item.title}</span>
              {" — "}
              {item.material}
            </figcaption>
          </figure>
        ))}
      </div>

      {current && (
        <div
          className="fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${current.title}, ${current.material}`}
          onClick={close}
        >
          <button
            type="button"
            autoFocus
            onClick={close}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Закрыть"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              prev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Предыдущее фото"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
            aria-label="Следующее фото"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <figure
            className="max-w-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={current.src}
              alt={`${current.title}, ${current.material}`}
              className="max-h-[75vh] max-w-full rounded-xl"
            />
            <figcaption className="mt-3 text-center text-sm text-cream/80">
              <span className="font-medium text-cream">{current.title}</span>
              {" — "}
              {current.material}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, type FormEvent } from "react";

const PRODUCTS = ["Кошелёк", "Ремень", "Обложка для паспорта"];

const fieldClasses =
  "w-full rounded-xl border border-linen bg-paper px-4 py-3 text-ink outline-none transition-all placeholder:text-ink/35 focus:border-copper focus:ring-4 focus:ring-copper/15";

export default function LeadForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-3xl border border-linen bg-paper p-10 text-center"
      >
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-copper/10">
          <svg
            viewBox="0 0 20 20"
            className="h-6 w-6 text-copper"
            fill="none"
            aria-hidden
          >
            <path
              d="M4 10.5l4 4 8-8.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="font-serif text-3xl text-espresso">Спасибо!</p>
        <p className="mt-3 text-ink-soft">Свяжемся в течение дня.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Имя</span>
          <input
            className={fieldClasses}
            name="name"
            type="text"
            placeholder="Имя"
            required
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="sr-only">Телефон или Telegram</span>
          <input
            className={fieldClasses}
            name="contact"
            type="text"
            placeholder="Телефон или Telegram"
            required
            autoComplete="tel"
          />
        </label>
      </div>

      <label className="block">
        <span className="sr-only">Выбранный товар</span>
        <select className={fieldClasses} name="product" defaultValue={PRODUCTS[0]}>
          {PRODUCTS.map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="sr-only">Комментарий</span>
        <textarea
          className={`${fieldClasses} resize-none`}
          name="comment"
          rows={3}
          placeholder="Комментарий (необязательно)"
        />
      </label>

      <button type="submit" className="btn-primary w-full">
        Отправить заявку
      </button>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";

const PRODUCTS = ["Кошелёк", "Ремень", "Обложка для паспорта"];

const fieldClasses =
  "w-full rounded-lg border border-linen bg-paper px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-copper focus:ring-2 focus:ring-copper/30";

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
        className="rounded-2xl border border-linen bg-paper p-8 text-center"
      >
        <p className="font-serif text-2xl text-espresso">Спасибо!</p>
        <p className="mt-2 text-ink/70">Свяжемся в течение дня.</p>
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

      <button
        type="submit"
        className="w-full rounded-lg bg-copper px-6 py-3 font-medium text-paper transition-colors hover:bg-copper-deep focus:outline-none focus:ring-2 focus:ring-copper/50 focus:ring-offset-2 focus:ring-offset-cream"
      >
        Отправить заявку
      </button>
    </form>
  );
}

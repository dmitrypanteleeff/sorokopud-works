import AiCoreCanvas from "@/components/ai-core-canvas";
import LeadForm from "@/components/lead-form";

const capabilities = [
  {
    title: "Натуральная кожа",
    text: "Растительное дубление и честный материал, который со временем становится только благороднее.",
  },
  {
    title: "Ручная прошивка",
    text: "Седловидный шов вручную — прочнее и аккуратнее машинной строчки.",
  },
  {
    title: "Гарантия на швы",
    text: "Отвечаем за каждый шов. Если он разойдётся — починим бесплатно.",
  },
];

const steps = [
  {
    title: "Выбираете изделие",
    text: "Определяетесь с моделью и размером.",
  },
  {
    title: "Оставляете контакты",
    text: "Имя и телефон или Telegram.",
  },
  {
    title: "Обсуждаем детали",
    text: "Цвет, тиснение и размер согласуем до старта.",
  },
];

const products = [
  {
    name: "Кошелёк",
    price: "4 900 ₽",
    description:
      "Формат на 6–8 карт и отделение для купюр. Ручная прошивка седловидным швом.",
    art: (
      <svg
        viewBox="0 0 120 90"
        className="h-full w-full"
        role="img"
        aria-label="Кошелёк"
      >
        <rect x="20" y="24" width="80" height="52" rx="8" fill="#3e2c23" />
        <path d="M20 36h80" stroke="#8c5622" strokeWidth="2" />
        <circle cx="84" cy="36" r="5" fill="#b87333" />
      </svg>
    ),
  },
  {
    name: "Ремень",
    price: "3 500 ₽",
    description:
      "Цельная полоса кожи растительного дубления с латунной пряжкой.",
    art: (
      <svg
        viewBox="0 0 120 90"
        className="h-full w-full"
        role="img"
        aria-label="Ремень"
      >
        <rect x="14" y="40" width="92" height="12" rx="4" fill="#3e2c23" />
        <rect
          x="12"
          y="30"
          width="20"
          height="32"
          rx="4"
          fill="none"
          stroke="#b87333"
          strokeWidth="4"
        />
        <rect x="19" y="42" width="6" height="8" rx="1" fill="#b87333" />
      </svg>
    ),
  },
  {
    name: "Обложка для паспорта",
    price: "2 900 ₽",
    description:
      "Плотная кожа, защита документа и карман для карты.",
    art: (
      <svg
        viewBox="0 0 120 90"
        className="h-full w-full"
        role="img"
        aria-label="Обложка для паспорта"
      >
        <rect x="24" y="12" width="72" height="66" rx="6" fill="#3e2c23" />
        <line x1="60" y1="12" x2="60" y2="78" stroke="#8c5622" strokeWidth="3" />
        <rect x="38" y="38" width="18" height="14" rx="2" fill="#b87333" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 lg:px-8">
        <a href="#" className="font-serif text-xl font-semibold text-espresso">
          TERRA<span className="text-copper">·</span>CORIUM
        </a>
        <a
          href="#order"
          className="rounded-lg border border-espresso/15 px-4 py-2 text-sm text-espresso transition-colors hover:border-copper hover:text-copper"
        >
          Оставить заявку
        </a>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow text-sm font-medium text-copper">
              Ручная работа из натуральной кожи
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-tight text-espresso sm:text-5xl lg:text-6xl">
              Один мастер. Каждая вещь — на годы.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink/70">
              Кошельки, ремни и обложки для паспорта. Ручная прошивка,
              натуральное дубление, честные материалы.
            </p>
            <a
              href="#catalog"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-copper px-7 py-3.5 font-medium text-paper transition-colors hover:bg-copper-deep"
            >
              Выбрать изделие
            </a>
          </div>

          <div className="relative h-[74vw] max-h-[460px] w-full lg:h-[min(72vh,680px)] lg:max-h-none">
            <AiCoreCanvas />
          </div>
        </section>

        {/* Catalog */}
        <section id="catalog" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow text-sm font-medium text-copper">
              Каталог товаров
            </p>
            <h2 className="mt-4 font-serif text-3xl text-espresso sm:text-4xl">
              Три категории изделий
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.name}
                className="flex flex-col rounded-2xl border border-linen bg-paper p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-linen/40 p-6">
                  {product.art}
                </div>
                <h3 className="mt-5 font-serif text-xl text-espresso">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 leading-relaxed text-ink/70">
                  {product.description}
                </p>
                <p className="mt-4 font-serif text-2xl text-copper">
                  {product.price}
                </p>
                <a
                  href="#order"
                  className="mt-5 inline-flex items-center justify-center rounded-lg border border-copper px-4 py-2 text-sm text-copper transition-colors hover:bg-copper hover:text-paper"
                >
                  Оставить заявку
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section
          id="capabilities"
          className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="eyebrow text-sm font-medium text-copper">Почему мы</p>
            <h2 className="mt-4 font-serif text-3xl text-espresso sm:text-4xl">
              Ремесло в каждой детали
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {capabilities.map((item, index) => (
              <article
                key={item.title}
                className="rounded-2xl border border-linen bg-paper p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="font-serif text-sm text-copper">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-serif text-xl text-espresso">
                  {item.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/70">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Workflow */}
        <section
          id="workflow"
          className="border-y border-linen bg-paper/50"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow text-sm font-medium text-copper">
                Как это работает
              </p>
              <h2 className="mt-4 font-serif text-3xl text-espresso sm:text-4xl">
                Три шага до заказа
              </h2>
            </div>

            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-linen bg-paper p-8">
                  <p className="font-serif text-3xl text-copper">
                    {index + 1}
                  </p>
                  <h3 className="mt-4 font-serif text-xl text-espresso">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final CTA + form */}
        <section id="order" className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-espresso sm:text-4xl">
                Не нашли нужное? Сделаем на заказ.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink/70">
                Оставьте контакты — обсудим цвет, тиснение и размер. Без спешки
                и маркетингового шума.
              </p>
            </div>

            <div className="rounded-2xl border border-linen bg-paper p-6 shadow-sm sm:p-8">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-linen">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-serif text-espresso">
            TERRA<span className="text-copper">·</span>CORIUM
          </p>
          <p>© 2025. Изделия из натуральной кожи ручной работы.</p>
        </div>
      </footer>
    </div>
  );
}

import Image from "next/image";
import AiCoreCanvas from "@/components/ai-core-canvas";
import Gallery from "@/components/gallery";
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
    price: "от\u00A04\u00A0900\u00A0₽",
    description:
      "Формат на 6–8 карт и отделение для купюр. Ручная прошивка седловидным швом.",
    art: (
      <svg
        viewBox="0 0 120 90"
        className="h-full w-full"
        role="img"
        aria-label="Кошелёк"
      >
        <defs>
          <linearGradient id="wallet-leather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a352a" />
            <stop offset="1" stopColor="#2a1e17" />
          </linearGradient>
          <linearGradient id="wallet-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="80" rx="42" ry="5" fill="#3e2c23" opacity="0.14" />
        <rect x="20" y="22" width="80" height="54" rx="9" fill="url(#wallet-leather)" />
        <rect x="20" y="22" width="80" height="54" rx="9" fill="url(#wallet-sheen)" />
        <rect
          x="25"
          y="27"
          width="70"
          height="44"
          rx="6"
          fill="none"
          stroke="#b87333"
          strokeOpacity="0.5"
          strokeDasharray="3 2.4"
          strokeWidth="1"
        />
        <path d="M20 40h80" stroke="#8c5622" strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx="84" cy="40" r="4.4" fill="#b87333" />
        <circle cx="84" cy="40" r="2" fill="#8c5622" />
      </svg>
    ),
  },
  {
    name: "Ремень",
    price: "от\u00A03\u00A0500\u00A0₽",
    description:
      "Цельная полоса кожи растительного дубления с латунной пряжкой.",
    art: (
      <svg
        viewBox="0 0 120 90"
        className="h-full w-full"
        role="img"
        aria-label="Ремень"
      >
        <defs>
          <linearGradient id="belt-leather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a352a" />
            <stop offset="1" stopColor="#2a1e17" />
          </linearGradient>
          <linearGradient id="belt-brass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d8a05e" />
            <stop offset="1" stopColor="#9a5f24" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="78" rx="46" ry="5" fill="#3e2c23" opacity="0.14" />
        <rect x="16" y="38" width="88" height="14" rx="5" fill="url(#belt-leather)" />
        <rect
          x="19"
          y="41"
          width="82"
          height="8"
          rx="3"
          fill="none"
          stroke="#b87333"
          strokeOpacity="0.4"
          strokeDasharray="2.4 2"
          strokeWidth="1"
        />
        <rect
          x="16"
          y="30"
          width="22"
          height="30"
          rx="5"
          fill="none"
          stroke="url(#belt-brass)"
          strokeWidth="5"
        />
        <rect x="23" y="42" width="8" height="8" rx="1.5" fill="#8c5622" />
        <circle cx="58" cy="45" r="1.6" fill="#b87333" opacity="0.85" />
        <circle cx="68" cy="45" r="1.6" fill="#b87333" opacity="0.85" />
        <circle cx="78" cy="45" r="1.6" fill="#b87333" opacity="0.85" />
      </svg>
    ),
  },
  {
    name: "Обложка для паспорта",
    price: "от\u00A02\u00A0900\u00A0₽",
    description:
      "Плотная кожа, защита документа и карман для карты.",
    art: (
      <svg
        viewBox="0 0 120 90"
        className="h-full w-full"
        role="img"
        aria-label="Обложка для паспорта"
      >
        <defs>
          <linearGradient id="cover-leather" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a352a" />
            <stop offset="1" stopColor="#2a1e17" />
          </linearGradient>
          <linearGradient id="cover-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="82" rx="40" ry="4.6" fill="#3e2c23" opacity="0.14" />
        <rect x="26" y="12" width="68" height="66" rx="7" fill="url(#cover-leather)" />
        <rect x="26" y="12" width="68" height="66" rx="7" fill="url(#cover-sheen)" />
        <line x1="60" y1="12" x2="60" y2="78" stroke="#8c5622" strokeOpacity="0.6" strokeWidth="2" />
        <rect
          x="32"
          y="18"
          width="52"
          height="54"
          rx="4"
          fill="none"
          stroke="#b87333"
          strokeOpacity="0.4"
          strokeDasharray="3 2.4"
          strokeWidth="1"
        />
        <rect x="42" y="38" width="16" height="12" rx="2" fill="#b87333" />
        <rect x="42" y="38" width="16" height="12" rx="2" fill="none" stroke="#8c5622" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-linen/70 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/logo-bird-dark.png"
              alt=""
              width={484}
              height={480}
              className="h-10 w-auto"
              priority
            />
            <span className="font-serif text-lg font-semibold tracking-wide text-espresso">
              SOROKOPUD<span className="text-copper">-</span>WORKS
            </span>
          </a>
          <a href="#order" className="btn-outline">
            Оставить заявку
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid min-h-[calc(100svh-84px)] w-full max-w-6xl items-center gap-12 px-6 py-14 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <p className="eyebrow text-copper">
              Ручная работа из натуральной кожи
            </p>
            <h1 className="mt-6 font-serif text-[2.75rem] leading-[1.08] tracking-tight text-espresso sm:text-6xl lg:text-[4.25rem]">
              Один мастер. Каждая вещь —{" "}
              <em className="italic text-copper">на годы</em>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">
              Кошельки, ремни и обложки для паспорта. Ручная прошивка,
              натуральное дубление, честные материалы.
            </p>
            <a href="#catalog" className="btn-primary mt-10">
              Выбрать изделие
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div className="relative">
            <div className="relative h-[74vw] max-h-[480px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-espresso-deep shadow-card-lg lg:h-[min(70vh,640px)] lg:max-h-none">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,rgba(184,115,51,0.26),transparent_72%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent" />
              <AiCoreCanvas />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section
          id="capabilities"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24 lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="eyebrow text-copper">Почему мы</p>
            <h2 className="mt-5 font-serif text-4xl text-espresso sm:text-5xl">
              Ремесло в каждой детали
            </h2>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-linen md:grid-cols-3">
            {capabilities.map((item, index) => (
              <article
                key={item.title}
                className="bg-cream p-10 transition-colors duration-500 hover:bg-paper"
              >
                <p className="font-serif text-sm text-copper">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 font-serif text-2xl text-espresso">
                  {item.title}
                </h3>
                <p className="mt-4 leading-relaxed text-ink-soft">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section
          id="gallery"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24 lg:px-8"
        >
          <div className="max-w-2xl">
            <p className="eyebrow text-copper">Галерея</p>
            <h2 className="mt-5 font-serif text-4xl text-espresso sm:text-5xl">
              Примеры работ
            </h2>
          </div>

          <div className="mt-14">
            <Gallery />
          </div>
        </section>

        {/* Catalog */}
        <section
          id="catalog"
          className="scroll-mt-20 border-y border-linen bg-paper"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow text-copper">Каталог товаров</p>
              <h2 className="mt-5 font-serif text-4xl text-espresso sm:text-5xl">
                Три категории изделий
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {products.map((product) => (
                <article key={product.name} className="card group flex flex-col p-7">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-cream p-6 ring-1 ring-linen">
                    {product.art}
                    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-copper/0 transition duration-500 group-hover:ring-copper/30" />
                  </div>
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-2xl text-espresso">
                      {product.name}
                    </h3>
                    <p className="font-serif text-xl text-copper">{product.price}</p>
                  </div>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-soft">
                    {product.description}
                  </p>
                  <a href="#order" className="btn-outline mt-6 self-start">
                    Оставить заявку
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA после каталога */}
        <section className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24 lg:px-8">
          <div className="rounded-3xl border border-linen bg-paper p-8 shadow-card-lg sm:p-10">
            <h2 className="font-serif text-3xl leading-tight text-espresso sm:text-4xl">
              Не нашли нужное? Сделаем на заказ.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
              Оставьте контакты — обсудим цвет, тиснение и размер. Без спешки и
              маркетингового шума.
            </p>
            <div className="mt-8">
              <LeadForm />
            </div>
          </div>
        </section>

        {/* SEO */}
        <section
          id="handmade"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24 lg:px-8"
        >
          <article>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <p className="eyebrow text-copper">Философия мастерской</p>
                <h2 className="mt-5 font-serif text-4xl leading-tight text-espresso sm:text-5xl">
                  Почему handmade — это{" "}
                  <em className="italic text-copper">на годы</em>
                </h2>
                <p className="mt-8 text-lg leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-medium first-letter:leading-[0.85] first-letter:text-copper">
                  Массовое производство оптимизирует скорость и стоимость.
                  Ручная работа оптимизирует другое — долговечность и честность
                  материала. Когда мастер шьёт кошелёк вручную, он видит каждый
                  стежок, проверяет каждое сечение кожи и подбирает дубление
                  под конкретную задачу.
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {[
                    "Растительное дубление",
                    "Седловидный шов",
                    "Гарантия на швы",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-copper/40 bg-paper px-4 py-1.5 text-sm font-medium text-copper-deep"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href="#catalog" className="btn-primary">
                    Выбрать изделие
                  </a>
                  <a href="#order" className="btn-outline">
                    Оставить заявку
                  </a>
                </div>
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-ink">
                <p>
                  Натуральная кожа растительного дубления со временем не
                  изнашивается, а приобретает характер: темнеет, становится
                  мягче, ложится по руке. Ручная прошивка вощёной нитью не
                  расходится при нагрузке — в отличие от машинной строчки,
                  которая рвётся по шву.
                </p>
                <p>
                  Handmade — это не про «уникальность» ради уникальности. Это
                  про вещь, которую можно передать дальше. Про
                  ремонтопригодность, про заменяемость фурнитуры, про материал,
                  который не стыдно показать через пять лет.
                </p>
                <p>
                  Мы делаем немного и не спешим. Каждый кошелёк, ремень и
                  обложка проходят через руки мастера — и это видно по стежкам.
                </p>
                <blockquote className="border-l-2 border-copper pl-6">
                  <p className="font-serif text-2xl italic leading-snug text-espresso">
                    «Ручная прошивка не расходится при нагрузке. Вещь, которую
                    не стыдно показать через пять лет.»
                  </p>
                </blockquote>
              </div>
            </div>

            <p className="sr-only">
              SOROKOPUD-WORKS создаёт изделия из натуральной кожи ручной работы:
              кошелёк handmade, ремень из кожи ручной работы и обложку для
              паспорта из кожи. Это подарок мужчине, сделанный вручную и
              рассчитанный на годы.
            </p>
          </article>
        </section>

        {/* Workflow */}
        <section id="workflow" className="scroll-mt-20 bg-espresso-deep text-cream">
          <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow text-copper-bright">Как это работает</p>
              <h2 className="mt-5 font-serif text-4xl text-cream sm:text-5xl">
                Три шага до заказа
              </h2>
            </div>

            <ol className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8"
                >
                  <p className="font-serif text-5xl leading-none text-copper/40">
                    {index + 1}
                  </p>
                  <h3 className="mt-6 font-serif text-2xl text-cream">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-cream/60">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final CTA + form */}
        <section
          id="order"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-24 lg:px-8"
        >
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="lg:sticky lg:top-28">
              <h2 className="font-serif text-4xl leading-tight text-espresso sm:text-5xl">
                Не нашли нужное? Сделаем на заказ.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
                Оставьте контакты — обсудим цвет, тиснение и размер. Без спешки
                и маркетингового шума.
              </p>
            </div>

            <div className="rounded-3xl border border-linen bg-paper p-8 shadow-card-lg sm:p-10">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-espresso-deep text-cream/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-bird-light.png"
              alt=""
              width={484}
              height={480}
              className="h-10 w-auto"
            />
            <span className="font-serif text-lg text-cream">
              SOROKOPUD<span className="text-copper-bright">-</span>WORKS
            </span>
          </div>
          <p className="text-cream/55">
            © {new Date().getFullYear()}. Изделия из натуральной кожи ручной работы.
          </p>
        </div>
      </footer>
    </div>
  );
}

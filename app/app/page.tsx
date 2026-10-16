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
              href="#order"
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-copper px-7 py-3.5 font-medium text-paper transition-colors hover:bg-copper-deep"
            >
              Выбрать изделие
            </a>
          </div>

          <div className="relative h-[74vw] max-h-[460px] w-full lg:h-[min(72vh,680px)] lg:max-h-none">
            <AiCoreCanvas />
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

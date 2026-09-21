import { useState } from "react";
import {
  Heart,
  Server,
  Database,
  Film,
  Rocket,
  CreditCard,
  Copy,
  Check,
  Wallet,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import SideImage from "../components/ui/SideImages";

export default function PrizePage() {
  const [copied, setCopied] = useState(false);

  const cardNumber = "6219861938917621";

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardNumber);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      dir="rtl"
      className="
      min-h-screen
      overflow-hidden
      bg-gradient-to-b
      from-black
      via-[#120809]
      to-[#1A0B0C]
      px-4
      py-14
      sm:px-6
      lg:px-8
    "
    >
      <SideImage />

      {/* Glow */}

      <div className="pointer-events-none fixed -right-32 top-0 h-[420px] w-[420px] rounded-full bg-fuchsia-700/20 blur-[120px]" />

      <div className="pointer-events-none fixed -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-red-700/20 blur-[140px]" />

      <div className="mx-auto mt-24 max-w-7xl">

        {/* ================= Hero ================= */}

        <section
          className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-2xl
        "
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-fuchsia-600/10" />

          <div className="relative z-10 p-8 md:p-14">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-white/80">

              <Sparkles size={16} />

              حمایت از پروژه

            </div>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">

                <div className="mb-6 flex items-center gap-4">

                  <div
                    className="
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-pink-500
                    to-red-600
                    shadow-[0_0_45px_rgba(225,29,72,.45)]
                  "
                  >
                    <Heart
                      className="fill-white text-white"
                      size={38}
                    />
                  </div>

                  <div>

                    <h1 className="text-4xl font-black text-white md:text-6xl">
                      مووی<span className="text-rose-500">ورس</span>
                    </h1>

                    <p className="mt-2 text-lg text-white/70">
                      همیشه رایگان، همیشه در کنار شما
                    </p>

                  </div>

                </div>

                <p className="leading-9 text-white/75 md:text-lg">

                  هدف ما این بوده که کاربران بدون خرید اشتراک، بدون محدودیت و
                  بدون تبلیغات آزاردهنده بتوانند به دنیای فیلم و سریال دسترسی
                  داشته باشند.

                </p>

                {/* <p className="mt-5 leading-9 text-white/60">

                  نگهداری سرورها، افزایش فضای ذخیره‌سازی، تهیه نسخه‌های جدید،
                  توسعه امکانات سایت و بروزرسانی روزانه هزینه‌های زیادی دارد.
                  اگر از مووی<span className="text-rose-500">ورس</span> رضایت دارید، حمایت شما باعث می‌شود این مسیر را
                  با قدرت بیشتری ادامه دهیم.

                </p> */}

                <div className="mt-8 flex flex-wrap gap-4">

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-emerald-300">

                    ✓ بدون اشتراک ماهانه

                  </div>

                  <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-5 py-3 text-sky-300">

                    ✓ دانلود رایگان

                  </div>

                  <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-5 py-3 text-fuchsia-300">

                    ✓ بدون تبلیغات مزاحم

                  </div>

                </div>

              </div>

              {/* قلب بزرگ سمت راست */}

              <div className="hidden lg:flex">

                <div
                  className="
                  relative
                  flex
                  h-72
                  w-72
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-xl
                "
                >
                  <div className="absolute h-60 w-60 rounded-full bg-pink-600/20 blur-3xl" />

                  <Heart
                    size={120}
                    className="relative text-pink-400 fill-pink-400"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>
        {/* ================= Why Support ================= */}

        <section className="mt-12">

          <div className="mb-8 text-center">

            <h2 className="text-3xl font-black text-white">
              چرا حمایت شما اهمیت دارد؟
            </h2>

            <p className="mt-3 text-white/60">
              هر حمایت، حتی کوچک، به ادامه فعالیت مووی<span className="text-rose-500">ورس</span> کمک می‌کند.
            </p>

          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <div
              className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-7
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-red-500/30
              hover:shadow-[0_0_45px_rgba(225,29,72,.18)]
            "
            >

              <div
                className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-red-500/15
                text-red-400
                transition
                group-hover:scale-110
              "
              >
                <Server size={30} />
              </div>

              <h3 className="text-xl font-bold text-white">
                هزینه سرورها
              </h3>

              <p className="mt-4 leading-8 text-sm text-white/60">
                برای اینکه دانلودها با سرعت مناسب و بدون قطعی در اختیار کاربران
                قرار بگیرند، سرورهای قدرتمند و پایدار نیاز داریم.
              </p>

            </div>

            <div
              className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-7
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-sky-500/30
              hover:shadow-[0_0_45px_rgba(59,130,246,.18)]
            "
            >

              <div
                className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-sky-500/15
                text-sky-400
              "
              >
                <Database size={30} />
              </div>

              <h3 className="text-xl font-bold text-white">
                فضای ذخیره‌سازی
              </h3>

              <p className="mt-4 leading-8 text-sm text-white/60">
                هر روز فیلم‌ها و سریال‌های جدیدی به سایت اضافه می‌شود و این
                یعنی نیاز مداوم به فضای ذخیره‌سازی بیشتر.
              </p>

            </div>

            <div
              className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-7
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-yellow-500/30
              hover:shadow-[0_0_45px_rgba(234,179,8,.18)]
            "
            >

              <div
                className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-yellow-500/15
                text-yellow-400
              "
              >
                <Film size={30} />
              </div>

              <h3 className="text-xl font-bold text-white">
                محتوای جدید
              </h3>

              <p className="mt-4 leading-8 text-sm text-white/60">
                هدف ما این است که جدیدترین فیلم‌ها و سریال‌ها در سریع‌ترین زمان
                ممکن به سایت اضافه شوند.
              </p>

            </div>

            <div
              className="
              group
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              p-7
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-fuchsia-500/30
              hover:shadow-[0_0_45px_rgba(217,70,239,.18)]
            "
            >

              <div
                className="
                mb-5
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-2xl
                bg-fuchsia-500/15
                text-fuchsia-400
                "
              >
                <Rocket size={30} />
              </div>

              <h3 className="text-xl font-bold text-white">
                توسعه سایت
              </h3>

              <p className="mt-4 leading-8 text-sm text-white/60">
                قابلیت‌های جدید، طراحی بهتر، اپلیکیشن موبایل و امکانات آینده،
                همگی با حمایت کاربران قابل توسعه خواهند بود.
              </p>

            </div>

          </div>

        </section>





        {/* ================= Free Forever ================= */}

        <section
          className="
          mt-14
          overflow-hidden
          rounded-[30px]
          border
          border-white/10
          bg-gradient-to-br
          from-white/[0.06]
          to-white/[0.03]
          p-8
          backdrop-blur-xl
        "
        >

          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-3xl">

              <div className="mb-5 flex items-center gap-3">

                <ShieldCheck
                  className="text-emerald-400"
                  size={32}
                />

                <h2 className="text-3xl font-black text-white">
                  مووی<span className="text-rose-500">ورس</span> همیشه رایگان خواهد ماند
                </h2>

              </div>

              <p className="leading-9 text-white/70">

                ما اعتقاد داریم دسترسی به دنیای فیلم و سریال نباید وابسته به
                خرید اشتراک‌های گران‌قیمت باشد.

              </p>

              <p className="mt-5 leading-9 text-white/60">

                به همین دلیل تلاش کرده‌ایم تمام امکانات اصلی سایت را بدون
                دریافت هزینه در اختیار کاربران قرار دهیم و قصد داریم این مسیر را
                با کمک شما ادامه دهیم.

              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-5 text-center text-emerald-300">
                ✓ دانلود رایگان
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 px-6 py-5 text-center text-sky-300">
                ✓ بدون اشتراک
              </div>

              <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-6 py-5 text-center text-fuchsia-300">
                ✓ بدون محدودیت
              </div>

              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-center text-red-300">
                ✓ بدون تبلیغات آزاردهنده
              </div>

            </div>

          </div>

        </section>
        {/* ================= Payment ================= */}

        <section className="mt-14 grid gap-8 lg:grid-cols-2">

          {/* Online Payment */}

          <div
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.05]
              p-8
              backdrop-blur-xl
            "
          >
            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-2xl bg-pink-500/15 p-4 text-pink-400">
                <Wallet size={30} />
              </div>

              <div>

                <h2 className="text-2xl font-black text-white">
                  پرداخت آنلاین
                </h2>

                <p className="text-white/60">
                  سریع، امن و بدون محدودیت
                </p>

              </div>

            </div>

            <p className="leading-8 text-white/65">
              اگر مایل هستید از ادامه توسعه مووی<span className="text-rose-500">ورس</span> حمایت کنید، می‌توانید از طریق
              درگاه پرداخت آنلاین مبلغ دلخواه خود را پرداخت نمایید.
            </p>

            <a
              
              href="https://YOUR-PAYMENT-LINK"
              target="_blank"
              rel="noreferrer"
              className="
                mt-8
                flex
                h-16
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                via-pink-600
                to-red-600
                text-lg
                font-bold
                text-white
                transition-all
                duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_45px_rgba(225,29,72,.35)]
              "
            >
              <Heart className="fill-white" size={22} />

              حمایت از <span>مووی<span className="text-rose-950">ورس</span></span>
            </a>
          </div>

          {/* Card Number */}

          <div
            className="
              rounded-[32px]
              border
              border-white/10
              bg-white/[0.05]
              p-8
              backdrop-blur-xl
            "
          >

            <div className="mb-6 flex items-center gap-3">

              <div className="rounded-2xl bg-sky-500/15 p-4 text-sky-400">
                <CreditCard size={30} />
              </div>

              <div>

                <h2 className="text-2xl font-black text-white">
                  شماره کارت
                </h2>

                <p className="text-white/60">
                  انتقال مستقیم بانکی
                </p>

              </div>

            </div>

            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-black/20
                px-6
                py-5
              "
            >

              {/* <p className="text-sm text-white/50">
                شماره کارت
              </p> */}

              <p dir="ltr" className="text-center mt-3 select-all text-2xl font-black tracking-[4px] text-white">
                {cardNumber.replace(/(\d{4})/g, "$1 ").trim()}
              </p>
              
              <br />

              {/* <p className="mt-5 text-white/60">
                به نام
              </p> */}

              <p className="text-center mt-2 text-lg font-bold text-white">
                امیرعباس سالاری
              </p>

            </div>

            <button
              onClick={copyCard}
              className="
                mt-6
                flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-white/10
                bg-white/5
                text-white
                transition-all
                duration-300
                hover:bg-white/10
              "
            >

              {copied ? (
                <>
                  <Check className="text-emerald-400" />

                  شماره کارت کپی شد
                </>
              ) : (
                <>
                  <Copy />

                  کپی شماره کارت
                </>
              )}

            </button>

          </div>

        </section>





        {/* ================= Thank You ================= */}

        <section
          className="
            mt-16
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-gradient-to-r
            from-red-600/10
            via-fuchsia-600/10
            to-pink-600/10
            p-10
            text-center
            backdrop-blur-xl
          "
        >

          <div
            className="
              mx-auto
              mb-6
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-gradient-to-br
              from-pink-500
              to-red-600
              shadow-[0_0_40px_rgba(225,29,72,.45)]
            "
          >

            <Heart
              size={42}
              className="fill-white text-white"
            />

          </div>

          <h2 className="text-4xl font-black text-white">
            از همراهی شما سپاسگزاریم ❤️
          </h2>

          <p className="mx-auto mt-6 max-w-3xl leading-9 text-white/70">

            حمایت شما فقط یک پرداخت نیست؛ بلکه انگیزه‌ای برای ادامه مسیر،
            توسعه امکانات جدید، افزایش کیفیت سایت و حفظ رایگان بودن مووی<span className="text-rose-500">ورس</span>
            برای همه کاربران است.

          </p>

          <p className="mt-6 text-lg font-semibold text-pink-300">

            با کمک شما، این پروژه هر روز بهتر از دیروز خواهد شد.

          </p>

        </section>

      </div>

    </div>
  );
}

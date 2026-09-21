import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function Dropdown({
  isOpen,
  onClose,
  anchorRef,      // ref دکمه‌ی toggle برای پوزیشن دسکتاپ
  children,
  className = "",
}) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  // محاسبه‌ی پوزیشن دسکتاپ نسبت به دکمه
  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return;

    function updatePosition() {
      const rect = anchorRef.current.getBoundingClientRect();
      const menuWidth = 288; // عرض منو (مثلاً w-72)

      // مرکز دکمه منهای نصف عرض منو
      let left = rect.left + rect.width / 2 - menuWidth / 2;

      // جلوگیری از زدن بیرون از لبه‌های صفحه
      left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8));

      setPos({
        top: rect.bottom + 8,
        left,
      });

    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, anchorRef]);

  // بستن با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-toggle")
      ) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // قفل اسکرول صفحه فقط در موبایل
  useEffect(() => {
    if (!isOpen) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (mq.matches) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop فقط در موبایل */}
      <div
        className="fixed inset-0 z-[60] bg-black/40 sm:hidden"
        onClick={() => onClose?.()}
      />

      <div
        ref={dropdownRef}
        style={{
          // پوزیشن دسکتاپ از روی anchor تنظیم میشه
          top: pos.top,
          left: pos.left,
        }}
        className={`
          z-[70]
          overflow-hidden
          backdrop-blur-xl
          bg-white/10 dark:bg-black/20
          border border-white/20
          shadow-2xl shadow-black/30

          /* موبایل: bottom sheet */
          fixed inset-x-0 bottom-0
          max-h-[85vh] overflow-y-auto
          rounded-t-2xl
          p-2 pb-[calc(env(safe-area-inset-bottom)+8px)]

          /* دسکتاپ: شناور نسبت به دکمه */
          sm:inset-x-auto sm:bottom-auto
          sm:top-[var(--dd-top)] sm:right-[var(--dd-right)]
          sm:w-[300px] sm:max-h-none
          sm:rounded-2xl sm:p-0

          ${className}
        `}
      >
        {/* دستگیره فقط در موبایل */}
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/30 sm:hidden" />
        {children}
      </div>
    </>,
    document.body
  );
}

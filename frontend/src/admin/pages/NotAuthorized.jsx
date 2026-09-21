import { Link } from "react-router-dom";

const NotAuthorized = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-5">⛔</div>

        <h1 className="text-2xl font-bold mb-3">دسترسی غیرمجاز</h1>

        <p className="text-zinc-400 text-sm leading-7 mb-6">
          شما اجازه دسترسی به پنل مدیریت را ندارید. این بخش فقط برای کاربران
          دارای سطح دسترسی ادمین فعال است.
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm transition"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
};

export default NotAuthorized;

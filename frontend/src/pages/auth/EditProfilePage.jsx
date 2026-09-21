import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import {
  User,
  Mail,
  Phone,
  Lock,
  ImagePlus,
  Save,
  Settings,
  Shield,
  Film,
} from "lucide-react";

export default function EditProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("profile");

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    avatar: null,
    favorite_genres: [],
    password: "",
    password2: "",
  });

  const [preview, setPreview] = useState(null);
  const [original, setOriginal] = useState(null);
  const [msg, setMsg] = useState({ error: null, success: null });

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
        try {
        const res = await api.get("/genres/");

        const data = res.data;

        // 👇 مهم‌ترین بخش
        const list =
            Array.isArray(data) ? data :
            Array.isArray(data?.results) ? data.results :
            Array.isArray(data?.data) ? data.data :
            [];

        setGenres(list);
        } catch (err) {
        setGenres([]);
        }
    };

    fetchGenres();
  }, []);
  

  // ---------------- FETCH ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/accounts/profile/");

        const init = {
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          avatar: null,
          favorite_genres: data.favorite_genres || [],
          password: "",
          password2: "",
        };

        setForm(init);
        setOriginal(init);
        setPreview(data.avatar);
      } catch (err) {
        setMsg({ error: "خطا در دریافت اطلاعات کاربر" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ---------------- DIRTY CHECK ----------------
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(original);
  }, [form, original]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((p) => ({ ...p, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const toggleGenre = (id) => {
    setForm((prev) => {
      const exists = prev.favorite_genres.includes(id);
  
      return {
        ...prev,
        favorite_genres: exists
          ? prev.favorite_genres.filter((x) => x !== id)
          : [...prev.favorite_genres, Number(id)],
      };
    });
  };
  
  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({});

    try {
      const fd = new FormData();

      fd.append("username", form.username);
      fd.append("email", form.email);
      fd.append("phone", form.phone);

    form.favorite_genres.forEach((id) => {
      fd.append("favorite_genres", Number(id));
    });
    
      if (form.avatar) fd.append("avatar", form.avatar);

      // password optional
      if (form.password) {
        fd.append("password", form.password);
        fd.append("password2", form.password2);
      }

      await api.patch("/accounts/profile/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOriginal(form);
      setMsg({ success: "تغییرات با موفقیت ذخیره شد" });
    } catch (err) {
      setMsg({ error: "خطا در ذخیره اطلاعات" });
    } finally {
      setSaving(false);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center text-white/50">
        در حال بارگذاری پروفایل...
      </div>
    );
  }


  return (
    <div dir="rtl" className="min-h-screen bg-black text-white pt-36 px-4">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <div className="space-y-2">
          <SidebarItem icon={User} label="پروفایل" active={tab==="profile"} onClick={()=>setTab("profile")} />
          <SidebarItem icon={Settings} label="اطلاعات حساب" active={tab==="account"} onClick={()=>setTab("account")} />
          <SidebarItem icon={Film} label="علاقه‌مندی‌ها" active={tab==="genres"} onClick={()=>setTab("genres")} />
          <SidebarItem icon={Shield} label="امنیت" active={tab==="security"} onClick={()=>setTab("security")} />
        </div>

        {/* CONTENT */}
        <div className="md:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

          {/* PROFILE TAB */}
          {tab === "profile" && (
            <div className="flex flex-col gap-6 items-center">
              <div className="h-28 w-28 rounded-full overflow-hidden border border-white/20">
                {preview ? (
                  <img src={preview} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-white/10">
                    <User />
                  </div>
                )}
              </div>

              <label className="text-sky-300 cursor-pointer text-sm">
                تغییر عکس پروفایل
                <input type="file" hidden onChange={handleFile} />
              </label>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {tab === "account" && (
            <div className="space-y-4">
              <Input icon={User} name="username" value={form.username} onChange={handleChange} label="نام کاربری" />
              <Input icon={Mail} name="email" value={form.email} onChange={handleChange} label="ایمیل" />
              <Input icon={Phone} name="phone" value={form.phone} onChange={handleChange} label="شماره موبایل" />
            </div>
          )}

          {/* GENRES */}
          {tab === "genres" && (
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => {
                const active = form.favorite_genres.includes(g.id);

                return (
                    <button
                    key={g.id}
                    type="button"
                    onClick={() => toggleGenre(g.id)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                        active
                        ? "bg-sky-500/20 border-sky-400 text-sky-300"
                        : "border-white/10 text-white/60"
                    }`}
                    >
                    {g.name}
                    </button>
                );
              })}
            </div>
          )}

          {/* SECURITY */}
          {tab === "security" && (
            <div className="space-y-4">
              <Input icon={Lock} name="password" type="password" value={form.password} onChange={handleChange} label="رمز جدید" />
              <Input icon={Lock} name="password2" type="password" value={form.password2} onChange={handleChange} label="تکرار رمز جدید" />
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-6 flex items-center justify-between">
            {msg.error && <p className="text-red-400 text-sm">{msg.error}</p>}
            {msg.success && <p className="text-green-400 text-sm">{msg.success}</p>}

            <button
              onClick={handleSubmit}
              disabled={!isDirty || saving}
              className="flex items-center gap-2 bg-sky-500 px-5 py-2 rounded-xl disabled:opacity-40"
            >
              <Save className="h-4 w-4" />
              {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ---------------- COMPONENTS ----------------
function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition ${
        active ? "bg-sky-500 text-white" : "bg-white/5 text-white/60"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Input({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="text-sm text-white/60 mb-1 block">{label}</label>
      <div className="relative">
        <Icon className="absolute right-3 top-3 h-4 w-4 text-white/40" />
        <input
          {...props}
          className="w-full bg-white/10 rounded-xl px-10 py-2 outline-none"
        />
      </div>
    </div>
  );
}
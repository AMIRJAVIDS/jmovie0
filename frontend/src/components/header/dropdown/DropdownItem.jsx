import { Link } from "react-router";

export function DropdownItem({
  tag = "button",
  to,
  onClick,
  onItemClick,
  baseClassName = "",
  className = "",
  children,
}) {
  

  const combinedClasses = `
    flex
    items-center
    gap-3

    w-full

    min-h-[48px]

    px-4
    py-3

    rounded-xl

    text-sm
    md:text-base

    transition-all
    duration-200

    hover:bg-gray-100
    dark:hover:bg-white/10

    hover:text-[#27679f]
    dark:hover:text-[#98b2ff]

    ${baseClassName}
    ${className}
  `.trim();


  const handleClick = (event) => {
    if (tag === "button") {
      event.preventDefault();
    }

    onClick?.();
    onItemClick?.();
  };

  if (tag === "a" && to) {
    return (
      <Link
        to={to}
        onClick={handleClick}
        className={combinedClasses}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={combinedClasses}
    >
      {children}
    </button>
  );
}
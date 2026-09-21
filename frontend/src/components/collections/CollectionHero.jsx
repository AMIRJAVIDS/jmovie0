import {
  Film,
  FolderOpen,
  ArrowLeft,
} from "lucide-react";


export default function CollectionHero({
  collection,
  featured = false,
  onClick,
}) {

  if (!collection) return null;


  return (

    <section
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        backdrop-blur-xl
      "
    >


      {/* Backdrop */}

      <div className="absolute inset-0">

        {(collection.backdrop_url || collection.poster_url) && (

          <img
            src={
              collection.backdrop_url ||
              collection.poster_url
            }
            alt=""
            className="
              h-full
              w-full
              object-cover
            "
          />

        )}


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#120709]
            via-[#120709]/90
            to-black/30
          "
        />


        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#120709]
            via-transparent
            to-transparent
          "
        />

      </div>



      <div
        className="
          relative
          z-10
          grid
          min-h-[420px]

          gap-8

          p-5
          sm:p-8

          lg:grid-cols-[0.2fr_0.8fr]
        "
      >

        {/* Poster */}

        <div
          className="
            hidden
            items-center
            justify-center

            lg:flex
          "
        >

          {collection.poster_url && (

            <img
              src={collection.poster_url}
              alt={collection.title}

              className="
                h-[340px]
                rounded-2xl
                shadow-2xl

                transition
                duration-500

                group-hover:-translate-y-2
              "
            />

          )}

        </div>



        {/* Content */}
        
        <div
          className="
            flex
            flex-col
            justify-center
          "
        >


          <div
            className="
              mb-4
              inline-flex
              w-fit
              items-center
              rounded-full
              border
              border-fuchsia-500/20
              bg-fuchsia-500/10
              px-4
              py-2
              text-sm
              text-fuchsia-300
            "
          >

            {featured
              ? "کالکشن ویژه"
              : "اطلاعات کالکشن"
            }

          </div>



          <h1
            className="
              text-3xl
              font-black
              text-white

              sm:text-5xl
            "
          >
            {collection.title}
          </h1>



          {collection.description && (

            <p
              className="
                mt-5
                max-w-2xl
                leading-8
                text-zinc-400
              "
            >
              {collection.description}
            </p>

          )}



          <div
            className="
              mt-8
              flex
              flex-wrap
              gap-6
              text-zinc-300
            "
          >

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <Film
                size={20}
                className="text-fuchsia-400"
              />

              {collection.items_count ??
                collection.items?.length ??
                0
              }

              فیلم

            </div>



            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <FolderOpen
                size={20}
                className="text-fuchsia-400"
              />

              Collection

            </div>


          </div>



          {featured && (

            <button

              onClick={onClick}

              className="
                mt-10
                flex
                w-fit
                items-center
                gap-3
                rounded-2xl
                bg-gradient-to-r
                from-fuchsia-600
                to-red-600
                px-7
                py-4
                font-semibold
                text-white

                transition
                hover:scale-105
              "
            >

              مشاهده کالکشن

              <ArrowLeft size={20}/>

            </button>

          )}



        </div>





      </div>


    </section>

  );
}
import {
  Bot,
  User,
} from 'lucide-react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import AIMovieCard from './AIMovieCard'

const AIMessage = ({ message }) => {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-end justify-start gap-2">

        <div
          className="
            max-w-[82%]
            whitespace-pre-wrap
            break-words
            rounded-2xl
            rounded-br-md
            bg-[#8b1e2d]
            px-3.5
            py-3
            text-[13px]
            leading-7
            text-white
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>

        <div
          className="
            mb-0.5
            flex h-7 w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            bg-white/[0.06]
            text-[9px]
            text-gray-400
          "
        >
          <User size={13} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end justify-end gap-2">

      <div
        className="
          flex h-7 w-7
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-[#8b1e2d]/15
          text-[#c95264]
        "
      >
        <Bot
          size={14}
          strokeWidth={2}
        />
      </div>

      <div
        className="
          max-w-[88%]
          min-w-0
          rounded-2xl
          rounded-bl-md
          border border-white/[0.06]
          bg-white/[0.055]
          px-3.5
          py-3
          text-[13px]
          leading-7
          text-gray-200
        "
      >

        {message.content && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>        )}

        {message.type === 'media_results' &&
          message.items?.map((item, index) => (
            <AIMovieCard
              key={item.id ?? item.imdb_id ?? index}
              item={item}
            />
          ))}
      </div>
    </div>
  )
}

export default AIMessage
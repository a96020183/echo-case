import { useState } from 'react'
import PostCard from '../PostCard.jsx'
import AccountModal from '../AccountModal.jsx'

export default function FeedApp({ items }) {
  const [account, setAccount] = useState(null)
  const posts = items.filter((e) => e.app === 'feed')

  return (
    <div>
      {/* Threads 風頂欄 */}
      <div className="sticky top-0 z-10 -mx-3 mb-1 flex items-center justify-center border-b border-[#262626] bg-ink/95 px-3 py-2 backdrop-blur">
        <span className="text-base font-black tracking-tight">＠ 動態</span>
        <span className="absolute right-3 text-[10px] text-danger">● 延燒中</span>
      </div>
      {posts.length === 0 && <Empty text="這裡目前沒有新動態。" />}
      {posts.map((ev) => (
        <PostCard key={ev.id} ev={ev} onOpenAccount={setAccount} variant="thread" />
      ))}
      {account && <AccountModal ev={account} onClose={() => setAccount(null)} />}
    </div>
  )
}

function Empty({ text }) {
  return <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-center text-sm text-mute">{text}</div>
}

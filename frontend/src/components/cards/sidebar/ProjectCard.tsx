import React from 'react'

export function ProjectCard({
  subject,
  isOpen,
  selectedSubjectId,
  selectedChatId,
  onToggle,
  setSelectedSubjectId,
  selectChat,
  renameSubject,
  createChat,
  renameChat,
  deleteChat,
}) {
  const subj = subject
  return (
    <div className={`border rounded-lg bg-[#0b1d27] mb-2 ${selectedSubjectId === subj.id ? 'border-[#1d5674] shadow-[0_0_0_1px_#1d5674]' : 'border-[#133142]'}`}>
      <div className="flex items-center p-2 font-semibold text-[0.9rem] gap-2">
        <span className="w-4 text-center opacity-90">{isOpen ? '▾' : '▸'}</span>
        <span
          className="flex-1 cursor-pointer"
          role="button"
          aria-expanded={isOpen}
          onClick={() => { setSelectedSubjectId?.(subj.id); onToggle?.(subj.id) }}
        >{subj.name}</span>
        <div className="ml-2 flex gap-2">
          <span className="cursor-pointer opacity-70 hover:opacity-100" title="Byt namn" onClick={() => renameSubject(subj.id)}>✎</span>
          <span className="cursor-pointer opacity-70 hover:opacity-100" title="Ny chat" onClick={() => createChat(subj.id)}>＋</span>
        </div>
      </div>
      {isOpen && (
        <div className="p-1 pt-0 pb-2">
          {(subj.chats||[]).map(ch => (
            <div key={ch.id} className={`flex justify-between items-center p-1 px-2 text-[0.82rem] rounded cursor-pointer text-[#cddfea]${selectedChatId === ch.id ? ' bg-[#163040]' : ''} hover:bg-[#132a38]`}
              onClick={() => selectChat(subj.id, ch.id)}>
              <span className="truncate" title={ch.name}>{ch.name}</span>
              <span className="flex ml-2 gap-1">
                <span className="ml-1 cursor-pointer opacity-55 text-[0.75rem] hover:opacity-100" title="Byt namn" onClick={(e) => { e.stopPropagation(); renameChat(subj.id, ch.id) }}>✎</span>
                <span className="ml-1 cursor-pointer opacity-55 text-[0.75rem] hover:opacity-100" title="Ta bort" onClick={(e) => { e.stopPropagation(); deleteChat(subj.id, ch.id) }}>✕</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

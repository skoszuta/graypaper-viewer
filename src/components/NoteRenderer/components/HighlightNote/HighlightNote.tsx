import "./HighlightNote.css";
import { useContext, useMemo, useState } from "react";
import { CodeSyncContext, type ICodeSyncContext } from "../../../CodeSyncProvider/CodeSyncProvider";
import { Highlighter } from "../../../Highlighter/Highlighter";
import type { IHighlightNote } from "../../../NotesProvider/NotesProvider";

interface HighlightNoteProps {
  note: IHighlightNote;
  pageOffset: DOMRect;
}

export function HighlightNote({ note, pageOffset }: HighlightNoteProps) {
  const [noteContentHeight, setNoteContentHeight] = useState<number>(0);
  const { getSynctexBlockRange } = useContext(CodeSyncContext) as ICodeSyncContext;

  const blocks = useMemo(
    () => getSynctexBlockRange(note.selectionStart, note.selectionEnd),
    [note, getSynctexBlockRange],
  );

  if (!blocks.length) return null;

  const rightmostEdge = Math.max(...blocks.map(({ left, width }) => left + width));
  const leftmostEdge = Math.min(...blocks.map(({ left }) => left));

  const style =
    rightmostEdge > 0.5
      ? {
          left: `${pageOffset.left + rightmostEdge * pageOffset.width}px`,
          top: `${pageOffset.top + pageOffset.height * blocks[blocks.length - 1].top - noteContentHeight}px`,
        }
      : {
          right: `${pageOffset.right - pageOffset.width + (1 - leftmostEdge) * pageOffset.width}px`,
          top: `${pageOffset.top + pageOffset.height * blocks[blocks.length - 1].top - noteContentHeight}px`,
        };

  const handleNoteContentRef = (noteContentElement: HTMLDivElement) =>
    setNoteContentHeight(noteContentElement?.offsetHeight || 0);

  return (
    <>
      <Highlighter blocks={blocks} pageOffset={pageOffset} />

      <div className="highlight-note-content" ref={handleNoteContentRef} style={style}>
        {note.content}
      </div>
    </>
  );
}

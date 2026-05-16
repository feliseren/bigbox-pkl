"use client";

import { useCallback, useRef, useState } from "react";

type ToolbarAction = {
  id:
    | "bold"
    | "italic"
    | "underline"
    | "align-left"
    | "align-center"
    | "align-right"
    | "align-justify"
    | "link";
  title: string;
  icon: React.ReactNode;
};

type ListOption = {
  id:
    | "list-bullet"
    | "list-circle"
    | "list-square"
    | "list-number"
    | "list-alpha-lower"
    | "list-alpha-upper"
    | "list-roman-lower"
    | "list-roman-upper";
  title: string;
  icon: React.ReactNode;
};

type EditorActionId = ToolbarAction["id"] | ListOption["id"];

const toolbarActions: ToolbarAction[] = [
  {
    id: "bold",
    title: "Bold",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M7 5h6a3 3 0 0 1 0 6H7V5Zm0 6h7a3 3 0 0 1 0 6H7v-6Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "italic",
    title: "Italic",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M10 5h8v2h-3.5l-4 10H14v2H6v-2h3.5l4-10H10V5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "underline",
    title: "Underline",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M7 4v7a5 5 0 0 0 10 0V4h-2v7a3 3 0 0 1-6 0V4H7Zm-1 16h12v2H6v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "align-left",
    title: "Align Left",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M4 6h16v2H4V6Zm0 5h10v2H4v-2Zm0 5h16v2H4v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "align-center",
    title: "Align Center",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M4 6h16v2H4V6Zm3 5h10v2H7v-2Zm-3 5h16v2H4v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "align-right",
    title: "Align Right",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M4 6h16v2H4V6Zm6 5h10v2H10v-2Zm-6 5h16v2H4v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "align-justify",
    title: "Justify",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    id: "link",
    title: "Link",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M10 13a4 4 0 0 1 0-6l3-3a4 4 0 0 1 6 6l-1.5 1.5-1.4-1.4L18 8.6a2 2 0 0 0-2.8-2.8l-3 3a2 2 0 0 0 0 2.8L13 12l-1.4 1.4-1.6-1.4ZM14 11a4 4 0 0 1 0 6l-3 3a4 4 0 0 1-6-6l1.5-1.5 1.4 1.4L6 15.4a2 2 0 0 0 2.8 2.8l3-3a2 2 0 0 0 0-2.8L11 12l1.4-1.4 1.6 1.4Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const listOptions: ListOption[] = [
  {
    id: "list-bullet",
    title: "Bullet",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="6" cy="7" r="2" fill="currentColor" />
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <circle cx="6" cy="12" r="2" fill="currentColor" />
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <circle cx="6" cy="17" r="2" fill="currentColor" />
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-circle",
    title: "Circle",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="6" cy="7" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <circle cx="6" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <circle cx="6" cy="17" r="2" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-square",
    title: "Square",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="4" y="5" width="4" height="4" fill="currentColor" />
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="10" width="4" height="4" fill="currentColor" />
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <rect x="4" y="15" width="4" height="4" fill="currentColor" />
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-number",
    title: "Numbered",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <text x="3" y="9" fontSize="7" fontFamily="Arial" fill="currentColor">
          1.
        </text>
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="14" fontSize="7" fontFamily="Arial" fill="currentColor">
          2.
        </text>
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="19" fontSize="7" fontFamily="Arial" fill="currentColor">
          3.
        </text>
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-alpha-lower",
    title: "a.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <text x="3" y="9" fontSize="7" fontFamily="Arial" fill="currentColor">
          a.
        </text>
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="14" fontSize="7" fontFamily="Arial" fill="currentColor">
          b.
        </text>
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="19" fontSize="7" fontFamily="Arial" fill="currentColor">
          c.
        </text>
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-alpha-upper",
    title: "A.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <text x="3" y="9" fontSize="7" fontFamily="Arial" fill="currentColor">
          A.
        </text>
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="14" fontSize="7" fontFamily="Arial" fill="currentColor">
          B.
        </text>
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="19" fontSize="7" fontFamily="Arial" fill="currentColor">
          C.
        </text>
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-roman-lower",
    title: "i.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <text x="3" y="9" fontSize="7" fontFamily="Arial" fill="currentColor">
          i.
        </text>
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="14" fontSize="7" fontFamily="Arial" fill="currentColor">
          ii.
        </text>
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="19" fontSize="7" fontFamily="Arial" fill="currentColor">
          iii.
        </text>
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "list-roman-upper",
    title: "I.",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <text x="3" y="9" fontSize="7" fontFamily="Arial" fill="currentColor">
          I.
        </text>
        <rect x="11" y="6" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="14" fontSize="7" fontFamily="Arial" fill="currentColor">
          II.
        </text>
        <rect x="11" y="11" width="9" height="2" rx="1" fill="currentColor" />
        <text x="3" y="19" fontSize="7" fontFamily="Arial" fill="currentColor">
          III.
        </text>
        <rect x="11" y="16" width="9" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  },
];

const getCommandForAction = (action: EditorActionId) => {
  switch (action) {
    case "align-left":
      return "justifyLeft";
    case "align-center":
      return "justifyCenter";
    case "align-right":
      return "justifyRight";
    case "align-justify":
      return "justifyFull";
    case "list-bullet":
    case "list-circle":
    case "list-square":
      return "insertUnorderedList";
    case "list-number":
    case "list-alpha-lower":
    case "list-alpha-upper":
    case "list-roman-lower":
    case "list-roman-upper":
      return "insertOrderedList";
    default:
      return action;
  }
};

const listStyleByAction: Partial<Record<ListOption["id"], string>> = {
  "list-bullet": "disc",
  "list-circle": "circle",
  "list-square": "square",
  "list-number": "decimal",
  "list-alpha-lower": "lower-alpha",
  "list-alpha-upper": "upper-alpha",
  "list-roman-lower": "lower-roman",
  "list-roman-upper": "upper-roman",
};

const listActions: ListOption["id"][] = [
  "list-bullet",
  "list-circle",
  "list-square",
  "list-number",
  "list-alpha-lower",
  "list-alpha-upper",
  "list-roman-lower",
  "list-roman-upper",
];

type SuccessHistoryEditorProps = {
  name?: string;
  placeholder?: string;
};

const fontOptions = [
  "Calibri",
  "Arial",
  "Times New Roman",
  "Georgia",
  "Verdana",
];

const fontSizeOptions = [
  { label: "8", value: "1" },
  { label: "9", value: "1" },
  { label: "10", value: "2" },
  { label: "11", value: "2" },
  { label: "12", value: "3" },
  { label: "14", value: "4" },
  { label: "16", value: "4" },
  { label: "18", value: "5" },
  { label: "20", value: "5" },
  { label: "22", value: "6" },
  { label: "24", value: "6" },
  { label: "28", value: "7" },
  { label: "32", value: "7" },
];

export default function SuccessHistoryEditor({
  name = "contentText",
  placeholder = "Tuliskan isi berita disini...",
}: SuccessHistoryEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const savedSelection = useRef<Range | null>(null);
  const [activeActions, setActiveActions] = useState<Set<ToolbarAction["id"]>>(
    new Set(),
  );
  const [activeList, setActiveList] = useState<ListOption["id"] | null>(null);
  const [isListMenuOpen, setIsListMenuOpen] = useState(false);
  const [contentValue, setContentValue] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const storeSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedSelection.current = range;
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !savedSelection.current) return;
    selection.removeAllRanges();
    selection.addRange(savedSelection.current);
  }, []);

  const updateActiveState = useCallback((action: ToolbarAction["id"]) => {
    setActiveActions((prev) => {
      const next = new Set(prev);
      const command = getCommandForAction(action);
      if (
        action === "align-left" ||
        action === "align-center" ||
        action === "align-right" ||
        action === "align-justify"
      ) {
        next.delete("align-left");
        next.delete("align-center");
        next.delete("align-right");
        next.delete("align-justify");
        next.add(action);
        return next;
      }
      if (action === "bold" || action === "italic" || action === "underline") {
        if (document.queryCommandState(command)) {
          next.add(action);
        } else {
          next.delete(action);
        }
        return next;
      }
      return next;
    });
  }, []);

  const updateActiveList = useCallback((listType: ListOption["id"]) => {
    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode ?? null;
    const element = anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
    const list = element?.closest<HTMLElement>("ul, ol");
    if (list && editorRef.current?.contains(list)) {
      const style = listStyleByAction[listType];
      if (style && list.style.listStyleType === style) {
        setActiveList(listType);
      } else if (style) {
        setActiveList(listType);
      }
    } else {
      setActiveList(null);
    }
  }, []);

  const ensureSelection = useCallback(() => {
    if (savedSelection.current || !editorRef.current) return;
    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    savedSelection.current = range;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  const applyList = useCallback(
    (listType: ListOption["id"]) => {
      editorRef.current?.focus();
      ensureSelection();
      restoreSelection();
      const command = getCommandForAction(listType);
      document.execCommand(command);
      const selection = window.getSelection();
      const anchorNode = selection?.anchorNode ?? null;
      const element =
        anchorNode instanceof Element ? anchorNode : anchorNode?.parentElement;
      let list = element?.closest<HTMLElement>("ul, ol") ?? null;
      if (!list && editorRef.current) {
        list = document.createElement(
          command === "insertOrderedList" ? "ol" : "ul",
        );
        const item = document.createElement("li");
        item.appendChild(document.createElement("br"));
        list.appendChild(item);
        const range = selection?.getRangeAt(0);
        if (range) {
          range.deleteContents();
          range.insertNode(list);
          range.setStart(item, 0);
          range.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(range);
        } else {
          editorRef.current.appendChild(list);
        }
      }
      const style = listStyleByAction[listType];
      if (style && list) {
        list.style.listStyleType = style;
      }
      requestAnimationFrame(() => updateActiveList(listType));
    },
    [ensureSelection, restoreSelection, updateActiveList],
  );

  const handleCommand = useCallback(
    (action: ToolbarAction["id"]) => {
      editorRef.current?.focus();
      ensureSelection();
      restoreSelection();
      const command = getCommandForAction(action);
      if (action === "link") {
        const url = window.prompt("Masukkan URL");
        if (!url) return;
        document.execCommand("createLink", false, url);
        return;
      }
      document.execCommand(command);
      requestAnimationFrame(() => updateActiveState(action));
    },
    [ensureSelection, restoreSelection, updateActiveState],
  );

  return (
    <div className="success-editor">
      <div className="success-toolbar">
        <div className="success-tool-group">
          <select
            className="success-select"
            defaultValue={fontOptions[0]}
            onChange={(event) => {
              editorRef.current?.focus();
              ensureSelection();
              restoreSelection();
              document.execCommand("fontName", false, event.target.value);
            }}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
          <select
            className="success-select"
            defaultValue={fontSizeOptions[1].value}
            onChange={(event) => {
              editorRef.current?.focus();
              ensureSelection();
              restoreSelection();
              document.execCommand("fontSize", false, event.target.value);
            }}
          >
            {fontSizeOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="success-color">
            <button
              type="button"
              className="success-color-button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => colorInputRef.current?.click()}
            >
              A
              <span
                className="success-color-indicator"
                style={{ background: textColor }}
              />
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={textColor}
              onChange={(event) => {
                const next = event.target.value;
                setTextColor(next);
                editorRef.current?.focus();
                ensureSelection();
                restoreSelection();
                document.execCommand("foreColor", false, next);
              }}
            />
          </div>
        </div>
        {toolbarActions.map((action) => (
          <button
            key={action.id}
            className={`success-tool${activeActions.has(action.id) ? " active" : ""}`}
            type="button"
            title={action.title}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => handleCommand(action.id)}
          >
            {action.icon}
          </button>
        ))}
        <div className="success-tool-group">
          <button
            className={`success-tool${activeList ? " active" : ""}`}
            type="button"
            title="List"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsListMenuOpen((prev) => !prev)}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M7 6h13v2H7V6Zm0 5h13v2H7v-2Zm0 5h13v2H7v-2ZM4 6h1v2H4V6Zm0 5h1v2H4v-2Zm0 5h1v2H4v-2Z"
                fill="currentColor"
              />
            </svg>
          </button>
          {isListMenuOpen ? (
            <div className="success-list-menu">
              {listOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`success-list-option${
                    activeList === option.id ? " active" : ""
                  }`}
                  title={option.title}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    applyList(option.id);
                    setActiveList(option.id);
                    setIsListMenuOpen(false);
                  }}
                >
                  {option.icon}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div
        ref={editorRef}
        className="success-textarea"
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onFocus={storeSelection}
        onKeyUp={storeSelection}
        onMouseUp={storeSelection}
        onInput={(event) => {
          storeSelection();
          const text = (event.currentTarget.textContent || "").trim();
          setContentValue(text);
        }}
        suppressContentEditableWarning
      />
      <input type="hidden" name={name} value={contentValue} />
    </div>
  );
}

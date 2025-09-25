"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, createContext, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  Handle,
  Position,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- SVG ICONS (for a dependency-free setup) ---
const SquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
);
const CircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
);
const DiamondIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.5 21.5 12 12 21.5 2.5 12 12 2.5Z" /></svg>
);
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" /></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);
const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
);
const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);
const LoadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
);
const ExportIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
);
const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
);


// --- TOAST NOTIFICATION SYSTEM ---
type ToastType = 'success' | 'error' | 'info';
type ToastContextValue = { addToast: (message: string, type?: ToastType) => void };
const ToastContext = createContext<ToastContextValue | null>(null);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] space-y-2">
                {toasts.map(({ id, message, type }) => (
                    <div
                        key={id}
                        className={`
                            px-4 py-3 rounded-lg shadow-lg text-white text-sm
                            ${type === 'success' ? 'bg-green-500' : ''}
                            ${type === 'error' ? 'bg-red-500' : ''}
                            ${type === 'info' ? 'bg-blue-500' : ''}
                            animate-toast-in
                        `}
                    >
                        {message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const useToast = () => useContext(ToastContext);


// --- TYPES ---
type ContentBlock = {
  id: string;
  type: 'h1' | 'h2' | 'p';
  text: string;
};

type Shape = 'rectangle' | 'circle' | 'diamond';

type CustomNodeData = {
  shape: Shape;
  blocks: ContentBlock[];
  onChange?: (updater: (prev: CustomNodeData) => CustomNodeData) => void;
  containerColor?: string;
  textColor?: string;
  onRequestDelete?: (id: string) => void;
  onRequestAddChild?: (fromId: string, shape: Shape) => void;
};

type NodeData = CustomNodeData | { label: string };


// --- CUSTOM NODE COMPONENT ---
const EditableNode = ({ id, data, selected }: { id: string; data: CustomNodeData; selected: boolean }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [childMenuOpen, setChildMenuOpen] = useState(false);

  useEffect(() => {
    if (editingId) setTimeout(() => inputRef.current?.focus(), 0);
  }, [editingId]);

  const containerShapeClasses = useMemo(() => {
    if (data.shape === 'circle') return 'rounded-full w-48 h-48 flex items-center justify-center p-4';
    if (data.shape === 'diamond') return 'w-48 h-48 flex items-center justify-center transform rotate-45 p-0';
    return 'rounded-xl w-48';
  }, [data.shape]);

  const innerRotationClass = data.shape === 'diamond' ? '-rotate-45' : '';

  const changeBlockType = (blockId: string, type: ContentBlock['type']) => {
    data.onChange?.((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, type } : b)),
    }));
  };

  const changeBlockText = (blockId: string, text: string) => {
    data.onChange?.((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, text } : b)),
    }));
  };

  const getAutoContrast = (hex?: string): string | undefined => {
    if (!hex) return undefined;
    const c = hex.replace('#', '');
    if (c.length < 6) return '#111827';
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 0.5 ? '#111827' : '#ffffff';
  };
  
  const effectiveTextColor = data.textColor || getAutoContrast(data.containerColor);

  const Block = ({ block }: { block: ContentBlock }) => {
    const common = 'outline-none bg-transparent text-center w-full';
    if (editingId === block.id) {
      if (block.type === 'p') {
        return (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={`${common} text-sm resize-none`}
            value={block.text}
            rows={3}
            onChange={(e) => changeBlockText(block.id, e.target.value)}
            onBlur={() => setEditingId(null)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); setEditingId(null);}}}
            style={{ color: effectiveTextColor }}
          />
        );
      }
      return (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          className={`${common} ${block.type === 'h1' ? 'text-lg font-bold' : 'text-base font-semibold'}`}
          value={block.text}
          onChange={(e) => changeBlockText(block.id, e.target.value)}
          onBlur={() => setEditingId(null)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
          style={{ color: effectiveTextColor }}
        />
      );
    }
    const Tag = block.type as 'h1' | 'h2' | 'p';
    return (
      <div className="group relative flex flex-col items-center">
        <Tag
          className={`cursor-text break-words w-full ${block.type === 'h1' ? 'text-lg font-bold' : block.type === 'h2' ? 'text-base font-semibold' : 'text-sm'}`}
          style={{ color: effectiveTextColor }}
          onDoubleClick={() => setEditingId(block.id)}
        >
          {block.text || <span className="opacity-50">...</span>}
        </Tag>
        <div className="absolute right-[-48px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-opacity flex gap-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-1 rounded-full shadow-sm">
          <button className="text-xs w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white" onClick={() => changeBlockType(block.id, 'h1')}>H1</button>
          <button className="text-xs w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white" onClick={() => changeBlockType(block.id, 'h2')}>H2</button>
          <button className="text-xs w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-blue-500 hover:text-white" onClick={() => changeBlockType(block.id, 'p')}>P</button>
        </div>
      </div>
    );
  };

  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setChildMenuOpen(false);
  }

  const handleEdit = () => {
    const first = data.blocks[0];
    if (first) {
      setEditingId(first.id);
    } else {
      data.onChange?.((prev) => ({ ...prev, blocks: [{ id: `h2-${crypto.randomUUID()}`, type: 'h2', text: 'Heading' }] }));
    }
    closeMenu();
  };

  const ContextMenu = () => (
      <div
          className="fixed z-50 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl p-2 animate-context-menu-in"
          style={{ left: menuPos.x, top: menuPos.y }}
          onClick={(e) => e.stopPropagation()}
      >
          <div className="flex flex-col gap-1">
              <button className="context-menu-item" onClick={handleEdit}><EditIcon className="w-4 h-4 mr-2"/> Edit Content</button>
              <div onMouseEnter={() => setChildMenuOpen(true)} onMouseLeave={() => setChildMenuOpen(false)} className="relative">
                  <button className="context-menu-item justify-between w-full">
                      <div className="flex items-center"><PlusIcon className="w-4 h-4 mr-2" /> Add Child</div>
                      <span>▸</span>
                  </button>
                  {childMenuOpen && (
                      <div className="absolute left-full -top-2 ml-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl p-2">
                        {(['rectangle', 'circle', 'diamond'] as const).map(shape => (
                          <button key={shape} className="context-menu-item" onClick={() => { data.onRequestAddChild?.(id, shape); closeMenu(); }}>
                            {shape === 'rectangle' && <SquareIcon className="w-4 h-4 mr-2" />}
                            {shape === 'circle' && <CircleIcon className="w-4 h-4 mr-2" />}
                            {shape === 'diamond' && <DiamondIcon className="w-4 h-4 mr-2" />}
                            {shape.charAt(0).toUpperCase() + shape.slice(1)}
                          </button>
                        ))}
                      </div>
                  )}
              </div>
              <div className="my-1 h-px bg-slate-200 dark:bg-slate-700" />
              <button className="context-menu-item text-red-500 hover:bg-red-500/10" onClick={() => { data.onRequestDelete?.(id); closeMenu(); }}>
                  <TrashIcon className="w-4 h-4 mr-2"/> Delete Node
              </button>
          </div>
      </div>
  );

  return (
    <>
      <div
        className={`p-4 border text-center font-sans shadow-md transition-all duration-200 ${containerShapeClasses} ${selected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' : 'border-slate-300 dark:border-slate-700'}`}
        style={{ backgroundColor: data.containerColor || 'transparent' }}
        onContextMenu={onContextMenu}
      >
        <Handle type="target" position={Position.Left} className="!bg-slate-400 !border-slate-200" />
        <div className={`flex flex-col items-center justify-center gap-2 w-full h-full ${innerRotationClass}`}>
          {data.blocks.map((b) => <Block key={b.id} block={b} />)}
        </div>
        <Handle type="source" position={Position.Right} className="!bg-slate-400 !border-slate-200" />
      </div>
      {menuOpen && <div className="fixed inset-0 z-40" onClick={closeMenu} />}
      {menuOpen && <ContextMenu />}
    </>
  );
};

const nodeTypes: NodeTypes = { custom: EditableNode };


// --- INITIAL DATA ---
const initialNodes: Node<NodeData>[] = [
  { id: '1', type: 'input', position: { x: 100, y: 150 }, data: { label: 'Start' }, className: '!rounded-full !bg-green-500 !text-white !border-green-600' },
  { id: '2', type: 'custom', position: { x: 350, y: 150 }, data: {
      shape: 'rectangle',
      blocks: [
        { id: 'b1', type: 'h2', text: 'Workflow Step' },
        { id: 'b2', type: 'p', text: 'Right-click me for options!' },
      ],
      containerColor: '#ffffff',
      textColor: '#1e293b'
    },
  },
  { id: '3', type: 'output', position: { x: 650, y: 150 }, data: { label: 'End' }, className: '!rounded-full !bg-red-500 !text-white !border-red-600' },
];
const initialEdges: Edge[] = [ { id: 'e1-2', source: '1', target: '2', animated: true, style: { strokeWidth: 2 } }, { id: 'e2-3', source: '2', target: '3', animated: true, style: { strokeWidth: 2 } }, ];


// --- MAIN APP COMPONENT ---
function WorkflowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState<NodeData>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowInstance = useReactFlow();
   const toastCtx = useToast();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'));
   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
   const addButtonRef = useRef<HTMLButtonElement | null>(null);
   const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
   const [shapeMenuPos, setShapeMenuPos] = useState<{x:number;y:number}>({x:0,y:0});
  const [defaultContainerColor, setDefaultContainerColor] = useState<string>('#ffffff');
  const [defaultTextColor, setDefaultTextColor] = useState<string>('#1e293b');

  const attachCallbacks = useCallback((list: Node<NodeData>[]) =>
    list.map((n) => {
      if (n.type === 'custom') {
        const nodeData = n.data as CustomNodeData;
        return {
          ...n,
          data: {
            ...nodeData,
            onChange: (updater: (prev: CustomNodeData) => CustomNodeData) => {
              setNodes((prevNodes) =>
                prevNodes.map((pn) =>
                  pn.id === n.id ? { ...pn, data: updater(pn.data as CustomNodeData) } : pn
                )
              );
            },
            onRequestDelete: (id: string) => {
              setNodes((prev) => prev.filter((p) => p.id !== id));
              setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
            },
            onRequestAddChild: (fromId: string, shape: Shape) => {
                 const newId = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
                const parent = list.find(ln => ln.id === fromId);
                const basePos = parent?.position || { x: 100, y: 100 };
                const child: Node<CustomNodeData> = {
                  id: newId,
                  type: 'custom',
                  position: { x: basePos.x + 250, y: basePos.y },
                  data: {
                    shape,
                    blocks: [{ id: `h2-${newId}`, type: 'h2', text: 'New Node' }],
                    containerColor: defaultContainerColor,
                    textColor: defaultTextColor,
                  },
                };
                setNodes((prev) => attachCallbacks([...prev, child]));
                setEdges((prev) => [...prev, { id: `e-${fromId}-${newId}`, source: fromId, target: newId, animated: true, style: { strokeWidth: 2 } }]);
              },
          },
        };
      }
      return n;
    }),
  [setNodes, setEdges, defaultContainerColor, defaultTextColor]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

   // no-op: we use a global overlay for outside clicks on shape menu

  useEffect(() => {
    setNodes((prev) => attachCallbacks(prev));
  }, [attachCallbacks, setNodes]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { strokeWidth: 2 } }, eds)), [setEdges]);

   const addNode = useCallback((shape: Shape, position?: {x: number, y: number}) => {
     const id = (globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
    const pos = position || {
        x: Math.random() * 500 + 100,
        y: Math.random() * 300 + 100,
    };
    const newNode: Node<CustomNodeData> = {
      id, type: 'custom', position: pos,
      data: {
        shape,
        blocks: [{ id: `h2-${id}`, type: 'h2', text: 'New Node' }],
        containerColor: defaultContainerColor,
        textColor: defaultTextColor,
      },
    };
    setNodes((nds) => attachCallbacks([...nds, newNode]));
  }, [setNodes, attachCallbacks, defaultContainerColor, defaultTextColor]);

  const saveWorkflow = useCallback(() => {
    try {
        const serializableNodes = nodes.map(n => {
            if (n.type === 'custom') {
                const { onChange, onRequestDelete, onRequestAddChild, ...restData } = (n.data as CustomNodeData);
                return { ...n, data: restData };
            }
            return n as Node<NodeData>;
        });
        const workflow = { nodes: serializableNodes, edges, theme, defaults: { bg: defaultContainerColor, text: defaultTextColor } };
        localStorage.setItem('workflow', JSON.stringify(workflow, null, 2));
         toastCtx?.addToast('Workflow saved successfully!', 'success');
    } catch(e) {
         toastCtx?.addToast('Failed to save workflow.', 'error');
    }
  }, [nodes, edges, theme, defaultContainerColor, defaultTextColor, toastCtx]);

  const loadWorkflow = useCallback(() => {
    const saved = localStorage.getItem('workflow');
    if (!saved) {
         toastCtx?.addToast('No saved workflow found.', 'info');
        return;
    }
    try {
      const parsed = JSON.parse(saved);
      setTheme(parsed.theme === 'dark' ? 'dark' : 'light');
      setNodes(attachCallbacks(parsed.nodes || initialNodes));
      setEdges(parsed.edges || initialEdges);
      setDefaultContainerColor(parsed.defaults?.bg || '#ffffff');
      setDefaultTextColor(parsed.defaults?.text || '#1e293b');
       toastCtx?.addToast('Workflow loaded!', 'success');
    } catch {
       toastCtx?.addToast('Failed to load workflow.', 'error');
    }
  }, [attachCallbacks, setNodes, setEdges, toastCtx]);

  const onPaneContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const pane = (e.target as HTMLElement).closest('.react-flow__pane');
    if (!pane) return;

    const addNodeAtPos = (shape: Shape) => {
        const bounds = pane.getBoundingClientRect();
        const position = reactFlowInstance.project({
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        });
        addNode(shape, position);
        closeMenu();
    };

     const ContextMenu = ({x, y}: { x: number; y: number }) => {
        const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
        return (
            <div
                className="fixed z-50 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl p-2 animate-context-menu-in"
                style={{ left: x, top: y }}
            >
                <div onMouseEnter={() => setShapeMenuOpen(true)} onMouseLeave={() => setShapeMenuOpen(false)} className="relative">
                    <button className="context-menu-item justify-between w-full">
                        <div className="flex items-center"><PlusIcon className="w-4 h-4 mr-2" /> Add Node</div>
                        <span>▸</span>
                    </button>
                    {shapeMenuOpen && (
                      <div className="absolute left-full -top-2 ml-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl p-2">
                          {(['rectangle', 'circle', 'diamond'] as const).map(shape => (
                              <button key={shape} className="context-menu-item" onClick={() => addNodeAtPos(shape)}>
                                  {shape === 'rectangle' && <SquareIcon className="w-4 h-4 mr-2" />}
                                  {shape === 'circle' && <CircleIcon className="w-4 h-4 mr-2" />}
                                  {shape === 'diamond' && <DiamondIcon className="w-4 h-4 mr-2" />}
                                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                              </button>
                          ))}
                      </div>
                    )}
                </div>
            </div>
        )
    };
    
    // Imperatively render context menu to avoid state management complexity here
    const menuContainer = document.createElement('div');
    const closeMenu = () => {
        document.body.removeChild(menuContainer);
        window.removeEventListener('click', closeMenu);
    };
    window.addEventListener('click', closeMenu, { once: true });
    
    const root = createRoot(menuContainer);
    document.body.appendChild(menuContainer);
    root.render(<ContextMenu x={e.clientX} y={e.clientY} />);
  }, [reactFlowInstance, addNode]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200">
      <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 z-10 shrink-0">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Workflow Editor</h1>
      </header>
      <div className="flex flex-1 min-h-0">
         <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-stretch overflow-hidden`}> 
            <div className="flex-1 p-2 space-y-2">
                 <div className="relative">
                     <button ref={addButtonRef} onClick={() => {
                         if (shapeMenuOpen) { setShapeMenuOpen(false); return; }
                         const rect = addButtonRef.current?.getBoundingClientRect();
                         if (rect) setShapeMenuPos({ x: rect.right + 8, y: rect.top });
                         setShapeMenuOpen(true);
                     }} className="sidebar-button w-full"><PlusIcon className="w-5 h-5" /> {sidebarOpen && <span>Add Node</span>}</button>
                 </div>
                {sidebarOpen && (
                  <div className="p-2 border-t border-b border-slate-200 dark:border-slate-800 space-y-3">
                      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">DEFAULTS</h3>
                      <div className="flex items-center justify-between">
                        <label className="text-sm">Background</label>
                        <input type="color" value={defaultContainerColor} onChange={(e) => setDefaultContainerColor(e.target.value)} className="w-7 h-7 rounded-md cursor-pointer bg-transparent border border-slate-300 dark:border-slate-700" />
                      </div>
                      <div className="flex items-center justify-between">
                          <label className="text-sm">Text</label>
                          <input type="color" value={defaultTextColor} onChange={(e) => setDefaultTextColor(e.target.value)} className="w-7 h-7 rounded-md cursor-pointer bg-transparent border border-slate-300 dark:border-slate-700" />
                      </div>
                  </div>
                )}
                 <button onClick={saveWorkflow} className="sidebar-button w-full"><SaveIcon className="w-5 h-5" />{sidebarOpen && <span>Save</span>}</button>
                 <button onClick={loadWorkflow} className="sidebar-button w-full"><LoadIcon className="w-5 h-5" />{sidebarOpen && <span>Load</span>}</button>
                 <button onClick={() => {
                      const serializableNodes = nodes.map(n => n.type === 'custom' ? { ...n, data: { ...n.data, onChange: undefined, onRequestDelete: undefined, onRequestAddChild: undefined } } : n);
                      const json = JSON.stringify({ nodes: serializableNodes, edges }, null, 2);
                      const blob = new Blob([json], { type: 'application/json' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = 'workflow.json';
                      a.click();
                      URL.revokeObjectURL(a.href);
                 }} className="sidebar-button w-full"><ExportIcon className="w-5 h-5" />{sidebarOpen && <span>Export JSON</span>}</button>
                 <button onClick={async () => {
                      const serializableNodes = nodes.map(n => n.type === 'custom' ? { ...n, data: { ...n.data, onChange: undefined, onRequestDelete: undefined, onRequestAddChild: undefined } } : n);
                      const json = JSON.stringify({ nodes: serializableNodes, edges }, null, 2);
                      try { await navigator.clipboard.writeText(json); toastCtx?.addToast('Copied to clipboard!', 'success'); } catch { toastCtx?.addToast('Failed to copy.', 'error'); }
                 }} className="sidebar-button w-full"><CopyIcon className="w-5 h-5" />{sidebarOpen && <span>Copy JSON</span>}</button>
            </div>
            <div className="p-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                 <button onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))} className="sidebar-button w-full">
                    {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    {sidebarOpen && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>
                 <button onClick={() => setSidebarOpen((o) => !o)} className="sidebar-button w-full text-xl">
                    {sidebarOpen ? '⟨' : '⟩'}
                </button>
            </div>
         </aside>

         {shapeMenuOpen && (
           <>
             <div className="fixed inset-0 z-40" onClick={() => setShapeMenuOpen(false)} />
             <div className="fixed z-50 w-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg p-2" style={{ left: shapeMenuPos.x, top: shapeMenuPos.y }}>
               {(['rectangle','circle','diamond'] as const).map((shape) => (
                 <button key={shape} onClick={() => { addNode(shape); setShapeMenuOpen(false); }} className="context-menu-item">
                   {shape === 'rectangle' && <SquareIcon className="w-4 h-4 mr-2" />}
                   {shape === 'circle' && <CircleIcon className="w-4 h-4 mr-2" />}
                   {shape === 'diamond' && <DiamondIcon className="w-4 h-4 mr-2" />}
                   {shape[0].toUpperCase() + shape.slice(1)}
                 </button>
               ))}
             </div>
           </>
         )}

        <main className="flex-1 bg-slate-50 dark:bg-slate-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onPaneContextMenu={onPaneContextMenu}
          fitView
          className="bg-slate-50 dark:bg-slate-950"
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Controls className="react-flow-controls" />
          <MiniMap className="react-flow-minimap" nodeColor={theme === 'dark' ? '#334155' : '#e2e8f0'} maskColor={theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)'} />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={theme === 'dark' ? '#1e293b' : '#cbd5e1'} />
        </ReactFlow>
        </main>
      </div>
      <style jsx global>{`
        .dark .react-flow__node-input, .dark .react-flow__node-default, .dark .react-flow__node-output {
            background: #1e293b;
            color: #f1f5f9;
            border-color: #334155;
        }
        .react-flow-controls {
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0;
        }
        .dark .react-flow-controls {
            border-color: #334155;
            background: #1e293b;
        }
        .dark .react-flow-controls button {
            background: #334155;
            color: #94a3b8;
            border-bottom: 1px solid #1e293b;
        }
        .dark .react-flow-controls button:hover {
            background: #475569;
        }
        .react-flow-minimap {
            border-radius: 0.75rem;
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
        }
        .dark .react-flow-minimap {
            border-color: #334155;
            background-color: #0f172a;
        }
        .sidebar-button {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            text-align: left;
            transition: all 0.2s;
            color: #475569;
        }
        .dark .sidebar-button { color: #94a3b8; }
        .sidebar-button:hover {
            background-color: #f1f5f9;
            color: #0f172a;
        }
        .dark .sidebar-button:hover {
            background-color: #1e293b;
            color: #f1f5f9;
        }
        .context-menu-item {
            display: flex;
            align-items: center;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            text-align: left;
            transition: background-color 0.2s;
        }
        .context-menu-item:hover {
            background-color: #e2e8f0;
        }
        .dark .context-menu-item:hover {
            background-color: #334155;
        }
        @keyframes toast-in {
            from { opacity: 0; transform: translateY(1rem); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-toast-in { animation: toast-in 0.3s ease-out forwards; }
        @keyframes context-menu-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-context-menu-in { animation: context-menu-in 0.1s ease-out forwards; }
      `}</style>
    </div>
  );
}

// --- WRAPPER to provide context ---
export default function App() {
    return (
        <ToastProvider>
            <ReactFlowProvider>
                <WorkflowEditor />
            </ReactFlowProvider>
        </ToastProvider>
    );
}


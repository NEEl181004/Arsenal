"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
    Bold, Italic, Underline as UnderlineIcon,
    List, ListOrdered, Heading1, Heading2,
    Quote, Code, Undo, Redo, Link as LinkIcon,
    Image as ImageIcon, Eraser
} from 'lucide-react';
import { Editor } from '@tiptap/core';

const EditorButton = ({ onClick, isActive, disabled, children, title }: any) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded transition-all ${isActive ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20' : 'text-outline hover:bg-white/10 hover:text-white'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
    >
        {children}
    </button>
);

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-outline-variant/20 bg-black/40 backdrop-blur-sm sticky top-0 z-20 rounded-t-lg">
            <EditorButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                title="Underline"
            >
                <UnderlineIcon className="w-4 h-4" />
            </EditorButton>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <EditorButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
                title="Heading 1"
            >
                <Heading1 className="w-4 h-4" />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </EditorButton>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <EditorButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </EditorButton>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <EditorButton
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                isActive={editor.isActive('blockquote')}
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                isActive={editor.isActive('codeBlock')}
                title="Code Block"
            >
                <Code className="w-4 h-4" />
            </EditorButton>

            <div className="w-px h-6 bg-white/10 mx-1 self-center" />

            <EditorButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link">
                <LinkIcon className="w-4 h-4" />
            </EditorButton>
            <EditorButton onClick={addImage} title="Add Image">
                <ImageIcon className="w-4 h-4" />
            </EditorButton>
            <EditorButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear Formatting">
                <Eraser className="w-4 h-4" />
            </EditorButton>

            <div className="flex-1" />

            <EditorButton
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <Undo className="w-4 h-4" />
            </EditorButton>
            <EditorButton
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <Redo className="w-4 h-4" />
            </EditorButton>
        </div>
    );
};

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline decoration-primary/30 hover:decoration-primary transition-all cursor-pointer',
                    target: '_blank',
                    rel: 'noopener noreferrer'
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-none border-l-2 border-primary-container max-w-full my-4',
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-sm focus:outline-none min-h-[300px] p-6 text-on-surface-variant max-w-none font-body prose-headings:font-headline prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic prose-a:text-primary prose-strong:text-white',
            },
        },
    });

    return (
        <div className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-none focus-within:border-primary-container/50 transition-colors overflow-hidden group">
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <div className="px-6 py-3 border-t border-outline-variant/10 bg-[#0e0e0e] flex justify-between items-center">
                <span className="text-[10px] text-outline font-label uppercase tracking-widest font-bold">
                    Visual Editor
                </span>
                {placeholder && !editor?.getText() && (
                    <span className="text-[10px] text-outline-variant italic font-label tracking-widest">
                        {placeholder}
                    </span>
                )}
            </div>
        </div>
    );
}

import {Editor} from "@tiptap/react";
import classes from "./index.module.css";
import {ActionIcon} from "@mantine/core";
import {
    IconBlockquote,
    IconBold,
    IconClearFormatting,
    IconCode,
    IconH1,
    IconH2,
    IconH3,
    IconH4,
    IconH5,
    IconH6,
    IconItalic,
    IconList,
    IconListNumbers,
    IconMinus,
    IconStrikethrough
} from "@tabler/icons-react";

export default function MenuBar({editor}: { editor: Editor }) {

    return (
        <>
            <div className={classes.iconGroup}>
                <ActionIcon
                    aria-label={"bold"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()
                    }
                    className={classes.icon}
                    data-active={editor.isActive('bold')}
                >
                    <IconBold/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"italic"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()
                    }
                    className={classes.icon}
                    data-active={editor.isActive('italic')}
                >
                    <IconItalic/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"strikethrough"}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={classes.icon}
                    data-active={editor.isActive('strike')}
                >
                    <IconStrikethrough/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"inline-code"}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleCode()
                            .run()
                    }
                    className={classes.icon}
                    data-active={editor.isActive('code')}
                >
                    <IconCode/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"clear formatting"}
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    className={classes.icon}
                >
                    <IconClearFormatting/>
                </ActionIcon>
            </div>
            <div className={classes.iconGroup}>

                <ActionIcon
                    aria-label={"heading 1"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}
                    className={classes.icon}
                    data-active={editor.isActive('heading', {level: 1})}
                >
                    <IconH1/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"heading 2"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}
                    className={classes.icon}
                    data-active={editor.isActive('heading', {level: 2})}
                >
                    <IconH2/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"heading 3"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}
                    className={classes.icon}
                    data-active={editor.isActive('heading', {level: 3})}
                >
                    <IconH3/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"heading 4"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}
                    className={classes.icon}
                    data-active={editor.isActive('heading', {level: 4})}
                >
                    <IconH4/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"heading 5"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 5}).run()}
                    className={classes.icon}
                    data-active={editor.isActive('heading', {level: 5})}
                >
                    <IconH5/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"heading 6"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 6}).run()}
                    className={classes.icon}
                    data-active={editor.isActive('heading', {level: 6})}
                >
                    <IconH6/>
                </ActionIcon>
            </div>

            <div className={classes.iconGroup}>
                <ActionIcon
                    aria-label={"bullet list"}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={classes.icon}
                    data-active={editor.isActive('bulletList')}
                >
                    <IconList/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"ordered list"}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={classes.icon}
                    data-active={editor.isActive('orderedList')}
                >
                    <IconListNumbers/>
                </ActionIcon>

                <ActionIcon
                    aria-label={"blockquote"}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={classes.icon}
                    data-active={editor.isActive('blockquote')}
                >
                    <IconBlockquote/>
                </ActionIcon>
                <ActionIcon
                    aria-label={"horizontal rule"}
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    className={classes.icon}
                >
                    <IconMinus/>
                </ActionIcon>
            </div>
        </>
    )
}

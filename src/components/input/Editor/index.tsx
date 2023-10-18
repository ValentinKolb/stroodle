import {BubbleMenu, Editor, useEditor} from "@tiptap/react";
import {StarterKit} from "@tiptap/starter-kit";
import {Underline} from "@tiptap/extension-underline";
import Placeholder from '@tiptap/extension-placeholder';
import {RichTextEditor, RichTextEditorContent} from "@mantine/tiptap";
import classes from './index.module.css';
import {Box, Input, InputWrapperProps, Loader} from "@mantine/core";
import {useEffect} from "react";


const Bubble = ({editor}: { editor: Editor }) => (
    <BubbleMenu editor={editor}>
        <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold/>
            <RichTextEditor.Italic/>
            <RichTextEditor.Link/>
        </RichTextEditor.ControlsGroup>
    </BubbleMenu>
)

const Toolbar = ({fullToolbar}: { fullToolbar: boolean, editor: Editor }) => (
    <RichTextEditor.Toolbar>
        {
            fullToolbar ?
                <>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold/>
                        <RichTextEditor.Italic/>
                        <RichTextEditor.Underline/>
                        <RichTextEditor.Code/>
                        <RichTextEditor.Strikethrough/>
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1/>
                        <RichTextEditor.H2/>
                        <RichTextEditor.H3/>
                        <RichTextEditor.H4/>
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote/>
                        <RichTextEditor.Hr/>
                        <RichTextEditor.BulletList/>
                        <RichTextEditor.OrderedList/>
                    </RichTextEditor.ControlsGroup>
                </>
                :
                <>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold/>
                        <RichTextEditor.Italic/>
                        <RichTextEditor.Underline/>
                        <RichTextEditor.Code/>
                    </RichTextEditor.ControlsGroup>
                </>

        }
    </RichTextEditor.Toolbar>
)

/**
 * Cleans the string from empty paragraphs.
 * @param s The string to clean.
 */
export const cleanHtmlString = (s: string) => s
    .replace(/^(<p>\s*<\/p>)+$/g, '')
    .replace(/^(<p>\s*<\/p>)+/g, '')
    .replace(/(<p>\s*<\/p>)+$/g, '')

/**
 * A wrapper around the Mantine Input component that provides a WYSIWYG editor.
 * @param initialValue The initial value of the editor.
 * @param onChange The callback to call when the editor's value changes.
 * @param placeholder The placeholder text to show when the editor is empty.
 * @param fullToolbar Whether to show the full toolbar or not.
 * @param maxHeight The maximum height of the editor.
 * @param hideToolbar Whether to hide the toolbar or not.
 * @param props The props to pass to the Mantine Input Wrapper component.
 */
export default function TextEditor({
                                       value,
                                       onChange,
                                       placeholder,
                                       fullToolbar,
                                       maxHeight,
                                       hideToolbar,
                                       noBorder,
                                       ...props
                                   }: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    fullToolbar?: boolean;
    maxHeight?: number;
    hideToolbar?: boolean;
    noBorder?: boolean;
} & Omit<InputWrapperProps, "onChange">) {

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({placeholder})
        ],
        content: value,
        onUpdate: ({editor}) => {
            onChange(editor.getHTML())
        }
    })

    useEffect(() => {
        if (!editor) return
        if (editor.getHTML() === value) return
        const {from, to} = editor.state.selection
        editor.commands.setContent(value, false)
        editor.commands.setTextSelection({from, to})
    }, [editor, value])

    if (!editor) {
        return <Loader size={"xs"}/>
    }

    return (
        <Input.Wrapper miw={0} maw={"100%"} {...props}>
            <Box
                component={RichTextEditor}
                editor={editor}
                mod={{error: !!props.error, margin: !!props.label || !!props.description}}
                classNames={{
                    content: `${classes.content} scrollbar`,
                    root: `${classes.container} ${noBorder ? classes.noBorder : ''}`,
                    toolbar: classes.toolbar,
                }}
            >
                <RichTextEditorContent mah={maxHeight ?? 100}/>
                {hideToolbar ? <Bubble editor={editor}/> : <Toolbar editor={editor} fullToolbar={!!fullToolbar}/>}
            </Box>
        </Input.Wrapper>
    )
}